import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileUp, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { evidenceTypes } from "./EvidenceShared";
import { useEvidenceData } from "./useEvidenceData";

const availableFrameworks = ["SOC 2", "ISO 27001", "GDPR", "HIPAA", "PCI DSS", "NIST CSF"];

export default function EvidenceUploadPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createEvidence, isCreating } = useEvidenceData();
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [frameworks, setFrameworks] = useState<string[]>([]);
  const [controlIdsText, setControlIdsText] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    packageName: "",
    evidenceType: "",
    owner: "",
    reviewer: "",
    dueDate: "",
    expirationDate: "",
    uploadedBy: "",
    notes: "",
  });

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));
  const toggleFramework = (name: string, checked: boolean) => {
    setFrameworks((current) => (checked ? [...current, name] : current.filter((item) => item !== name)));
  };
  const controlIds = controlIdsText.split(",").map((item) => item.trim()).filter(Boolean);
  const canSave = form.title && frameworks.length > 0 && controlIds.length > 0 && form.evidenceType && form.owner && form.uploadedBy && file;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Upload Evidence</h1>
        <p className="text-muted-foreground">Create an evidence record and attach it to one or more frameworks, controls, a package, and a review owner.</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form
        className="space-y-6"
        onSubmit={async (event) => {
          event.preventDefault();
          setError(null);
          try {
            const record = await createEvidence({
              title: form.title,
              description: form.description || undefined,
              frameworks,
              control_ids: controlIds,
              package_name: form.packageName || undefined,
              evidence_type: form.evidenceType || undefined,
              owner: form.owner || undefined,
              reviewer: form.reviewer || undefined,
              uploaded_by: form.uploadedBy || undefined,
              due_date: form.dueDate || undefined,
              expiration_date: form.expirationDate || undefined,
              notes: form.notes || undefined,
              file: file ?? undefined,
            });
            toast({ title: "Evidence uploaded", description: "The evidence record is ready for review." });
            navigate(`/app/evidence/${record.id}`);
          } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to upload evidence.");
          }
        }}
      >
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Evidence Metadata</CardTitle>
            <CardDescription>Core identifiers used for compliance review and audit traceability. One record can map to several frameworks and controls at once.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2 md:col-span-2"><Label htmlFor="title">Evidence Title</Label><Input id="title" value={form.title} onChange={(event) => update("title", event.target.value)} required /></div>
            <div className="grid gap-2 md:col-span-2"><Label htmlFor="description">Description</Label><Textarea id="description" value={form.description} onChange={(event) => update("description", event.target.value)} rows={4} /></div>
            <div className="grid gap-2">
              <Label>Frameworks</Label>
              <div className="grid grid-cols-2 gap-2 rounded-md border border-border p-3">
                {availableFrameworks.map((name) => (
                  <label key={name} className="flex items-center gap-2 text-sm text-foreground">
                    <Checkbox checked={frameworks.includes(name)} onCheckedChange={(checked) => toggleFramework(name, checked === true)} />
                    {name}
                  </label>
                ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="control-ids">Control IDs</Label>
              <Input id="control-ids" value={controlIdsText} onChange={(event) => setControlIdsText(event.target.value)} placeholder="CC6.1, A.9.2.1" required />
              <p className="text-xs text-muted-foreground">Comma-separated. One control ID per framework this evidence satisfies.</p>
            </div>
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
            <CardDescription>Attach the evidence file and reviewer context.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2"><Label htmlFor="uploaded-by">Uploaded By</Label><Input id="uploaded-by" value={form.uploadedBy} onChange={(event) => update("uploadedBy", event.target.value)} required /></div>
            <div className="grid gap-2">
              <Label htmlFor="file">Evidence File</Label>
              <Input id="file" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required />
            </div>
            <div className="grid gap-2 md:col-span-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" value={form.notes} onChange={(event) => update("notes", event.target.value)} rows={4} /></div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => navigate("/app/evidence/library")}>Cancel</Button>
          <Button type="submit" disabled={!canSave || isCreating}>
            {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileUp className="mr-2 h-4 w-4" />}
            Upload Evidence
          </Button>
        </div>
      </form>
    </div>
  );
}
