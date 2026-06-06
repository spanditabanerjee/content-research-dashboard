import { getRedditConfig, RedditConfig } from "../config/reddit";
import { NormalizedRedditPost, RedditSearchResponse } from "../types/reddit";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";

interface RedditOAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

interface RedditApiPost {
  title: string;
  selftext: string;
  subreddit: string;
  score: number;
  url: string;
  permalink: string;
  is_self: boolean;
}

interface RedditSearchApiResponse {
  data: {
    children: Array<{
      data: RedditApiPost;
    }>;
  };
}

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

export class RedditService {
  private cachedToken: CachedToken | null = null;

  async searchByTopic(topic: string): Promise<RedditSearchResponse> {
    const config = getRedditConfig();
    const accessToken = await this.getAccessToken(config);
    const posts = await this.fetchPosts(topic, config, accessToken);

    return {
      topic,
      posts,
      count: posts.length,
    };
  }

  private async getAccessToken(config: RedditConfig): Promise<string> {
    if (this.cachedToken && Date.now() < this.cachedToken.expiresAt) {
      return this.cachedToken.accessToken;
    }

    const credentials = Buffer.from(
      `${config.clientId}:${config.clientSecret}`
    ).toString("base64");

    let response: Response;

    try {
      response = await this.fetchWithTimeout(
        config.oauthUrl,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${credentials}`,
            "Content-Type": "application/x-www-form-urlencoded",
            "User-Agent": config.userAgent,
          },
          body: "grant_type=client_credentials",
        },
        config.requestTimeoutMs
      );
    } catch (error) {
      logger.error("Reddit OAuth request failed", {
        message: error instanceof Error ? error.message : "Unknown error",
      });
      throw ApiError.serviceUnavailable(
        "Unable to authenticate with Reddit API"
      );
    }

    if (!response.ok) {
      const errorBody = await this.safeParseJson(response);
      logger.error("Reddit OAuth returned error", {
        status: response.status,
        body: errorBody,
      });

      if (response.status === 429) {
        throw ApiError.serviceUnavailable(
          "Reddit API rate limit exceeded. Please try again later."
        );
      }

      throw ApiError.serviceUnavailable(
        "Reddit API authentication failed",
        { status: response.status }
      );
    }

    const data = (await response.json()) as RedditOAuthResponse;

    if (!data.access_token || !data.expires_in) {
      throw ApiError.serviceUnavailable(
        "Reddit API returned an invalid authentication response"
      );
    }

    const expiresInMs = data.expires_in * 1000;
    const bufferMs = 60_000;

    this.cachedToken = {
      accessToken: data.access_token,
      expiresAt: Date.now() + expiresInMs - bufferMs,
    };

    return data.access_token;
  }

  private async fetchPosts(
    topic: string,
    config: RedditConfig,
    accessToken: string
  ): Promise<NormalizedRedditPost[]> {
    const searchUrl = new URL("/search", config.apiBaseUrl);
    searchUrl.searchParams.set("q", topic);
    searchUrl.searchParams.set("sort", "relevance");
    searchUrl.searchParams.set("limit", String(config.searchLimit));
    searchUrl.searchParams.set("type", "link");
    searchUrl.searchParams.set("restrict_sr", "false");

    let response: Response;

    try {
      response = await this.fetchWithTimeout(
        searchUrl.toString(),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": config.userAgent,
          },
        },
        config.requestTimeoutMs
      );
    } catch (error) {
      logger.error("Reddit search request failed", {
        topic,
        message: error instanceof Error ? error.message : "Unknown error",
      });
      throw ApiError.serviceUnavailable(
        "Unable to reach Reddit API. Please try again later."
      );
    }

    if (!response.ok) {
      const errorBody = await this.safeParseJson(response);
      logger.error("Reddit search returned error", {
        topic,
        status: response.status,
        body: errorBody,
      });

      if (response.status === 401) {
        this.cachedToken = null;
        throw ApiError.serviceUnavailable(
          "Reddit API session expired. Please retry your request."
        );
      }

      if (response.status === 429) {
        throw ApiError.serviceUnavailable(
          "Reddit API rate limit exceeded. Please try again later."
        );
      }

      throw ApiError.serviceUnavailable(
        "Reddit search request failed",
        { status: response.status }
      );
    }

    let payload: RedditSearchApiResponse;

    try {
      payload = (await response.json()) as RedditSearchApiResponse;
    } catch {
      throw ApiError.serviceUnavailable(
        "Reddit API returned an invalid response"
      );
    }

    const children = payload.data?.children ?? [];

    return children
      .map((child) => this.normalizePost(child.data))
      .filter((post) => post.title.length > 0);
  }

  private normalizePost(post: RedditApiPost): NormalizedRedditPost {
    return {
      title: post.title?.trim() ?? "",
      selftext: post.selftext?.trim() ?? "",
      subreddit: post.subreddit?.trim() ?? "",
      score: typeof post.score === "number" ? post.score : 0,
      url: this.resolvePostUrl(post),
    };
  }

  private resolvePostUrl(post: RedditApiPost): string {
    if (post.is_self || !post.url || post.url.includes("reddit.com")) {
      const permalink = post.permalink?.startsWith("/")
        ? post.permalink
        : `/${post.permalink ?? ""}`;
      return `https://www.reddit.com${permalink}`;
    }

    return post.url;
  }

  private async fetchWithTimeout(
    url: string,
    init: RequestInit,
    timeoutMs: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timeoutId);
    }
  }

  private async safeParseJson(response: Response): Promise<unknown> {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
}

export const redditService = new RedditService();
