import { AlertTriangle } from "lucide-react";
import { SecurityEmptyState, ScannerIntegrationBadge } from "./SecurityShared";

export default function SecurityAlertsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-3">
        <ScannerIntegrationBadge />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Security Alerts</h1>
          <p className="text-muted-foreground">Connected-scanner alerts will support compliance monitoring and remediation workflows.</p>
        </div>
      </div>
      <SecurityEmptyState icon={AlertTriangle} title="No security alerts yet" description="Optional scanner alerts will appear here after connection." />
    </div>
  );
}
