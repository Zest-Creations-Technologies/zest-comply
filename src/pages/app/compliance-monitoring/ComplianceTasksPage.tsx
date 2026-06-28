import { MetricCard, TasksTable } from "./MonitoringShared";
import { complianceTasks } from "./monitoring-data";

export default function ComplianceTasksPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Compliance Tasks</h1>
        <p className="text-muted-foreground">Assigned work for evidence, control remediation, policy review, audit readiness, and governance follow-up.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Open Tasks" value={complianceTasks.filter((task) => task.status !== "Complete").length} />
        <MetricCard label="High Priority" value={complianceTasks.filter((task) => task.priority === "High").length} />
        <MetricCard label="Blocked" value={complianceTasks.filter((task) => task.status === "Blocked").length} />
        <MetricCard label="In Progress" value={complianceTasks.filter((task) => task.status === "In Progress").length} />
      </div>
      <TasksTable tasks={complianceTasks} />
    </div>
  );
}
