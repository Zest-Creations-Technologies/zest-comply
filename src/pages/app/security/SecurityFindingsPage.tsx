import { ShieldCheck } from "lucide-react";
import { SecurityEmptyState, ZestReconBadge } from "./SecurityShared";

export default function SecurityFindingsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-3">
        <ZestReconBadge />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Findings</h1>
          <p className="text-muted-foreground">Security findings imported from ZestRecon will be available for compliance triage.</p>
        </div>
      </div>
      <SecurityEmptyState icon={ShieldCheck} title="No ZestRecon findings yet" description="No ZestRecon findings yet. Connect ZestRecon to begin importing security findings." />
    </div>
  );
}
