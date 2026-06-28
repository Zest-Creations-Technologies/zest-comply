import { FileText } from "lucide-react";
import { ReportsEmptyState, ReportsPageHeader } from "./ReportsShared";

export default function AuditReadinessPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <ReportsPageHeader
        title="Audit Readiness"
        description="Prepare audit-facing reporting from approved documents, evidence, review decisions, audit events, and control traceability."
      />
      <ReportsEmptyState
        icon={FileText}
        description="Audit readiness reports will appear after assessments, evidence, reviews, approvals, and audit trail events are completed."
      />
    </div>
  );
}
