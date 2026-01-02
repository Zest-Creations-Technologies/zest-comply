// Mock data for development

import type { User, Plan, UserPlan, ConversationSession, Invoice, LinkedProviderInfo } from './types';

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
    id: 'plan-free',
    name: 'Free',
    description: 'Get started with basic compliance tools',
    display_price: 'Free',
    type: 'free',
    is_active: true,
    trial_days: 0,
    features: [
      { title: '1 Document', description: '1 compliance document per month', value: '1', category: 'Documents' },
      { title: 'Community Support', description: 'Get help from the community', value: true, category: 'Support' },
    ],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'plan-starter',
    name: 'Starter',
    description: 'Perfect for getting started with compliance',
    display_price: '$29/month',
    type: 'paid',
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
    type: 'paid',
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
    type: 'paid',
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

export const mockSubscription: UserPlan = {
  id: 'sub-1',
  user_id: 'user-1',
  plan_id: 'plan-pro',
  status: 'active',
  current_period_start: '2024-11-01T00:00:00Z',
  current_period_end: '2024-12-01T00:00:00Z',
  cancel_at_period_end: false,
  documents_generated_this_period: 3,
  packages_generated_this_period: 1,
  last_quota_reset: '2024-11-01T00:00:00Z',
  plan: mockPlans[1],
};

export const mockConversationSessions: ConversationSession[] = [
  {
    id: 'conv-1',
    user_id: 'user-1',
    company_name: 'Acme Corp',
    company_industry: 'Technology',
    company_sector: 'Cloud Services',
    company_size: '50-200 employees',
    company_location: 'United States',
    company_system_type: 'SaaS',
    company_description: 'Cloud-based project management platform',
    current_phase: 'document_generation',
    is_archived: false,
    archived_at: null,
    messages: [],
    facts: [],
    created_at: '2024-11-20T14:30:00Z',
    updated_at: '2024-11-25T09:15:00Z',
  },
  {
    id: 'conv-2',
    user_id: 'user-1',
    company_name: 'TechStart Inc',
    company_industry: 'Healthcare',
    company_sector: 'Health Tech',
    company_size: '10-50 employees',
    company_location: 'Germany',
    company_system_type: 'Web Application',
    company_description: 'Patient data management system',
    current_phase: 'completed',
    is_archived: false,
    archived_at: null,
    messages: [],
    facts: [],
    created_at: '2024-11-10T08:00:00Z',
    updated_at: '2024-11-15T16:45:00Z',
  },
  {
    id: 'conv-3',
    user_id: 'user-1',
    company_name: 'SecureData LLC',
    company_industry: 'Finance',
    company_sector: 'FinTech',
    company_size: '200-500 employees',
    company_location: 'United Kingdom',
    company_system_type: 'API Platform',
    company_description: 'Payment processing API',
    current_phase: 'framework_selection',
    is_archived: true,
    archived_at: '2024-10-08T13:00:00Z',
    messages: [],
    facts: [],
    created_at: '2024-10-05T11:20:00Z',
    updated_at: '2024-10-08T13:00:00Z',
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: 'inv-3',
    amount_paid: 79.00,
    currency: 'usd',
    status: 'paid',
    created: '2024-11-01T00:00:00Z',
    invoice_pdf: '#',
  },
  {
    id: 'inv-2',
    amount_paid: 79.00,
    currency: 'usd',
    status: 'paid',
    created: '2024-10-01T00:00:00Z',
    invoice_pdf: '#',
  },
  {
    id: 'inv-1',
    amount_paid: 79.00,
    currency: 'usd',
    status: 'paid',
    created: '2024-09-01T00:00:00Z',
    invoice_pdf: '#',
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
