import { ClipboardList, FileWarning, ListChecks, Scale, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiskActionCard, RiskRelationshipSection } from "./RiskShared";
import { Link } from "react-router-dom";

const workflowSteps = [
  {
    title: "Identify",
    description: "Risks can come from assessments, governance reviews, compliance monitoring, audits, manual entries, integrations, and optional ZestRecon findings.",
  },
  {
    title: "Assess",
    description: "Evaluate likelihood, business impact, priority, and ownership.",
  },
  {
    title: "Treat",
    description: "Create remediation plans, assign owners, and define due dates.",
  },
  {
    title: "Approve / Accept",
    description: "Route exceptions and accepted risks through governance.",
  },
  {
    title: "Monitor",
    description: "Track progress, evidence, due dates, and review status.",
  },
  {
    title: "Close",
    description: "Verify remediation, record evidence, and archive completed risks.",
  },
];

export default function RiskManagementPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Risk Management</h1>
          <p className="max-w-3xl text-muted-foreground">
            Manage enterprise risks identified through assessments, governance reviews, compliance monitoring, audits, manual entries, integrations, and optional ZestRecon findings.
          </p>
        </div>
        <Button asChild>
          <Link to="/app/risk/register">View Risk Register</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RiskActionCard title="Risk Register" description="Review enterprise risks once they are created." href="/app/risk/register" icon={ShieldAlert} />
        <RiskActionCard title="New Risk Assessment" description="Start risk identification from assessments, monitoring, manual entries, integrations, or optional imported findings." href="/app/risk/assessments" icon={ClipboardList} />
        <RiskActionCard title="Treatment Plans" description="Track mitigation, transfer, acceptance, and remediation plans." href="/app/risk/treatment-plans" icon={ListChecks} />
        <RiskActionCard title="Exceptions" description="Manage approved exceptions and compensating control context." href="/app/risk/exceptions" icon={Scale} />
        <RiskActionCard title="POA&M" description="Track plans of action and milestones for unresolved risk items." href="/app/risk/poam" icon={FileWarning} />
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Risk Workflow</CardTitle>
          <CardDescription>Risk work moves through a controlled lifecycle from identification through closure.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-6">
            {workflowSteps.map((step, index) => (
              <div key={step.title} className="rounded-md border border-border p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground">{step.title}</p>
                  {index < workflowSteps.length - 1 && <span className="hidden text-muted-foreground lg:block">↓</span>}
                </div>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <RiskRelationshipSection />
    </div>
  );
}
