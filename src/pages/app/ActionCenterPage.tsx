import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bell, FileCheck2, Gauge, MessageSquare, Radar, ShieldCheck } from "lucide-react";
import { toneFor } from "@/lib/tone-palette";
import { ActivityBarChart, ActivityFeed, BreakdownBarChart, DonutBreakdown, GaugeMeter, MiniCalendar, StatRing, TrendBadge } from "@/components/app/dashboard-charts";
import { useActivityTrend, useComplianceKpis, useCompletionTrend, useDailyActivityTrend, usePhaseBreakdown, usePlanUsageStats, useRecentActivity, useValidationQueueStats } from "@/hooks/useDashboardStats";
import { calendarEvents } from "@/pages/app/compliance-monitoring/monitoring-data";

export default function ActionCenterPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const complianceKpis = useComplianceKpis();
  const validationStats = useValidationQueueStats();
  const recentActivity = useRecentActivity();
  const dailyActivity = useDailyActivityTrend();
  const planUsage = usePlanUsageStats();
  const phaseBreakdown = usePhaseBreakdown();
  const activityTrend = useActivityTrend();
  const completionTrend = useCompletionTrend();

  const usageTotal = (planUsage.data?.documentsGenerated ?? 0) + (planUsage.data?.packagesGenerated ?? 0);

  const assessmentCompletionRate = complianceKpis.data?.completionRate ?? 0;

  const reviewTotal = validationStats.data?.total ?? 0;
  const reviewedCount = Math.max(reviewTotal - (validationStats.data?.pendingReview ?? 0), 0);
  const queueReviewedRate = reviewTotal > 0 ? Math.round((reviewedCount / reviewTotal) * 100) : 0;

  const upcomingEvents = calendarEvents.map((event) => ({
    date: event.date,
    title: event.title,
    subtitle: `${event.type} - ${event.framework}`,
  }));

  const usageBreakdown = [
    { name: "Documents", count: planUsage.data?.documentsGenerated ?? 0 },
    { name: "Packages", count: planUsage.data?.packagesGenerated ?? 0 },
  ];

  const quickLinks = [
    { title: "Assessments", icon: MessageSquare, action: () => navigate("/app/assistant") },
    { title: "Approvals", icon: ShieldCheck, action: () => navigate("/app/human-validation/review-queue") },
    { title: "Evidence", icon: FileCheck2, action: () => navigate("/app/evidence") },
    { title: "Security Operations", icon: Radar, action: () => navigate("/app/security") },
    { title: "Monitoring", icon: Bell, action: () => navigate("/app/compliance-monitoring") },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d8b45d] via-[#f0d990] to-[#98d8c5]" />
        <div className="relative space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a622b]">Workspace</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">
            Operations Center
          </h1>
          <p className="text-slate-600">
            Welcome back, {user?.full_name || user?.first_name || "there"}. Start from the work that needs attention now.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-slate-950">Activity, last 14 days</CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityBarChart
              data={dailyActivity.data ?? []}
              emptyLabel="No activity yet - start an assessment to see daily activity here."
            />
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
          <CardHeader>
            <CardTitle className="text-slate-950">Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <MiniCalendar events={upcomingEvents} emptyLabel="No upcoming compliance events yet." />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-950 mb-4">Across your workspaces</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
            <CardContent className="p-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Compliance</p>
              <StatRing label="Assessments completed" value={assessmentCompletionRate} max={100} tone="gold" suffix="%" />
            </CardContent>
          </Card>
          <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
            <CardContent className="p-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Governance</p>
              <StatRing label="Validation queue reviewed" value={queueReviewedRate} max={100} tone="teal" suffix="%" />
            </CardContent>
          </Card>
          <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
            <CardContent className="p-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Security Operations</p>
              <StatRing label="Open findings" value={0} max={5} tone="gold" />
            </CardContent>
          </Card>
          <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
            <CardContent className="p-5">
              <p className="mb-3 text-[10px] font-semibold uppercase tracking-wide text-slate-400">Platform</p>
              <p className="mb-2 text-sm text-slate-500">Usage this period</p>
              <DonutBreakdown data={usageBreakdown} emptyLabel="No usage recorded this period." compact />
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-slate-950 mb-4">Assessment performance</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
            <CardHeader>
              <CardTitle className="text-slate-950">Plan usage</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4 sm:flex-row">
              <GaugeMeter label="This period" value={usageTotal} max={Math.max(usageTotal, 50)} variant="light" palette="gold" />
              <div className="w-full space-y-3 sm:w-auto">
                <div>
                  <p className="text-2xl font-bold text-slate-900">{planUsage.data?.documentsGenerated ?? 0}</p>
                  <p className="text-sm text-slate-500">Documents generated</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{planUsage.data?.packagesGenerated ?? 0}</p>
                  <p className="text-sm text-slate-500">Packages generated</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
            <CardHeader>
              <CardTitle className="text-slate-950">Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <TrendBadge
                label="Activity vs prior 14 days"
                changePercent={activityTrend.data?.changePercent ?? 0}
                direction={activityTrend.data?.direction ?? "flat"}
                detail={`${activityTrend.data?.last ?? 0} assessments started`}
              />
              <TrendBadge
                label="Completions vs last month"
                changePercent={completionTrend.data?.changePercent ?? 0}
                direction={completionTrend.data?.direction ?? "flat"}
                detail={`${completionTrend.data?.current ?? 0} completed this month`}
              />
            </CardContent>
          </Card>
          <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
            <CardHeader>
              <CardTitle className="text-slate-950">Assessments by phase</CardTitle>
            </CardHeader>
            <CardContent>
              <BreakdownBarChart
                data={phaseBreakdown.data ?? []}
                tone="gold"
                emptyLabel="No assessments yet - start one to see phase activity here."
              />
            </CardContent>
          </Card>
          <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
            <CardHeader>
              <CardTitle className="text-slate-950">Phase breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <DonutBreakdown
                data={phaseBreakdown.data ?? []}
                emptyLabel="No assessments yet - start one to see phase breakdown here."
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-[#d8b45d]/30 bg-gradient-to-r from-[#fff7df] to-white shadow-sm shadow-slate-200/60">
        <CardContent className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#d8b45d]/30 bg-white text-[#7a622b] shadow-sm">
              <Gauge className="h-7 w-7" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Run the Compliance Workflow</h2>
              <p className="text-slate-600">
                Assess, approve, evidence, monitor, and report from one operating model.
              </p>
            </div>
          </div>
          <Button size="lg" className="shadow-lg shadow-primary/20" onClick={() => navigate("/app/assistant")}>
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
        <CardHeader>
          <CardTitle className="text-slate-950">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ActivityFeed
            items={recentActivity.data ?? []}
            emptyLabel="No activity yet - start an assessment to see it here."
          />
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold text-slate-950 mb-4">Quick links</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link, index) => {
            const tone = toneFor(index);
            return (
              <button
                key={link.title}
                onClick={link.action}
                className={`group flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white p-3 text-left shadow-sm shadow-slate-200/60 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${tone.ring}`}
              >
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 ${tone.box} ${tone.icon}`}>
                  <link.icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium text-slate-900">{link.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
