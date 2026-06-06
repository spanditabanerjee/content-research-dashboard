import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().int().positive().default(5001),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().default("http://localhost:3000"),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4o-mini"),
  OPENAI_MAX_RETRIES: z.coerce.number().int().min(1).max(5).default(3),
  OPENAI_REQUEST_TIMEOUT_MS: z.coerce
    .number()
    .int()
    .positive()
    .default(60_000),
  OPENAI_MAX_TOKENS: z.coerce.number().int().min(256).max(4096).default(2000),
  OPENAI_TEMPERATURE: z.coerce.number().min(0).max(2).default(0.7),
  NEWS_API_KEY: z.string().optional(),

NEWS_API_BASE_URL: z
  .string()
  .default("https://newsapi.org/v2/everything"),

NEWS_SEARCH_LIMIT: z.coerce
  .number()
  .int()
  .min(1)
  .max(20)
  .default(5),

NEWS_REQUEST_TIMEOUT_MS: z.coerce
  .number()
  .int()
  .positive()
  .default(10000),
  // REDDIT_CLIENT_ID: z.string().optional(),
  // REDDIT_CLIENT_SECRET: z.string().optional(),
  // REDDIT_USER_AGENT: z
  //   .string()
  //   .default("ContentResearchDashboard/1.0 (by /u/contentresearch)"),
  // REDDIT_OAUTH_URL: z
  //   .string()
  //   .url()
  //   .default("https://www.reddit.com/api/v1/access_token"),
  // REDDIT_API_BASE_URL: z
  //   .string()
  //   .url()
  //   .default("https://oauth.reddit.com"),
  // REDDIT_SEARCH_LIMIT: z.coerce.number().int().min(1).max(25).default(5),
  // REDDIT_REQUEST_TIMEOUT_MS: z.coerce
  //   .number()
  //   .int()
  //   .positive()
  //   .default(10_000),
});

export type Env = z.infer<typeof envSchema>;

function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.errors
      .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
      .join("\n");

    throw new Error(`Environment validation failed:\n${formatted}`);
  }

  return result.data;
}

export const env = loadEnv();
