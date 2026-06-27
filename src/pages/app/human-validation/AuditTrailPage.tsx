import { Link, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { humanValidationApi } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { auditEventLabels, EmptyState, formatDateTime, PageSkeleton, StatusBadge } from "./shared";

export default function AuditTrailPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();

  const profileQuery = useQuery({
    queryKey: ["human-validation", "profile", profileId],
    queryFn: () => humanValidationApi.getProfile(profileId!),
    enabled: !!profileId,
  });

  const auditQuery = useQuery({
    queryKey: ["human-validation", "audit", profileId],
    queryFn: () => humanValidationApi.getAuditTrail(profileId!),
    enabled: !!profileId,
  });

  const events = auditQuery.data ?? [];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(`/app/human-validation/approvals/${profileId}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Approval
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Audit Trail</h1>
          <p className="text-muted-foreground">Chronological governance events for this validation profile.</p>
        </div>
        {profileQuery.data && <StatusBadge status={profileQuery.data.status} />}
      </div>

      {(profileQuery.isLoading || auditQuery.isLoading) && <PageSkeleton />}

      {(profileQuery.isError || auditQuery.isError) && (
        <Alert variant="destructive">
          <AlertDescription>
            {profileQuery.error instanceof Error
              ? profileQuery.error.message
              : auditQuery.error instanceof Error
              ? auditQuery.error.message
              : "Failed to load audit trail."}
          </AlertDescription>
        </Alert>
      )}

      {!profileQuery.isLoading && !auditQuery.isLoading && !profileQuery.isError && !auditQuery.isError && events.length === 0 && (
        <EmptyState title="No audit events yet" description="Audit events will appear as this profile moves through review and approval." />
      )}

      {!profileQuery.isLoading && !auditQuery.isLoading && events.length > 0 && (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Events</CardTitle>
            <CardDescription>{events.length} recorded event{events.length === 1 ? "" : "s"}.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Status Change</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">{auditEventLabels[event.event_type]}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {event.from_status && <StatusBadge status={event.from_status} />}
                        {event.from_status && event.to_status && <span className="text-muted-foreground">to</span>}
                        {event.to_status && <StatusBadge status={event.to_status} />}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground break-all">{event.actor_user_id || "System"}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(event.created_at)}</TableCell>
                    <TableCell className="text-muted-foreground">{event.message || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link to="/app/human-validation/review-queue">Review Queue</Link>
        </Button>
      </div>
    </div>
  );
}
