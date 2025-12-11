// Mock data for development

import type { User, Plan, Subscription, Conversation, Invoice, LinkedProviderInfo } from './types';

export const mockUser: User = {
  id: 'user-1',
  email: 'demo@zestcomply.com',
  first_name: 'Demo',
  last_name: 'User',
  full_name: 'Demo User',
  role: 'USER',
  is_active: true,
  created_at: '2024-01-15T10:00:00Z',
  updated_at: '2024-01-15T10:00:00Z',
};

export const mockPlans: Plan[] = [
  {
    id: 'plan-starter',
    name: 'Starter',
    description: 'Perfect for getting started with compliance',
    display_price: '$29/month',
    is_active: true,
    trial_days: 7,
    features: [
      { title: '5 Documents', description: '5 compliance documents per month', value: '5', category: 'Documents' },
      { title: 'Single Framework', description: 'Generate docs for 1 framework at a time', value: true, category: 'Frameworks' },
      { title: 'Email Support', description: 'Get help via email', value: true, category: 'Support' },
      { title: 'Basic Templates', description: 'Access to standard templates', value: true, category: 'Templates' },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'plan-pro',
    name: 'Professional',
    description: 'For growing teams needing more power',
    display_price: '$79/month',
    is_active: true,
    trial_days: 14,
    features: [
      { title: 'Unlimited Documents', description: 'Generate unlimited compliance documents', value: 'Unlimited', category: 'Documents' },
      { title: 'All Frameworks', description: 'Access any compliance framework', value: true, category: 'Frameworks' },
      { title: 'Priority Support', description: 'Get faster responses from our team', value: true, category: 'Support' },
      { title: 'Custom Templates', description: 'Create and save custom templates', value: true, category: 'Templates' },
      { title: 'Cloud Storage', description: 'Sync to Google Drive, Dropbox, OneDrive', value: true, category: 'Integrations' },
      { title: 'Team Collaboration', description: 'Work together with your team', value: true, category: 'Collaboration' },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    description: 'Full power for large organizations',
    display_price: '$199/month',
    is_active: true,
    features: [
      { title: 'Everything in Pro', description: 'All Professional features included', value: true, category: 'Base' },
      { title: 'Dedicated Manager', description: 'Your own account manager', value: true, category: 'Support' },
      { title: 'Custom Integrations', description: 'Connect to your existing tools', value: true, category: 'Integrations' },
      { title: 'SLA Guarantee', description: '99.9% uptime guarantee', value: '99.9%', category: 'Reliability' },
      { title: 'On-Premise Option', description: 'Deploy on your own infrastructure', value: true, category: 'Deployment' },
      { title: 'Advanced Analytics', description: 'Deep insights into compliance status', value: true, category: 'Analytics' },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
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

export const mockCloudProviders: LinkedProviderInfo[] = [
  {
    provider: 'google_drive',
    linked_at: '2024-10-15T09:00:00Z',
  },
];

// Helper to simulate API delay
export const delay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));
