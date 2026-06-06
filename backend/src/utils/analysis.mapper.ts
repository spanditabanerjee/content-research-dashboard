import type { Analysis } from "../types/prisma";
import { AnalysisResult } from "../types/analysis";
import { AnalysisListItem } from "../types/history";
import { NormalizedNewsArticle } from "../types/news";

export function parseSourceContent(
  sourceContent: string | null
): NormalizedNewsArticle[] {
  if (!sourceContent) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(sourceContent);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map((article) => {
      const item = article as Record<string, unknown>;

      return {
        title: String(item.title ?? ""),
        selftext: String(item.selftext ?? ""),
        source: String(item.source ?? ""),
        score: typeof item.score === "number" ? item.score : 0,
        url: String(item.url ?? ""),
      };
    });
  } catch {
    return [];
  }
}

export function toAnalysisResult(
  analysis: Analysis
): AnalysisResult {
  return {
    id: analysis.id,
    topic: analysis.topic,
    sourceContent: parseSourceContent(
      analysis.sourceContent
    ),
    summary: analysis.summary ?? "",
    linkedinPost: analysis.linkedinPost ?? "",
    instagramCaption: analysis.instagramCaption ?? "",
    hashtags: analysis.hashtags ?? "",
    createdAt: analysis.createdAt.toISOString(),
    updatedAt: analysis.updatedAt.toISOString(),
  };
}

export function toAnalysisListItem(
  analysis: Analysis
): AnalysisListItem {
  return {
    id: analysis.id,
    topic: analysis.topic,
    summary: analysis.summary ?? "",
    createdAt: analysis.createdAt.toISOString(),
    updatedAt: analysis.updatedAt.toISOString(),
  };
}