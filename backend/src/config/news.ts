import { env } from "./env";
import { ApiError } from "../utils/api-error";

export interface NewsConfig {
  apiKey: string;
  baseUrl: string;
  searchLimit: number;
  requestTimeoutMs: number;
}

function requireNewsApiKey(value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw ApiError.serviceUnavailable(
      "News API is not configured",
      {
        missing: "NEWS_API_KEY",
      }
    );
  }

  return value.trim();
}

export function getNewsConfig(): NewsConfig {
  return {
    apiKey: requireNewsApiKey(env.NEWS_API_KEY),
    baseUrl: env.NEWS_API_BASE_URL,
    searchLimit: env.NEWS_SEARCH_LIMIT,
    requestTimeoutMs: env.NEWS_REQUEST_TIMEOUT_MS,
  };
}