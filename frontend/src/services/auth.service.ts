import api from "./api";
import { ApiResponse } from "@/types/api";
import { LoginResponse, MeResponse, RegisterResponse } from "@/types/auth";
import { LoginFormData, RegisterFormData } from "@/schemas/auth.schema";

export const authService = {
  async login(data: LoginFormData): Promise<LoginResponse> {
    const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", data);
    return response.data.data!;
  },

  async register(data: RegisterFormData): Promise<RegisterResponse> {
    const response = await api.post<ApiResponse<RegisterResponse>>(
      "/auth/register",
      data
    );
    return response.data.data!;
  },

  async getMe(): Promise<MeResponse> {
    const response = await api.get<ApiResponse<MeResponse>>("/auth/me");
    return response.data.data!;
  },
};
