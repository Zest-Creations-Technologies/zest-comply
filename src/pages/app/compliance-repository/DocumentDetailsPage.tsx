import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, FileClock, GitBranch } from "lucide-react";
import { humanValidationApi } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { useRepositoryData } from "./useRepositoryData";
import { decodeDocumentId, formatDate, latestComment, repositoryStatusLabels } from "./repository-utils";
import { RepositoryEmptyState, RepositoryLoading, RepositoryStatusBadge } from "./RepositoryShared";

export default function DocumentDetailsPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const decoded = decodeDocumentId(documentId);
  const { documents, isLoading, isError, error } = useRepositoryData();
  const document = documents.find((item) => item.id === documentId);

  const auditQuery = useQuery({
    queryKey: ["compliance-repository", "document-audit", document?.profileId],
    queryFn: () => humanValidationApi.getAuditTrail(document!.profileId!),
    enabled: Boolean(document?.profileId),
  });

  const commentsQuery = useQuery({
    queryKey: ["compliance-repository", "document-comments", document?.profileId],
    queryFn: () => humanValidationApi.getComments(document!.profileId!),
    enabled: Boolean(document?.profileId),
  });

  const comments = commentsQuery.data ?? [];
  const latest = latestComment(comments);
  const packageUrl = document?.packageRecord?.package_url;
  const isPdf = document?.title.toLowerCase().endsWith(".pdf");
  const isDocx = document?.title.toLowerCase().endsWith(".docx");

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate("/app/compliance-repository/approved-documents")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Approved Documents
        </Button>
      </div>

      {isLoading && <RepositoryLoading />}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{error instanceof Error ? error.message : "Failed to load document details."}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && (!decoded || !document) && (
        <RepositoryEmptyState title="Document not found" description="The repository document may no longer be available or has not been approved yet." />
      )}

      {!isLoading && !isError && document && (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{document.title}</h1>
              <p className="text-muted-foreground">{document.framework} · {document.documentType} · Version {document.currentVersion}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <RepositoryStatusBadge status={document.status} />
              <Button
                variant="outline"
                onClick={() => toast({ title: "Revision workflow", description: "Start the new revision from Governance & Approvals for this approved profile." })}
              >
                <GitBranch className="mr-2 h-4 w-4" />
                Start New Revision
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="bg-card lg:col-span-2">
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
                <CardDescription>Controlled document attributes from the approved package and governance profile.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm md:grid-cols-2">
                <div><p className="text-muted-foreground">Framework</p><p className="text-foreground">{document.framework}</p></div>
                <div><p className="text-muted-foreground">Document Type</p><p className="text-foreground">{document.documentType}</p></div>
                <div><p className="text-muted-foreground">Current Version</p><p className="text-foreground">{document.currentVersion}</p></div>
                <div><p className="text-muted-foreground">Status</p><p className="text-foreground">{repositoryStatusLabels[document.status]}</p></div>
                <div><p className="text-muted-foreground">Owner</p><p className="text-foreground">{document.owner}</p></div>
                <div><p className="text-muted-foreground">Approver</p><p className="text-foreground">{document.approver}</p></div>
                <div><p className="text-muted-foreground">Approval Date</p><p className="text-foreground">{formatDate(document.approvalDate)}</p></div>
                <div><p className="text-muted-foreground">Last Updated</p><p className="text-foreground">{formatDate(document.lastUpdated)}</p></div>
                <div className="md:col-span-2"><p className="text-muted-foreground">Repository Path</p><p className="break-all text-foreground">{document.file?.path || document.title}</p></div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Downloads</CardTitle>
                <CardDescription>Downloads use the approved package archive currently available from storage.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" variant="outline" asChild disabled={!packageUrl || !isPdf}>
                  <a href={packageUrl || "#"} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download PDF
                  </a>
                </Button>
                <Button className="w-full" variant="outline" asChild disabled={!packageUrl || !isDocx}>
                  <a href={packageUrl || "#"} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Download DOCX
                  </a>
                </Button>
                {!isPdf && !isDocx && <p className="text-xs text-muted-foreground">This artifact is available in the package archive.</p>}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Version History</CardTitle>
                <CardDescription>Current approved package version.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-border p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium text-foreground">Version {document.currentVersion}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(document.lastUpdated)}</p>
                    </div>
                    <FileClock className="h-5 w-5 text-muted-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Approval Timeline</CardTitle>
                <CardDescription>Key governance milestones.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(auditQuery.data ?? []).filter((event) => ["profile_created", "submitted_for_review", "approved", "executive_signoff_updated"].includes(event.event_type)).map((event) => (
                  <div key={event.id} className="flex items-center justify-between gap-4 rounded-md border border-border p-3 text-sm">
                    <span className="text-foreground">{event.event_type.replace(/_/g, " ")}</span>
                    <span className="text-muted-foreground">{formatDate(event.created_at)}</span>
                  </div>
                ))}
                {!auditQuery.isLoading && (auditQuery.data ?? []).length === 0 && <p className="text-sm text-muted-foreground">No approval events recorded.</p>}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Audit History</CardTitle>
              <CardDescription>Read-only audit events inherited from Governance & Approvals.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Status Change</TableHead>
                    <TableHead>Actor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Message</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(auditQuery.data ?? []).map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="font-medium">{event.event_type.replace(/_/g, " ")}</TableCell>
                      <TableCell>{event.to_status ?? "No status change"}</TableCell>
                      <TableCell className="break-all">{event.actor_user_id ?? "System"}</TableCell>
                      <TableCell>{formatDate(event.created_at)}</TableCell>
                      <TableCell>{event.message ?? "None"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Comments</CardTitle>
              <CardDescription>Read-only comments from the approved governance workflow.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments have been recorded for this profile.</p>
              ) : comments.map((comment) => (
                <div key={comment.id} className="rounded-md border border-border p-4">
                  <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm font-medium text-foreground">{comment.section_reference || "General comment"}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</p>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-foreground">{comment.comment}</p>
                </div>
              ))}
              {latest && (
                <>
                  <Separator />
                  <p className="text-xs text-muted-foreground">Latest comment: {formatDate(latest.created_at)}</p>
                </>
              )}
            </CardContent>
          </Card>

          {document.profileId && (
            <div className="flex justify-end">
              <Button asChild variant="outline">
                <Link to={`/app/human-validation/approvals/${document.profileId}`}>Open Governance Record</Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
