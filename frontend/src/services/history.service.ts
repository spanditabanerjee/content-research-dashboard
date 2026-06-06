import api from "./api";
import { ApiResponse } from "@/types/api";
import { HistoryListResponse } from "@/types/history";

export const historyService = {
  async getResults(page = 1, limit = 10): Promise<HistoryListResponse> {
    const response = await api.get<ApiResponse<HistoryListResponse>>("/results", {
      params: { page, limit },
    });
    return response.data.data!;
  },
};
