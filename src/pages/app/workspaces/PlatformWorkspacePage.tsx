import { Bot, Cloud, CreditCard, FileEdit, Plug, User } from "lucide-react";
import { WorkspacePage } from "./WorkspaceShared";

export default function PlatformWorkspacePage() {
  return (
    <WorkspacePage
      title="Platform"
      description="Manage AI assistance, integrations, administration, profile settings, billing, branding, and storage."
      primaryAction={{ title: "Open AI Assistant", href: "/app/assistant", icon: Bot }}
      items={[
        { title: "Integrations", description: "Configure integrations for storage, monitoring, evidence, and security data.", href: "/app/settings/storage", icon: Plug },
        { title: "Profile", description: "Manage your user profile and account details.", href: "/app/settings/profile", icon: User },
        { title: "Billing", description: "View subscription, plan, invoices, and payment settings.", href: "/app/billing", icon: CreditCard },
        { title: "Document Branding", description: "Configure letterhead, logo, margins, and document styling.", href: "/app/settings/documents", icon: FileEdit },
        { title: "Cloud Storage", description: "Connect storage destinations for generated compliance packages.", href: "/app/settings/storage", icon: Cloud },
      ]}
    />
  );
}
