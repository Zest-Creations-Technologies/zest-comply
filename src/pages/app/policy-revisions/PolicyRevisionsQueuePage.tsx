import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { policyRevisionsApi } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, formatDateTime, PageSkeleton, StatusBadge } from "./shared";

export default function PolicyRevisionsQueuePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["policy-revisions", "pending-target-review"],
    queryFn: policyRevisionsApi.listPendingTargetReview,
  });

  const proposals = data?.proposals ?? [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Policy Revisions</h1>
        <p className="text-muted-foreground">
          Scanner findings that may affect an existing policy. Confirm which policy each one is
          about before the AI drafts a revision.
        </p>
      </div>

      {isLoading && <PageSkeleton />}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : "Failed to load policy revision proposals."}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && proposals.length === 0 && (
        <EmptyState
          title="No policy revisions pending"
          description="When a scanner finding might affect one of your policies, it will show up here for you to confirm."
        />
      )}

      {!isLoading && !isError && proposals.length > 0 && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Pending Target Confirmation</CardTitle>
            <CardDescription>
              {proposals.length} proposal{proposals.length === 1 ? "" : "s"} awaiting review.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Finding</TableHead>
                  <TableHead>Suggested Policy</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      <p className="font-medium text-foreground">
                        {proposal.evidence_title || "Untitled finding"}
                      </p>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {proposal.suggested_policy_document_name || "No match found"}
                    </TableCell>
                    <TableCell><StatusBadge status={proposal.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(proposal.updated_at)}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm">
                        <Link to={`/app/policy-revisions/${proposal.id}`}>Review</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
