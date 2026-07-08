// Auth API client

import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockUser, delay } from './mocks';
import type { User, AuthTokens, LoginRequest, SignupRequest, SignupResponse, UpdateProfileRequest, ChangePasswordRequest, ChangePasswordResponse } from './types';

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

  // Signup now returns user profile, NOT tokens (no auto-login)
  async signup(data: SignupRequest): Promise<SignupResponse> {
    if (API_CONFIG.useMocks) {
      await delay();
      // Mock returns user profile without tokens
      return {
        id: 'mock-user-' + Date.now(),
        email: data.email,
        first_name: data.first_name || null,
        last_name: data.last_name || null,
        company_name: data.company_name,
        full_name: [data.first_name, data.last_name].filter(Boolean).join(' ') || data.email,
        role: 'USER',
        is_active: true,
        email_verified: false,
        email_verified_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    // Signup returns user profile, no tokens saved
    return apiClient.post<SignupResponse>('/auth/signup', data, { skipAuth: true });
  },

  async logout(): Promise<void> {
    if (!API_CONFIG.useMocks) {
      try {
        const refreshToken = apiClient.getStoredRefreshToken();
        await apiClient.post('/auth/logout', refreshToken ? { refresh_token: refreshToken } : {});
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

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    if (API_CONFIG.useMocks) {
      await delay();
      return { ...mockUser, ...data, full_name: [data.first_name, data.last_name].filter(Boolean).join(' ') || mockUser.full_name };
    }
    return apiClient.patch<User>('/auth/me', data);
  },

  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    if (API_CONFIG.useMocks) {
      await delay();
      return {
        success: true,
        message: 'Password changed successfully. Other devices will need to login again.',
        access_token: 'mock-new-token-' + Date.now(),
        refresh_token: 'mock-new-refresh-' + Date.now(),
        token_type: 'bearer',
        expires_in: 900,
      };
    }
    const response = await apiClient.post<ChangePasswordResponse>('/auth/change-password', data);
    apiClient.saveTokens(response.access_token, response.refresh_token);
    return response;
  },
};
