import { Loader2 } from "lucide-react";
import { AlertsTable, FrameworkTable, MonitoringEmptyState, SimpleProgressList, TasksTable } from "./MonitoringShared";
import { useMonitoringData } from "./useMonitoringData";

export default function ComplianceMonitoringDashboardPage() {
  const { frameworkHealth, monitoringAlerts, complianceTasks, calendarEvents, isLoading } = useMonitoringData();
  const hasMonitoringData = frameworkHealth.length > 0 || monitoringAlerts.length > 0 || complianceTasks.length > 0 || calendarEvents.length > 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Compliance Monitoring</h1>
        <p className="text-muted-foreground">Continuous compliance signals across frameworks, control sets, requirements, evidence, governance, and review calendars.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
      ) : !hasMonitoringData ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <MonitoringEmptyState title="No data yet" description="Connect data sources to begin monitoring framework health, requirements, evidence coverage, and open risks." />
          <MonitoringEmptyState title="Create an assessment to start tracking compliance" description="Assessment, evidence, and governance activity will populate monitoring once real workflow data exists." />
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
}
