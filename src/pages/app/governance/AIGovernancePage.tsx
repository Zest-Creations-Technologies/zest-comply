import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DonutBreakdown, MeterBar, StatCallout } from "@/components/app/dashboard-charts";
import { useAIGovernanceDocuments, useAIGovernanceSummary } from "./useAIGovernance";

function formatStatusLabel(status: string) {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function AIGovernancePage() {
  const { summary, isLoading: summaryLoading } = useAIGovernanceSummary();
  const { documents, methodology, isLoading: documentsLoading } = useAIGovernanceDocuments();

  const statusData = summary
    ? Object.entries(summary.status_breakdown).map(([name, count]) => ({
        name: formatStatusLabel(name),
        count,
      }))
    : [];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">AI Governance</h1>
        <p className="text-muted-foreground">
          Oversight of AI-generated documents: self-assessed quality, human review activity, and final decisions.
        </p>
      </div>

      {summaryLoading || documentsLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : !summary || summary.total_documents === 0 ? (
        <Card className="bg-card">
          <CardContent className="py-10">
            <p className="font-medium text-foreground">No generated documents yet</p>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Once you generate a compliance document package, its AI-assessed quality score and review activity will appear here.
            </p>
            {summary && summary.total_copilot_answers > 0 && (
              <p className="mt-4 text-sm text-muted-foreground">
                Copilot answers so far: {summary.total_copilot_answers}, {summary.copilot_grounded_rate}% grounded in real data.
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCallout label="Documents generated" value={summary.total_documents} tone="gold" />
            <StatCallout
              label="Avg AI quality score"
              value={summary.avg_quality_score ?? "N/A"}
              tone="teal"
            />
            <StatCallout label="Human review rate" value={`${summary.review_rate}%`} tone="gold" />
            <StatCallout
              label="Copilot grounded rate"
              value={summary.copilot_grounded_rate !== null ? `${summary.copilot_grounded_rate}%` : "N/A"}
              tone="teal"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Human review coverage</CardTitle>
                <CardDescription>Share of generated documents with at least one human review comment.</CardDescription>
              </CardHeader>
              <CardContent>
                <MeterBar
                  label={`${summary.reviewed_count}/${summary.total_documents} documents reviewed`}
                  value={summary.review_rate}
                  max={100}
                  tone="teal"
                />
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Validation status breakdown</CardTitle>
                <CardDescription>Where each document's validation profile currently stands.</CardDescription>
              </CardHeader>
              <CardContent>
                <DonutBreakdown data={statusData} emptyLabel="No validation profiles yet." />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Generated documents</CardTitle>
              <CardDescription>Per-document AI quality score and human review status.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document</TableHead>
                    <TableHead>AI quality score</TableHead>
                    <TableHead>Review comments</TableHead>
                    <TableHead>Validation status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium">{doc.document_name}</TableCell>
                      <TableCell>{doc.quality_score ?? "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant={doc.review_comment_count > 0 ? "default" : "outline"}>
                          {doc.review_comment_count}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {doc.validation_status ? (
                          <Badge variant="outline">{formatStatusLabel(doc.validation_status)}</Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">Not submitted</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <p className="text-sm italic text-muted-foreground">{methodology}</p>
        </>
      )}
    </div>
  );
}
