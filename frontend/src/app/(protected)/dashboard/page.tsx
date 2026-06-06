import type { Metadata } from "next";
import { AnalyzeForm } from "@/features/dashboard/analyze-form";
import { HistoryList } from "@/features/history/history-list";

export const metadata: Metadata = {
  title: "Dashboard | Content Research Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-slate-400">
          Research topics, generate content, and review your analysis history.
        </p>
      </div>

      <AnalyzeForm />
      <HistoryList />
    </div>
  );
}
