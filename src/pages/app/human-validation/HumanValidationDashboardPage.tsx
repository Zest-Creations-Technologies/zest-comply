import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { humanValidationApi, type HumanValidationStatus } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ClipboardCheck, FileCheck2, ListChecks, ShieldCheck, UserCheck } from "lucide-react";
import { EmptyState, formatDateTime, PageSkeleton, profileTitle, StatusBadge } from "./shared";

const activeStatuses: HumanValidationStatus[] = ["submitted", "in_review"];

export default function HumanValidationDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["human-validation", "queue"],
    queryFn: humanValidationApi.getQueue,
  });

  const profiles = data?.profiles ?? [];
  const stats = useMemo(() => {
    return {
      total: profiles.length,
      active: profiles.filter((profile) => activeStatuses.includes(profile.status)).length,
      changesRequested: profiles.filter((profile) => profile.status === "changes_requested").length,
      approved: profiles.filter((profile) => profile.status === "approved" || profile.status === "signed_off").length,
    };
  }, [profiles]);

  const recentProfiles = profiles.slice(0, 5);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Human Validation</h1>
          <p className="text-muted-foreground">Review, approve, and track governance activity for generated compliance work.</p>
        </div>
        <Button asChild>
          <Link to="/app/human-validation/company-profile">Create Profile</Link>
        </Button>
      </div>

      {isLoading && <PageSkeleton />}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{error instanceof Error ? error.message : "Failed to load validation dashboard."}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardDescription>Total Profiles</CardDescription>
                <CardTitle className="flex items-center gap-2 text-3xl"><ClipboardCheck className="h-6 w-6 text-primary" />{stats.total}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardDescription>In Review</CardDescription>
                <CardTitle className="flex items-center gap-2 text-3xl"><ListChecks className="h-6 w-6 text-primary" />{stats.active}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardDescription>Changes Requested</CardDescription>
                <CardTitle className="flex items-center gap-2 text-3xl"><FileCheck2 className="h-6 w-6 text-primary" />{stats.changesRequested}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card">
              <CardHeader className="pb-2">
                <CardDescription>Approved</CardDescription>
                <CardTitle className="flex items-center gap-2 text-3xl"><ShieldCheck className="h-6 w-6 text-primary" />{stats.approved}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {profiles.length === 0 ? (
            <EmptyState title="No validation profiles yet" description="Create a company validation profile when a package is ready for human review." />
          ) : (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Recent Validation Work</CardTitle>
                <CardDescription>Latest profiles that need governance attention.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentProfiles.map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between gap-4 rounded-md border border-border p-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">{profileTitle(profile)}</p>
                        <p className="text-sm text-muted-foreground">Updated {formatDateTime(profile.updated_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusBadge status={profile.status} />
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/app/human-validation/approvals/${profile.id}`}>Open</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
