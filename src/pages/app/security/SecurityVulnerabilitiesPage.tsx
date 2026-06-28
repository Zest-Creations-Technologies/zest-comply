import { Bug } from "lucide-react";
import { SecurityEmptyState, ZestReconBadge } from "./SecurityShared";

export default function SecurityVulnerabilitiesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-3">
        <ZestReconBadge />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Vulnerabilities</h1>
          <p className="text-muted-foreground">Vulnerability scan results can later drive evidence requests, remediation tasks, risks, and reports.</p>
        </div>
      </div>
      <SecurityEmptyState icon={Bug} title="No vulnerabilities imported yet" description="Connect ZestRecon when you are ready to sync scan results." />
    </div>
  );
}
