import { SafeUser, userRepository } from "../repositories/user.repository";
import { AuthenticatedUser } from "../types";
import { LoginResponse, RegisterResponse } from "../types/auth";
import { ApiError } from "../utils/api-error";
import { signToken } from "../utils/jwt.util";
import { comparePassword, hashPassword } from "../utils/password.util";
import { LoginInput, RegisterInput } from "../validators/auth.validator";

function toAuthenticatedUser(user: SafeUser): AuthenticatedUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
  };
}

export class AuthService {
  async register(input: RegisterInput): Promise<RegisterResponse> {
    const emailExists = await userRepository.existsByEmail(input.email);

    if (emailExists) {
      throw ApiError.conflict("An account with this email already exists");
    }

    const passwordHash = await hashPassword(input.password);

    const user = await userRepository.create({
      email: input.email,
      passwordHash,
      name: input.name,
    });

    return { user: toAuthenticatedUser(user) };
  }

  async login(input: LoginInput): Promise<LoginResponse> {
    const user = await userRepository.findByEmail(input.email);

    if (!user) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const isPasswordValid = await comparePassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw ApiError.unauthorized("Invalid email or password");
    }

    const token = signToken({ userId: user.id, email: user.email });

    return {
      user: toAuthenticatedUser(user),
      token,
    };
  }

  getAuthenticatedUser(user: AuthenticatedUser): AuthenticatedUser {
    return user;
  }
}

export const authService = new AuthService();
