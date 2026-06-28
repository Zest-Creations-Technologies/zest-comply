import { FrameworkTable, MonitoringEmptyState, SimpleProgressList } from "./MonitoringShared";
import { frameworkHealth } from "./monitoring-data";

export default function FrameworkHealthPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Framework Health</h1>
        <p className="text-muted-foreground">Monitor any framework or control set using requirement completion, evidence coverage, assessment dates, and monitoring status.</p>
      </div>
      {frameworkHealth.length === 0 ? (
        <MonitoringEmptyState title="No data yet" description="Create an assessment or connect monitoring data to start tracking framework and control set health." />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <SimpleProgressList title="Overall Percentage" description="Framework-level compliance score." rows={frameworkHealth.map((item) => ({ label: item.name, value: item.overallPercentage }))} />
            <SimpleProgressList title="Evidence Coverage" description="Evidence coverage supporting framework requirements." rows={frameworkHealth.map((item) => ({ label: item.name, value: item.evidenceCoverage }))} />
          </div>
          <FrameworkTable frameworks={frameworkHealth} />
        </>
      )}
    </div>
  );
}
