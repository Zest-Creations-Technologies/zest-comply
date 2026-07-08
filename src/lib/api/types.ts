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
  company_name?: string | null;
  full_name: string;
  role: 'USER' | 'STAFF' | 'ADMIN';
  is_active: boolean;
  email_verified: boolean;
  email_verified_at?: string | null;
  user_plan?: UserPlan | null;
  created_at: string;
  updated_at: string;
}

// Email verification types
export interface SignupResponse {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  company_name?: string | null;
  full_name: string;
  role: 'USER' | 'STAFF' | 'ADMIN';
  is_active: boolean;
  email_verified: boolean;
  email_verified_at?: string | null;
  user_plan?: UserPlan | null;
  created_at: string;
  updated_at: string;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  email_verified: boolean;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
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
  logo: ConversationLogo | null;
  created_at: string;
  updated_at: string;
}

// Legacy alias for backwards compatibility
export type Conversation = ConversationSession;
export type Message = ConversationMessage;

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
  company_name: string;
  first_name?: string;
  last_name?: string;
}

export interface AccessRequestPayload {
  company_name: string;
  contact_first_name: string;
  contact_last_name: string;
  email: string;
  company_size?: string;
  message?: string;
}

export interface AccessRequestResponse {
  message: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
  status_code?: number;
  details?: {
    feature?: string;
    reason?: string;
    suggestion?: string;
  };
}

// Compliance Packages Types
export type PackageStorageProvider = "R2";

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
  updated_at: string;
}

export interface LetterheadLogoResponse {
  message: string;
  logo_cloud_path: string;
  logo_width_inches: number;
}

// Profile update request/response
export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
}

// Change password request/response
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// ============================================
// Human Validation & Governance Types
// ============================================

export type HumanValidationStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "signed_off";

export type HumanValidationRole = "reviewer" | "approver" | "executive_signer";

export type HumanValidationDecisionAction = "approve" | "reject" | "request_changes";

export type HumanValidationAuditEventType =
  | "profile_created"
  | "profile_updated"
  | "reviewer_assigned"
  | "approver_assigned"
  | "executive_signer_assigned"
  | "submitted_for_review"
  | "comment_added"
  | "changes_requested"
  | "approved"
  | "rejected"
  | "executive_signoff_updated";

export interface CompanyValidationProfileBase {
  package_id?: string | null;
  legal_name?: string | null;
  business_unit?: string | null;
  system_owner_name?: string | null;
  system_owner_email?: string | null;
  compliance_owner_name?: string | null;
  compliance_owner_email?: string | null;
  scope_summary?: string | null;
  in_scope_locations: unknown[];
  in_scope_systems: unknown[];
  data_types: unknown[];
  third_parties: unknown[];
  assumptions: unknown[];
  exclusions: unknown[];
  metadata_json: Record<string, unknown>;
}

export interface CompanyValidationProfileCreate extends CompanyValidationProfileBase {
  conversation_session_id: string;
}

export interface CompanyValidationProfileUpdate {
  legal_name?: string | null;
  business_unit?: string | null;
  system_owner_name?: string | null;
  system_owner_email?: string | null;
  compliance_owner_name?: string | null;
  compliance_owner_email?: string | null;
  scope_summary?: string | null;
  in_scope_locations?: unknown[] | null;
  in_scope_systems?: unknown[] | null;
  data_types?: unknown[] | null;
  third_parties?: unknown[] | null;
  assumptions?: unknown[] | null;
  exclusions?: unknown[] | null;
  metadata_json?: Record<string, unknown> | null;
}

export interface CompanyValidationProfile extends CompanyValidationProfileBase {
  id: string;
  user_id: string;
  conversation_session_id: string;
  framework_version_id?: string | null;
  status: HumanValidationStatus;
  created_at: string;
  updated_at: string;
}

export interface HumanValidationQueueResponse {
  profiles: CompanyValidationProfile[];
  count: number;
}

export interface ValidationAssignmentCreate {
  user_id: string;
  role: HumanValidationRole;
  metadata_json?: Record<string, unknown>;
}

export interface ValidationAssignment {
  id: string;
  profile_id: string;
  user_id: string;
  assigned_by_user_id?: string | null;
  role: HumanValidationRole;
  is_active: boolean;
  metadata_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ValidationCommentCreate {
  comment: string;
  document_trace_id?: string | null;
  document_control_trace_id?: string | null;
  control_id?: string | null;
  document_requirement_id?: string | null;
  section_reference?: string | null;
  evidence_references?: unknown[];
  metadata_json?: Record<string, unknown>;
}

export interface ValidationComment {
  id: string;
  profile_id: string;
  created_by_user_id?: string | null;
  document_trace_id?: string | null;
  document_control_trace_id?: string | null;
  control_id?: string | null;
  document_requirement_id?: string | null;
  section_reference?: string | null;
  comment: string;
  is_resolved: boolean;
  resolved_by_user_id?: string | null;
  resolved_at?: string | null;
  evidence_references: unknown[];
  metadata_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ValidationDecisionRequest {
  action: HumanValidationDecisionAction;
  message?: string | null;
  metadata_json?: Record<string, unknown>;
}

export interface ValidationAuditEvent {
  id: string;
  profile_id: string;
  actor_user_id?: string | null;
  event_type: HumanValidationAuditEventType;
  from_status?: HumanValidationStatus | null;
  to_status?: HumanValidationStatus | null;
  message?: string | null;
  metadata_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ============================================
// Platform Administration Types
// ============================================

export interface AdminOrganizationSettings {
  id?: string | null;
  user_id: string;
  company_name?: string | null;
  address?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  industry?: string | null;
  frameworks_in_scope: string[];
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdminBrandingSettings {
  id?: string | null;
  user_id: string;
  logo_url?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  report_footer?: string | null;
  document_header?: string | null;
  default_approver_title?: string | null;
  default_reviewer_title?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface AdminNotificationSettings {
  id?: string | null;
  user_id: string;
  email_alerts_enabled: boolean;
  evidence_expiration_alerts: boolean;
  alert_days_before_expiration: number;
  readiness_score_alerts_enabled: boolean;
  readiness_score_threshold: number;
  created_at?: string | null;
  updated_at?: string | null;
}

// ============================================
// Evidence Types
// ============================================

export type EvidenceStatus = "draft" | "pending_review" | "approved" | "rejected" | "expired" | "archived";

export interface EvidenceItem {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  frameworks: string[];
  control_ids: string[];
  package_name?: string | null;
  evidence_type?: string | null;
  owner?: string | null;
  reviewer?: string | null;
  uploaded_by?: string | null;
  status: EvidenceStatus;
  due_date?: string | null;
  expiration_date?: string | null;
  version: string;
  notes?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  mime_type?: string | null;
  metadata_json: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface EvidenceListResponse {
  records: EvidenceItem[];
  count: number;
}

export interface EvidenceCreateInput {
  title: string;
  description?: string;
  frameworks?: string[];
  control_ids?: string[];
  package_name?: string;
  evidence_type?: string;
  owner?: string;
  reviewer?: string;
  uploaded_by?: string;
  due_date?: string;
  expiration_date?: string;
  notes?: string;
  file?: File;
}

export interface EvidenceDownloadResponse {
  download_url: string;
  expires_in: number;
}

// ============================================
// Readiness Score Types
// ============================================

export interface ReadinessScore {
  id: string;
  user_id: string;
  framework: string;
  framework_display: string;
  overall_score: number;
  coverage_score: number | null;
  freshness_score: number | null;
  validation_score: number | null;
  breakdown_json: {
    evidence_total?: number;
    evidence_approved?: number;
    evidence_expired?: number;
    evidence_expiring_soon?: number;
    validation?: { profile_id?: string; status?: string };
  };
  trigger: string;
  created_at: string;
}

export interface ReadinessScoreListResponse {
  scores: ReadinessScore[];
  methodology: string;
}

export interface ReadinessScoreHistoryResponse {
  framework: string;
  history: ReadinessScore[];
  methodology: string;
}

// ============================================
// Cross-Framework Intelligence Types
// ============================================

export interface FrameworkPairOverlap {
  framework_a: string;
  framework_a_display: string;
  framework_b: string;
  framework_b_display: string;
  shared_evidence_count: number;
  pct_of_a: number;
  pct_of_b: number;
}

export interface FrameworkReuseSummary {
  framework: string;
  framework_display: string;
  total_evidence: number;
  multi_framework_evidence_count: number;
  reuse_percentage: number;
}

export interface CrossFrameworkOverlapResponse {
  frameworks: string[];
  pairs: FrameworkPairOverlap[];
  reuse_summary: FrameworkReuseSummary[];
  methodology: string;
}

export interface SharedEvidenceResponse {
  framework_a: string;
  framework_b: string;
  evidence: EvidenceItem[];
  methodology: string;
}

// ============================================
// Compliance Copilot Types
// ============================================

export interface CopilotConversation {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface CopilotConversationListResponse {
  conversations: CopilotConversation[];
}

export interface CopilotMessage {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  metadata_json: {
    grounded?: boolean;
    data_points_used?: string[];
  };
  created_at: string;
}

export interface CopilotMessageListResponse {
  messages: CopilotMessage[];
}

// ============================================
// AI Governance Types
// ============================================

export interface DocumentGovernanceRecord {
  id: string;
  document_name: string;
  quality_score: number | null;
  review_comment_count: number;
  validation_status: string | null;
  created_at: string;
}

export interface AIGovernanceDocumentsResponse {
  documents: DocumentGovernanceRecord[];
  methodology: string;
}

export interface AIGovernanceSummaryResponse {
  total_documents: number;
  avg_quality_score: number | null;
  reviewed_count: number;
  review_rate: number;
  status_breakdown: Record<string, number>;
  total_copilot_answers: number;
  copilot_grounded_rate: number | null;
  methodology: string;
}
