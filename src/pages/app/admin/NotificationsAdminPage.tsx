import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { adminSettingsApi } from "@/lib/api";
import type { AdminNotificationSettings } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AdminPageHeader } from "./AdminShared";

export default function NotificationsAdminPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [form, setForm] = useState({
    email_alerts_enabled: true,
    evidence_expiration_alerts: true,
    alert_days_before_expiration: 7,
  });

  const notificationsQuery = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: adminSettingsApi.getNotifications,
  });

  useEffect(() => {
    const data = notificationsQuery.data;
    if (!data) return;
    setForm({
      email_alerts_enabled: data.email_alerts_enabled,
      evidence_expiration_alerts: data.evidence_expiration_alerts,
      alert_days_before_expiration: data.alert_days_before_expiration,
    });
  }, [notificationsQuery.data]);

  const mutation = useMutation({
    mutationFn: () => {
      const payload: AdminNotificationSettings = {
        user_id: notificationsQuery.data?.user_id ?? "",
        email_alerts_enabled: form.email_alerts_enabled,
        evidence_expiration_alerts: form.evidence_expiration_alerts,
        alert_days_before_expiration: form.alert_days_before_expiration,
      };
      return adminSettingsApi.updateNotifications(payload);
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "notifications"], data);
      toast({ title: "Notification settings saved", description: "Alert preferences were updated." });
    },
    onError: (error) => {
      toast({
        title: "Could not save notification settings",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        title="Notifications"
        description="Control email alerts for evidence expiration and other compliance deadlines."
      />

      {notificationsQuery.isLoading && (
        <Card className="bg-card">
          <CardContent className="space-y-4 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {notificationsQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {notificationsQuery.error instanceof Error
              ? notificationsQuery.error.message
              : "Failed to load notification settings."}
          </AlertDescription>
        </Alert>
      )}

      {!notificationsQuery.isLoading && !notificationsQuery.isError && (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            mutation.mutate();
          }}
        >
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Email Alerts</CardTitle>
              <CardDescription>
                Choose when ZestComply should email you about compliance evidence.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="email-alerts-enabled">Email alerts enabled</Label>
                  <p className="text-sm text-muted-foreground">
                    Master switch for all compliance email alerts.
                  </p>
                </div>
                <Switch
                  id="email-alerts-enabled"
                  checked={form.email_alerts_enabled}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({ ...current, email_alerts_enabled: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <Label htmlFor="evidence-expiration-alerts">Evidence expiration alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Email me when evidence is approaching its expiration date.
                  </p>
                </div>
                <Switch
                  id="evidence-expiration-alerts"
                  checked={form.evidence_expiration_alerts}
                  disabled={!form.email_alerts_enabled}
                  onCheckedChange={(checked) =>
                    setForm((current) => ({ ...current, evidence_expiration_alerts: checked }))
                  }
                />
              </div>

              <div className="grid gap-2 md:max-w-xs">
                <Label htmlFor="alert-days-before">Alert days before expiration</Label>
                <Input
                  id="alert-days-before"
                  type="number"
                  min={1}
                  max={90}
                  value={form.alert_days_before_expiration}
                  disabled={!form.email_alerts_enabled || !form.evidence_expiration_alerts}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      alert_days_before_expiration: Number(event.target.value) || 1,
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  Send the alert this many days before evidence expires (1-90).
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Notification Settings
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
