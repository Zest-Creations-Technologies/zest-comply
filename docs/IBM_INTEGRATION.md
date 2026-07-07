# watsonx.data Integration Alignment

> Shared reference for IBM and the ZestComply team | July 2026
> Status: scaffolding in place, no live connection — see [Status](#status) below

---

## Relationship to earlier documents

The `zct-backend` repo's `docs/ibm/00` through `06` were written for an
earlier, broader technical working session and speak to a wide IBM
portfolio (watsonx.ai, OpenPages, QRadar, Guardium, Verify, Instana,
Turbonomic). They remain accurate as a record of that discussion and are
left as-is there.

This document reflects what actually followed: a formal proposal from IBM
(Netra C N, Solution Architect — Data & AI) on June 30, 2026, narrowing scope
to three specific watsonx.data products. It supersedes those earlier docs
**only** for the question "what is IBM actually proposing right now" —
everything else in them still holds. It lives in this repo rather than
alongside 00–06 because `zct-backend/.gitignore` excludes new files under
`docs/ibm/` going forward; that convention is left untouched.

---

## What IBM proposed (June 30, 2026)

Three products, applied in sequence against ZestComply's existing platform,
explicitly **without requiring application changes**:

| Product | Role | Maps to ZestComply concept |
|---|---|---|
| **watsonx.data** | Governed enterprise repository | Replaces "generated docs in isolated customer folders" with a centralized, searchable store: policies, procedures, evidence, assessments, framework mappings, historical records |
| **watsonx.data Intelligence** (IBM Knowledge Catalog) | Governance & metadata layer | Adds business metadata, classification, ownership/stewardship, version history, lineage, and framework mapping on top of the repository |
| **watsonx.data Integration** | Orchestration / ingestion layer | Connects enterprise telemetry sources (AWS Config, Azure Policy, Okta, ServiceNow, SIEM, cloud audit logs) into the repository as evidence, on a schedule or event-driven |

IBM's illustrative example: an AWS Config change (e.g. an S3 bucket losing
encryption) is picked up by watsonx.data Integration, stored as evidence in
watsonx.data, evaluated by watsonx.data Intelligence against the mapped HIPAA
control, and ZestComply's compliance status updates automatically — instead
of waiting for the next manual evidence upload.

IBM's recommended path forward (their deck, slide 8) is four phases:

1. Establish a trusted compliance foundation (watsonx.data)
2. Govern and enrich compliance knowledge (watsonx.data Intelligence)
3. Connect operational evidence (watsonx.data Integration)
4. Deliver continuous compliance intelligence (all three, combined)

IBM explicitly recommends **not** doing all four at once, and jointly
assessing which phase to start with based on ZestComply's current priorities.

## Where ZestComply's priorities sit right now

Per the June 30 internal reply (Abidemi Ogunlade, CEO): the immediate
priority is finishing **Phase 1 of the ZestComply roadmap** —
framework/control knowledge base, human validation and governance workflows,
the compliance repository, evidence management, executive reporting, and
production readiness on the current PostgreSQL/RabbitMQ/object-storage stack
— before adding new infrastructure dependencies.

The stated preference is to **not** introduce watsonx.data capabilities
ahead of the business requirement that justifies them. Continuous
compliance generation (IBM's phase 4 end-state) is the point where
alignment is strongest, once phase 1 is stable.

A follow-up meeting to finalize scope was requested for the week of June 30,
2026 — confirm current status of that conversation before treating the
phase order above as final.

---

## What's built now to receive this integration

Nothing in this proposal is connected yet — there are no watsonx.data
credentials, and none of `watsonx.data` / `watsonx.data Intelligence` /
`watsonx.data Integration` are called from ZestComply. What exists is a
**seam**: an interface a future connector implements, so that when IBM (or
anyone) is ready to build the real connector, it plugs into one place
instead of touching every page that currently uses local/mock evidence data.

Frontend: `src/lib/api/integrations/`

```
src/lib/api/integrations/
  types.ts     - ComplianceIntelligenceProvider contract + supporting types
  provider.ts  - NullComplianceIntelligenceProvider (default, makes no calls)
                 + getComplianceIntelligenceProvider() resolver
  index.ts     - barrel export
```

The contract, and how it maps back to IBM's three products:

```ts
interface ComplianceIntelligenceProvider {
  healthCheck(): Promise<ProviderHealth>;

  // watsonx.data — the governed repository
  listConnectedSources(): Promise<TelemetrySource[]>;

  // watsonx.data Integration — telemetry -> evidence orchestration
  collectEvidence(params: { framework?: string; controlId?: string }): Promise<EvidenceCandidate[]>;

  // watsonx.data Intelligence — classification, ownership, lineage
  getGovernanceMetadata(assetId: string): Promise<GovernanceMetadata | null>;
}
```

Selection is config-driven (`VITE_COMPLIANCE_INTELLIGENCE_PROVIDER`, default
`none`) so a real provider can be registered and switched on per-environment
without a code change to the pages that will eventually consume it. Today it
always resolves to the null provider, which returns empty results and
reports `configured: false` — nothing in the product currently depends on
this returning real data.

This scaffold is intentionally **not** wired into the Evidence or Compliance
Monitoring pages yet — those still run on local mock stores
(`src/pages/app/evidence/evidence-store.ts`,
`src/pages/app/compliance-monitoring/monitoring-data.ts`). Wiring a real or
even mock provider into those pages is future work, once there's a concrete
connector (IBM's or otherwise) to wire in.

---

## Status

- [x] Extension point defined (frontend interface + resolver)
- [ ] No watsonx.data / Intelligence / Integration credentials exist
- [ ] No connector implementation exists
- [ ] Evidence and Compliance Monitoring pages are not wired to any provider
- [ ] Scope/phase order for IBM engagement not yet finalized (pending
      follow-up meeting referenced above)

## Open questions for the next working session

1. Which of IBM's four phases does ZestComply want to start with, given the
   phase-1-first priority above?
2. Does watsonx.data Integration's connector model support the specific
   evidence sources ZestComply's own roadmap already lists (AWS Config,
   Azure Policy, Okta, ServiceNow, SIEM) or is there a gap to close?
3. What's the minimum viable watsonx.data footprint IBM would recommend for
   a pilot, versus the full governed-repository vision in the proposal?
4. Deployment model — does watsonx.data run alongside the existing
   AWS/RDS/R2 stack, or does it imply an IBM Cloud dependency?
