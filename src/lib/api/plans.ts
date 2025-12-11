// Plans & Billing API client

import { apiClient } from "./client";
import { API_CONFIG } from "./config";
import { mockPlans, mockSubscription, mockInvoices, delay } from "./mocks";
import type { Plan, UserPlan, Invoice } from "./types";

export const plansApi = {
  async getPlans(): Promise<Plan[]> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return mockPlans;
    }
    const response = await apiClient.get<{ plans: Plan[]; count: number }>("/plans/");
    return response.plans;
  },

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

  async createCheckoutSession(planId: string): Promise<{ checkout_url: string }> {
    if (API_CONFIG.useMocks) {
      await delay();
      return { checkout_url: "#checkout-mock" };
    }
    const baseUrl = window.location.origin;
    return apiClient.post<{ checkout_url: string }>(`/plans/${planId}/checkout`, {
      success_url: `${baseUrl}/app/billing?checkout=success`,
      cancel_url: `${baseUrl}/app/billing?checkout=cancelled`,
    });
  },

  async cancelSubscription(): Promise<void> {
    if (API_CONFIG.useMocks) {
      await delay();
      return;
    }
    await apiClient.post("/subscription/cancel");
  },

  async resumeSubscription(): Promise<void> {
    if (API_CONFIG.useMocks) {
      await delay();
      return;
    }
    await apiClient.post("/subscription/resume");
  },

  async getInvoices(): Promise<Invoice[]> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return mockInvoices;
    }
    try {
      const response = await apiClient.get<{ invoices: Invoice[] }>("/plans/subscription/history");
      return response.invoices;
    } catch {
      return [];
    }
  },
};
