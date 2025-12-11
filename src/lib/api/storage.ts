// Cloud Storage API client

import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockCloudProviders, delay } from './mocks';
import type { LinkedProvidersResponse, OAuthLinkResponse, StorageProvider } from './types';

export const storageApi = {
  async getLinkedProviders(): Promise<LinkedProvidersResponse> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return { linked_providers: mockCloudProviders };
    }
    return apiClient.get<LinkedProvidersResponse>('/cloud-storage/credentials');
  },

  async linkProvider(provider: StorageProvider, redirectUri?: string): Promise<OAuthLinkResponse> {
    if (API_CONFIG.useMocks) {
      await delay();
      // Mock OAuth URL
      return { authorization_url: `#oauth-${provider}-mock`, provider };
    }
    const params = redirectUri ? `?redirect_uri=${encodeURIComponent(redirectUri)}` : '';
    return apiClient.get<OAuthLinkResponse>(`/cloud-storage/link/${provider}${params}`);
  },

  async unlinkProvider(provider: StorageProvider): Promise<void> {
    if (API_CONFIG.useMocks) {
      await delay();
      return;
    }
    await apiClient.delete(`/cloud-storage/unlink/${provider}`);
  },
};
