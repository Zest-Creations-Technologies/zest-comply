import { Bell } from "lucide-react";
import { AdminEmptyState, AdminPageHeader } from "./AdminShared";

export default function NotificationsAdminPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Notifications"
        description="Prepare organization notification rules for operational compliance work."
      />
      <AdminEmptyState
        icon={Bell}
        title="Notification rules are not configured yet."
        description="Notification rules will control alerts, approvals, deadlines, and report updates."
      />
    </div>
  );
}
