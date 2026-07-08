import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, ClipboardCheck, FileText, History, ListChecks, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toneFor } from "@/lib/tone-palette";
import { DonutBreakdown, StatCallout } from "@/components/app/dashboard-charts";
import { useValidationQueueStats } from "@/hooks/useDashboardStats";

const quickLinks = [
  { title: "Approvals", href: "/app/human-validation", icon: ClipboardCheck },
  { title: "Review Queue", href: "/app/human-validation/review-queue", icon: ListChecks },
  { title: "Audit Trail", href: "/app/human-validation/review-queue", icon: History },
  { title: "Risk Management", href: "/app/risk", icon: ShieldAlert },
  { title: "Executive Reports", href: "/app/reports", icon: FileText },
  { title: "AI Governance", href: "/app/governance/ai-oversight", icon: BrainCircuit },
];

export default function GovernanceWorkspacePage() {
  const validationStats = useValidationQueueStats();

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d8b45d] via-[#f0d990] to-[#98d8c5]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a622b]">Workspace</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Governance</h1>
            <p className="text-slate-600">Coordinate human review, approvals, audit trails, risk work, and executive reporting.</p>
          </div>
          <Button asChild size="lg" className="shadow-lg shadow-primary/20">
            <Link to="/app/human-validation/review-queue">
              Open Queue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
        <StatCallout
          label="Profiles awaiting your review"
          value={validationStats.data?.pendingReview ?? 0}
          tone="gold"
          className="flex flex-col justify-center shadow-sm shadow-slate-200/60"
        />
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
          <CardHeader>
            <CardTitle className="text-slate-950">Queue by status</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutBreakdown
              data={validationStats.data?.breakdown ?? []}
              emptyLabel="No profiles submitted for review yet."
            />
          </CardContent>
        </Card>
      </div>

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
