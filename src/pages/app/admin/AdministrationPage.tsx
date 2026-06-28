import { Bell, Building2, FileEdit, KeyRound, ScrollText, ShieldCheck, Users } from "lucide-react";
import { AdminActionCard, AdminEmptyState, AdminPageHeader } from "./AdminShared";

export default function AdministrationPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Administration"
        description="Manage organization profile settings, document branding, users, roles, notifications, audit logs, and integration keys."
      />

      <div className="grid gap-4 md:grid-cols-2">
        <AdminActionCard title="Organization Profile" description="Maintain company identity and frameworks in scope." href="/app/admin/organization" icon={Building2} />
        <AdminActionCard title="Document Branding" description="Configure report and document branding defaults." href="/app/admin/branding" icon={FileEdit} />
        <AdminActionCard title="Users" description="Invite and manage team members when user administration is available." href="/app/admin/users" icon={Users} />
        <AdminActionCard title="Roles & Permissions" description="Define access boundaries for platform workspaces." href="/app/admin/roles" icon={ShieldCheck} />
        <AdminActionCard title="Notifications" description="Prepare alert and deadline notification rules." href="/app/admin/notifications" icon={Bell} />
        <AdminActionCard title="Audit Logs" description="Review administrative and platform activity when audit events are available." href="/app/admin/audit-logs" icon={ScrollText} />
        <AdminActionCard title="API Keys" description="Manage secure automation and integration keys when enabled." href="/app/admin/api-keys" icon={KeyRound} />
      </div>

      <AdminEmptyState
        title="Administration data is not configured yet."
        description="Organization settings, user access, notifications, audit logs, and API keys will appear here as administration services are connected."
      />
    </div>
  );
}
