import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { ApiResponse } from "../types";
import { LoginResponse, MeResponse, RegisterResponse } from "../types/auth";
import { LoginInput, RegisterInput } from "../validators/auth.validator";

export class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const input = req.body as RegisterInput;
    const result: RegisterResponse = await authService.register(input);

    const response: ApiResponse<RegisterResponse> = {
      success: true,
      message: "Registration successful",
      data: result,
    };

    res.status(201).json(response);
  }

  async login(req: Request, res: Response): Promise<void> {
    const input = req.body as LoginInput;
    const result: LoginResponse = await authService.login(input);

    const response: ApiResponse<LoginResponse> = {
      success: true,
      message: "Login successful",
      data: result,
    };

    res.status(200).json(response);
  }

  async getMe(req: Request, res: Response): Promise<void> {
    const user = authService.getAuthenticatedUser(req.user!);

    const response: ApiResponse<MeResponse> = {
      success: true,
      data: { user },
    };

    res.status(200).json(response);
  }
}

export const authController = new AuthController();
