import { Scale } from "lucide-react";
import { RiskEmptyState, RiskPageHeader, RiskRelationshipSection } from "./RiskShared";

export default function RiskExceptionsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <RiskPageHeader title="Exceptions" description="Track approved exceptions, rationale, owners, and compensating controls." />
      <RiskEmptyState icon={Scale} title="No approved exceptions." description="Approved exceptions will appear after governance review and risk acceptance decisions." />
      <RiskRelationshipSection />
    </div>
  );
}
