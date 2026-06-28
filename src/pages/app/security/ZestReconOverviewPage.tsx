import { Radar } from "lucide-react";
import { ComplianceImpactSection, SecurityEmptyState, ZestReconBadge } from "./SecurityShared";

export default function ZestReconOverviewPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-3">
        <ZestReconBadge />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">ZestRecon Integration</h1>
          <p className="max-w-3xl text-muted-foreground">
            ZestComply works independently. Connect ZestRecon to enrich Security Operations with security findings, vulnerabilities, assets, alerts, attack surface data, and compliance signals.
          </p>
        </div>
      </div>
      <SecurityEmptyState
        icon={Radar}
        title="Connect ZestRecon"
        description="Connection setup will activate after integration keys are configured."
      />
      <ComplianceImpactSection />
    </div>
  );
}
