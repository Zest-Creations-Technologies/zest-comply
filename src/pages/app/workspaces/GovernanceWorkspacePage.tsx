import { ClipboardCheck, History, ListChecks, ShieldAlert } from "lucide-react";
import { WorkspaceEmptyState, WorkspacePage } from "./WorkspaceShared";

export default function GovernanceWorkspacePage() {
  return (
    <WorkspacePage
      title="Governance"
      description="Coordinate human review, approvals, audit trails, risk work, and executive reporting."
      primaryAction={{ title: "Open Queue", href: "/app/human-validation/review-queue", icon: ListChecks }}
      items={[
        { title: "Approvals", description: "Review company validation profiles and approval decisions.", href: "/app/human-validation", icon: ClipboardCheck },
        { title: "Review Queue", description: "Open profiles assigned to you or owned by you.", href: "/app/human-validation/review-queue", icon: ListChecks },
        { title: "Audit Trail", description: "Review audit events from active governance records.", href: "/app/human-validation/review-queue", icon: History },
        { title: "Risk Management", description: "Manage risks from assessments, governance, monitoring, manual entries, integrations, and optional ZestRecon findings.", href: "/app/risk", icon: ShieldAlert },
      ]}
    >
      <WorkspaceEmptyState title="Reports & Executive Insights" description="Reports become available as approved governance and monitoring data accumulates." />
    </WorkspacePage>
  );
}
