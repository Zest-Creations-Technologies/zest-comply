// Auth API client

import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockUser, delay } from './mocks';
import type { User, AuthTokens, LoginRequest, SignupRequest } from './types';

export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthTokens> {
    if (API_CONFIG.useMocks) {
      await delay();
      // Mock successful login
      const tokens: AuthTokens = {
        access_token: 'mock-access-token-' + Date.now(),
        refresh_token: 'mock-refresh-token-' + Date.now(),
        token_type: 'bearer',
        expires_in: 3600,
      };
      apiClient.saveTokens(tokens.access_token, tokens.refresh_token);
      return tokens;
    }

    const tokens = await apiClient.post<AuthTokens>('/auth/login', credentials, { skipAuth: true });
    apiClient.saveTokens(tokens.access_token, tokens.refresh_token);
    return tokens;
  },

  async signup(data: SignupRequest): Promise<AuthTokens> {
    if (API_CONFIG.useMocks) {
      await delay();
      const tokens: AuthTokens = {
        access_token: 'mock-access-token-' + Date.now(),
        refresh_token: 'mock-refresh-token-' + Date.now(),
        token_type: 'bearer',
        expires_in: 3600,
      };
      apiClient.saveTokens(tokens.access_token, tokens.refresh_token);
      return tokens;
    }

    const tokens = await apiClient.post<AuthTokens>('/auth/signup', data, { skipAuth: true });
    apiClient.saveTokens(tokens.access_token, tokens.refresh_token);
    return tokens;
  },

  async logout(): Promise<void> {
    if (!API_CONFIG.useMocks) {
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // Ignore errors on logout
      }
    }
    apiClient.removeTokens();
  },

  async getCurrentUser(): Promise<User> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      if (!apiClient.hasTokens()) {
        throw new Error('Not authenticated');
      }
      return mockUser;
    }

    return apiClient.get<User>('/auth/me');
  },

  isAuthenticated(): boolean {
    return apiClient.hasTokens();
  },
};
