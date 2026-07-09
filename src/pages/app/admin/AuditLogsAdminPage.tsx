import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Download, Loader2, ScrollText } from "lucide-react";
import { telemetryApi } from "@/lib/api";
import type { TelemetryEventType } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { AdminEmptyState, AdminPageHeader } from "./AdminShared";

const EVENT_TYPES: { value: TelemetryEventType; label: string }[] = [
  { value: "login_success", label: "Login success" },
  { value: "login_failure", label: "Login failure" },
  { value: "document_generated", label: "Document generated" },
  { value: "evidence_uploaded", label: "Evidence uploaded" },
  { value: "evidence_status_changed", label: "Evidence status changed" },
  { value: "evidence_expired", label: "Evidence expired" },
  { value: "api_error", label: "API error" },
  { value: "copilot_query", label: "ZestComply AI query" },
];

function formatEventType(type: string) {
  const known = EVENT_TYPES.find((t) => t.value === type);
  if (known) return known.label;
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function toneForEventType(type: TelemetryEventType): "default" | "destructive" | "outline" {
  if (type === "login_failure" || type === "api_error") return "destructive";
  if (type === "evidence_expired") return "outline";
  return "default";
}

export default function AuditLogsAdminPage() {
  const { toast } = useToast();
  const [eventType, setEventType] = useState<TelemetryEventType | "all">("all");
  const [isExporting, setIsExporting] = useState(false);

  const eventsQuery = useQuery({
    queryKey: ["admin", "audit-logs", eventType],
    queryFn: () =>
      telemetryApi.listOrgEvents({
        event_type: eventType === "all" ? undefined : eventType,
        limit: 100,
      }),
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await telemetryApi.downloadOrgEventsCsv({
        event_type: eventType === "all" ? undefined : eventType,
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const events = eventsQuery.data?.events ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <AdminPageHeader
          title="Audit Logs"
          description="Platform activity across logins, document generation, evidence lifecycle, and errors."
        />
        <Button onClick={handleExport} disabled={isExporting || eventsQuery.isLoading} variant="outline">
          {isExporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
          Download CSV
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Select value={eventType} onValueChange={(value) => setEventType(value as TelemetryEventType | "all")}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Filter by event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All event types</SelectItem>
            {EVENT_TYPES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {eventsQuery.data && (
          <p className="text-sm text-muted-foreground">{eventsQuery.data.total} total events</p>
        )}
      </div>

      {eventsQuery.isLoading && (
        <Card className="bg-card">
          <CardContent className="space-y-3 py-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      )}

      {eventsQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {eventsQuery.error instanceof Error
              ? eventsQuery.error.message
              : "Failed to load audit logs. This page requires staff or admin access."}
          </AlertDescription>
        </Alert>
      )}

      {!eventsQuery.isLoading && !eventsQuery.isError && events.length === 0 && (
        <AdminEmptyState
          icon={ScrollText}
          title="No activity recorded yet"
          description="Audit events will appear here as users take actions across the platform - logins, document generation, evidence uploads, and errors."
        />
      )}

      {!eventsQuery.isLoading && !eventsQuery.isError && events.length > 0 && (
        <Card className="bg-card">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(event.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={toneForEventType(event.event_type)}>
                        {formatEventType(event.event_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {event.user_id ? event.user_id.slice(0, 8) : "—"}
                    </TableCell>
                    <TableCell className="text-sm">{event.message ?? "—"}</TableCell>
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
