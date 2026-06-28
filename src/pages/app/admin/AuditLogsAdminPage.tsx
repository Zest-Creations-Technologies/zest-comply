import { ScrollText } from "lucide-react";
import { AdminEmptyState, AdminPageHeader } from "./AdminShared";

export default function AuditLogsAdminPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Audit Logs"
        description="Review administrative and platform events once audit logging is connected."
      />
      <AdminEmptyState
        icon={ScrollText}
        title="Audit events will appear here as users take actions across the platform."
        description="Administrative audit logs will include user, access, configuration, and platform activity."
      />
    </div>
  );
}
