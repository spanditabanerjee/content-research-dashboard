import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getToken, removeToken } from "@/utils/token";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 120_000,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const isAuthRoute =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";

      if (!isAuthRoute) {
        removeToken();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
