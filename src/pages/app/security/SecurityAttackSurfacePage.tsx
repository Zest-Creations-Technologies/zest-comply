import { Activity } from "lucide-react";
import { SecurityEmptyState, ScannerIntegrationBadge } from "./SecurityShared";

export default function SecurityAttackSurfacePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-3">
        <ScannerIntegrationBadge />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Attack Surface</h1>
          <p className="text-muted-foreground">External exposure monitoring will help connect domains, services, and applications to compliance impact.</p>
        </div>
      </div>
      <SecurityEmptyState icon={Activity} title="No attack surface data yet" description="Connect a scanner when you are ready to monitor exposed services, domains, and applications." />
    </div>
  );
}
