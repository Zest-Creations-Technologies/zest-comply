import { ShieldAlert } from "lucide-react";
import { RiskEmptyState, RiskRelationshipSection } from "./RiskShared";

export default function RiskRegisterPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Risk Register</h1>
        <p className="text-muted-foreground">Central view for enterprise risks and ownership.</p>
      </div>
      <RiskEmptyState icon={ShieldAlert} title="No risks have been created yet." description="Risks will appear here after assessments, governance reviews, monitoring alerts, or ZestRecon findings identify risk items." />
      <RiskRelationshipSection />
    </div>
  );
}
