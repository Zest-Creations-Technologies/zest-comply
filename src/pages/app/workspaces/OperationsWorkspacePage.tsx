import { CalendarClock, CheckSquare, Gauge, Inbox } from "lucide-react";
import { WorkspaceEmptyState, WorkspacePage } from "./WorkspaceShared";

export default function OperationsWorkspacePage() {
  return (
    <WorkspacePage
      title="Operations Center"
      description="A calm command center for current work, alerts, tasks, and deadlines."
      primaryAction={{ title: "Open Dashboard", href: "/app", icon: Gauge }}
      items={[
        { title: "Dashboard", description: "Start from the main ZestComply operating view.", href: "/app", icon: Gauge },
        { title: "My Work", description: "Track assigned compliance work and remediation.", href: "/app/compliance-monitoring/tasks", icon: CheckSquare },
        { title: "Alerts", description: "Open monitoring signals that need attention.", href: "/app/compliance-monitoring/alerts", icon: Inbox },
        { title: "Upcoming Deadlines", description: "Review dates, audits, evidence expirations, and approvals.", href: "/app/compliance-monitoring/calendar", icon: CalendarClock },
      ]}
    >
      <WorkspaceEmptyState title="Recent Activity" description="No data yet. Create an assessment to start tracking compliance activity." />
      <WorkspaceEmptyState title="Notifications" description="No data yet. Connect data sources to begin monitoring." />
    </WorkspacePage>
  );
}
