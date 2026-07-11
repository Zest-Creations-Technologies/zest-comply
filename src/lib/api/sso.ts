import { apiClient } from "./client";
import type { AuthTokens } from "./types";
import type { SsoConfig, SsoConfigUpdate, SsoDiscoverResponse } from "./types";

export const ssoApi = {
  // Org-admin configuration
  getConfig(): Promise<SsoConfig> {
    return apiClient.get<SsoConfig>("/admin/sso-config");
  },

  updateConfig(payload: SsoConfigUpdate): Promise<SsoConfig> {
    return apiClient.put<SsoConfig>("/admin/sso-config", payload);
  },

  // Public login flow
  discover(email: string): Promise<SsoDiscoverResponse> {
    return apiClient.post<SsoDiscoverResponse>("/auth/sso/discover", { email }, { skipAuth: true });
  },

  async exchange(handoffToken: string): Promise<AuthTokens> {
    // Cookies are set by the response - nothing for the client to store.
    return apiClient.post<AuthTokens>(
      "/auth/sso/exchange",
      { handoff_token: handoffToken },
      { skipAuth: true }
    );
  },
};
