import { MonitoringEmptyState, TasksTable } from "./MonitoringShared";
import { complianceTasks } from "./monitoring-data";

export default function ComplianceTasksPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Compliance Tasks</h1>
        <p className="text-muted-foreground">Assigned work for evidence, control remediation, policy review, audit readiness, and governance follow-up.</p>
      </div>
      {complianceTasks.length === 0 ? (
        <MonitoringEmptyState title="No data yet" description="Compliance tasks will appear after assessments, evidence reviews, or monitoring alerts create work." />
      ) : (
        <TasksTable tasks={complianceTasks} />
      )}
    </div>
  );
}
