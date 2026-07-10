// Auth API client

import { apiClient } from './client';
import { API_CONFIG, getApiUrl } from './config';
import { mockUser, delay } from './mocks';
import { isMfaRequired } from './types';
import type { User, AuthTokens, LoginRequest, LoginResponse, MFAVerifyRequest, MFAToggleRequest, MFAToggleResponse, TOTPSetupResponse, TOTPVerifySetupRequest, SignupRequest, SignupResponse, UpdateProfileRequest, ChangePasswordRequest, ChangePasswordResponse, AcceptInviteRequest } from './types';

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
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

    const result = await apiClient.post<LoginResponse>('/auth/login', credentials, { skipAuth: true });
    if (isMfaRequired(result)) {
      return result;
    }
    apiClient.saveTokens(result.access_token, result.refresh_token);
    return result;
  },

  // Completes a login that returned MFARequiredResponse.
  async verifyMfa(data: MFAVerifyRequest): Promise<AuthTokens> {
    const tokens = await apiClient.post<AuthTokens>('/auth/mfa/verify', data, { skipAuth: true });
    apiClient.saveTokens(tokens.access_token, tokens.refresh_token);
    return tokens;
  },

  // Email-OTP MFA toggle (requires re-entering the current password).
  async enableMfa(data: MFAToggleRequest): Promise<MFAToggleResponse> {
    return apiClient.post<MFAToggleResponse>('/auth/mfa/enable', data);
  },

  async disableMfa(data: MFAToggleRequest): Promise<MFAToggleResponse> {
    return apiClient.post<MFAToggleResponse>('/auth/mfa/disable', data);
  },

  // Authenticator-app (TOTP) enrollment.
  async setupTotp(data: MFAToggleRequest): Promise<TOTPSetupResponse> {
    return apiClient.post<TOTPSetupResponse>('/auth/mfa/totp/setup', data);
  },

  async verifyTotpSetup(data: TOTPVerifySetupRequest): Promise<MFAToggleResponse> {
    return apiClient.post<MFAToggleResponse>('/auth/mfa/totp/verify-setup', data);
  },

  async disableTotp(data: MFAToggleRequest): Promise<MFAToggleResponse> {
    return apiClient.post<MFAToggleResponse>('/auth/mfa/totp/disable', data);
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

  // Accept an admin-sent org invite. Creates the account and logs in (like login()).
  async acceptInvite(data: AcceptInviteRequest): Promise<AuthTokens> {
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

    const tokens = await apiClient.post<AuthTokens>('/auth/accept-invite', data, { skipAuth: true });
    apiClient.saveTokens(tokens.access_token, tokens.refresh_token);
    return tokens;
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

  async uploadAvatar(file: File): Promise<User> {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.uploadFormData<User>('/auth/me/avatar', formData);
  },

  async deleteAvatar(): Promise<User> {
    return apiClient.delete<User>('/auth/me/avatar');
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

  // Auth headers can't be set on a plain <a href> download, so fetch as a
  // blob with the token attached and trigger the download client-side.
  async exportMyData(): Promise<void> {
    const token = localStorage.getItem('access_token');
    const response = await fetch(getApiUrl('/users/me/export'), {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    if (!response.ok) {
      throw new Error('Failed to export data');
    }

    const blob = await response.blob();
    const disposition = response.headers.get('Content-Disposition') ?? '';
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] ?? 'zestcomply-export.json';

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
