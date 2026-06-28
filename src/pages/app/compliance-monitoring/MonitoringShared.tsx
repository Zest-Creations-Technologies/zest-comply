import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ComplianceTask, FrameworkHealth, MonitoringAlert, MonitoringStatus, TaskPriority } from "./monitoring-data";
import { formatDate } from "./monitoring-data";

const statusLabel: Record<MonitoringStatus, string> = {
  healthy: "Healthy",
  watch: "Watch",
  at_risk: "At Risk",
  overdue: "Overdue",
};

const statusVariant: Record<MonitoringStatus, "default" | "secondary" | "destructive" | "outline"> = {
  healthy: "default",
  watch: "secondary",
  at_risk: "destructive",
  overdue: "destructive",
};

const priorityVariant: Record<TaskPriority, "default" | "secondary" | "destructive" | "outline"> = {
  High: "destructive",
  Medium: "secondary",
  Low: "outline",
};

export function MonitoringStatusBadge({ status }: { status: MonitoringStatus }) {
  return <Badge variant={statusVariant[status]}>{statusLabel[status]}</Badge>;
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return <Badge variant={priorityVariant[priority]}>{priority}</Badge>;
}

export function MetricCard({ label, value, description }: { label: string; value: string | number; description?: string }) {
  return (
    <Card className="bg-card">
      <CardHeader className="pb-3">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardHeader>
    </Card>
  );
}

export function MonitoringEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-card">
      <CardContent className="py-10">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function SimpleProgressList({ title, description, rows }: { title: string; description: string; rows: { label: string; value: number }[] }) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.map((row) => (
          <div key={row.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="font-medium text-foreground">{row.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: `${row.value}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function FrameworkTable({ frameworks }: { frameworks: FrameworkHealth[] }) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Framework Health</CardTitle>
        <CardDescription>Framework, control set, requirement, and evidence readiness.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Framework</TableHead>
              <TableHead>Overall Percentage</TableHead>
              <TableHead>Requirements Complete</TableHead>
              <TableHead>Requirements Missing</TableHead>
              <TableHead>Evidence Coverage</TableHead>
              <TableHead>Last Assessment</TableHead>
              <TableHead>Next Review</TableHead>
              <TableHead>Monitoring Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {frameworks.map((framework) => (
              <TableRow key={framework.name}>
                <TableCell className="font-medium text-foreground">{framework.name}</TableCell>
                <TableCell>{framework.overallPercentage}%</TableCell>
                <TableCell>{framework.controlsComplete}</TableCell>
                <TableCell>{framework.controlsMissing}</TableCell>
                <TableCell>{framework.evidenceCoverage}%</TableCell>
                <TableCell>{formatDate(framework.lastAssessmentDate)}</TableCell>
                <TableCell>{formatDate(framework.nextReviewDate)}</TableCell>
                <TableCell><MonitoringStatusBadge status={framework.status} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function AlertsTable({ alerts }: { alerts: MonitoringAlert[] }) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Monitoring Alerts</CardTitle>
        <CardDescription>Open compliance signals that need attention.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Alert</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Framework</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id}>
                <TableCell className="font-medium text-foreground">{alert.title}</TableCell>
                <TableCell>{alert.type}</TableCell>
                <TableCell>{alert.framework}</TableCell>
                <TableCell>{alert.owner}</TableCell>
                <TableCell>{formatDate(alert.dueDate)}</TableCell>
                <TableCell><PriorityBadge priority={alert.severity} /></TableCell>
                <TableCell>{alert.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function TasksTable({ tasks }: { tasks: ComplianceTask[] }) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Compliance Tasks</CardTitle>
        <CardDescription>Assigned remediation and review work.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Title</TableHead>
              <TableHead>Assigned Owner</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Related Framework</TableHead>
              <TableHead>Related Control Set / Requirement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium text-foreground">{task.title}</TableCell>
                <TableCell>{task.assignedOwner}</TableCell>
                <TableCell>{formatDate(task.dueDate)}</TableCell>
                <TableCell><PriorityBadge priority={task.priority} /></TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>{task.relatedFramework}</TableCell>
                <TableCell>{task.relatedPackageControl}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
