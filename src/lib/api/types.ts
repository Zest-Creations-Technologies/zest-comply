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

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: "active" | "canceled" | "past_due" | "trialing";
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface Invoice {
  id: string;
  amount_cents: number;
  status: "paid" | "open" | "void" | "uncollectible";
  created_at: string;
  pdf_url?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  phase: ConversationPhase;
  status: "active" | "completed" | "archived";
  created_at: string;
  updated_at: string;
}

export type ConversationPhase =
  | "discovery"
  | "framework_selection"
  | "structure_approval"
  | "document_generation"
  | "completed";

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface CloudStorageProvider {
  id: string;
  provider: "google_drive" | "dropbox" | "onedrive";
  connected: boolean;
  email?: string;
  connected_at?: string;
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
