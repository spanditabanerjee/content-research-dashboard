import { Request, Response } from "express";
import { historyService } from "../services/history.service";
import { ApiResponse } from "../types";
import { AnalysisResult } from "../types/analysis";
import { HistoryListResponse } from "../types/history";
import {
  AnalysisIdParam,
  HistoryPaginationInput,
} from "../validators/history.validator";

export class HistoryController {
  async getResults(req: Request, res: Response): Promise<void> {
    const pagination = req.validatedQuery as HistoryPaginationInput;
    const userId = req.user!.id;

    const result: HistoryListResponse = await historyService.getResults(
      userId,
      pagination
    );

    const response: ApiResponse<HistoryListResponse> = {
      success: true,
      data: result,
    };

    res.status(200).json(response);
  }

  async getResultById(req: Request, res: Response): Promise<void> {
    const { id } = req.validatedParams as AnalysisIdParam;
    const userId = req.user!.id;

    const result: AnalysisResult = await historyService.getResultById(
      id,
      userId
    );

    const response: ApiResponse<AnalysisResult> = {
      success: true,
      data: result,
    };

    res.status(200).json(response);
  }
}

export const historyController = new HistoryController();
