import { analysisRepository } from "../repositories/analysis.repository";
import { AnalysisResult } from "../types/analysis";
import { toAnalysisResult } from "../utils/analysis.mapper";
import { ApiError } from "../utils/api-error";
import { logger } from "../utils/logger";
import { openaiService } from "./openai.service";
import { newsService } from "./news.service";
export class AnalysisService {
  async analyzeTopic(topic: string, userId: string): Promise<AnalysisResult> {
    logger.info("Starting analysis", { topic, userId });

    const newsResult = await newsService.searchByTopic(topic);

    if (newsResult.posts.length === 0) {
      throw ApiError.notFound(
        "No relevant news posts found for this topic. Try a different search term."
      );
    }

    const sourceContent = JSON.stringify(newsResult.posts);
    const newsContext = sourceContent;

    logger.info("news content fetched", {
      topic,
      postCount: newsResult.count,
    });

    const generatedContent = await openaiService.generateContent({
      topic,
     redditContent: newsContext,
    });

    logger.info("AI content generated", { topic });

    const analysis = await analysisRepository.create({
      topic,
      userId,
      sourceContent,
      summary: generatedContent.summary,
      linkedinPost: generatedContent.linkedinPost,
      instagramCaption: generatedContent.instagramCaption,
      hashtags: generatedContent.hashtags,
    });

    logger.info("Analysis saved", { analysisId: analysis.id, topic });

    return toAnalysisResult(analysis);
  }
}

export const analysisService = new AnalysisService();
