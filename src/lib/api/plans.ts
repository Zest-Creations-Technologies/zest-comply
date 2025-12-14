// Plans & Billing API client

import { apiClient } from "./client";
import { API_CONFIG } from "./config";
import { mockPlans, mockSubscription, mockInvoices, delay } from "./mocks";
import type { 
  Plan, 
  UserPlan, 
  Invoice, 
  PlanChangeResponse, 
  CancelSubscriptionResponse, 
  ResumeSubscriptionResponse,
  PreviewPlanChangeResponse 
} from "./types";

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

  async previewPlanChange(targetPlanId: string): Promise<PreviewPlanChangeResponse> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return {
        current_plan_name: "Professional",
        new_plan_name: "Enterprise",
        prorated_amount: 45.50,
        next_invoice_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        is_upgrade: true,
      };
    }
    return apiClient.get<PreviewPlanChangeResponse>(`/plans/change/preview?target_plan_id=${targetPlanId}`);
  },

  async changePlan(targetPlanId: string): Promise<PlanChangeResponse> {
    if (API_CONFIG.useMocks) {
      await delay();
      return { 
        message: "Plan changed successfully", 
        paid_plan_change: { checkout_url: "#checkout-mock" },
        migrate_plan_change: null 
      };
    }
    const baseUrl = window.location.origin;
    return apiClient.post<PlanChangeResponse>("/plans/change", {
      target_plan_id: targetPlanId,
      success_url: `${baseUrl}/app/billing?checkout=success`,
      cancel_url: `${baseUrl}/app/billing?checkout=cancelled`,
    });
  },

  async cancelSubscription(): Promise<CancelSubscriptionResponse> {
    if (API_CONFIG.useMocks) {
      await delay();
      return { 
        message: "Subscription canceled successfully.", 
        current_period_end: new Date().toISOString(), 
        canceled_at: new Date().toISOString() 
      };
    }
    return apiClient.post<CancelSubscriptionResponse>("/plan/cancel");
  },

  async resumeSubscription(): Promise<ResumeSubscriptionResponse> {
    if (API_CONFIG.useMocks) {
      await delay();
      return { 
        message: "Subscription resumed successfully.", 
        next_billing_date: new Date().toISOString(), 
        resumed_at: new Date().toISOString() 
      };
    }
    return apiClient.post<ResumeSubscriptionResponse>("/plans/subscription/resume");
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
