import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { adminSettingsApi } from "@/lib/api";
import type { AdminOrganizationSettings } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AdminPageHeader } from "./AdminShared";

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function OrganizationProfilePage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const resetDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletePassword("");
    setDeleteConfirmText("");
    setDeleteError(null);
  };

  const deleteOrgMutation = useMutation({
    mutationFn: () => adminSettingsApi.deleteOrganization({ password: deletePassword }),
    onSuccess: () => {
      window.dispatchEvent(new CustomEvent("auth:logout"));
      toast({ title: "Organization deleted", description: "Your organization and all associated data have been deleted." });
      navigate("/", { replace: true });
    },
    onError: (error) => {
      const status = (error as { status?: number })?.status;
      if (status === 429) {
        setDeleteError("Too many attempts. Please wait 15 minutes before trying again.");
      } else {
        setDeleteError(error instanceof Error ? error.message : "Incorrect password.");
      }
    },
  });

  const handleDeleteOrganization = () => {
    if (deleteConfirmText !== "DELETE") {
      setDeleteError("Type DELETE to confirm.");
      return;
    }
    if (!deletePassword) {
      setDeleteError("Enter your password to confirm.");
      return;
    }
    setDeleteError(null);
    deleteOrgMutation.mutate();
  };

  const [form, setForm] = useState({
    company_name: "",
    address: "",
    website: "",
    email: "",
    phone: "",
    industry: "",
    frameworks_in_scope: "",
  });

  const organizationQuery = useQuery({
    queryKey: ["admin", "organization"],
    queryFn: adminSettingsApi.getOrganization,
  });

  useEffect(() => {
    const data = organizationQuery.data;
    if (!data) return;
    setForm({
      company_name: data.company_name ?? "",
      address: data.address ?? "",
      website: data.website ?? "",
      email: data.email ?? "",
      phone: data.phone ?? "",
      industry: data.industry ?? "",
      frameworks_in_scope: (data.frameworks_in_scope ?? []).join("\n"),
    });
  }, [organizationQuery.data]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const mutation = useMutation({
    mutationFn: () => {
      const payload: AdminOrganizationSettings = {
        organization_id: organizationQuery.data?.organization_id ?? "",
        company_name: form.company_name || null,
        address: form.address || null,
        website: form.website || null,
        email: form.email || null,
        phone: form.phone || null,
        industry: form.industry || null,
        frameworks_in_scope: splitLines(form.frameworks_in_scope),
      };
      return adminSettingsApi.updateOrganization(payload);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "organization"], data);
      toast({ title: "Organization profile saved", description: "Company details were updated." });
    },
    onError: (error) => {
      toast({
        title: "Could not save organization profile",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Organization Profile"
        description="Centralize organization details used across compliance, governance, reports, and document generation."
      />

      {organizationQuery.isLoading && (
        <Card className="bg-card">
          <CardContent className="space-y-4 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      )}

      {organizationQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {organizationQuery.error instanceof Error ? organizationQuery.error.message : "Failed to load organization profile."}
          </AlertDescription>
        </Alert>
      )}

      {!organizationQuery.isLoading && !organizationQuery.isError && (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Company Details</CardTitle>
              <CardDescription>Save the organization profile used by administration and reporting workflows.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="company-name">Company name</Label>
                <Input id="company-name" value={form.company_name} onChange={(event) => updateField("company_name", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" value={form.industry} onChange={(event) => updateField("industry", event.target.value)} />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea id="address" value={form.address} onChange={(event) => updateField("address", event.target.value)} rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" value={form.website} onChange={(event) => updateField("website", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="frameworks">Frameworks in scope</Label>
                <Textarea id="frameworks" value={form.frameworks_in_scope} onChange={(event) => updateField("frameworks_in_scope", event.target.value)} rows={5} />
                <p className="text-sm text-muted-foreground">Enter one framework per line.</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Organization Profile
            </Button>
          </div>
        </form>
      )}

      {user?.org_role === "admin" && (
        <Card className="border-destructive/40 bg-card">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Permanently delete this organization and everything in it.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-muted-foreground">
              Every member's account, all evidence, compliance packages, governance records, and
              integration configuration (SSO, SIEM export) are permanently deleted. This cannot be undone.
            </p>
            <Button type="button" variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete organization
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={(open) => { if (!open) resetDeleteDialog(); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete organization
            </DialogTitle>
            <DialogDescription>
              This permanently deletes your organization and every member's account. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="delete-org-password">Confirm your password</Label>
              <Input
                id="delete-org-password"
                type="password"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-org-confirm-text">Type <span className="font-mono font-semibold">DELETE</span> to confirm</Label>
              <Input
                id="delete-org-confirm-text"
                value={deleteConfirmText}
                onChange={(event) => setDeleteConfirmText(event.target.value)}
              />
            </div>
            {deleteError && <p className="text-sm text-destructive">{deleteError}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={resetDeleteDialog}>Cancel</Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteOrganization}
              disabled={deleteOrgMutation.isPending || deleteConfirmText !== "DELETE" || !deletePassword}
            >
              {deleteOrgMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Permanently delete organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
