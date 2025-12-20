// Password Reset API client

import { apiClient } from './client';

interface InitiateResetResponse {
  message: string;
}

interface VerifyResetResponse {
  success: boolean;
  message: string;
}

export const passwordResetApi = {
  async initiate(email: string): Promise<InitiateResetResponse> {
    return apiClient.post<InitiateResetResponse>('/auth/password-reset/initiate', { email }, { skipAuth: true });
  },

  async verify(email: string, otp: string, newPassword: string): Promise<VerifyResetResponse> {
    return apiClient.post<VerifyResetResponse>('/auth/password-reset/verify', {
      email,
      otp,
      new_password: newPassword,
    }, { skipAuth: true });
  },
};
