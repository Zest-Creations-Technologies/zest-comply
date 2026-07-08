// Access Request (onboarding request) API client
// Replaces self-serve signup: prospects submit this form, staff manually
// create the account after review. No password is collected here.

import { apiClient } from './client';
import { API_CONFIG } from './config';
import { delay } from './mocks';
import type { AccessRequestPayload, AccessRequestResponse } from './types';

export const accessRequestsApi = {
  async submit(data: AccessRequestPayload): Promise<AccessRequestResponse> {
    if (API_CONFIG.useMocks) {
      await delay();
      return { message: "Thanks! We've received your request and will be in touch soon." };
    }

    return apiClient.post<AccessRequestResponse>('/access-requests', data, { skipAuth: true });
  },
};
