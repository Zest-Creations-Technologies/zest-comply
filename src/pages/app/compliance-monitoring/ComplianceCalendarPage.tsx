import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { calendarEvents, formatDate } from "./monitoring-data";

export default function ComplianceCalendarPage() {
  const sortedEvents = [...calendarEvents].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Compliance Calendar</h1>
        <p className="text-muted-foreground">Review dates, audit dates, evidence expirations, assessments, and governance approval dates.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {["Review", "Audit", "Evidence Expiration", "Assessment", "Governance Approval"].map((type) => (
          <Card key={type} className="bg-card">
            <CardHeader className="pb-3">
              <CardDescription>{type}</CardDescription>
              <CardTitle className="text-3xl">{calendarEvents.filter((event) => event.type === type).length}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>

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
    </div>
  );
}
