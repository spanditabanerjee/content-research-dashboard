import { analysisRepository } from "../repositories/analysis.repository";
import { AnalysisResult } from "../types/analysis";
import { HistoryListResponse } from "../types/history";
import { toAnalysisListItem, toAnalysisResult } from "../utils/analysis.mapper";
import { ApiError } from "../utils/api-error";
import { HistoryPaginationInput } from "../validators/history.validator";

export class HistoryService {
  async getResults(
    userId: string,
    pagination: HistoryPaginationInput
  ): Promise<HistoryListResponse> {
    const result = await analysisRepository.findByUserId(userId, pagination);

    return {
      items: result.items.map(toAnalysisListItem),
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  async getResultById(id: string, userId: string): Promise<AnalysisResult> {
    const analysis = await analysisRepository.findByIdAndUserId(id, userId);

    if (!analysis) {
      throw ApiError.notFound("Analysis not found");
    }

    return toAnalysisResult(analysis);
  }
}

export const historyService = new HistoryService();
