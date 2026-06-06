"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { User } from "@/types/auth";
import { getErrorMessage } from "@/utils/errors";
import { getToken, removeToken, setToken } from "@/utils/token";
import { LoginFormData, RegisterFormData } from "@/schemas/auth.schema";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      return;
    }

    const { user: currentUser } = await authService.getMe();
    setUser(currentUser);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        if (getToken()) {
          await refreshUser();
        }
      } catch {
        removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void init();
  }, [refreshUser]);

  const login = useCallback(
    async (data: LoginFormData) => {
      const result = await authService.login(data);
      setToken(result.token);
      setUser(result.user);
      router.push("/dashboard");
    },
    [router]
  );

  const register = useCallback(
    async (data: RegisterFormData) => {
      await authService.register(data);
      router.push("/login");
    },
    [router]
  );

  const logout = useCallback(() => {
    removeToken();
    setUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
      refreshUser,
    }),
    [user, isLoading, login, register, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
}

export function getAuthErrorMessage(error: unknown): string {
  return getErrorMessage(error, "Authentication failed");
}
