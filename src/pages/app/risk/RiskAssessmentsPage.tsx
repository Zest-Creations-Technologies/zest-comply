import { ClipboardList } from "lucide-react";
import { RiskEmptyState, RiskRelationshipSection } from "./RiskShared";

export default function RiskAssessmentsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Risk Assessments</h1>
        <p className="text-muted-foreground">Identify risks from assessment results, control gaps, manual entries, integrations, and optional imported security findings.</p>
      </div>
      <RiskEmptyState icon={ClipboardList} title="Complete assessments or add risk inputs to begin identifying risks." description="Risk assessments will appear after assessment workflows, manual entries, integrations, or optional ZestRecon findings provide risk candidates." />
      <RiskRelationshipSection />
    </div>
  );
}
