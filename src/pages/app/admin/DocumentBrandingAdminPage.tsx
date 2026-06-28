import { FileEdit } from "lucide-react";
import { AdminEmptyState, AdminFieldGrid, AdminPageHeader } from "./AdminShared";

const brandingFields = [
  "Company logo",
  "Primary color",
  "Secondary color",
  "Report footer",
  "Document header",
  "Default approver title",
  "Default reviewer title",
];

export default function DocumentBrandingAdminPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Document Branding"
        description="Manage organization-wide branding defaults for reports, policies, procedures, and executive documents."
      />
      <AdminFieldGrid fields={brandingFields} />
      <AdminEmptyState
        icon={FileEdit}
        title="Document branding is not configured."
        description="Branding settings will appear here after administration services are connected."
      />
    </div>
  );
}
