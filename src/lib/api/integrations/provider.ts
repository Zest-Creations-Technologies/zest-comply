// Extension point for a future compliance intelligence backend.
//
// No connector exists yet — IBM's June 2026 proposal (watsonx.data /
// watsonx.data Intelligence / watsonx.data Integration) is still in the
// evaluation phase and there are no credentials to call anything with.
// This module exists so that when a real connector is built, it plugs in
// here without any other frontend changes: implement
// ComplianceIntelligenceProvider, register it below, and set
// VITE_COMPLIANCE_INTELLIGENCE_PROVIDER.
//
// Until then, everything resolves to NullComplianceIntelligenceProvider,
// which makes no network calls and reports itself as unconfigured.

import type {
  ComplianceIntelligenceProvider,
  EvidenceCandidate,
  GovernanceMetadata,
  ProviderHealth,
  TelemetrySource,
} from "./types";

class NullComplianceIntelligenceProvider implements ComplianceIntelligenceProvider {
  readonly id = "none";
  readonly name = "Not configured";

  async healthCheck(): Promise<ProviderHealth> {
    return {
      configured: false,
      connected: false,
      message: "No compliance intelligence provider is configured.",
    };
  }

  async listConnectedSources(): Promise<TelemetrySource[]> {
    return [];
  }

  async collectEvidence(): Promise<EvidenceCandidate[]> {
    return [];
  }

  async getGovernanceMetadata(): Promise<GovernanceMetadata | null> {
    return null;
  }
}

const providers: Record<string, () => ComplianceIntelligenceProvider> = {
  none: () => new NullComplianceIntelligenceProvider(),
  // watsonx: () => new WatsonxComplianceIntelligenceProvider(), // future IBM connector
};

let cachedProvider: ComplianceIntelligenceProvider | null = null;

/**
 * Resolves the active compliance intelligence provider based on
 * VITE_COMPLIANCE_INTELLIGENCE_PROVIDER. Falls back to the null provider
 * for any unset or unrecognized value so callers never need to null-check
 * the provider itself, only the data it returns.
 */
export function getComplianceIntelligenceProvider(): ComplianceIntelligenceProvider {
  if (cachedProvider) return cachedProvider;

  const key = (import.meta.env.VITE_COMPLIANCE_INTELLIGENCE_PROVIDER as string | undefined) || "none";
  const factory = providers[key] ?? providers.none;
  cachedProvider = factory();
  return cachedProvider;
}

export type { ComplianceIntelligenceProvider } from "./types";
