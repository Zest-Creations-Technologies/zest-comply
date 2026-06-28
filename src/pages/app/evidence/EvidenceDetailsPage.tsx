import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Archive, Download, FileUp, GitBranch, Send, ShieldCheck, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { EvidenceEmptyState, EvidenceStatusBadge, formatDate } from "./EvidenceShared";
import { useEvidenceStore } from "./evidence-store";

export default function EvidenceDetailsPage() {
  const { evidenceId } = useParams<{ evidenceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { byId, updateStatus, replaceVersion } = useEvidenceStore();
  const record = evidenceId ? byId.get(evidenceId) : null;

  if (!record) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/app/evidence/library")}><ArrowLeft className="mr-2 h-4 w-4" />Back to Evidence Library</Button>
        <EvidenceEmptyState title="Evidence record not found" description="The evidence record is not available in the current library." />
      </div>
    );
  }

  const setStatus = (status: Parameters<typeof updateStatus>[1], message: string) => {
    updateStatus(record.id, status);
    toast({ title: "Evidence updated", description: message });
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/app/evidence/library")}><ArrowLeft className="mr-2 h-4 w-4" />Back to Evidence Library</Button>

      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{record.title}</h1>
          <p className="text-muted-foreground">{record.framework} · {record.controlId} · Version {record.version}</p>
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
            <div><p className="text-muted-foreground">Evidence Type</p><p className="text-foreground">{record.evidenceType}</p></div>
            <div><p className="text-muted-foreground">Package</p><p className="text-foreground">{record.packageName || "Not linked"}</p></div>
            <div><p className="text-muted-foreground">Owner</p><p className="text-foreground">{record.owner}</p></div>
            <div><p className="text-muted-foreground">Reviewer</p><p className="text-foreground">{record.reviewer || "Not assigned"}</p></div>
            <div><p className="text-muted-foreground">Uploaded By</p><p className="text-foreground">{record.uploadedBy}</p></div>
            <div><p className="text-muted-foreground">Due Date</p><p className="text-foreground">{formatDate(record.dueDate)}</p></div>
            <div><p className="text-muted-foreground">Expiration Date</p><p className="text-foreground">{formatDate(record.expirationDate)}</p></div>
            <div><p className="text-muted-foreground">Uploaded Date</p><p className="text-foreground">{formatDate(record.uploadedDate)}</p></div>
            <div><p className="text-muted-foreground">Last Updated</p><p className="text-foreground">{formatDate(record.lastUpdated)}</p></div>
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
              <p className="text-sm font-medium text-foreground">{record.fileName}</p>
              <p className="text-xs text-muted-foreground">Version {record.version}</p>
            </div>
            <Button className="w-full" variant="outline" onClick={() => toast({ title: "Download prepared", description: "The evidence file is tracked locally in this frontend checkpoint." })}>
              <Download className="mr-2 h-4 w-4" />Download Evidence
            </Button>
            <div className="space-y-2">
              <Label htmlFor="replacement-file">Replace Version</Label>
              <Input
                id="replacement-file"
                type="file"
                onChange={(event) => {
                  const fileName = event.target.files?.[0]?.name;
                  if (!fileName) return;
                  replaceVersion(record.id, fileName);
                  toast({ title: "Version replaced", description: "The evidence record has a new draft version." });
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
