import { Scale } from "lucide-react";
import { RiskEmptyState, RiskRelationshipSection } from "./RiskShared";

export default function RiskExceptionsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Exceptions</h1>
        <p className="text-muted-foreground">Track approved exceptions, rationale, owners, and compensating controls.</p>
      </div>
      <RiskEmptyState icon={Scale} title="No approved exceptions." description="Approved exceptions will appear after governance review and risk acceptance decisions." />
      <RiskRelationshipSection />
    </div>
  );
}
