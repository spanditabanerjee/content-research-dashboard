import { NextFunction, Request, Response } from "express";
import { userRepository } from "../repositories/user.repository";
import { ApiError } from "../utils/api-error";
import { verifyToken } from "../utils/jwt.util";

function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.slice(7).trim();
  return token.length > 0 ? token : null;
}

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractBearerToken(req);

    if (!token) {
      throw ApiError.unauthorized("Access token is required");
    }

    const payload = verifyToken(token);
    const user = await userRepository.findById(payload.userId);

    if (!user) {
      throw ApiError.unauthorized("Invalid or expired token");
    }

    req.user = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
      return;
    }

    next(ApiError.unauthorized("Invalid or expired token"));
  }
}
