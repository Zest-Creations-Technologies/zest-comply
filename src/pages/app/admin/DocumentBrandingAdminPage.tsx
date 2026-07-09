import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { adminSettingsApi } from "@/lib/api";
import type { AdminBrandingSettings } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AdminPageHeader } from "./AdminShared";

export default function DocumentBrandingAdminPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({
    logo_url: "",
    primary_color: "",
    secondary_color: "",
    report_footer: "",
    document_header: "",
    default_approver_title: "",
    default_reviewer_title: "",
  });

  const brandingQuery = useQuery({
    queryKey: ["admin", "branding"],
    queryFn: adminSettingsApi.getBranding,
  });

  useEffect(() => {
    const data = brandingQuery.data;
    if (!data) return;
    setForm({
      logo_url: data.logo_url ?? "",
      primary_color: data.primary_color ?? "",
      secondary_color: data.secondary_color ?? "",
      report_footer: data.report_footer ?? "",
      document_header: data.document_header ?? "",
      default_approver_title: data.default_approver_title ?? "",
      default_reviewer_title: data.default_reviewer_title ?? "",
    });
  }, [brandingQuery.data]);

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const mutation = useMutation({
    mutationFn: () => {
      const payload: AdminBrandingSettings = {
        organization_id: brandingQuery.data?.organization_id ?? "",
        logo_url: form.logo_url || null,
        primary_color: form.primary_color || null,
        secondary_color: form.secondary_color || null,
        report_footer: form.report_footer || null,
        document_header: form.document_header || null,
        default_approver_title: form.default_approver_title || null,
        default_reviewer_title: form.default_reviewer_title || null,
      };
      return adminSettingsApi.updateBranding(payload);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "branding"], data);
      toast({ title: "Document branding saved", description: "Branding details were updated." });
    },
    onError: (error) => {
      toast({
        title: "Could not save document branding",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Document Branding"
        description="Manage organization-wide branding defaults for reports, policies, procedures, and executive documents."
      />

      {brandingQuery.isLoading && (
        <Card className="bg-card">
          <CardContent className="space-y-4 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      )}

      {brandingQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {brandingQuery.error instanceof Error ? brandingQuery.error.message : "Failed to load document branding."}
          </AlertDescription>
        </Alert>
      )}

      {!brandingQuery.isLoading && !brandingQuery.isError && (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Branding Defaults</CardTitle>
              <CardDescription>Logo file upload is future work. Use a logo URL for this activation checkpoint.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="logo-url">Company logo URL</Label>
                <Input id="logo-url" type="url" value={form.logo_url} onChange={(event) => updateField("logo_url", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="primary-color">Primary color</Label>
                <Input id="primary-color" value={form.primary_color} onChange={(event) => updateField("primary_color", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="secondary-color">Secondary color</Label>
                <Input id="secondary-color" value={form.secondary_color} onChange={(event) => updateField("secondary_color", event.target.value)} />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="document-header">Document header</Label>
                <Textarea id="document-header" value={form.document_header} onChange={(event) => updateField("document_header", event.target.value)} rows={3} />
              </div>
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="report-footer">Report footer</Label>
                <Textarea id="report-footer" value={form.report_footer} onChange={(event) => updateField("report_footer", event.target.value)} rows={3} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="approver-title">Default approver title</Label>
                <Input id="approver-title" value={form.default_approver_title} onChange={(event) => updateField("default_approver_title", event.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reviewer-title">Default reviewer title</Label>
                <Input id="reviewer-title" value={form.default_reviewer_title} onChange={(event) => updateField("default_reviewer_title", event.target.value)} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Document Branding
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
