import { ListChecks } from "lucide-react";
import { RiskEmptyState, RiskPageHeader, RiskRelationshipSection } from "./RiskShared";

export default function RiskTreatmentPlansPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <RiskPageHeader title="Treatment Plans" description="Manage mitigation, transfer, acceptance, and remediation plans." />
      <RiskEmptyState icon={ListChecks} title="No treatment plans available." description="Treatment plans will appear after risks are created and assigned for response." />
      <RiskRelationshipSection />
    </div>
  );
}
