import { apiClient } from "./client";
import type { OrgTeamsWebhook, OrgTeamsWebhookUpdate } from "./types";

export const teamsWebhookApi = {
  get(): Promise<OrgTeamsWebhook> {
    return apiClient.get<OrgTeamsWebhook>("/admin/teams-webhook");
  },

  update(payload: OrgTeamsWebhookUpdate): Promise<OrgTeamsWebhook> {
    return apiClient.put<OrgTeamsWebhook>("/admin/teams-webhook", payload);
  },

  test(): Promise<{ sent: boolean }> {
    return apiClient.post<{ sent: boolean }>("/admin/teams-webhook/test");
  },

  remove(): Promise<{ deleted: boolean }> {
    return apiClient.delete<{ deleted: boolean }>("/admin/teams-webhook");
  },
};
