import { AlertsTable, MonitoringEmptyState } from "./MonitoringShared";
import { monitoringAlerts } from "./monitoring-data";

export default function MonitoringAlertsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Monitoring Alerts</h1>
        <p className="text-muted-foreground">Compliance signals for missing evidence, expiring evidence, reviews, approvals, failed controls, and framework updates.</p>
      </div>
      {monitoringAlerts.length === 0 ? (
        <MonitoringEmptyState title="No data yet" description="Connect data sources to begin monitoring missing evidence, overdue approvals, failed requirements, and framework updates." />
      ) : (
        <AlertsTable alerts={monitoringAlerts} />
      )}
    </div>
  );
}
