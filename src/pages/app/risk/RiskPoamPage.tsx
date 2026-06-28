import { FileWarning } from "lucide-react";
import { RiskEmptyState, RiskRelationshipSection } from "./RiskShared";

export default function RiskPoamPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">POA&M</h1>
        <p className="text-muted-foreground">Track plans of action and milestones for unresolved risk and compliance items.</p>
      </div>
      <RiskEmptyState icon={FileWarning} title="No open POA&M items." description="POA&M items will appear after risks require formal action plans and milestone tracking." />
      <RiskRelationshipSection />
    </div>
  );
}
