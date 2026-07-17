import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, HelpCircle, Loader2, XCircle } from "lucide-react";
import { connectionsApi } from "@/lib/api";
import type { OrgConnectionUpdate } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AdminPageHeader } from "./AdminShared";

const STATUS_LABEL: Record<string, string> = {
  pass: "MFA enforcement is on",
  fail: "MFA enforcement is off",
  indeterminate: "Could not determine MFA status",
};

function StatusBadge({ status }: { status: string | null }) {
  if (status === "pass") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600">
        <CheckCircle2 className="h-4 w-4" /> {STATUS_LABEL.pass}
      </span>
    );
  }
  if (status === "fail") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-destructive">
        <XCircle className="h-4 w-4" /> {STATUS_LABEL.fail}
      </span>
    );
  }
  if (status === "indeterminate") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <HelpCircle className="h-4 w-4" /> {STATUS_LABEL.indeterminate}
      </span>
    );
  }
  return <span className="text-sm text-muted-foreground">Not checked yet</span>;
}

export default function ConnectionsAdminPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({ domain: "", api_token: "", enabled: true });

  const connectionQuery = useQuery({
    queryKey: ["admin", "connections"],
    queryFn: connectionsApi.get,
  });

  useEffect(() => {
    const data = connectionQuery.data;
    if (!data) return;
    setForm((current) => ({
      ...current,
      domain: data.domain ?? "",
      enabled: data.enabled,
      // api_token is intentionally never echoed back by the API once set -
      // leave blank unless the admin re-enters it.
    }));
  }, [connectionQuery.data]);

  const isConfigured = Boolean(connectionQuery.data?.has_credentials);

  const saveMutation = useMutation({
    mutationFn: (payload: OrgConnectionUpdate) => connectionsApi.update(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "connections"], data);
      setForm((c) => ({ ...c, api_token: "" }));
      toast({ title: "Connection saved", description: "ZestComply will check this connection on its regular schedule." });
    },
    onError: (error) => {
      toast({
        title: "Could not save connection",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const checkNowMutation = useMutation({
    mutationFn: () => connectionsApi.checkNow(),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "connections"], data);
      toast({ title: "Check complete", description: STATUS_LABEL[data.last_check_status ?? ""] ?? "Check finished." });
    },
    onError: (error) => {
      toast({
        title: "Check failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Connected Systems"
        description="Connect Okta so ZestComply can continuously verify MFA enrollment is enforced and alert you if it drifts - instead of relying on a one-time manual upload. ZestComply only reads your Okta policy configuration; it never modifies it."
      />

      {connectionQuery.isLoading && (
        <Card className="bg-card">
          <CardContent className="space-y-4 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {connectionQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {connectionQuery.error instanceof Error ? connectionQuery.error.message : "Failed to load connected systems."}
          </AlertDescription>
        </Alert>
      )}

      {!connectionQuery.isLoading && !connectionQuery.isError && (
        <>
          <form
            className="space-y-6"
            onSubmit={(event) => {
              event.preventDefault();
              saveMutation.mutate({
                provider: "okta",
                domain: form.domain || undefined,
                api_token: form.api_token || undefined,
                enabled: form.enabled,
              });
            }}
          >
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Okta</CardTitle>
                <CardDescription>
                  {isConfigured
                    ? "A connection is configured. Enter a new API token below only if you want to replace it."
                    : "Not connected yet - MFA enforcement won't be monitored until this is set up."}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label htmlFor="connection-enabled">Enabled</Label>
                    <p className="text-sm text-muted-foreground">Pause monitoring without losing the saved connection.</p>
                  </div>
                  <Switch
                    id="connection-enabled"
                    checked={form.enabled}
                    onCheckedChange={(checked) => setForm((c) => ({ ...c, enabled: checked }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="connection-domain">Okta domain</Label>
                  <Input
                    id="connection-domain"
                    placeholder="acme.okta.com"
                    value={form.domain}
                    onChange={(e) => setForm((c) => ({ ...c, domain: e.target.value }))}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="connection-token">API token</Label>
                  <Input
                    id="connection-token"
                    type="password"
                    placeholder={isConfigured ? "Leave blank to keep the current token" : "Okta API token (Admin > Security > API)"}
                    value={form.api_token}
                    onChange={(e) => setForm((c) => ({ ...c, api_token: e.target.value }))}
                  />
                </div>

                <div className="rounded-lg border border-border bg-muted/30 p-3">
                  <p className="text-xs font-medium text-foreground">Last check</p>
                  <div className="mt-1">
                    <StatusBadge status={connectionQuery.data?.last_check_status ?? null} />
                  </div>
                  {connectionQuery.data?.last_check_error && (
                    <p className="mt-1 text-xs text-destructive">{connectionQuery.data.last_check_error}</p>
                  )}
                  {connectionQuery.data?.last_check_at && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Checked {new Date(connectionQuery.data.last_check_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={!isConfigured || checkNowMutation.isPending}
                onClick={() => checkNowMutation.mutate()}
              >
                {checkNowMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Check now
              </Button>
              <Button type="submit" disabled={saveMutation.isPending || (!isConfigured && !form.domain)}>
                {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Connection
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
