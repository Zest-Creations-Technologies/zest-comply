import { Loader2 } from "lucide-react";
import { AlertsTable, MonitoringEmptyState } from "./MonitoringShared";
import { useMonitoringData } from "./useMonitoringData";

export default function MonitoringAlertsPage() {
  const { monitoringAlerts, isLoading } = useMonitoringData();

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Monitoring Alerts</h1>
        <p className="text-muted-foreground">Compliance signals for missing evidence, expiring evidence, reviews, approvals, failed controls, and framework updates.</p>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : monitoringAlerts.length === 0 ? (
        <MonitoringEmptyState title="No data yet" description="Connect data sources to begin monitoring missing evidence, overdue approvals, failed requirements, and framework updates." />
      ) : (
        <AlertsTable alerts={monitoringAlerts} />
      )}
    </div>
  );
}
