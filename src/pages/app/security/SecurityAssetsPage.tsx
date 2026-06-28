import { Network } from "lucide-react";
import { SecurityEmptyState, ZestReconBadge } from "./SecurityShared";

export default function SecurityAssetsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-3">
        <ZestReconBadge />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Assets</h1>
          <p className="text-muted-foreground">Synchronized assets will help connect security exposure to compliance requirements.</p>
        </div>
      </div>
      <SecurityEmptyState icon={Network} title="No assets imported yet" description="Connect ZestRecon when you are ready to synchronize monitored assets." />
    </div>
  );
}
