// Email Verification API client

import { apiClient } from './client';
import { API_CONFIG } from './config';
import { delay } from './mocks';
import type { VerifyEmailRequest, VerifyEmailResponse, ResendOtpRequest, ResendOtpResponse } from './types';

export const emailVerificationApi = {
  async verifyEmail(data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    if (API_CONFIG.useMocks) {
      await delay(500);
      // Mock successful verification
      if (data.otp === '123456') {
        return {
          success: true,
          message: 'Email verified successfully. You can now login.',
          email_verified: true,
        };
      }
      throw new Error('Invalid or expired OTP code');
    }

    return apiClient.post<VerifyEmailResponse>('/auth/email-verification/verify', data, { skipAuth: true });
  },

  async resendOtp(data: ResendOtpRequest): Promise<ResendOtpResponse> {
    if (API_CONFIG.useMocks) {
      await delay(500);
      return {
        message: 'If an unverified account exists with this email, a new verification code has been sent.',
      };
    }

    return apiClient.post<ResendOtpResponse>('/auth/email-verification/resend', data, { skipAuth: true });
  },
};
