import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { evidenceTypes } from "./EvidenceShared";
import { useEvidenceStore } from "./evidence-store";

const frameworks = ["SOC 2", "ISO 27001", "GDPR", "HIPAA", "PCI DSS", "NIST CSF"];

export default function EvidenceUploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createEvidence } = useEvidenceStore();
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    framework: "",
    controlId: "",
    packageName: "",
    evidenceType: "",
    owner: "",
    reviewer: "",
    dueDate: "",
    expirationDate: "",
    uploadedBy: "",
    notes: "",
    fileName: "",
  });

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const canSave = form.title && form.framework && form.controlId && form.evidenceType && form.owner && form.uploadedBy && form.fileName;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Upload Evidence</h1>
        <p className="text-muted-foreground">Create an evidence record and attach it to a framework, control, package, and review owner.</p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          setIsSaving(true);
          const record = createEvidence(form);
          toast({ title: "Evidence uploaded", description: "The evidence record is ready for review." });
          navigate(`/app/evidence/${record.id}`);
        }}
      >
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Evidence Metadata</CardTitle>
            <CardDescription>Core identifiers used for compliance review and audit traceability.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2 md:col-span-2"><Label htmlFor="title">Evidence Title</Label><Input id="title" value={form.title} onChange={(event) => update("title", event.target.value)} required /></div>
            <div className="grid gap-2 md:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={form.description} onChange={(event) => update("description", event.target.value)} rows={4} /></div>
            <div className="grid gap-2"><Label>Framework</Label><Select value={form.framework} onValueChange={(value) => update("framework", value)} required><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{frameworks.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid gap-2"><Label htmlFor="control-id">Control ID</Label><Input id="control-id" value={form.controlId} onChange={(event) => update("controlId", event.target.value)} required /></div>
            <div className="grid gap-2"><Label htmlFor="package">Package</Label><Input id="package" value={form.packageName} onChange={(event) => update("packageName", event.target.value)} /></div>
            <div className="grid gap-2"><Label>Evidence Type</Label><Select value={form.evidenceType} onValueChange={(value) => update("evidenceType", value)} required><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{evidenceTypes.map((item) => <SelectItem key={item} value={item}>{item}</SelectItem>)}</SelectContent></Select></div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Ownership and Review</CardTitle>
            <CardDescription>Define accountability and review timing.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2"><Label htmlFor="owner">Owner</Label><Input id="owner" value={form.owner} onChange={(event) => update("owner", event.target.value)} required /></div>
            <div className="grid gap-2"><Label htmlFor="reviewer">Reviewer</Label><Input id="reviewer" value={form.reviewer} onChange={(event) => update("reviewer", event.target.value)} /></div>
            <div className="grid gap-2"><Label htmlFor="due-date">Due Date</Label><Input id="due-date" type="date" value={form.dueDate} onChange={(event) => update("dueDate", event.target.value)} /></div>
            <div className="grid gap-2"><Label htmlFor="expiration-date">Expiration Date</Label><Input id="expiration-date" type="date" value={form.expirationDate} onChange={(event) => update("expirationDate", event.target.value)} /></div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardHeader>
            <CardTitle>File and Notes</CardTitle>
            <CardDescription>Record the uploaded file name and reviewer context.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2"><Label htmlFor="uploaded-by">Uploaded By</Label><Input id="uploaded-by" value={form.uploadedBy} onChange={(event) => update("uploadedBy", event.target.value)} required /></div>
            <div className="grid gap-2"><Label htmlFor="file">Evidence File</Label><Input id="file" type="file" onChange={(event) => update("fileName", event.target.files?.[0]?.name ?? "")} required /></div>
            <div className="grid gap-2 md:col-span-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={form.notes} onChange={(event) => update("notes", event.target.value)} rows={4} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/app/evidence/library")}>Cancel</Button>
          <Button type="submit" disabled={!canSave || isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
            Upload Evidence
          </Button>
        </div>
      </form>
    </div>
  );
}
