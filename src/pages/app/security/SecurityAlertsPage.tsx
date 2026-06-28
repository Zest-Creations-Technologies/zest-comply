import { AlertTriangle } from "lucide-react";
import { SecurityEmptyState, ZestReconBadge } from "./SecurityShared";

export default function SecurityAlertsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-3">
        <ZestReconBadge />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Security Alerts</h1>
          <p className="text-muted-foreground">ZestRecon alerts will support compliance monitoring and remediation workflows.</p>
        </div>
      </div>
      <SecurityEmptyState icon={AlertTriangle} title="No security alerts yet" description="Optional ZestRecon alerts will appear here after connection." />
    </div>
  );
}
