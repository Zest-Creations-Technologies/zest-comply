// API Types based on OpenAPI spec

export interface UserPlan {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  cancel_at?: string | null;
  canceled_at?: string | null;
  trial_start?: string | null;
  trial_end?: string | null;
  ended_at?: string | null;
  plan: Plan;
}

export interface User {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  full_name: string;
  role: string;
  is_active: boolean;
  user_plan?: UserPlan | null;
  created_at: string;
  updated_at: string;
}

export interface PlanFeature {
  title: string;
  description: string;
  value?: string | boolean | null;
  category?: string | null;
}

export interface Plan {
  id: string;
  name: string;
  description?: string | null;
  display_price?: string | null;
  is_active: boolean;
  trial_days?: number | null;
  features: PlanFeature[];
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  created: string;
  amount_paid: number;
  currency: string;
  status: string;
  invoice_pdf?: string | null;
}

// Plan change response types
export interface PaidPlanChangeResponse {
  checkout_url: string;
}

export interface MigratePlanChangeResponse {
  old_plan_name: string | null;
  new_plan_name: string;
  proration_amount: number;
  effective_date: string;
}

export interface PlanChangeResponse {
  message: string;
  paid_plan_change: PaidPlanChangeResponse | null;
  migrate_plan_change: MigratePlanChangeResponse | null;
}

export interface CancelSubscriptionResponse {
  message: string;
  current_period_end: string | null;
  canceled_at: string | null;
}

export interface ResumeSubscriptionResponse {
  message: string;
  next_billing_date: string | null;
  resumed_at: string | null;
}

export interface ConversationMessage {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationFact {
  id: string;
  session_id: string;
  category: string;
  key: string;
  value: unknown;
  confidence: number;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface ConversationSession {
  id: string;
  user_id: string | null;
  company_name: string | null;
  company_industry: string | null;
  company_sector: string | null;
  company_size: string | null;
  company_location: string | null;
  company_system_type: string | null;
  company_description: string | null;
  current_phase: string;
  is_archived: boolean;
  archived_at: string | null;
  messages: ConversationMessage[];
  facts: ConversationFact[];
  created_at: string;
  updated_at: string;
}

// Legacy alias for backwards compatibility
export type Conversation = ConversationSession;
export type Message = ConversationMessage;

// Storage provider enum
export type StorageProvider = "google_drive" | "dropbox" | "onedrive";

// Linked provider info from API
export interface LinkedProviderInfo {
  provider: StorageProvider;
  linked_at: string;
}

// Response from GET /cloud-storage/credentials
export interface LinkedProvidersResponse {
  linked_providers: LinkedProviderInfo[];
}

// Response from GET /cloud-storage/link/{provider}
export interface OAuthLinkResponse {
  authorization_url: string;
  provider: StorageProvider;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignupRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}
