import type { Metadata } from "next";
import { AnalysisDetail } from "@/features/analysis/analysis-detail";

export const metadata: Metadata = {
  title: "Analysis | Content Research Dashboard",
};

interface AnalysisPageProps {
  params: Promise<{ id: string }>;
}

export default async function AnalysisPage({ params }: AnalysisPageProps) {
  const { id } = await params;

  return <AnalysisDetail id={id} />;
}
