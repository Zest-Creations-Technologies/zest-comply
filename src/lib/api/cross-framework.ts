// Cross-Framework Intelligence API

import { apiClient } from "./client";
import type { CrossFrameworkOverlapResponse, SharedEvidenceResponse } from "./types";

export const crossFrameworkApi = {
  getOverlap(): Promise<CrossFrameworkOverlapResponse> {
    return apiClient.get<CrossFrameworkOverlapResponse>("/cross-framework/overlap");
  },

  getSharedEvidence(frameworkA: string, frameworkB: string): Promise<SharedEvidenceResponse> {
    const params = new URLSearchParams({ framework_a: frameworkA, framework_b: frameworkB });
    return apiClient.get<SharedEvidenceResponse>(`/cross-framework/shared-evidence?${params}`);
  },
};
