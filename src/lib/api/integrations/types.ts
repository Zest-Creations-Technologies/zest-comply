// Shared types for the compliance intelligence provider extension point.
// See ./provider.ts for what this exists to support.

export type TelemetrySourceType =
  | "aws_config"
  | "azure_policy"
  | "okta"
  | "servicenow"
  | "siem"
  | "vulnerability_scanner"
  | "cloud_audit_log"
  | "custom";

export interface TelemetrySource {
  id: string;
  type: TelemetrySourceType;
  label: string;
  connected: boolean;
  lastSyncedAt: string | null;
}

export interface EvidenceCandidate {
  id: string;
  controlId: string;
  framework: string;
  sourceType: TelemetrySourceType;
  collectedAt: string;
  summary: string;
  /** Raw payload from the originating system (e.g. an AWS Config item). Opaque to the UI. */
  rawPayload: Record<string, unknown>;
}

export interface GovernanceMetadata {
  assetId: string;
  owner: string | null;
  steward: string | null;
  classification: string | null;
  frameworkMappings: string[];
  lineage: Array<{ label: string; occurredAt: string }>;
}

export interface ProviderHealth {
  configured: boolean;
  connected: boolean;
  message: string;
}

/**
 * Contract a future compliance intelligence backend (e.g. IBM watsonx.data,
 * watsonx.data Intelligence, watsonx.data Integration) implements to plug
 * into ZestComply without frontend changes beyond selecting the provider.
 *
 * watsonx.data Integration -> collectEvidence (telemetry -> evidence)
 * watsonx.data (repository) -> listConnectedSources / evidence storage
 * watsonx.data Intelligence -> getGovernanceMetadata (classification, lineage, ownership)
 */
export interface ComplianceIntelligenceProvider {
  readonly id: string;
  readonly name: string;

  healthCheck(): Promise<ProviderHealth>;
  listConnectedSources(): Promise<TelemetrySource[]>;
  collectEvidence(params: { framework?: string; controlId?: string }): Promise<EvidenceCandidate[]>;
  getGovernanceMetadata(assetId: string): Promise<GovernanceMetadata | null>;
}
