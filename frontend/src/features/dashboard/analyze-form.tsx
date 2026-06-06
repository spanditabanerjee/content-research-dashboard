"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAnalyze } from "@/hooks/use-analysis";
import { AnalyzeFormData, analyzeSchema } from "@/schemas/analysis.schema";
import { getErrorMessage } from "@/utils/errors";

export function AnalyzeForm() {
  const router = useRouter();
  const analyzeMutation = useAnalyze();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnalyzeFormData>({
    resolver: zodResolver(analyzeSchema),
    defaultValues: { topic: "" },
  });

  const onSubmit = async (data: AnalyzeFormData) => {
    setError(null);
    try {
      const result = await analyzeMutation.mutateAsync(data);
      router.push(`/analysis/${result.id}`);
    } catch (err) {
      setError(getErrorMessage(err, "Analysis failed. Please try again."));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Analysis</CardTitle>
        <CardDescription>
          Enter a topic to fetch Reddit insights and generate AI-powered content.
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <Alert variant="error">{error}</Alert>}

        <Input
          id="topic"
          label="Research Topic"
          placeholder="e.g. AI in content marketing"
          error={errors.topic?.message}
          disabled={analyzeMutation.isPending}
          {...register("topic")}
        />

        <Button
          type="submit"
          className="w-full sm:w-auto"
          isLoading={analyzeMutation.isPending}
        >
          <Search className="h-4 w-4" />
          {analyzeMutation.isPending ? "Analyzing..." : "Analyze Topic"}
        </Button>
      </form>
    </Card>
  );
}
