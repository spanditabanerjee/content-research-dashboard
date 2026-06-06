export interface AnalysisListItem {
  id: string;
  topic: string;
  summary: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryListResponse {
  items: AnalysisListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
