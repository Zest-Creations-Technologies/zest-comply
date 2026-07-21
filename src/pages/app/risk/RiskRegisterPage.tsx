import { ShieldAlert } from "lucide-react";
import { RiskEmptyState, RiskPageHeader, RiskRelationshipSection } from "./RiskShared";

export default function RiskRegisterPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <RiskPageHeader title="Risk Register" description="Central view for enterprise risks and ownership." />
      <RiskEmptyState icon={ShieldAlert} title="No risks have been created yet." description="Risks will appear here after assessments, governance reviews, monitoring alerts, manual entries, integrations, or optional connected-scanner findings identify risk items." />
      <RiskRelationshipSection />
    </div>
  );
}
