import { NormalizedRedditPost } from "./reddit";

export interface AnalysisResult {
  id: string;
  topic: string;
  sourceContent: NormalizedRedditPost[];
  summary: string;
  linkedinPost: string;
  instagramCaption: string;
  hashtags: string;
  createdAt: string;
  updatedAt: string;
}
