import { Sparkles } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-4">
      <div className="mb-8 flex items-center gap-2 text-white">
        <Sparkles className="h-6 w-6 text-indigo-400" />
        <span className="text-xl font-semibold">Content Research</span>
      </div>
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900/60 p-8 shadow-xl">
        {children}
      </div>
    </div>
  );
}
