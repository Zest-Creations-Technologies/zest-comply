import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Upload } from "lucide-react";
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
import { useLogoUpload } from "@/hooks/useLogoUpload";
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

  const uploadLogoMutation = useMutation({
    mutationFn: (file: File) => adminSettingsApi.uploadBrandingLogo(file),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "branding"], data);
      toast({ title: "Logo uploaded" });
    },
    onError: (error) => {
      toast({
        title: "Could not upload logo",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteLogoMutation = useMutation({
    mutationFn: () => adminSettingsApi.deleteBrandingLogo(),
    onSuccess: () => {
      queryClient.setQueryData(["admin", "branding"], (current: AdminBrandingSettings | undefined) =>
        current ? { ...current, logo_download_url: null } : current
      );
      toast({ title: "Logo deleted" });
    },
    onError: (error) => {
      toast({
        title: "Could not delete logo",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { selectedFile, previewUrl, error: logoError, selectFile, upload, reset } = useLogoUpload({
    onUpload: async (file) => {
      await uploadLogoMutation.mutateAsync(file);
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
              <CardTitle>Company Logo</CardTitle>
              <CardDescription>Upload a logo to appear on generated reports, policies, and executive documents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {brandingQuery.data?.logo_download_url && !selectedFile ? (
                <div className="flex items-center gap-4 rounded-md border border-border p-4">
                  <img
                    src={brandingQuery.data.logo_download_url}
                    alt="Current logo"
                    className="h-16 max-w-[200px] object-contain"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteLogoMutation.mutate()}
                    disabled={deleteLogoMutation.isPending}
                  >
                    {deleteLogoMutation.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete Logo
                  </Button>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  className="cursor-pointer rounded-md border-2 border-dashed border-border p-6 text-center hover:border-primary/50"
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Logo preview" className="mx-auto max-h-24 object-contain" />
                  ) : (
                    <>
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Click to select a logo (PNG or JPEG, max 5MB)</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) await selectFile(file);
                      e.target.value = "";
                    }}
                  />
                </div>
              )}
              {logoError && <p className="text-sm text-destructive">{logoError}</p>}
              {selectedFile && (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
                  <div className="flex gap-2">
                    <Button type="button" variant="ghost" size="sm" onClick={reset}>
                      Cancel
                    </Button>
                    <Button type="button" size="sm" onClick={() => upload()} disabled={uploadLogoMutation.isPending}>
                      {uploadLogoMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Upload Logo
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Branding Defaults</CardTitle>
              <CardDescription>The logo URL below is used only if no logo has been uploaded above.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2 md:col-span-2">
                <Label htmlFor="logo-url">Fallback logo URL</Label>
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
