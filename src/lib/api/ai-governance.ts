// AI Governance API

import { apiClient } from "./client";
import type { AIGovernanceDocumentsResponse, AIGovernanceSummaryResponse } from "./types";

export const aiGovernanceApi = {
  getDocuments(): Promise<AIGovernanceDocumentsResponse> {
    return apiClient.get<AIGovernanceDocumentsResponse>("/ai-governance/documents");
  },

  getSummary(): Promise<AIGovernanceSummaryResponse> {
    return apiClient.get<AIGovernanceSummaryResponse>("/ai-governance/summary");
  },
};
