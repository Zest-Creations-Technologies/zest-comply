// Plans API client

import { apiClient } from "./client";
import { API_CONFIG } from "./config";
import { mockSubscription, delay } from "./mocks";
import type { UserPlan } from "./types";

export const plansApi = {
  async getSubscription(): Promise<UserPlan | null> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return mockSubscription;
    }
    try {
      const response = await apiClient.get<{ subscription: UserPlan | null }>("/plans/subscription/current");
      return response.subscription;
    } catch {
      return null;
    }
  },
};
