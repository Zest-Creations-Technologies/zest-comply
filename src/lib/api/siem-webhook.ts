import { apiClient } from "./client";
import type { SiemWebhookConfig, SiemWebhookConfigUpdate } from "./types";

export const siemWebhookApi = {
  get(): Promise<SiemWebhookConfig> {
    return apiClient.get<SiemWebhookConfig>("/admin/siem-webhook");
  },

  update(payload: SiemWebhookConfigUpdate): Promise<SiemWebhookConfig> {
    return apiClient.put<SiemWebhookConfig>("/admin/siem-webhook", payload);
  },
};
