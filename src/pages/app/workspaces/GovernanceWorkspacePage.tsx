import { ClipboardCheck, History, ListChecks } from "lucide-react";
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
      ]}
    >
      <WorkspaceEmptyState title="Risk Management" description="Connect risk and control data sources to begin tracking risk." />
      <WorkspaceEmptyState title="Reports & Executive Insights" description="Reports become available as approved governance and monitoring data accumulates." />
    </WorkspacePage>
  );
}
