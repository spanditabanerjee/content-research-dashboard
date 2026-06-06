"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { useAnalysis } from "@/hooks/use-analysis";
import { formatDate } from "@/utils/format";
import { getErrorMessage } from "@/utils/errors";
import { ContentSections } from "./content-sections";
import { RedditSources } from "./reddit-sources";

interface AnalysisDetailProps {
  id: string;
}

export function AnalysisDetail({ id }: AnalysisDetailProps) {
  const { data, isLoading, isError, error } = useAnalysis(id);

  if (isLoading) {
    return <Spinner className="py-16" label="Loading analysis..." />;
  }

  if (isError) {
    return (
      <Alert variant="error">
        {getErrorMessage(error, "Failed to load analysis")}
      </Alert>
    );
  }

  if (!data) {
    return <Alert variant="error">Analysis not found</Alert>;
  }

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-white sm:text-3xl">{data.topic}</h1>
        <p className="mt-1 text-sm text-slate-400">Analyzed on {formatDate(data.createdAt)}</p>
      </div>

      <RedditSources posts={data.sourceContent} />
      <ContentSections analysis={data} />
    </div>
  );
}
