import { apiClient } from "./client";
import type { ApiKeyCreateResponse, ApiKeyListResponse } from "./types";

export const apiKeysApi = {
  list(): Promise<ApiKeyListResponse> {
    return apiClient.get<ApiKeyListResponse>("/admin/api-keys");
  },

  create(name: string): Promise<ApiKeyCreateResponse> {
    return apiClient.post<ApiKeyCreateResponse>("/admin/api-keys", { name });
  },

  revoke(keyId: string): Promise<void> {
    return apiClient.delete<void>(`/admin/api-keys/${keyId}`);
  },
};
