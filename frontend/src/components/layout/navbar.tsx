"use client";

import Link from "next/link";
import { LogOut, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-white">
          <Sparkles className="h-5 w-5 text-indigo-400" />
          <span className="font-semibold">Content Research</span>
        </Link>

        <div className="flex items-center gap-4">
          {user && (
            <span className="hidden text-sm text-slate-400 sm:block">
              {user.name ?? user.email}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
