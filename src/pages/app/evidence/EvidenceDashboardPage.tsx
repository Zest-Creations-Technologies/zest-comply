import { Link } from "react-router-dom";
import { Archive, Clock, FileCheck2, FileUp, Loader2, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEvidenceData } from "./useEvidenceData";
import { EvidenceEmptyState, EvidenceTable, evidenceByStatus } from "./EvidenceShared";

export default function EvidenceDashboardPage() {
  const { records, isLoading, isError, error } = useEvidenceData();
  const approved = evidenceByStatus(records, "approved");
  const pending = evidenceByStatus(records, "pending_review");
  const expired = evidenceByStatus(records, "expired");
  const archived = evidenceByStatus(records, "archived");
  const recent = records.filter((record) => record.status !== "archived").slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Evidence Management</h1>
          <p className="text-muted-foreground">Manage proof for controls, packages, audits, governance reviews, and monitoring readiness.</p>
        </div>
        <Button asChild>
          <Link to="/app/evidence/upload"><FileUp className="mr-2 h-4 w-4" />Upload Evidence</Link>
        </Button>
      </div>

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{error instanceof Error ? error.message : "Failed to load evidence."}</AlertDescription>
        </Alert>
      )}

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-card"><CardHeader className="pb-3"><CardDescription>Approved Evidence</CardDescription><CardTitle className="flex items-center gap-2 text-3xl"><FileCheck2 className="h-6 w-6 text-primary" />{approved.length}</CardTitle></CardHeader></Card>
            <Card className="bg-card"><CardHeader className="pb-3"><CardDescription>Pending Review</CardDescription><CardTitle className="flex items-center gap-2 text-3xl"><Clock className="h-6 w-6 text-primary" />{pending.length}</CardTitle></CardHeader></Card>
            <Card className="bg-card"><CardHeader className="pb-3"><CardDescription>Expired</CardDescription><CardTitle className="flex items-center gap-2 text-3xl"><ShieldAlert className="h-6 w-6 text-primary" />{expired.length}</CardTitle></CardHeader></Card>
            <Card className="bg-card"><CardHeader className="pb-3"><CardDescription>Archived</CardDescription><CardTitle className="flex items-center gap-2 text-3xl"><Archive className="h-6 w-6 text-primary" />{archived.length}</CardTitle></CardHeader></Card>
          </div>

          {records.length === 0 ? (
            <EvidenceEmptyState
              title="No evidence records yet"
              description="Upload evidence to begin tracking proof against frameworks, controls, packages, audits, and governance reviews."
            />
          ) : (
            <EvidenceTable records={recent} />
          )}
        </>
      )}
    </div>
  );
}
