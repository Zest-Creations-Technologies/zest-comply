// Plans & Billing API client

import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockPlans, mockSubscription, mockInvoices, delay } from './mocks';
import type { Plan, Subscription, Invoice } from './types';

export const plansApi = {
  async getPlans(): Promise<Plan[]> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return mockPlans;
    }
    return apiClient.get<Plan[]>('/plans');
  },

  async getSubscription(): Promise<Subscription | null> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return mockSubscription;
    }
    try {
      return await apiClient.get<Subscription>('/subscription');
    } catch {
      return null;
    }
  },

  async createCheckoutSession(planId: string): Promise<{ checkout_url: string }> {
    if (API_CONFIG.useMocks) {
      await delay();
      // In mock mode, just return a placeholder
      return { checkout_url: '#checkout-mock' };
    }
    return apiClient.post<{ checkout_url: string }>('/subscription/checkout', { plan_id: planId });
  },

  async cancelSubscription(): Promise<void> {
    if (API_CONFIG.useMocks) {
      await delay();
      return;
    }
    await apiClient.post('/subscription/cancel');
  },

  async resumeSubscription(): Promise<void> {
    if (API_CONFIG.useMocks) {
      await delay();
      return;
    }
    await apiClient.post('/subscription/resume');
  },

  async getInvoices(): Promise<Invoice[]> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return mockInvoices;
    }
    return apiClient.get<Invoice[]>('/invoices');
  },
};
