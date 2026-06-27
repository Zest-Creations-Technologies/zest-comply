import type {
  CompanyValidationProfile,
  CompliancePackage,
  ManifestFile,
  ValidationAuditEvent,
  ValidationComment,
} from "@/lib/api";

export type RepositoryDocumentStatus = "approved" | "published" | "in_review" | "draft";

export interface RepositoryDocument {
  id: string;
  title: string;
  framework: string;
  documentType: string;
  currentVersion: string;
  status: RepositoryDocumentStatus;
  owner: string;
  reviewer: string;
  approver: string;
  approvalDate: string | null;
  lastUpdated: string;
  packageId: string | null;
  profileId: string | null;
  file: ManifestFile | null;
  profile: CompanyValidationProfile | null;
  packageRecord: CompliancePackage | null;
}

export const repositoryCategories = {
  policies: {
    title: "Policies",
    description: "Approved policy documents organized from governance-approved packages.",
  },
  procedures: {
    title: "Procedures",
    description: "Operational procedure documents available for reuse and review.",
  },
  standards: {
    title: "Standards",
    description: "Standards, baselines, and control expectations in the repository.",
  },
  plans: {
    title: "Plans",
    description: "Compliance, security, continuity, and response plans.",
  },
  templates: {
    title: "Templates",
    description: "Reusable templates and supporting source documents.",
  },
  "evidence-library": {
    title: "Evidence Library",
    description: "Evidence matrices and artifacts linked to approved work.",
  },
} as const;

export type RepositoryCategorySlug = keyof typeof repositoryCategories;

export function isRepositoryCategory(value: string | undefined): value is RepositoryCategorySlug {
  return Boolean(value && value in repositoryCategories);
}

export function encodeDocumentId(packageId: string, index: number) {
  return encodeURIComponent(`${packageId}:${index}`);
}

export function decodeDocumentId(documentId: string | undefined) {
  if (!documentId) return null;
  const [packageId, indexValue] = decodeURIComponent(documentId).split(":");
  const index = Number(indexValue);
  if (!packageId || Number.isNaN(index)) return null;
  return { packageId, index };
}

export function formatDate(value?: string | null) {
  if (!value) return "Not available";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function normalizeStatus(profile?: CompanyValidationProfile | null): RepositoryDocumentStatus {
  if (profile?.status === "signed_off") return "published";
  if (profile?.status === "approved") return "approved";
  if (profile?.status === "in_review" || profile?.status === "submitted") return "in_review";
  return "draft";
}

export const repositoryStatusLabels: Record<RepositoryDocumentStatus, string> = {
  approved: "Approved",
  published: "Published",
  in_review: "In Review",
  draft: "Draft",
};

export function inferDocumentType(file: ManifestFile | null) {
  const source = `${file?.filename ?? ""} ${file?.path ?? ""} ${file?.file_type ?? ""}`.toLowerCase();
  if (source.includes("evidence") || source.endsWith(".xlsx") || source.endsWith(".csv")) return "Evidence";
  if (source.includes("procedure")) return "Procedure";
  if (source.includes("standard") || source.includes("baseline")) return "Standard";
  if (source.includes("plan")) return "Plan";
  if (source.includes("template")) return "Template";
  if (source.includes("policy")) return "Policy";
  if (source.endsWith(".pdf")) return "PDF";
  if (source.endsWith(".md")) return "Markdown";
  return "Document";
}

export function documentMatchesCategory(document: RepositoryDocument, category: RepositoryCategorySlug) {
  const type = document.documentType.toLowerCase();
  const text = `${document.title} ${document.file?.path ?? ""}`.toLowerCase();
  switch (category) {
    case "policies":
      return type === "policy" || text.includes("policy");
    case "procedures":
      return type === "procedure" || text.includes("procedure");
    case "standards":
      return type === "standard" || text.includes("standard") || text.includes("baseline");
    case "plans":
      return type === "plan" || text.includes("plan");
    case "templates":
      return type === "template" || text.includes("template");
    case "evidence-library":
      return type === "evidence" || text.includes("evidence") || text.endsWith(".xlsx") || text.endsWith(".csv");
  }
}

export function getApprovalDate(events: ValidationAuditEvent[] | undefined) {
  const event = [...(events ?? [])]
    .reverse()
    .find((item) => item.event_type === "approved" || item.event_type === "executive_signoff_updated");
  return event?.created_at ?? null;
}

export function buildRepositoryDocuments({
  packages,
  profiles,
  auditByProfile,
}: {
  packages: CompliancePackage[];
  profiles: CompanyValidationProfile[];
  auditByProfile: Record<string, ValidationAuditEvent[]>;
}) {
  const approvedProfiles = profiles.filter((profile) => profile.status === "approved" || profile.status === "signed_off");
  const profileByPackage = new Map(approvedProfiles.filter((profile) => profile.package_id).map((profile) => [profile.package_id, profile]));

  return packages.flatMap((pkg) => {
    const profile = profileByPackage.get(pkg.id) ?? null;
    if (!profile) return [];

    const files = pkg.manifest_json?.files ?? [];
    return files.map((file, index) => ({
      id: encodeDocumentId(pkg.id, index),
      title: file.filename || file.path || pkg.package_name,
      framework: pkg.manifest_json?.framework || pkg.framework,
      documentType: inferDocumentType(file),
      currentVersion: pkg.manifest_json?.package_version || "1.0",
      status: normalizeStatus(profile),
      owner: profile.compliance_owner_name || profile.system_owner_name || "Not assigned",
      reviewer: "Assigned in Governance",
      approver: profile.compliance_owner_name || "Assigned in Governance",
      approvalDate: getApprovalDate(auditByProfile[profile.id]) ?? profile.updated_at,
      lastUpdated: file.created_at || pkg.uploaded_at || profile.updated_at,
      packageId: pkg.id,
      profileId: profile.id,
      file,
      profile,
      packageRecord: pkg,
    }));
  });
}

export function latestComment(comments: ValidationComment[]) {
  return [...comments].sort((a, b) => b.created_at.localeCompare(a.created_at))[0] ?? null;
}
