import { ShieldCheck } from "lucide-react";
import { AdminEmptyState, AdminPageHeader } from "./AdminShared";

export default function RolesPermissionsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Roles & Permissions"
        description="Prepare access controls for platform workspaces and administrative actions."
      />
      <AdminEmptyState
        icon={ShieldCheck}
        title="Roles are not configured yet."
        description="Roles will control access to compliance, governance, reporting, and administration."
      />
    </div>
  );
}
