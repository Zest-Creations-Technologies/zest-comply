import { Bell, Building2, FileEdit, KeyRound, ScrollText, ShieldCheck, Users } from "lucide-react";
import { AdminActionCard, AdminEmptyState, AdminPageHeader } from "./AdminShared";
import { toneFor } from "@/lib/tone-palette";

const adminCards = [
  { title: "Organization Profile", description: "Maintain company identity and frameworks in scope.", href: "/app/admin/organization", icon: Building2 },
  { title: "Document Branding", description: "Configure report and document branding defaults.", href: "/app/admin/branding", icon: FileEdit },
  { title: "Users", description: "Invite and manage team members when user administration is available.", href: "/app/admin/users", icon: Users },
  { title: "Roles & Permissions", description: "Define access boundaries for platform workspaces.", href: "/app/admin/roles", icon: ShieldCheck },
  { title: "Notifications", description: "Prepare alert and deadline notification rules.", href: "/app/admin/notifications", icon: Bell },
  { title: "Audit Logs", description: "Review administrative and platform activity when audit events are available.", href: "/app/admin/audit-logs", icon: ScrollText },
  { title: "API Keys", description: "Manage secure automation and integration keys when enabled.", href: "/app/admin/api-keys", icon: KeyRound },
];

export default function AdministrationPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d8b45d] via-[#f0d990] to-[#98d8c5]" />
        <div className="relative">
          <AdminPageHeader
            eyebrow="Platform"
            title="Workspace administration"
            description="Manage organization profile settings, document branding, users, roles, notifications, audit logs, and integration keys."
            caption="Advanced items are grouped here so the main workspace stays calm."
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminCards.map((card, index) => (
          <AdminActionCard key={card.title} {...card} tone={toneFor(index)} />
        ))}
      </div>

      <AdminEmptyState
        title="Administration data is not configured yet."
        description="Organization settings, user access, notifications, audit logs, and API keys will appear here as administration services are connected."
      />
    </div>
  );
}
