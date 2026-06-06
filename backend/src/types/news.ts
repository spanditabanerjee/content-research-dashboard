export interface NormalizedNewsArticle {
    title: string;
    selftext: string;
    source: string;
    score: number;
    url: string;
  }
  
  export interface NewsSearchResponse {
    topic: string;
    posts: NormalizedNewsArticle[];
    count: number;
  }