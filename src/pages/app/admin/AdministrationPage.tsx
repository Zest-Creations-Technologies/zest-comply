import { Bell, Building2, FileEdit, KeyRound, Lock, Radar, ScrollText, Send, ShieldCheck, Users, Fingerprint } from "lucide-react";
import { AdminActionCard, AdminPageHeader } from "./AdminShared";
import { toneFor } from "@/lib/tone-palette";

const adminCards = [
  { title: "Organization Profile", description: "Maintain company identity and frameworks in scope.", href: "/app/admin/organization", icon: Building2 },
  { title: "Document Branding", description: "Configure report and document branding defaults.", href: "/app/admin/branding", icon: FileEdit },
  { title: "Users", description: "Invite and manage team members and their workspace roles.", href: "/app/admin/users", icon: Users },
  { title: "Roles & Permissions", description: "Define access boundaries for platform workspaces.", href: "/app/admin/roles", icon: ShieldCheck },
  { title: "Security", description: "Require multi-factor authentication for every user on the workspace.", href: "/app/admin/security", icon: Lock },
  { title: "Single Sign-On", description: "Connect your identity provider (Okta, Azure AD, Google Workspace) for SSO.", href: "/app/admin/sso", icon: Fingerprint },
  { title: "Notifications", description: "Configure alert and deadline notification rules.", href: "/app/admin/notifications", icon: Bell },
  { title: "Audit Logs", description: "Review administrative and platform activity across your organization.", href: "/app/admin/audit-logs", icon: ScrollText },
  { title: "API Keys", description: "Create and manage keys for programmatic access to the ZestComply API.", href: "/app/admin/api-keys", icon: KeyRound },
  { title: "SIEM Export", description: "Forward audit events to Splunk or Datadog in near real time.", href: "/app/admin/siem-export", icon: Send },
  { title: "Connected Systems", description: "Continuously monitor Okta MFA enforcement and get alerted when it drifts.", href: "/app/admin/connections", icon: Radar },
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
    </div>
  );
}
