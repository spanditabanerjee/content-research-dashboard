import { AxiosError } from "axios";
import { ApiErrorResponse } from "@/types/api";

export function getErrorMessage(error: unknown, fallback = "Something went wrong"): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data as ApiErrorResponse | undefined;
    if (data?.error?.message) return data.error.message;
    if (error.message) return error.message;
  }

  if (error instanceof Error) return error.message;

  return fallback;
}
