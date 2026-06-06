import { env } from "./env";
import { ApiError } from "../utils/api-error";

export interface OpenAIConfig {
  apiKey: string;
  model: string;
  maxRetries: number;
  requestTimeoutMs: number;
  maxTokens: number;
  temperature: number;
}

function requireOpenAIKey(value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw ApiError.serviceUnavailable(
      "OpenAI API is not configured",
      { missing: "OPENAI_API_KEY" }
    );
  }

  return value.trim();
}

export function getOpenAIConfig(): OpenAIConfig {
  return {
    apiKey: requireOpenAIKey(env.OPENAI_API_KEY),
    model: env.OPENAI_MODEL,
    maxRetries: env.OPENAI_MAX_RETRIES,
    requestTimeoutMs: env.OPENAI_REQUEST_TIMEOUT_MS,
    maxTokens: env.OPENAI_MAX_TOKENS,
    temperature: env.OPENAI_TEMPERATURE,
  };
}
