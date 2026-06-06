import OpenAI from "openai";
import { APIError } from "openai";
import { getOpenAIConfig, OpenAIConfig } from "../config/openai";
import {
  buildCombinedGenerationPrompt,
  CONTENT_SYSTEM_PROMPT,
} from "../prompts/content-generation.prompts";
import {
  ContentGenerationInput,
  GeneratedContent,
} from "../types/openai";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";
import { withRetry } from "../utils/retry";
import { z } from "zod";

const generatedContentSchema = z.object({
  summary: z.string().min(1, "Summary is required"),
  linkedinPost: z.string().min(1, "LinkedIn post is required"),
  instagramCaption: z.string().min(1, "Instagram caption is required"),
  hashtags: z.string().min(1, "Hashtags are required"),
});

export class OpenAIService {
  private client: OpenAI | null = null;

  async generateContent(input: ContentGenerationInput): Promise<GeneratedContent> {
    const config = getOpenAIConfig();
    const client = this.getClient(config);

    const prompt = buildCombinedGenerationPrompt(input.topic, input.redditContent);

    const rawContent = await withRetry(
      () => this.createChatCompletion(client, config, prompt),
      {
        maxAttempts: config.maxRetries,
        shouldRetry: (error) => this.isRetryableError(error),
        onRetry: (attempt, error) => {
          logger.warn("OpenAI request failed, retrying", {
            attempt,
            topic: input.topic,
            message: error instanceof Error ? error.message : "Unknown error",
          });
        },
      }
    );

    return this.parseGeneratedContent(rawContent);
  }

  private getClient(config: OpenAIConfig): OpenAI {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: config.apiKey,
        timeout: config.requestTimeoutMs,
        maxRetries: 0,
      });
    }

    return this.client;
  }

  private async createChatCompletion(
    client: OpenAI,
    config: OpenAIConfig,
    userPrompt: string
  ): Promise<string> {
    try {
      const response = await client.chat.completions.create({
        model: config.model,
        temperature: config.temperature,
        max_tokens: config.maxTokens,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: CONTENT_SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
      });

      const content = response.choices[0]?.message?.content?.trim();

      if (!content) {
        throw ApiError.serviceUnavailable(
          "OpenAI returned an empty response"
        );
      }

      return content;
    } catch (error) {
      throw this.mapOpenAIError(error);
    }
  }

  private parseGeneratedContent(rawJson: string): GeneratedContent {
    let parsed: unknown;

    try {
      parsed = JSON.parse(rawJson);
    } catch {
      logger.error("OpenAI returned invalid JSON", { rawJson });
      throw ApiError.serviceUnavailable(
        "OpenAI returned an invalid response format"
      );
    }

    const result = generatedContentSchema.safeParse(parsed);

    if (!result.success) {
      logger.error("OpenAI response failed validation", {
        errors: result.error.errors,
      });
      throw ApiError.serviceUnavailable(
        "OpenAI response is missing required content fields",
        result.error.errors
      );
    }

    return {
      summary: result.data.summary.trim(),
      linkedinPost: result.data.linkedinPost.trim(),
      instagramCaption: result.data.instagramCaption.trim(),
      hashtags: result.data.hashtags.trim(),
    };
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof ApiError) {
      return error.statusCode === 503;
    }

    if (error instanceof APIError) {
      const status = error.status;

      if (status === 429) return true;
      if (status !== undefined && status >= 500) return true;

      return false;
    }

    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return (
        message.includes("timeout") ||
        message.includes("econnreset") ||
        message.includes("network")
      );
    }

    return false;
  }

  private mapOpenAIError(error: unknown): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof APIError) {
      logger.error("OpenAI API error", {
        status: error.status,
        message: error.message,
        code: error.code,
      });

      if (error.status === 401) {
        return ApiError.serviceUnavailable(
          "OpenAI API authentication failed. Check OPENAI_API_KEY."
        );
      }

      if (error.status === 429) {
        return ApiError.serviceUnavailable(
          "OpenAI rate limit exceeded. Please try again later."
        );
      }

      if (error.status === 400) {
        return ApiError.badRequest(
          "Invalid request to OpenAI API",
          { message: error.message }
        );
      }

      if (error.status !== undefined && error.status >= 500) {
        return ApiError.serviceUnavailable(
          "OpenAI service is temporarily unavailable"
        );
      }

      return ApiError.serviceUnavailable(
        "OpenAI request failed",
        { message: error.message }
      );
    }

    if (error instanceof Error) {
      logger.error("Unexpected OpenAI error", {
        message: error.message,
        stack: error.stack,
      });

      if (error.message.toLowerCase().includes("timeout")) {
        return ApiError.serviceUnavailable(
          "OpenAI request timed out. Please try again."
        );
      }
    }

    return ApiError.serviceUnavailable(
      "Failed to generate content with OpenAI"
    );
  }
}

export const openaiService = new OpenAIService();
