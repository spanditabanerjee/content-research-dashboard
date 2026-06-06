export interface NewsArticle {
  title: string;
  selftext: string;
  source: string;
  score: number;
  url: string;
}

export interface AnalysisResult {
  id: string;
  topic: string;
  sourceContent: NewsArticle[];
  summary: string;
  linkedinPost: string;
  instagramCaption: string;
  hashtags: string;
  createdAt: string;
  updatedAt: string;
}