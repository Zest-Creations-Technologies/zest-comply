import { ListChecks } from "lucide-react";
import { RiskEmptyState, RiskRelationshipSection } from "./RiskShared";

export default function RiskTreatmentPlansPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Treatment Plans</h1>
        <p className="text-muted-foreground">Manage mitigation, transfer, acceptance, and remediation plans.</p>
      </div>
      <RiskEmptyState icon={ListChecks} title="No treatment plans available." description="Treatment plans will appear after risks are created and assigned for response." />
      <RiskRelationshipSection />
    </div>
  );
}
