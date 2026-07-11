// Auth API client

import { apiClient } from './client';
import { API_CONFIG, getApiUrl } from './config';
import { mockUser, delay } from './mocks';
import { isMfaRequired } from './types';
import type { User, AuthTokens, LoginRequest, LoginResponse, MFAVerifyRequest, MFAToggleRequest, MFAToggleResponse, TOTPSetupResponse, TOTPVerifySetupRequest, SignupRequest, SignupResponse, UpdateProfileRequest, ChangePasswordRequest, ChangePasswordResponse, AcceptInviteRequest, PasswordConfirmationRequest, DeletionConfirmationResponse } from './types';

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    if (API_CONFIG.useMocks) {
      await delay();
      // Mock successful login - real login sets httpOnly cookies server-side,
      // nothing for the client to store either way.
      return {
        access_token: 'mock-access-token-' + Date.now(),
        refresh_token: 'mock-refresh-token-' + Date.now(),
        token_type: 'bearer',
        expires_in: 3600,
      };
    }

    // Tokens are set as httpOnly cookies by the server response - nothing
    // for the client to store. The parsed body is only used to detect the
    // MFA-required case.
    return apiClient.post<LoginResponse>('/auth/login', credentials, { skipAuth: true });
  },

  // Completes a login that returned MFARequiredResponse.
  async verifyMfa(data: MFAVerifyRequest): Promise<AuthTokens> {
    return apiClient.post<AuthTokens>('/auth/mfa/verify', data, { skipAuth: true });
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
      return {
        access_token: 'mock-access-token-' + Date.now(),
        refresh_token: 'mock-refresh-token-' + Date.now(),
        token_type: 'bearer',
        expires_in: 3600,
      };
    }

    return apiClient.post<AuthTokens>('/auth/accept-invite', data, { skipAuth: true });
  },

  async logout(): Promise<void> {
    if (!API_CONFIG.useMocks) {
      try {
        // No body needed - the server reads the refresh token from the
        // httpOnly cookie and clears all auth cookies on the response.
        await apiClient.post('/auth/logout', {});
      } catch {
        // Ignore errors on logout
      }
    }
  },

  async getCurrentUser(): Promise<User> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      if (!apiClient.hasSession()) {
        throw new Error('Not authenticated');
      }
      return mockUser;
    }

    return apiClient.get<User>('/auth/me');
  },

  isAuthenticated(): boolean {
    return apiClient.hasSession();
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
    // New cookies are set on the response - nothing for the client to store.
    return apiClient.post<ChangePasswordResponse>('/auth/change-password', data);
  },

  // Auth is carried by the httpOnly cookie automatically - just need
  // credentials included, no manual Authorization header to construct.
  async exportMyData(): Promise<void> {
    const response = await fetch(getApiUrl('/users/me/export'), {
      credentials: 'include',
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

  // Right-to-erasure account deletion. Server clears auth cookies on the
  // response - nothing for the client to store either way.
  async deleteMyAccount(data: PasswordConfirmationRequest): Promise<DeletionConfirmationResponse> {
    if (API_CONFIG.useMocks) {
      await delay();
      return { message: 'Your account has been deleted.', deleted_at: new Date().toISOString() };
    }
    return apiClient.delete<DeletionConfirmationResponse>('/users/me', { body: JSON.stringify(data) });
  },
};
