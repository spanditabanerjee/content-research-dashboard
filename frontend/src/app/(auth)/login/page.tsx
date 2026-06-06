import type { Metadata } from "next";
import { LoginForm } from "@/features/auth/login-form";

export const metadata: Metadata = {
  title: "Login | Content Research Dashboard",
};

export default function LoginPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Welcome back</h1>
      <p className="mb-6 text-sm text-slate-400">Sign in to your account</p>
      <LoginForm />
    </div>
  );
}
