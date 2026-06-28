import { AlertsTable, FrameworkTable, MetricCard, SimpleProgressList, TasksTable } from "./MonitoringShared";
import { calendarEvents, complianceTasks, frameworkHealth, monitoringAlerts } from "./monitoring-data";

export default function ComplianceMonitoringDashboardPage() {
  const totalComplete = frameworkHealth.reduce((sum, item) => sum + item.controlsComplete, 0);
  const totalMissing = frameworkHealth.reduce((sum, item) => sum + item.controlsMissing, 0);
  const overall = Math.round(frameworkHealth.reduce((sum, item) => sum + item.overallPercentage, 0) / frameworkHealth.length);
  const evidenceCoverage = Math.round(frameworkHealth.reduce((sum, item) => sum + item.evidenceCoverage, 0) / frameworkHealth.length);
  const failing = frameworkHealth.filter((item) => item.status === "at_risk" || item.status === "overdue").length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Compliance Monitoring</h1>
        <p className="text-muted-foreground">Continuous compliance signals across frameworks, control sets, requirements, evidence, governance, and review calendars.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard label="Overall Compliance Score" value={`${overall}%`} />
        <MetricCard label="Framework Health" value={`${frameworkHealth.length - failing}/${frameworkHealth.length}`} />
        <MetricCard label="Requirements Passing" value={totalComplete} />
        <MetricCard label="Requirements Failing" value={totalMissing} />
        <MetricCard label="Evidence Coverage" value={`${evidenceCoverage}%`} />
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <MetricCard label="Upcoming Reviews" value={calendarEvents.filter((event) => event.type === "Review").length} />
        <MetricCard label="Expiring Evidence" value={monitoringAlerts.filter((alert) => alert.type === "Evidence expiring soon").length} />
        <MetricCard label="Missing Evidence" value={monitoringAlerts.filter((alert) => alert.type === "Missing evidence").length} />
        <MetricCard label="Pending Governance Approvals" value={monitoringAlerts.filter((alert) => alert.type === "Approval overdue").length} />
        <MetricCard label="Open Risks" value={monitoringAlerts.filter((alert) => alert.status !== "Resolved").length} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SimpleProgressList
          title="Framework Health"
          description="Overall readiness by framework or control set."
          rows={frameworkHealth.map((framework) => ({ label: framework.name, value: framework.overallPercentage }))}
        />
        <SimpleProgressList
          title="Evidence Coverage"
          description="Evidence completeness by framework or control set."
          rows={frameworkHealth.map((framework) => ({ label: framework.name, value: framework.evidenceCoverage }))}
        />
      </div>

      <AlertsTable alerts={monitoringAlerts.slice(0, 5)} />
      <TasksTable tasks={complianceTasks.slice(0, 4)} />
      <FrameworkTable frameworks={frameworkHealth.slice(0, 4)} />
    </div>
  );
}
