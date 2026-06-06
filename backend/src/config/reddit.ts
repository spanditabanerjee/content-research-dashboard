import { env } from "./env";
import { ApiError } from "../utils/api-error";

export interface RedditConfig {
  clientId: string;
  clientSecret: string;
  userAgent: string;
  oauthUrl: string;
  apiBaseUrl: string;
  searchLimit: number;
  requestTimeoutMs: number;
}

function requireRedditCredential(
  value: string | undefined,
  name: string
): string {
  if (!value || value.trim().length === 0) {
    throw ApiError.serviceUnavailable(
      "Reddit API is not configured",
      { missing: name }
    );
  }

  return value.trim();
}

export function getRedditConfig(): RedditConfig {
  return {
    clientId: requireRedditCredential(env.REDDIT_CLIENT_ID, "REDDIT_CLIENT_ID"),
    clientSecret: requireRedditCredential(
      env.REDDIT_CLIENT_SECRET,
      "REDDIT_CLIENT_SECRET"
    ),
    userAgent: env.REDDIT_USER_AGENT,
    oauthUrl: env.REDDIT_OAUTH_URL,
    apiBaseUrl: env.REDDIT_API_BASE_URL,
    searchLimit: env.REDDIT_SEARCH_LIMIT,
    requestTimeoutMs: env.REDDIT_REQUEST_TIMEOUT_MS,
  };
}
