"use client";

import { useQuery } from "@tanstack/react-query";
import { historyService } from "@/services/history.service";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";

export const historyKeys = {
  all: ["history"] as const,
  list: (page: number, limit: number) => ["history", page, limit] as const,
};

export function useHistory(page = 1, limit = DEFAULT_PAGE_SIZE) {
  return useQuery({
    queryKey: historyKeys.list(page, limit),
    queryFn: () => historyService.getResults(page, limit),
  });
}
