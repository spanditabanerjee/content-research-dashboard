import { Request, Response } from "express";
import { redditService } from "../services/reddit.service";
import { ApiResponse } from "../types";
import { RedditSearchResponse } from "../types/reddit";
import { RedditSearchInput } from "../validators/reddit.validator";

export class RedditController {
  async search(req: Request, res: Response): Promise<void> {
    const { topic } = req.validatedBody as RedditSearchInput;
    const result: RedditSearchResponse = await redditService.searchByTopic(topic);

    const response: ApiResponse<RedditSearchResponse> = {
      success: true,
      message: "Reddit posts fetched successfully",
      data: result,
    };

    res.status(200).json(response);
  }
}

export const redditController = new RedditController();
