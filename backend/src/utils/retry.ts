import { logger } from "./logger";

export interface RetryOptions {
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  shouldRetry: (error: unknown) => boolean;
  onRetry?: (attempt: number, error: unknown) => void;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  baseDelayMs: 1_000,
  maxDelayMs: 8_000,
  shouldRetry: () => true,
};

function getDelayMs(attempt: number, baseDelayMs: number, maxDelayMs: number): number {
  const exponential = baseDelayMs * 2 ** (attempt - 1);
  const jitter = Math.random() * 200;
  return Math.min(exponential + jitter, maxDelayMs);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      const isLastAttempt = attempt === config.maxAttempts;
      const canRetry = config.shouldRetry(error);

      if (isLastAttempt || !canRetry) {
        throw error;
      }

      config.onRetry?.(attempt, error);

      const delayMs = getDelayMs(attempt, config.baseDelayMs, config.maxDelayMs);
      logger.warn(`Retry attempt ${attempt}/${config.maxAttempts} after ${Math.round(delayMs)}ms`);
      await sleep(delayMs);
    }
  }

  throw lastError;
}
