export interface RedditPost {
  title: string;
  selftext: string;
  subreddit: string;
  score: number;
  url: string;
}

export interface AnalysisResult {
  id: string;
  topic: string;
  sourceContent: RedditPost[];
  summary: string;
  linkedinPost: string;
  instagramCaption: string;
  hashtags: string;
  createdAt: string;
  updatedAt: string;
}
