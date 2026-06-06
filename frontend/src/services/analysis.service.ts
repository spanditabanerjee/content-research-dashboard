import api from "./api";
import { ApiResponse } from "@/types/api";
import { AnalysisResult } from "@/types/analysis";
import { AnalyzeFormData } from "@/schemas/analysis.schema";

export const analysisService = {
  async analyze(data: AnalyzeFormData): Promise<AnalysisResult> {
    const response = await api.post<ApiResponse<AnalysisResult>>("/analyze", data);
    return response.data.data!;
  },

  async getById(id: string): Promise<AnalysisResult> {
    const response = await api.get<ApiResponse<AnalysisResult>>(`/results/${id}`);
    return response.data.data!;
  },
};
