"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Clock, ExternalLink } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useHistory } from "@/hooks/use-history";
import { DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { formatDate, truncate } from "@/utils/format";
import { getErrorMessage } from "@/utils/errors";

export function HistoryList() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useHistory(page, DEFAULT_PAGE_SIZE);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-400" />
          Analysis History
        </CardTitle>
        <CardDescription>Your previous research and generated content.</CardDescription>
      </CardHeader>

      {isLoading && <Spinner className="py-8" label="Loading history..." />}

      {isError && (
        <Alert variant="error">{getErrorMessage(error, "Failed to load history")}</Alert>
      )}

      {data && data.items.length === 0 && (
        <p className="py-6 text-center text-sm text-slate-400">
          No analyses yet. Run your first topic analysis above.
        </p>
      )}

      {data && data.items.length > 0 && (
        <div className="space-y-3">
          <ul className="divide-y divide-slate-800">
            {data.items.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/analysis/${item.id}`}
                  className="flex items-start justify-between gap-4 py-4 transition-colors hover:bg-slate-800/30 -mx-2 px-2 rounded-lg"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-white">{item.topic}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {truncate(item.summary, 120)}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(item.createdAt)}
                    </p>
                  </div>
                  <ExternalLink className="mt-1 h-4 w-4 shrink-0 text-slate-500" />
                </Link>
              </li>
            ))}
          </ul>

          {data.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 pt-4">
              <p className="text-sm text-slate-400">
                Page {data.page} of {data.totalPages} ({data.total} total)
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Prev
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
