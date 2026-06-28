import { FolderOpen } from "lucide-react";
import { ReportsEmptyState, ReportsPageHeader } from "./ReportsShared";

export default function EvidenceReportsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <ReportsPageHeader
        title="Evidence Reports"
        description="Report on evidence coverage, review status, expiration readiness, and control support after evidence records are available."
      />
      <ReportsEmptyState
        icon={FolderOpen}
        description="Evidence reports will appear after evidence is uploaded, reviewed, approved, and linked to compliance work."
      />
    </div>
  );
}
