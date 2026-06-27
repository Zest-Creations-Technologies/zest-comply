import { Link } from "react-router-dom";
import { Archive, CalendarClock, FileCheck2, FolderKanban, Library } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRepositoryData } from "./useRepositoryData";
import { documentMatchesCategory, repositoryStatusLabels } from "./repository-utils";
import { RepositoryEmptyState, RepositoryLoading, SimpleBarChart } from "./RepositoryShared";

function countBy(items: string[]) {
  return Object.entries(items.reduce<Record<string, number>>((acc, item) => {
    acc[item] = (acc[item] ?? 0) + 1;
    return acc;
  }, {})).map(([label, value]) => ({ label, value }));
}

export default function ComplianceRepositoryDashboardPage() {
  const { documents, isLoading, isError, error } = useRepositoryData();

  const policyCount = documents.filter((document) => documentMatchesCategory(document, "policies")).length;
  const evidenceCount = documents.filter((document) => documentMatchesCategory(document, "evidence-library")).length;
  const expiringCount = 0;
  const byFramework = countBy(documents.map((document) => document.framework));
  const byStatus = countBy(documents.map((document) => repositoryStatusLabels[document.status]));

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Compliance Repository</h1>
          <p className="text-muted-foreground">Approved compliance documents, evidence, and governance history in one controlled repository.</p>
        </div>
        <Button asChild>
          <Link to="/app/compliance-repository/approved-documents">View Approved Documents</Link>
        </Button>
      </div>

      {isLoading && <RepositoryLoading />}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{error instanceof Error ? error.message : "Failed to load repository."}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && documents.length === 0 && (
        <RepositoryEmptyState
          title="No approved documents yet"
          description="Documents will appear here after a governance profile is approved and linked to a generated package."
        />
      )}

      {!isLoading && !isError && documents.length > 0 && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-card">
              <CardHeader className="pb-3">
                <CardDescription>Approved Documents</CardDescription>
                <CardTitle className="flex items-center gap-2 text-3xl"><FileCheck2 className="h-6 w-6 text-primary" />{documents.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader className="pb-3">
                <CardDescription>Policies</CardDescription>
                <CardTitle className="flex items-center gap-2 text-3xl"><FolderKanban className="h-6 w-6 text-primary" />{policyCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader className="pb-3">
                <CardDescription>Evidence</CardDescription>
                <CardTitle className="flex items-center gap-2 text-3xl"><Library className="h-6 w-6 text-primary" />{evidenceCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader className="pb-3">
                <CardDescription>Expiring Documents</CardDescription>
                <CardTitle className="flex items-center gap-2 text-3xl"><CalendarClock className="h-6 w-6 text-primary" />{expiringCount}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <SimpleBarChart title="Documents by Framework" description="Approved repository coverage by framework." data={byFramework} />
            <SimpleBarChart title="Documents by Status" description="Current lifecycle state for repository documents." data={byStatus} />
          </div>

          <Card className="bg-card">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2"><Archive className="h-5 w-5 text-primary" /> Repository Scope</CardTitle>
                <CardDescription>Repository documents are sourced from approved Governance & Approvals profiles.</CardDescription>
              </div>
              <Button asChild variant="outline">
                <Link to="/app/human-validation/review-queue">Open Governance Queue</Link>
              </Button>
            </CardHeader>
          </Card>
        </>
      )}
    </div>
  );
}
