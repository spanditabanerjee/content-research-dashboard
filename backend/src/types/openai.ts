export interface ContentGenerationInput {
  topic: string;
  redditContent: string;
}

export interface GeneratedContent {
  summary: string;
  linkedinPost: string;
  instagramCaption: string;
  hashtags: string;
}
