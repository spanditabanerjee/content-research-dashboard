import { AuthenticatedUser } from "./index";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      validatedBody?: unknown;
      validatedQuery?: unknown;
      validatedParams?: unknown;
    }
  }
}

export {};
