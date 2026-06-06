import { Request, Response } from "express";
import { analysisService } from "../services/analysis.service";
import { ApiResponse } from "../types";
import { AnalysisResult } from "../types/analysis";
import { AnalyzeInput } from "../validators/analysis.validator";

export class AnalysisController {
  async analyze(req: Request, res: Response): Promise<void> {
    const { topic } = req.body as AnalyzeInput;
    const userId = req.user!.id;

    const result: AnalysisResult = await analysisService.analyzeTopic(
      topic,
      userId
    );

    const response: ApiResponse<AnalysisResult> = {
      success: true,
      message: "Analysis completed successfully",
      data: result,
    };

    res.status(201).json(response);
  }
}

export const analysisController = new AnalysisController();
