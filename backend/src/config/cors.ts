import cors, { CorsOptions } from "cors";
import { env } from "./env";

export function createCorsOptions(): CorsOptions {
  const allowedOrigins = env.CORS_ORIGIN.split(",").map((origin) =>
    origin.trim()
  );

  return {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}

export const corsMiddleware = cors(createCorsOptions());
