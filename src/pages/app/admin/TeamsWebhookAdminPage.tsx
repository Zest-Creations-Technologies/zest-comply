import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";
import { teamsWebhookApi } from "@/lib/api";
import type { OrgTeamsWebhookUpdate } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AdminPageHeader } from "./AdminShared";

export default function TeamsWebhookAdminPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({ webhook_url: "", enabled: true });

  const webhookQuery = useQuery({
    queryKey: ["admin", "teams-webhook"],
    queryFn: teamsWebhookApi.get,
  });

  useEffect(() => {
    const data = webhookQuery.data;
    if (!data) return;
    setForm((current) => ({
      ...current,
      enabled: data.enabled,
      // webhook_url is intentionally never echoed back by the API once set -
      // leave blank unless the admin re-enters it.
    }));
  }, [webhookQuery.data]);

  const isConfigured = Boolean(webhookQuery.data?.has_webhook);

  const saveMutation = useMutation({
    mutationFn: (payload: OrgTeamsWebhookUpdate) => teamsWebhookApi.update(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "teams-webhook"], data);
      setForm((c) => ({ ...c, webhook_url: "" }));
      toast({ title: "Teams webhook saved", description: "Alerts will now be posted to this channel." });
    },
    onError: (error) => {
      toast({
        title: "Could not save webhook",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const testMutation = useMutation({
    mutationFn: () => teamsWebhookApi.test(),
    onSuccess: () => {
      toast({ title: "Test message sent", description: "Check your Teams channel for a sample alert card." });
    },
    onError: (error) => {
      toast({
        title: "Test message failed",
        description: error instanceof Error ? error.message : "Teams did not accept the message.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Microsoft Teams Notifications"
        description="Post ZestComply alerts (evidence pending review, coverage drops, policy approvals) straight to a Teams channel. Uses a Teams Workflows webhook you create in your own tenant - ZestComply only ever posts to it, nothing else."
      />

      {webhookQuery.isLoading && (
        <Card className="bg-card">
          <CardContent className="space-y-4 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {webhookQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {webhookQuery.error instanceof Error ? webhookQuery.error.message : "Failed to load Teams webhook settings."}
          </AlertDescription>
        </Alert>
      )}

      {!webhookQuery.isLoading && !webhookQuery.isError && (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate({
              webhook_url: form.webhook_url || undefined,
              enabled: form.enabled,
            });
          }}
        >
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Teams webhook</CardTitle>
              <CardDescription>
                {isConfigured
                  ? "A webhook is configured. Enter a new URL below only if you want to replace it."
                  : "Not connected yet - alerts won't be posted to Teams until this is set up."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="teams-webhook-enabled">Enabled</Label>
                  <p className="text-sm text-muted-foreground">Pause notifications without losing the saved webhook.</p>
                </div>
                <Switch
                  id="teams-webhook-enabled"
                  checked={form.enabled}
                  onCheckedChange={(checked) => setForm((c) => ({ ...c, enabled: checked }))}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="teams-webhook-url">Webhook URL</Label>
                <Input
                  id="teams-webhook-url"
                  type="password"
                  placeholder={isConfigured ? "Leave blank to keep the current webhook" : "https://... (from Teams Workflows)"}
                  value={form.webhook_url}
                  onChange={(e) => setForm((c) => ({ ...c, webhook_url: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  In Teams: open the target channel, choose "Workflows" &rarr; "Post to a channel when a webhook request is received", then paste the generated URL here.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              disabled={!isConfigured || testMutation.isPending}
              onClick={() => testMutation.mutate()}
            >
              {testMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              Send test message
            </Button>
            <Button type="submit" disabled={saveMutation.isPending || (!isConfigured && !form.webhook_url)}>
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Webhook
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
