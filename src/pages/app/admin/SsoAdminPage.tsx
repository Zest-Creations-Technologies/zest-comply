import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ssoApi } from "@/lib/api";
import type { SsoConfigUpdate } from "@/lib/api";
import { API_CONFIG } from "@/lib/api/config";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AdminPageHeader } from "./AdminShared";

export default function SsoAdminPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({
    domain: "",
    provider_name: "",
    issuer: "",
    client_id: "",
    client_secret: "",
    enabled: false,
  });

  const configQuery = useQuery({
    queryKey: ["admin", "sso-config"],
    queryFn: ssoApi.getConfig,
  });

  useEffect(() => {
    const data = configQuery.data;
    if (!data) return;
    setForm((current) => ({
      ...current,
      domain: data.domain ?? "",
      provider_name: data.provider_name ?? "",
      issuer: data.issuer ?? "",
      client_id: data.client_id ?? "",
      enabled: data.enabled,
      // client_secret is intentionally not echoed back by the API once set
      // - leave blank unless the admin re-enters it.
    }));
  }, [configQuery.data]);

  const isConfigured = Boolean(configQuery.data?.issuer);

  const mutation = useMutation({
    mutationFn: (payload: SsoConfigUpdate) => ssoApi.updateConfig(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "sso-config"], data);
      toast({ title: "SSO connection saved", description: "Employees with a matching email domain can now sign in with your identity provider." });
    },
    onError: (error) => {
      toast({
        title: "Could not save SSO settings",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const redirectUri = `${API_CONFIG.baseUrl}/auth/sso/callback`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Single Sign-On"
        description="Let your team sign in with your own identity provider (Okta, Azure AD, Google Workspace, or any standard OIDC provider). This is additive - password sign-in always stays available too."
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
            {configQuery.error instanceof Error ? configQuery.error.message : "Failed to load SSO settings."}
          </AlertDescription>
        </Alert>
      )}

      {!configQuery.isLoading && !configQuery.isError && (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate({
              domain: form.domain || undefined,
              provider_name: form.provider_name || undefined,
              issuer: form.issuer || undefined,
              client_id: form.client_id || undefined,
              client_secret: form.client_secret || undefined,
              enabled: form.enabled,
            });
          }}
        >
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Identity Provider Connection</CardTitle>
              <CardDescription>
                {isConfigured
                  ? "A connection is configured. Enter new values below only for fields you want to replace."
                  : "Not configured yet - employees will only be able to sign in with a password until this is set up."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="sso-enabled">Enabled</Label>
                  <p className="text-sm text-muted-foreground">Turn SSO on or off without losing the saved connection.</p>
                </div>
                <Switch
                  id="sso-enabled"
                  checked={form.enabled}
                  onCheckedChange={(checked) => setForm((c) => ({ ...c, enabled: checked }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sso-domain">Email domain</Label>
                <Input
                  id="sso-domain"
                  placeholder="acme.com"
                  value={form.domain}
                  onChange={(e) => setForm((c) => ({ ...c, domain: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Employees whose email ends in this domain will be routed to your identity provider at sign-in.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sso-provider-name">Provider name</Label>
                <Input
                  id="sso-provider-name"
                  placeholder="Okta, Azure AD, Google Workspace..."
                  value={form.provider_name}
                  onChange={(e) => setForm((c) => ({ ...c, provider_name: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sso-issuer">Issuer URL</Label>
                <Input
                  id="sso-issuer"
                  placeholder="https://your-org.okta.com"
                  value={form.issuer}
                  onChange={(e) => setForm((c) => ({ ...c, issuer: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  We fetch <code>{"{issuer}/.well-known/openid-configuration"}</code> to discover the rest automatically.
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sso-client-id">Client ID</Label>
                <Input
                  id="sso-client-id"
                  placeholder={isConfigured ? "Leave blank to keep the current client ID" : "Client ID from your identity provider"}
                  value={form.client_id}
                  onChange={(e) => setForm((c) => ({ ...c, client_id: e.target.value }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="sso-client-secret">Client secret</Label>
                <Input
                  id="sso-client-secret"
                  type="password"
                  placeholder={isConfigured ? "Leave blank to keep the current secret" : "Client secret from your identity provider"}
                  value={form.client_secret}
                  onChange={(e) => setForm((c) => ({ ...c, client_secret: e.target.value }))}
                />
              </div>

              <div className="rounded-lg border border-border bg-muted/30 p-3">
                <p className="text-xs font-medium text-foreground">Redirect URI to register with your identity provider</p>
                <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{redirectUri}</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending || (!isConfigured && !form.issuer)}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save SSO Settings
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
