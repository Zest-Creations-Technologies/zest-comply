// Mock data for development

import type { User, Plan, Subscription, Conversation, Invoice, CloudStorageProvider } from './types';

export const mockUser: User = {
  id: 'user-1',
  email: 'demo@zestcomply.com',
  name: 'Demo User',
  plan_id: 'plan-pro',
  created_at: '2024-01-15T10:00:00Z',
};

export const mockPlans: Plan[] = [
  {
    id: 'plan-starter',
    name: 'Starter',
    description: 'Perfect for getting started with compliance',
    price_cents: 2900,
    interval: 'month',
    trial_days: 7,
    trial_interval: 'day',
    features: [
      '5 compliance documents/month',
      '1 framework',
      'Email support',
      'Basic templates',
    ],
  },
  {
    id: 'plan-pro',
    name: 'Professional',
    description: 'For growing teams needing more power',
    price_cents: 7900,
    interval: 'month',
    trial_days: 14,
    trial_interval: 'day',
    features: [
      'Unlimited documents',
      'All frameworks',
      'Priority support',
      'Custom templates',
      'Cloud storage integration',
      'Team collaboration',
    ],
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    description: 'Full power for large organizations',
    price_cents: 19900,
    interval: 'month',
    features: [
      'Everything in Professional',
      'Dedicated account manager',
      'Custom integrations',
      'SLA guarantee',
      'On-premise deployment',
      'Advanced analytics',
    ],
  },
];

export const mockSubscription: Subscription = {
  id: 'sub-1',
  user_id: 'user-1',
  plan_id: 'plan-pro',
  status: 'active',
  current_period_start: '2024-11-01T00:00:00Z',
  current_period_end: '2024-12-01T00:00:00Z',
  cancel_at_period_end: false,
};

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    user_id: 'user-1',
    title: 'SOC 2 Type II Compliance Assessment',
    phase: 'document_generation',
    status: 'active',
    created_at: '2024-11-20T14:30:00Z',
    updated_at: '2024-11-25T09:15:00Z',
  },
  {
    id: 'conv-2',
    user_id: 'user-1',
    title: 'GDPR Data Processing Documentation',
    phase: 'completed',
    status: 'completed',
    created_at: '2024-11-10T08:00:00Z',
    updated_at: '2024-11-15T16:45:00Z',
  },
  {
    id: 'conv-3',
    user_id: 'user-1',
    title: 'ISO 27001 Initial Assessment',
    phase: 'framework_selection',
    status: 'archived',
    created_at: '2024-10-05T11:20:00Z',
    updated_at: '2024-10-08T13:00:00Z',
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-3',
    amount_cents: 7900,
    status: 'paid',
    created_at: '2024-11-01T00:00:00Z',
    pdf_url: '#',
  },
  {
    id: 'inv-2',
    amount_cents: 7900,
    status: 'paid',
    created_at: '2024-10-01T00:00:00Z',
    pdf_url: '#',
  },
  {
    id: 'inv-1',
    amount_cents: 7900,
    status: 'paid',
    created_at: '2024-09-01T00:00:00Z',
    pdf_url: '#',
  },
];

export const mockCloudProviders: CloudStorageProvider[] = [
  {
    id: 'provider-1',
    provider: 'google_drive',
    connected: true,
    email: 'demo@gmail.com',
    connected_at: '2024-10-15T09:00:00Z',
  },
  {
    id: 'provider-2',
    provider: 'dropbox',
    connected: false,
  },
  {
    id: 'provider-3',
    provider: 'onedrive',
    connected: false,
  },
];

// Helper to simulate API delay
export const delay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));
