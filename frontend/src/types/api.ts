export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    details?: unknown;
  };
}
