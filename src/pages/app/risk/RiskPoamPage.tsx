import { FileWarning } from "lucide-react";
import { RiskEmptyState, RiskPageHeader, RiskRelationshipSection } from "./RiskShared";

export default function RiskPoamPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <RiskPageHeader title="POA&M" description="Track plans of action and milestones for unresolved risk and compliance items." />
      <RiskEmptyState icon={FileWarning} title="No open POA&M items." description="POA&M items will appear after risks require formal action plans and milestone tracking." />
      <RiskRelationshipSection />
    </div>
  );
}
