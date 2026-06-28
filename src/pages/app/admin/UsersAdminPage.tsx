import { Users } from "lucide-react";
import { AdminEmptyState, AdminPageHeader } from "./AdminShared";

export default function UsersAdminPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Users"
        description="Manage team access for compliance, governance, evidence, reporting, and administration workspaces."
      />
      <AdminEmptyState
        icon={Users}
        title="Users will appear here after team members are invited."
        description="Invite users when team administration is connected."
        action={{ label: "Invite User", href: "/app/admin/users" }}
      />
    </div>
  );
}
