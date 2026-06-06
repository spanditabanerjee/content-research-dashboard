export type { LoginResponse, MeResponse, RegisterResponse } from "./auth";
export type { NewsSearchResponse, NormalizedNewsArticle } from "./news";
export type { ContentGenerationInput, GeneratedContent } from "./openai";
export type { AnalysisResult } from "./analysis";
export type { AnalysisListItem, HistoryListResponse } from "./history";

export interface JwtPayload {
  userId: string;
  email: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
