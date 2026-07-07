import { Link } from "react-router-dom";
import { Archive, ArrowRight, Bot, FileCheck2, FileSearch, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toneFor } from "@/lib/tone-palette";
import { BreakdownBarChart, MonthlyTrendChart, StatCallout } from "@/components/app/dashboard-charts";
import { useAssessmentTrend, useComplianceKpis, useConversationsCount, usePackagesStats } from "@/hooks/useDashboardStats";

const quickLinks = [
  { title: "Assessments", href: "/app/assistant", icon: Bot },
  { title: "Packages", href: "/app/packages", icon: Package },
  { title: "Repository", href: "/app/compliance-repository", icon: Archive },
  { title: "Evidence", href: "/app/evidence", icon: FileCheck2 },
  { title: "Monitoring", href: "/app/compliance-monitoring", icon: FileSearch },
];

export default function ComplianceWorkspacePage() {
  const conversationsCount = useConversationsCount();
  const packagesStats = usePackagesStats();
  const complianceKpis = useComplianceKpis();
  const assessmentTrend = useAssessmentTrend();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d8b45d] via-[#f0d990] to-[#98d8c5]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a622b]">Workspace</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Compliance</h1>
            <p className="text-slate-600">Run assessments, manage packages, maintain evidence, and monitor framework readiness.</p>
          </div>
          <Button asChild size="lg" className="shadow-lg shadow-primary/20">
            <Link to="/app/assistant">
              Start Assessment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCallout label="Assessments started" value={conversationsCount.data ?? 0} tone="gold" size="lg" />
        <StatCallout label="Completion rate" value={`${complianceKpis.data?.completionRate ?? 0}%`} tone="teal" size="lg" />
        <StatCallout label="Avg processing time" value={`${complianceKpis.data?.avgProcessingDays ?? 0}d`} tone="gold" size="lg" />
        <StatCallout label="Packages generated" value={packagesStats.data?.total ?? 0} tone="teal" size="lg" />
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
        <CardHeader>
          <CardTitle className="text-slate-950">Assessments started + completed</CardTitle>
        </CardHeader>
        <CardContent>
          <MonthlyTrendChart
            data={assessmentTrend.data ?? []}
            emptyLabel="No assessments yet - start one to see monthly trends here."
          />
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
        <CardHeader>
          <CardTitle className="text-slate-950">Packages by framework</CardTitle>
        </CardHeader>
        <CardContent>
          <BreakdownBarChart
            data={packagesStats.data?.breakdown ?? []}
            tone="gold"
            emptyLabel="No packages generated yet - start an assessment to generate your first one."
          />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold text-slate-950 mb-4">Quick links</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {quickLinks.map((link, index) => {
            const tone = toneFor(index);
            return (
              <Link
                key={link.title}
                to={link.href}
                className={`group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 shadow-sm shadow-slate-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${tone.ring}`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 ${tone.box} ${tone.icon}`}>
                  <link.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-slate-900">{link.title}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
