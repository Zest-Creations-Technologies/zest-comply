import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDate } from "./monitoring-data";
import { useMonitoringData } from "./useMonitoringData";
import { MonitoringEmptyState } from "./MonitoringShared";

export default function ComplianceCalendarPage() {
  const { calendarEvents, isLoading } = useMonitoringData();
  const sortedEvents = [...calendarEvents].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Compliance Calendar</h1>
        <p className="text-muted-foreground">Review dates, audit dates, evidence expirations, assessments, and governance approval dates.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : calendarEvents.length === 0 ? (
        <MonitoringEmptyState title="No data yet" description="Review dates, audit dates, evidence expirations, assessments, and governance approvals will appear after real workflow data exists." />
      ) : (
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Compliance Events</CardTitle>
            <CardDescription>Upcoming compliance calendar items.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Framework</TableHead>
                  <TableHead>Owner</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{formatDate(event.date)}</TableCell>
                    <TableCell className="font-medium text-foreground">{event.title}</TableCell>
                    <TableCell><Badge variant="secondary">{event.type}</Badge></TableCell>
                    <TableCell>{event.framework}</TableCell>
                    <TableCell>{event.owner}</TableCell>
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
