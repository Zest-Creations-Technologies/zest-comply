import { ClipboardCheck } from "lucide-react";
import { ReportsEmptyState, ReportsPageHeader } from "./ReportsShared";

export default function ComplianceReportsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <ReportsPageHeader
        title="Compliance Reports"
        description="Generate compliance reports from completed assessments, framework progress, control status, and approved governance activity."
      />
      <ReportsEmptyState
        icon={ClipboardCheck}
        description="Compliance reports will appear after assessments, evidence, reviews, and approvals are completed."
      />
    </div>
  );
}
