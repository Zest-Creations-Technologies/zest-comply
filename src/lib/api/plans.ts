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

  async cancelSubscription(): Promise<{ message: string; current_period_end: string; canceled_at: string | null }> {
    if (API_CONFIG.useMocks) {
      await delay();
      return { message: "Subscription canceled successfully.", current_period_end: new Date().toISOString(), canceled_at: null };
    }
    return apiClient.post<{ message: string; current_period_end: string; canceled_at: string | null }>("/plans/subscription/cancel");
  },

  async resumeSubscription(): Promise<{ message: string; next_billing_date: string; resumed_at: string }> {
    if (API_CONFIG.useMocks) {
      await delay();
      return { message: "Subscription resumed successfully.", next_billing_date: new Date().toISOString(), resumed_at: new Date().toISOString() };
    }
    return apiClient.post<{ message: string; next_billing_date: string; resumed_at: string }>("/plans/subscription/resume");
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
