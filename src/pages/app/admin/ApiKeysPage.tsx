import { KeyRound } from "lucide-react";
import { AdminEmptyState, AdminPageHeader } from "./AdminShared";

export default function ApiKeysPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="API Keys"
        description="Prepare secure access for integrations and automation."
      />
      <AdminEmptyState
        icon={KeyRound}
        title="API keys are not configured yet."
        description="API keys will support integrations and secure automation."
      />
    </div>
  );
}
