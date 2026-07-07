import { Link } from "react-router-dom";
import { ArrowRight, ClipboardList, FileWarning, ListChecks, Scale, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskActionCard, RiskRelationshipSection } from "./RiskShared";
import { toneFor } from "@/lib/tone-palette";
import { BreakdownBarChart, DonutBreakdown, RiskHeatMap, StatCallout } from "@/components/app/dashboard-charts";

const actionCards = [
  { title: "Risk Register", description: "Review enterprise risks once they are created.", href: "/app/risk/register", icon: ShieldAlert },
  { title: "New Risk Assessment", description: "Start risk identification from assessments, monitoring, manual entries, integrations, or optional imported findings.", href: "/app/risk/assessments", icon: ClipboardList },
  { title: "Treatment Plans", description: "Track mitigation, transfer, acceptance, and remediation plans.", href: "/app/risk/treatment-plans", icon: ListChecks },
  { title: "Exceptions", description: "Manage approved exceptions and compensating control context.", href: "/app/risk/exceptions", icon: Scale },
  { title: "POA&M", description: "Track plans of action and milestones for unresolved risk items.", href: "/app/risk/poam", icon: FileWarning },
];

const workflowSteps = [
  { title: "Identify", description: "Risks can come from assessments, governance reviews, compliance monitoring, audits, manual entries, integrations, and optional ZestRecon findings." },
  { title: "Assess", description: "Evaluate likelihood, business impact, priority, and ownership." },
  { title: "Treat", description: "Create remediation plans, assign owners, and define due dates." },
  { title: "Approve / Accept", description: "Route exceptions and accepted risks through governance." },
  { title: "Monitor", description: "Track progress, evidence, due dates, and review status." },
  { title: "Close", description: "Verify remediation, record evidence, and archive completed risks." },
];

export default function RiskManagementPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d8b45d] via-[#f0d990] to-[#98d8c5]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a622b]">Governance</p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Risk Management</h1>
            <p className="text-slate-600">
              Manage enterprise risks identified through assessments, governance reviews, compliance monitoring, audits, manual entries, integrations, and optional ZestRecon findings.
            </p>
          </div>
          <Button asChild size="lg" className="shadow-lg shadow-primary/20">
            <Link to="/app/risk/register">
              View Risk Register
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCallout label="Risks at/above threshold" value="0%" tone="gold" />
        <StatCallout label="Total risks tracked" value={0} tone="teal" />
        <StatCallout label="Risk analysis progress" value="0%" tone="gold" />
        <StatCallout label="Treatment progress" value="0%" tone="teal" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actionCards.map((card, index) => (
          <RiskActionCard key={card.title} {...card} tone={toneFor(index)} />
        ))}
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
        <CardHeader>
          <CardTitle className="text-slate-950">Risk heat map</CardTitle>
        </CardHeader>
        <CardContent>
          <RiskHeatMap />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
          <CardHeader>
            <CardTitle className="text-slate-950">Risk rating breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutBreakdown data={[]} emptyLabel="No risks rated yet." />
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
          <CardHeader>
            <CardTitle className="text-slate-950">Treatment plan breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutBreakdown data={[]} emptyLabel="No treatment plans yet." />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
          <CardHeader>
            <CardTitle className="text-slate-950">Top risk categories</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownBarChart data={[]} tone="gold" emptyLabel="No risk categories recorded yet." />
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
          <CardHeader>
            <CardTitle className="text-slate-950">Top risk owners</CardTitle>
          </CardHeader>
          <CardContent>
            <BreakdownBarChart data={[]} tone="teal" emptyLabel="No risk owners assigned yet." />
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
        <CardHeader>
          <CardTitle className="text-slate-950">Risk workflow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-6">
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="rounded-lg border border-slate-200 p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-medium text-slate-900">{step.title}</p>
                  {index < workflowSteps.length - 1 && <span className="hidden text-slate-400 lg:block">→</span>}
                </div>
                <p className="text-sm text-slate-500">{step.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <RiskRelationshipSection />
    </div>
  );
}
