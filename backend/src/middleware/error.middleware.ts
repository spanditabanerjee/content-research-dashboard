import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { ApiError } from "../utils/api-error";
import { env } from "../config/env";
import { logger } from "../utils/logger";

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    details?: unknown;
    stack?: string;
  };
}

export function notFoundHandler(_req: Request, _res: Response, next: NextFunction): void {
  next(ApiError.notFound("Route not found"));
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ApiError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: err.message,
        ...(err.details !== undefined && { details: err.details }),
        ...(env.NODE_ENV === "development" && { stack: err.stack }),
      },
    };

    res.status(err.statusCode).json(response);
    return;
  }

  if (err instanceof ZodError) {
    const response: ErrorResponse = {
      success: false,
      error: {
        message: "Validation failed",
        details: err.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      },
    };

    res.status(400).json(response);
    return;
  }

  logger.error("Unhandled error", {
    message: err instanceof Error ? err.message : "Unknown error",
    stack: err instanceof Error ? err.stack : undefined,
  });

  const response: ErrorResponse = {
    success: false,
    error: {
      message: env.NODE_ENV === "production" ? "Internal server error" : err instanceof Error ? err.message : "Internal server error",
      ...(env.NODE_ENV === "development" &&
        err instanceof Error && { stack: err.stack }),
    },
  };

  res.status(500).json(response);
}

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as typeof req.query;
      next();
    } catch (error) {
      next(error);
    }
  };
}
