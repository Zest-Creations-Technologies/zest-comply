import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { adminSettingsApi } from "@/lib/api";
import type { AdminOrganizationSettings } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        user_id: organizationQuery.data?.user_id ?? "",
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
    </div>
  );
}
