// Real data for dashboard chart/stat components. Every value here comes
// from an existing, already-shipped API - no fabricated numbers. A fresh
// account legitimately shows zeros, which is the honest state to render.

import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { conversationsApi } from "@/lib/api/conversations";
import { packagesApi } from "@/lib/api/packages";
import { humanValidationApi } from "@/lib/api/human-validation";
import { plansApi } from "@/lib/api/plans";
import type { ActivityDatum, BreakdownDatum, DailyActivityDatum, MonthlyTrendDatum } from "@/components/app/dashboard-charts";

export function useConversationsCount() {
  return useQuery({
    queryKey: ["dashboard-stats", "conversations"],
    queryFn: () => conversationsApi.getConversations(),
    select: (sessions) => sessions.length,
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["dashboard-stats", "recent-activity"],
    queryFn: () => conversationsApi.getConversations(),
    select: (sessions): ActivityDatum[] =>
      [...sessions]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 4)
        .map((session) => ({
          title: session.company_name || "Untitled assessment",
          subtitle: session.current_phase.replace(/_/g, " "),
          timestamp: formatDistanceToNow(new Date(session.updated_at), { addSuffix: true }),
        })),
  });
}

export function usePackagesStats() {
  return useQuery({
    queryKey: ["dashboard-stats", "packages"],
    queryFn: () => packagesApi.listPackages({ limit: 100 }),
    select: (response) => {
      const byFramework = new Map<string, number>();
      for (const pkg of response.packages) {
        byFramework.set(pkg.framework, (byFramework.get(pkg.framework) ?? 0) + 1);
      }
      const breakdown: BreakdownDatum[] = Array.from(byFramework.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);

      return { total: response.count, breakdown };
    },
  });
}

const VALIDATION_STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  in_review: "In review",
  changes_requested: "Changes requested",
  approved: "Approved",
  rejected: "Rejected",
  signed_off: "Signed off",
};

export function useValidationQueueStats() {
  return useQuery({
    queryKey: ["dashboard-stats", "validation-queue"],
    queryFn: () => humanValidationApi.getQueue(),
    select: (response) => {
      const byStatus = new Map<string, number>();
      for (const profile of response.profiles) {
        byStatus.set(profile.status, (byStatus.get(profile.status) ?? 0) + 1);
      }
      const breakdown: BreakdownDatum[] = Array.from(byStatus.entries())
        .map(([status, count]) => ({ name: VALIDATION_STATUS_LABELS[status] ?? status, count }))
        .sort((a, b) => b.count - a.count);

      const pendingReview = (byStatus.get("submitted") ?? 0) + (byStatus.get("in_review") ?? 0);

      return { total: response.count, pendingReview, breakdown };
    },
  });
}

export function useDailyActivityTrend() {
  return useQuery({
    queryKey: ["dashboard-stats", "daily-activity"],
    queryFn: () => conversationsApi.getConversations(),
    select: (sessions): DailyActivityDatum[] => {
      const now = new Date();
      const days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (13 - i));
        return { key: d.toDateString(), label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) };
      });

      const counts = new Map<string, number>();
      for (const session of sessions) {
        const key = new Date(session.created_at).toDateString();
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }

      return days.map(({ key, label }) => ({ day: label, count: counts.get(key) ?? 0 }));
    },
  });
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

export function useAssessmentTrend() {
  return useQuery({
    queryKey: ["dashboard-stats", "assessment-trend"],
    queryFn: () => conversationsApi.getConversations(),
    select: (sessions): MonthlyTrendDatum[] => {
      const now = new Date();
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
        return { key: monthKey(d), label: d.toLocaleDateString("en-US", { month: "short", year: "numeric" }) };
      });

      const started = new Map<string, number>();
      const completed = new Map<string, number>();
      for (const session of sessions) {
        const createdKey = monthKey(new Date(session.created_at));
        started.set(createdKey, (started.get(createdKey) ?? 0) + 1);
        if (session.current_phase === "completed") {
          const completedKey = monthKey(new Date(session.updated_at));
          completed.set(completedKey, (completed.get(completedKey) ?? 0) + 1);
        }
      }

      return months.map(({ key, label }) => ({
        month: label,
        started: started.get(key) ?? 0,
        completed: completed.get(key) ?? 0,
      }));
    },
  });
}

export interface TrendResult {
  changePercent: number;
  direction: "up" | "down" | "flat";
}

function trendFrom(current: number, previous: number): TrendResult {
  const changePercent = previous > 0 ? Math.round(((current - previous) / previous) * 100) : current > 0 ? 100 : 0;
  const direction: TrendResult["direction"] = changePercent > 0 ? "up" : changePercent < 0 ? "down" : "flat";
  return { changePercent, direction };
}

export function useActivityTrend() {
  return useQuery({
    queryKey: ["dashboard-stats", "activity-trend"],
    queryFn: () => conversationsApi.getConversations(),
    select: (sessions): TrendResult & { last: number; prior: number } => {
      const now = new Date();
      const last14Start = new Date(now);
      last14Start.setDate(now.getDate() - 14);
      const prior14Start = new Date(now);
      prior14Start.setDate(now.getDate() - 28);

      let last = 0;
      let prior = 0;
      for (const session of sessions) {
        const created = new Date(session.created_at);
        if (created >= last14Start && created <= now) last += 1;
        else if (created >= prior14Start && created < last14Start) prior += 1;
      }

      return { last, prior, ...trendFrom(last, prior) };
    },
  });
}

export function useCompletionTrend() {
  return useQuery({
    queryKey: ["dashboard-stats", "completion-trend"],
    queryFn: () => conversationsApi.getConversations(),
    select: (sessions): TrendResult & { current: number; previous: number } => {
      const now = new Date();
      const currentKey = monthKey(now);
      const previousKey = monthKey(new Date(now.getFullYear(), now.getMonth() - 1, 1));

      let current = 0;
      let previous = 0;
      for (const session of sessions) {
        if (session.current_phase !== "completed") continue;
        const key = monthKey(new Date(session.updated_at));
        if (key === currentKey) current += 1;
        else if (key === previousKey) previous += 1;
      }

      return { current, previous, ...trendFrom(current, previous) };
    },
  });
}

export function useComplianceKpis() {
  return useQuery({
    queryKey: ["dashboard-stats", "compliance-kpis"],
    queryFn: () => conversationsApi.getConversations(),
    select: (sessions) => {
      const total = sessions.length;
      const completedSessions = sessions.filter((session) => session.current_phase === "completed");
      const completionRate = total > 0 ? Math.round((completedSessions.length / total) * 100) : 0;

      const processingDays = completedSessions
        .map((session) => (new Date(session.updated_at).getTime() - new Date(session.created_at).getTime()) / (1000 * 60 * 60 * 24))
        .filter((days) => days >= 0);
      const avgProcessingDays = processingDays.length > 0
        ? Math.round(processingDays.reduce((sum, days) => sum + days, 0) / processingDays.length)
        : 0;

      return { completionRate, avgProcessingDays, completedCount: completedSessions.length };
    },
  });
}

const PHASE_LABELS: Record<string, string> = {
  initiation: "Initiation",
  information_discovery: "Discovery",
  framework_analysis: "Framework Analysis",
  structure_generation: "Structure Generation",
  document_selection: "Document Selection",
  document_generation: "Generating Documents",
  package_finalization: "Finalizing",
  completed: "Completed",
};

export function usePhaseBreakdown() {
  return useQuery({
    queryKey: ["dashboard-stats", "phase-breakdown"],
    queryFn: () => conversationsApi.getConversations(),
    select: (sessions): BreakdownDatum[] => {
      const counts = new Map<string, number>();
      for (const session of sessions) {
        const label = PHASE_LABELS[session.current_phase] ?? session.current_phase;
        counts.set(label, (counts.get(label) ?? 0) + 1);
      }
      return Array.from(counts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
    },
  });
}

export function usePlanUsageStats() {
  return useQuery({
    queryKey: ["dashboard-stats", "plan-usage"],
    queryFn: () => plansApi.getSubscription(),
    select: (subscription) => ({
      planName: subscription?.plan?.name ?? "No plan",
      documentsGenerated: subscription?.documents_generated_this_period ?? 0,
      packagesGenerated: subscription?.packages_generated_this_period ?? 0,
    }),
  });
}
