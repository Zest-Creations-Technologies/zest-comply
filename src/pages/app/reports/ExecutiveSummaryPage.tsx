import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportsEmptyState, ReportsPageHeader } from "./ReportsShared";

const summarySources = [
  "Compliance posture",
  "Framework progress",
  "Risk posture",
  "Evidence coverage",
  "Outstanding approvals",
  "Audit readiness",
  "Security insights (optional via ZestRecon)",
];

export default function ExecutiveSummaryPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <ReportsPageHeader
        title="Executive Summary"
        description="A leadership-ready summary will aggregate trusted data from compliance, governance, risk, evidence, audit, and optional security operations inputs."
      />

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Future Summary Inputs</CardTitle>
          <CardDescription>The executive summary will use completed platform activity instead of manually entered figures.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {summarySources.map((source) => (
            <div key={source} className="rounded-md border border-border p-3 text-sm text-muted-foreground">
              {source}
            </div>
          ))}
        </CardContent>
      </Card>

      <ReportsEmptyState icon={BarChart3} />
    </div>
  );
}
