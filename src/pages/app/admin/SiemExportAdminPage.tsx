import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { siemWebhookApi } from "@/lib/api";
import type { SiemWebhookConfigUpdate } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AdminPageHeader } from "./AdminShared";

export default function SiemExportAdminPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({
    webhook_url: "",
    format: "splunk_hec" as "splunk_hec" | "datadog",
    auth_header_value: "",
    enabled: true,
  });

  const configQuery = useQuery({
    queryKey: ["admin", "siem-webhook"],
    queryFn: siemWebhookApi.get,
  });

  useEffect(() => {
    const data = configQuery.data;
    if (!data) return;
    setForm((current) => ({
      ...current,
      format: (data.format as "splunk_hec" | "datadog") ?? "splunk_hec",
      enabled: data.enabled,
      // webhook_url is intentionally not echoed back by the API once set
      // (may embed a token) - leave blank unless the admin re-enters it.
    }));
  }, [configQuery.data]);

  const isConfigured = Boolean(configQuery.data?.webhook_url);

  const mutation = useMutation({
    mutationFn: (payload: SiemWebhookConfigUpdate) => siemWebhookApi.update(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "siem-webhook"], data);
      toast({ title: "SIEM export saved", description: "New audit events will be forwarded on the next export cycle (within 5 minutes)." });
    },
    onError: (error) => {
      toast({
        title: "Could not save SIEM export settings",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="SIEM Export"
        description="Forward audit events to your SIEM (Splunk HTTP Event Collector or Datadog Logs API) in near real time."
      />

      {configQuery.isLoading && (
        <Card className="bg-card">
          <CardContent className="space-y-4 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {configQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {configQuery.error instanceof Error ? configQuery.error.message : "Failed to load SIEM export settings."}
          </AlertDescription>
        </Alert>
      )}

      {!configQuery.isLoading && !configQuery.isError && (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate({
              webhook_url: form.webhook_url,
              format: form.format,
              auth_header_value: form.auth_header_value || undefined,
              enabled: form.enabled,
            });
          }}
        >
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Export Destination</CardTitle>
              <CardDescription>
                {isConfigured
                  ? "A destination is configured. Enter a new URL/token below only if you want to replace it."
                  : "Not configured yet - events won't be forwarded anywhere until you set a destination."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="siem-enabled">Enabled</Label>
                  <p className="text-sm text-muted-foreground">Turn forwarding on or off without losing the saved destination.</p>
                </div>
                <Switch
                  id="siem-enabled"
                  checked={form.enabled}
                  onCheckedChange={(checked) => setForm((c) => ({ ...c, enabled: checked }))}
                />
              </div>

              <div className="grid gap-2">
                <Label>Format</Label>
                <Select value={form.format} onValueChange={(v) => setForm((c) => ({ ...c, format: v as "splunk_hec" | "datadog" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="splunk_hec">Splunk HTTP Event Collector</SelectItem>
                    <SelectItem value="datadog">Datadog Logs API</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="webhook-url">Webhook URL</Label>
                <Input
                  id="webhook-url"
                  placeholder={isConfigured ? "Leave blank to keep the current destination" : "https://http-inputs-yourorg.splunkcloud.com/services/collector/event"}
                  value={form.webhook_url}
                  onChange={(e) => setForm((c) => ({ ...c, webhook_url: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="auth-header">Authorization header value</Label>
                <Input
                  id="auth-header"
                  type="password"
                  placeholder={isConfigured ? "Leave blank to keep the current token" : "Splunk <your-hec-token>"}
                  value={form.auth_header_value}
                  onChange={(e) => setForm((c) => ({ ...c, auth_header_value: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  For Splunk HEC: "Splunk &lt;token&gt;". For Datadog: your API key value.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending || (!isConfigured && !form.webhook_url)}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save SIEM Export Settings
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
