// API Types based on OpenAPI spec

export interface UserPlan {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  current_period_start?: string | null;
  current_period_end?: string | null;
  cancel_at_period_end: boolean;
  cancel_at?: string | null;
  canceled_at?: string | null;
  trial_start?: string | null;
  trial_end?: string | null;
  ended_at?: string | null;
  documents_generated_this_period: number;
  packages_generated_this_period: number;
  last_quota_reset?: string | null;
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
  type: 'free' | 'paid';
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

export interface PreviewPlanChangeResponse {
  current_plan_name: string;
  new_plan_name: string;
  prorated_amount: number;
  next_invoice_date: string;
  is_upgrade: boolean;
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

// Compliance Packages Types
export type PackageStorageProvider = "GOOGLE_DRIVE" | "DROPBOX" | "ONEDRIVE";

export interface ManifestFile {
  path: string;
  filename: string;
  size: number;
  created_at: string;
  file_type: string;
  checksum: string;
}

export interface CompanyInfo {
  name: string;
  industry: string;
  size: string;
}

export interface PackageManifest {
  session_id: string;
  framework: string;
  company: CompanyInfo;
  generated_at: string;
  total_documents: number;
  files: ManifestFile[];
  package_version: string;
}

export interface CompliancePackage {
  id: string;
  session_id: string;
  user_id: string;
  framework: string;
  root_folder_name: string;
  provider: PackageStorageProvider;
  package_url: string;
  file_id: string;
  package_name: string;
  file_size: number;
  manifest_json: PackageManifest;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface ListCompliancePackagesResponse {
  packages: CompliancePackage[];
  count: number;
}

export interface PackagesPaginationParams {
  limit?: number;
  last_uploaded_at?: string;
  last_id?: string;
}

// ============================================
// User Settings Types (Document Customization)
// ============================================

export interface Letterhead {
  id: string;
  logo_cloud_path: string | null;
  logo_width_inches: number;
  show_logo: boolean;
  header_text: string | null;
  footer_text: string | null;
  top_margin: number;
  bottom_margin: number;
  left_margin: number;
  right_margin: number;
  created_at: string;
  updated_at: string;
}

export interface StyleElement {
  font?: string;
  size?: number;
  bold?: boolean;
  italic?: boolean;
  color?: string;
  spacing_after?: number;
  spacing_before?: number;
}

export interface TableStyle {
  header_bold?: boolean;
  header_background?: string;
  cell_font_size?: number;
}

export interface StylesJson {
  heading_1?: StyleElement;
  heading_2?: StyleElement;
  heading_3?: StyleElement;
  paragraph?: StyleElement;
  list_item?: StyleElement;
  table?: TableStyle;
}

export interface StyleMap {
  id: string;
  user_settings_id: string;
  styles_json: StylesJson;
  active_template: string;
  framework_overrides: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  letterhead: Letterhead;
  stylemap: StyleMap;
  created_at: string;
  updated_at: string;
}

export interface LetterheadUpdate {
  show_logo?: boolean;
  logo_width_inches?: number;
  header_text?: string;
  footer_text?: string;
  top_margin?: number;
  bottom_margin?: number;
  left_margin?: number;
  right_margin?: number;
}

export interface StyleMapUpdate {
  styles_json?: StylesJson;
  active_template?: string;
  framework_overrides?: Record<string, unknown>;
}

export interface ConversationLogo {
  id: string;
  session_id: string;
  logo_cloud_path: string;
  logo_width_inches: number;
  original_filename: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}

export interface LetterheadLogoResponse {
  message: string;
  logo_cloud_path: string;
  logo_width_inches: number;
}
