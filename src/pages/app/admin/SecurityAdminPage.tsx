import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { adminSettingsApi } from "@/lib/api";
import type { PlatformSettings } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { AdminPageHeader } from "./AdminShared";

export default function SecurityAdminPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [requireMfa, setRequireMfa] = useState(false);

  const settingsQuery = useQuery({
    queryKey: ["admin", "platform-settings"],
    queryFn: adminSettingsApi.getPlatformSettings,
  });

  useEffect(() => {
    if (settingsQuery.data) {
      setRequireMfa(settingsQuery.data.require_mfa);
    }
  }, [settingsQuery.data]);

  const mutation = useMutation({
    mutationFn: (payload: PlatformSettings) => adminSettingsApi.updatePlatformSettings(payload),
    onSuccess: (data) => {
      queryClient.setQueryData(["admin", "platform-settings"], data);
      setRequireMfa(data.require_mfa);
      toast({
        title: "Security settings saved",
        description: data.require_mfa
          ? "Multi-factor authentication is now required for every user."
          : "Multi-factor authentication is no longer organization-enforced.",
      });
    },
    onError: (error) => {
      setRequireMfa(settingsQuery.data?.require_mfa ?? false);
      toast({
        title: "Could not save security settings",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <AdminPageHeader
        eyebrow="Platform"
        title="Security"
        description="Organization-wide authentication requirements for every user on this workspace."
      />

      {settingsQuery.isLoading && (
        <Card className="bg-card">
          <CardContent className="space-y-4 py-6">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {settingsQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {settingsQuery.error instanceof Error
              ? settingsQuery.error.message
              : "Failed to load security settings. Administrator privileges are required to view this page."}
          </AlertDescription>
        </Alert>
      )}

      {!settingsQuery.isLoading && !settingsQuery.isError && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Multi-Factor Authentication</CardTitle>
            <CardDescription>
              When enabled, every user is required to verify a one-time code by email on their next
              login. Users who haven't set up MFA yet are enrolled automatically the next time they
              sign in.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <Label htmlFor="require-mfa">Require MFA for all users</Label>
                <p className="text-sm text-muted-foreground">
                  Enforces email-based one-time codes organization-wide.
                </p>
              </div>
              <Switch
                id="require-mfa"
                checked={requireMfa}
                disabled={mutation.isPending}
                onCheckedChange={(checked) => {
                  setRequireMfa(checked);
                  mutation.mutate({ require_mfa: checked });
                }}
              />
            </div>
            {mutation.isPending && (
              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
