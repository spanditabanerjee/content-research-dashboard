import { z } from "zod";

export const analyzeSchema = z.object({
  topic: z
    .string()
    .min(2, "Topic must be at least 2 characters")
    .max(200, "Topic must be at most 200 characters"),
});

export type AnalyzeFormData = z.infer<typeof analyzeSchema>;
