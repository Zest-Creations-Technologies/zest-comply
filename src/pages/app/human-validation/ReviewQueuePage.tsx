import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { humanValidationApi } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, formatDateTime, PageSkeleton, profileTitle, StatusBadge } from "./shared";

export default function ReviewQueuePage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["human-validation", "queue"],
    queryFn: humanValidationApi.getQueue,
  });

  const profiles = data?.profiles ?? [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Review Queue</h1>
        <p className="text-muted-foreground">Track validation profiles assigned to you or owned by you.</p>
      </div>

      {isLoading && <PageSkeleton />}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{error instanceof Error ? error.message : "Failed to load review queue."}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && profiles.length === 0 && (
        <EmptyState title="Review queue is empty" description="Profiles submitted for review will appear here." />
      )}

      {!isLoading && !isError && profiles.length > 0 && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Validation Profiles</CardTitle>
            <CardDescription>{profiles.length} profile{profiles.length === 1 ? "" : "s"} available.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profiles.map((profile) => (
                  <TableRow key={profile.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{profileTitle(profile)}</p>
                        <p className="text-xs text-muted-foreground">Session {profile.conversation_session_id}</p>
                      </div>
                    </TableCell>
                    <TableCell><StatusBadge status={profile.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(profile.updated_at)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={`/app/human-validation/audit/${profile.id}`}>Audit</Link>
                      </Button>
                      <Button asChild size="sm">
                        <Link to={`/app/human-validation/approvals/${profile.id}`}>Review</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
