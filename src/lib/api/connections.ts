import { apiClient } from "./client";
import type { OrgConnection, OrgConnectionUpdate } from "./types";

export const connectionsApi = {
  get(): Promise<OrgConnection> {
    return apiClient.get<OrgConnection>("/admin/connections");
  },

  update(payload: OrgConnectionUpdate): Promise<OrgConnection> {
    return apiClient.put<OrgConnection>("/admin/connections", payload);
  },

  checkNow(): Promise<OrgConnection> {
    return apiClient.post<OrgConnection>("/admin/connections/check-now");
  },

  remove(): Promise<{ deleted: boolean }> {
    return apiClient.delete<{ deleted: boolean }>("/admin/connections");
  },
};
