export interface User {
  id: string;
  email: string;
  name: string | null;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterResponse {
  user: User;
}

export interface MeResponse {
  user: User;
}
