import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Archive, Download, GitBranch, Loader2, Send, ShieldCheck, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { evidenceApi } from "@/lib/api";
import { EvidenceEmptyState, EvidenceStatusBadge, formatDate } from "./EvidenceShared";
import { useEvidenceData, useEvidenceItem } from "./useEvidenceData";

export default function EvidenceDetailsPage() {
  const { evidenceId } = useParams<{ evidenceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { updateStatus, replaceVersion } = useEvidenceData();
  const { data: record, isLoading, isError } = useEvidenceItem(evidenceId);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      </div>
    );
  }

  if (isError || !record) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/app/evidence/library")}><ArrowLeft className="mr-2 h-4 w-4" />Back to Evidence Library</Button>
        <EvidenceEmptyState title="Evidence record not found" description="The evidence record is not available in the current library." />
      </div>
    );
  }

  const setStatus = async (status: Parameters<typeof updateStatus>[1], message: string) => {
    try {
      await updateStatus(record.id, status);
      toast({ title: "Evidence updated", description: message });
    } catch (err) {
      toast({ title: "Could not update evidence", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    }
  };

  const handleDownload = async () => {
    try {
      const { download_url } = await evidenceApi.getDownloadUrl(record.id);
      window.open(download_url, "_blank", "noopener,noreferrer");
    } catch (err) {
      toast({ title: "Could not prepare download", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/app/evidence/library")}><ArrowLeft className="mr-2 h-4 w-4" />Back to Evidence Library</Button>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{record.title}</h1>
          <p className="text-muted-foreground">{record.frameworks.join(", ") || "No framework"} · {record.control_ids.join(", ") || "No control"} · Version {record.version}</p>
        </div>
        <EvidenceStatusBadge status={record.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Evidence Metadata</CardTitle>
            <CardDescription>Core record details used for compliance proof and review.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 text-sm md:grid-cols-2">
            <div><p className="text-muted-foreground">Description</p><p className="text-foreground">{record.description || "Not provided"}</p></div>
            <div><p className="text-muted-foreground">Evidence Type</p><p className="text-foreground">{record.evidence_type}</p></div>
            <div><p className="text-muted-foreground">Package</p><p className="text-foreground">{record.package_name || "Not linked"}</p></div>
            <div><p className="text-muted-foreground">Owner</p><p className="text-foreground">{record.owner}</p></div>
            <div><p className="text-muted-foreground">Reviewer</p><p className="text-foreground">{record.reviewer || "Not assigned"}</p></div>
            <div><p className="text-muted-foreground">Uploaded By</p><p className="text-foreground">{record.uploaded_by}</p></div>
            <div><p className="text-muted-foreground">Due Date</p><p className="text-foreground">{formatDate(record.due_date)}</p></div>
            <div><p className="text-muted-foreground">Expiration Date</p><p className="text-foreground">{formatDate(record.expiration_date)}</p></div>
            <div><p className="text-muted-foreground">Uploaded Date</p><p className="text-foreground">{formatDate(record.created_at)}</p></div>
            <div><p className="text-muted-foreground">Last Updated</p><p className="text-foreground">{formatDate(record.updated_at)}</p></div>
            <div className="md:col-span-2"><p className="text-muted-foreground">Notes</p><p className="whitespace-pre-wrap text-foreground">{record.notes || "Not provided"}</p></div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Evidence File</CardTitle>
            <CardDescription>File record and version controls.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-border p-3">
              <p className="text-sm font-medium text-foreground">{record.file_name || "No file attached"}</p>
              <p className="text-xs text-muted-foreground">Version {record.version}</p>
            </div>
            <Button className="w-full" variant="outline" onClick={handleDownload} disabled={!record.file_name}>
              <Download className="mr-2 h-4 w-4" />Download Evidence
            </Button>
            <div className="space-y-2">
              <Label htmlFor="replacement-file">Replace Version</Label>
              <Input
                id="replacement-file"
                type="file"
                onChange={async (event) => {
                  const nextFile = event.target.files?.[0];
                  if (!nextFile) return;
                  try {
                    await replaceVersion(record.id, nextFile);
                    toast({ title: "Version replaced", description: "The evidence record has a new draft version." });
                  } catch (err) {
                    toast({ title: "Could not replace version", description: err instanceof Error ? err.message : "Please try again.", variant: "destructive" });
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
          <CardDescription>Move evidence through review, governance, and retention workflows.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <Button variant="outline" onClick={() => setStatus("pending_review", "The evidence record is pending review.")}><Send className="mr-2 h-4 w-4" />Request Review</Button>
          <Button onClick={() => setStatus("approved", "The evidence record has been approved.")}><ShieldCheck className="mr-2 h-4 w-4" />Approve</Button>
          <Button variant="destructive" onClick={() => setStatus("rejected", "The evidence record has been rejected.")}><XCircle className="mr-2 h-4 w-4" />Reject</Button>
          <Button variant="outline" onClick={() => toast({ title: "Governance handoff", description: "Evidence is ready to reference from Governance & Approvals." })}><GitBranch className="mr-2 h-4 w-4" />Send to Governance</Button>
          <Button variant="outline" onClick={() => setStatus("archived", "The evidence record has been archived.")}><Archive className="mr-2 h-4 w-4" />Archive Evidence</Button>
        </CardContent>
      </Card>

      {record.status === "expired" && (
        <Alert>
          <AlertDescription>This evidence is expired and should be replaced before reuse in an audit package.</AlertDescription>
        </Alert>
      )}

      <Separator />
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link to="/app/evidence/review">Open Review Queue</Link>
        </Button>
      </div>
    </div>
  );
}
