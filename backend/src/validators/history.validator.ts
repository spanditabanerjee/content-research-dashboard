import { z } from "zod";

export const historyPaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const analysisIdParamSchema = z.object({
  id: z.string().cuid("Invalid analysis ID"),
});

export type HistoryPaginationInput = z.infer<typeof historyPaginationSchema>;
export type AnalysisIdParam = z.infer<typeof analysisIdParamSchema>;
