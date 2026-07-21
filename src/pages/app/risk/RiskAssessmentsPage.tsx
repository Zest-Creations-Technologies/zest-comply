import { ClipboardList } from "lucide-react";
import { RiskEmptyState, RiskPageHeader, RiskRelationshipSection } from "./RiskShared";

export default function RiskAssessmentsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <RiskPageHeader
        title="Risk Assessments"
        description="Identify risks from assessment results, control gaps, manual entries, integrations, and optional imported security findings."
      />
      <RiskEmptyState icon={ClipboardList} title="Complete assessments or add risk inputs to begin identifying risks." description="Risk assessments will appear after assessment workflows, manual entries, integrations, or optional connected-scanner findings provide risk candidates." />
      <RiskRelationshipSection />
    </div>
  );
}
