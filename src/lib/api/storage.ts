// Cloud Storage API client

import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockCloudProviders, delay } from './mocks';
import type { CloudStorageProvider } from './types';

export const storageApi = {
  async getProviders(): Promise<CloudStorageProvider[]> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return mockCloudProviders;
    }
    return apiClient.get<CloudStorageProvider[]>('/storage/providers');
  },

  async connectProvider(provider: string): Promise<{ auth_url: string }> {
    if (API_CONFIG.useMocks) {
      await delay();
      // Mock OAuth URL
      return { auth_url: `#oauth-${provider}-mock` };
    }
    return apiClient.post<{ auth_url: string }>(`/storage/connect/${provider}`);
  },

  async disconnectProvider(provider: string): Promise<void> {
    if (API_CONFIG.useMocks) {
      await delay();
      return;
    }
    await apiClient.delete(`/storage/disconnect/${provider}`);
  },
};
