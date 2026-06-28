import { Archive, Bot, FileCheck2, FileSearch, Package } from "lucide-react";
import { WorkspacePage } from "./WorkspaceShared";

export default function ComplianceWorkspacePage() {
  return (
    <WorkspacePage
      title="Compliance"
      description="Run assessments, manage packages, maintain evidence, and monitor framework readiness."
      primaryAction={{ title: "Start Assessment", href: "/app/assistant", icon: Bot }}
      items={[
        { title: "Assessments", description: "Use the AI assistant to gather requirements and generate compliance work.", href: "/app/assistant", icon: Bot },
        { title: "Packages", description: "View generated compliance documentation packages.", href: "/app/packages", icon: Package },
        { title: "Repository", description: "Browse approved policies, procedures, standards, plans, and evidence.", href: "/app/compliance-repository", icon: Archive },
        { title: "Evidence", description: "Manage proof used for controls, packages, audits, and reviews.", href: "/app/evidence", icon: FileCheck2 },
        { title: "Monitoring", description: "Track framework health, alerts, tasks, and review calendars.", href: "/app/compliance-monitoring", icon: FileSearch },
      ]}
    />
  );
}
