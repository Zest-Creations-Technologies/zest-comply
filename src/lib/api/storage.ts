// Cloud Storage API client

import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockCloudProviders, delay } from './mocks';
import type { LinkedProvidersResponse, OAuthLinkResponse, StorageProvider } from './types';

export const storageApi = {
  async getLinkedProviders(): Promise<LinkedProvidersResponse> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return { providers: mockCloudProviders };
    }
    return apiClient.get<LinkedProvidersResponse>('/cloud-storage/credentials');
  },

  async linkProvider(provider: StorageProvider): Promise<OAuthLinkResponse> {
    if (API_CONFIG.useMocks) {
      await delay();
      // Mock OAuth URL
      return { auth_url: `#oauth-${provider}-mock` };
    }
    return apiClient.get<OAuthLinkResponse>(`/cloud-storage/link/${provider}`);
  },

  async unlinkProvider(provider: StorageProvider): Promise<void> {
    if (API_CONFIG.useMocks) {
      await delay();
      return;
    }
    await apiClient.delete(`/cloud-storage/unlink/${provider}`);
  },
};
