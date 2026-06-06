import { AuthenticatedUser } from "./index";

export interface RegisterResponse {
  user: AuthenticatedUser;
}

export interface LoginResponse {
  user: AuthenticatedUser;
  token: string;
}

export interface MeResponse {
  user: AuthenticatedUser;
}
