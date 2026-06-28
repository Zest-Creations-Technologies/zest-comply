import { Bot, Building2, Cloud, CreditCard, FileEdit, KeyRound, Plug, Settings, User, Users } from "lucide-react";
import { WorkspacePage } from "./WorkspaceShared";

export default function PlatformWorkspacePage() {
  return (
    <WorkspacePage
      title="Platform"
      description="Manage AI assistance, integrations, administration, profile settings, billing, branding, and storage."
      primaryAction={{ title: "Open AI Assistant", href: "/app/assistant", icon: Bot }}
      items={[
        { title: "Administration", description: "Manage organization settings, users, roles, notifications, audit logs, and API keys.", href: "/app/admin", icon: Settings },
        { title: "Organization Profile", description: "Maintain company identity and frameworks in scope.", href: "/app/admin/organization", icon: Building2 },
        { title: "Users", description: "Invite and manage team members when user administration is available.", href: "/app/admin/users", icon: Users },
        { title: "API Keys", description: "Prepare secure access for integrations and automation.", href: "/app/admin/api-keys", icon: KeyRound },
        { title: "Integrations", description: "Connect IBM enterprise services for compliance, governance, reporting, and monitoring workflows.", href: "/app/integrations", icon: Plug },
        { title: "Profile", description: "Manage your user profile and account details.", href: "/app/settings/profile", icon: User },
        { title: "Billing", description: "View subscription, plan, invoices, and payment settings.", href: "/app/billing", icon: CreditCard },
        { title: "Document Branding", description: "Configure report and document branding defaults.", href: "/app/admin/branding", icon: FileEdit },
        { title: "Cloud Storage", description: "Connect storage destinations for generated compliance packages.", href: "/app/settings/storage", icon: Cloud },
      ]}
    />
  );
}
