import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsArticle } from "@/types/analysis";

interface RedditSourcesProps {
  posts: NewsArticle[];
}

export function RedditSources({ posts }: RedditSourcesProps) {
  if (posts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>News Sources</CardTitle>
          <CardDescription>No source content available.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>News Sources</CardTitle>
        <CardDescription>
          Top {posts.length} relevant post{posts.length !== 1 ? "s" : ""} from News
        </CardDescription>
      </CardHeader>

      <ul className="space-y-4">
        {posts.map((post, index) => (
          <li
            key={`${post.url}-${index}`}
            className="rounded-lg border border-slate-800 bg-slate-950/50 p-4"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Badge>r/{post.source}</Badge>
              <Badge className="bg-indigo-500/10 text-indigo-300">
                {post.score} pts
              </Badge>
            </div>
            <h4 className="mt-2 font-medium text-white">{post.title}</h4>
            {post.selftext && (
              <p className="mt-2 text-sm text-slate-400 line-clamp-3">{post.selftext}</p>
            )}
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300"
            >
              Read article
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </li>
        ))}
      </ul>
    </Card>
  );
}
