"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { analysisService } from "@/services/analysis.service";
import { AnalyzeFormData } from "@/schemas/analysis.schema";

export const analysisKeys = {
  all: ["analysis"] as const,
  detail: (id: string) => ["analysis", id] as const,
};

export function useAnalyze() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AnalyzeFormData) => analysisService.analyze(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["history"] });
    },
  });
}

export function useAnalysis(id: string) {
  return useQuery({
    queryKey: analysisKeys.detail(id),
    queryFn: () => analysisService.getById(id),
    enabled: Boolean(id),
  });
}
