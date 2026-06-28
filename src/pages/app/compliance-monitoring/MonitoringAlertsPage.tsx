import { AlertsTable, MetricCard } from "./MonitoringShared";
import { monitoringAlerts } from "./monitoring-data";

export default function MonitoringAlertsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Monitoring Alerts</h1>
        <p className="text-muted-foreground">Compliance signals for missing evidence, expiring evidence, reviews, approvals, failed controls, and framework updates.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Open Alerts" value={monitoringAlerts.filter((alert) => alert.status === "Open").length} />
        <MetricCard label="High Severity" value={monitoringAlerts.filter((alert) => alert.severity === "High").length} />
        <MetricCard label="In Review" value={monitoringAlerts.filter((alert) => alert.status === "In Review").length} />
        <MetricCard label="Framework Updates" value={monitoringAlerts.filter((alert) => alert.type === "Framework update available").length} />
      </div>
      <AlertsTable alerts={monitoringAlerts} />
    </div>
  );
}
