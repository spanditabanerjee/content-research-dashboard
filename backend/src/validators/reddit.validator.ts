import { z } from "zod";

export const redditSearchSchema = z.object({
  topic: z
    .string({ required_error: "Topic is required" })
    .trim()
    .min(2, "Topic must be at least 2 characters")
    .max(200, "Topic must be at most 200 characters"),
});

export type RedditSearchInput = z.infer<typeof redditSearchSchema>;
