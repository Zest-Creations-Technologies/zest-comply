// API Types based on OpenAPI spec

export interface User {
  id: string;
  email: string;
  name?: string;
  plan_id?: string;
  created_at: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price_cents: number;
  interval: 'month' | 'year';
  features: string[];
  trial_days?: number;
  trial_interval?: 'day' | 'week' | 'month';
  stripe_price_id?: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
}

export interface Invoice {
  id: string;
  amount_cents: number;
  status: 'paid' | 'open' | 'void' | 'uncollectible';
  created_at: string;
  pdf_url?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  phase: ConversationPhase;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
  updated_at: string;
}

export type ConversationPhase = 
  | 'discovery' 
  | 'framework_selection' 
  | 'structure_approval' 
  | 'document_generation' 
  | 'completed';

export interface Message {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
  metadata?: Record<string, unknown>;
}

export interface CloudStorageProvider {
  id: string;
  provider: 'google_drive' | 'dropbox' | 'onedrive';
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
  name?: string;
}

export interface ApiError {
  detail: string;
  status_code?: number;
}
