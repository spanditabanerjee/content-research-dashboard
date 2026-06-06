import cors, { CorsOptions } from "cors";
import { env } from "./env";

function getAllowedOrigins(): string[] {
  const configured = env.CORS_ORIGIN.split(",").map((origin) => origin.trim());

  if (env.NODE_ENV === "development") {
    return [
      ...configured,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ];
  }

  return configured;
}

export function createCorsOptions(): CorsOptions {
  const allowedOrigins = [...new Set(getAllowedOrigins())];

  return {
    origin: (origin, callback) => {
      // Allow non-browser clients (curl, Postman) and same-origin requests
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
}

export const corsMiddleware = cors(createCorsOptions());
