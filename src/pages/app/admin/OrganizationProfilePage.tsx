import { Building2 } from "lucide-react";
import { AdminEmptyState, AdminFieldGrid, AdminPageHeader } from "./AdminShared";

const organizationFields = [
  "Company name",
  "Address",
  "Website",
  "Email",
  "Phone",
  "Industry",
  "Frameworks in scope",
];

export default function OrganizationProfilePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Organization Profile"
        description="Centralize organization details used across compliance, governance, reports, and document generation."
      />
      <AdminFieldGrid fields={organizationFields} />
      <AdminEmptyState
        icon={Building2}
        title="Organization profile is not configured."
        description="Company details will appear here after organization administration is connected."
      />
    </div>
  );
}
