import { NormalizedNewsArticle } from "./news";

export interface AnalysisResult {
  id: string;
  topic: string;
  sourceContent: NormalizedNewsArticle[];
  summary: string;
  linkedinPost: string;
  instagramCaption: string;
  hashtags: string;
  createdAt: string;
  updatedAt: string;
}
