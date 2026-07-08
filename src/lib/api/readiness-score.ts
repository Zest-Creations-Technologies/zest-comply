// Compliance Readiness Score API

import { apiClient } from "./client";
import type { ReadinessScoreHistoryResponse, ReadinessScoreListResponse } from "./types";

export const readinessScoreApi = {
  getCurrentScores(): Promise<ReadinessScoreListResponse> {
    return apiClient.get<ReadinessScoreListResponse>("/readiness/scores");
  },

  getHistory(framework: string, limit = 100): Promise<ReadinessScoreHistoryResponse> {
    const params = new URLSearchParams({ framework, limit: String(limit) });
    return apiClient.get<ReadinessScoreHistoryResponse>(`/readiness/scores/history?${params}`);
  },

  recompute(): Promise<ReadinessScoreListResponse> {
    return apiClient.post<ReadinessScoreListResponse>("/readiness/scores/recompute", {});
  },
};
