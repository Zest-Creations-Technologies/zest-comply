import { Scale } from "lucide-react";
import { ReportsEmptyState, ReportsPageHeader } from "./ReportsShared";

export default function RiskReportsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <ReportsPageHeader
        title="Risk Reports"
        description="Summarize risk posture, treatment progress, exceptions, accepted risks, and POA&M activity once risk records are available."
      />
      <ReportsEmptyState
        icon={Scale}
        description="Risk reports will appear after risks, treatment plans, exceptions, and governance decisions are recorded."
      />
    </div>
  );
}
