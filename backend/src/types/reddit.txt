export interface NormalizedRedditPost {
  title: string;
  selftext: string;
  subreddit: string;
  score: number;
  url: string;
}

export interface RedditSearchResponse {
  topic: string;
  posts: NormalizedRedditPost[];
  count: number;
}
