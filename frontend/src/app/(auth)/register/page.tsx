import type { Metadata } from "next";
import { RegisterForm } from "@/features/auth/register-form";

export const metadata: Metadata = {
  title: "Register | Content Research Dashboard",
};

export default function RegisterPage() {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-white">Create account</h1>
      <p className="mb-6 text-sm text-slate-400">Start researching content with AI</p>
      <RegisterForm />
    </div>
  );
}
