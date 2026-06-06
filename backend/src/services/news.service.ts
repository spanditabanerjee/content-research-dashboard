import { getNewsConfig, NewsConfig } from "../config/news";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";
import {
  NewsSearchResponse,
  NormalizedNewsArticle,
} from "../types/news";

interface NewsApiArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  source: {
    name: string;
  };
}

interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: NewsApiArticle[];
}

export class NewsService {
  async searchByTopic(topic: string): Promise<NewsSearchResponse> {
    const config = getNewsConfig();
    const posts = await this.fetchArticles(topic, config);

    return {
      topic,
      posts,
      count: posts.length,
    };
  }

  private async fetchArticles(
    topic: string,
    config: NewsConfig
  ): Promise<NormalizedNewsArticle[]> {
    const searchUrl = new URL(config.baseUrl);

    searchUrl.searchParams.set("q", topic);
    searchUrl.searchParams.set("language", "en");
    searchUrl.searchParams.set(
      "pageSize",
      String(config.searchLimit)
    );
    searchUrl.searchParams.set("apiKey", config.apiKey);

    let response: Response;

    try {
      response = await this.fetchWithTimeout(
        searchUrl.toString(),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        },
        config.requestTimeoutMs
      );
    } catch (error) {
      logger.error("News API request failed", {
        topic,
        message: error instanceof Error ? error.message : "Unknown error",
      });

      throw ApiError.serviceUnavailable(
        "Unable to reach News API"
      );
    }

    if (!response.ok) {
      const errorBody = await response.text();

      logger.error("News API returned error", {
        status: response.status,
        body: errorBody,
      });

      throw ApiError.serviceUnavailable(
        "News API request failed",
        {
          status: response.status,
        }
      );
    }

    const payload =
      (await response.json()) as NewsApiResponse;

    return payload.articles.map((article) => ({
      title: article.title ?? "",
      selftext: `${article.description ?? ""}\n\n${
        article.content ?? ""
      }`,
      source: article.source?.name ?? "Unknown",
      score: 0,
      url: article.url ?? "",
    }));
  }

  private async fetchWithTimeout(
    url: string,
    init: RequestInit,
    timeoutMs: number
  ): Promise<Response> {
    const controller = new AbortController();

    const timeoutId = setTimeout(
      () => controller.abort(),
      timeoutMs
    );

    try {
      return await fetch(url, {
        ...init,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const newsService = new NewsService();