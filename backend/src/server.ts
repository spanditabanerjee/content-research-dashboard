import "dotenv/config";
import { createApp } from "./app";
import { connectDatabase, disconnectDatabase } from "./config/database";
import { env } from "./config/env";
import { logger } from "./utils/logger";

async function bootstrap(): Promise<void> {
  await connectDatabase();
  logger.info("Database connected");

  const app = createApp();
  const server = app.listen(env.PORT);

  server.on("listening", () => {
    const address = server.address();
    const boundPort =
      typeof address === "object" && address !== null ? address.port : env.PORT;

    logger.info(`Server running on port ${boundPort}`, {
      environment: env.NODE_ENV,
    });
  });

  server.on("error", (error: NodeJS.ErrnoException) => {
    if (error.code === "EADDRINUSE") {
      logger.error(
        `Port ${env.PORT} is already in use. On macOS, port 5000 is often taken by AirPlay Receiver — set PORT=5001 in .env`
      );
    } else {
      logger.error("Failed to start server", {
        message: error.message,
        code: error.code,
      });
    }
    process.exit(1);
  });

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      await disconnectDatabase();
      logger.info("Server closed");
      process.exit(0);
    });

    setTimeout(() => {
      logger.error("Forced shutdown after timeout");
      process.exit(1);
    }, 10_000);
  };

  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled promise rejection", { reason });
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });
}

bootstrap().catch((error: unknown) => {
  logger.error("Failed to start server", {
    message: error instanceof Error ? error.message : "Unknown error",
    stack: error instanceof Error ? error.stack : undefined,
  });
  process.exit(1);
});
