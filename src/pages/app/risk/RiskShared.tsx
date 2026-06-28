import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, GitBranch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RiskEmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="bg-card">
      <CardContent className="flex flex-col items-start gap-4 py-10">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function RiskRelationshipSection() {
  const relationships = [
    "Assessments -> Risks",
    "Governance Reviews -> Risks",
    "Compliance Monitoring -> Risks",
    "ZestRecon Findings -> Risks",
    "Risks -> Executive Reports",
    "Risks -> Evidence Requests",
  ];

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Future Integrations</CardTitle>
        <CardDescription>Risk Management will connect evidence, governance, monitoring, and security operations workflows.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {relationships.map((relationship) => (
          <div key={relationship} className="flex items-center gap-3 rounded-md border border-border p-3 text-sm text-muted-foreground">
            <GitBranch className="h-4 w-4 text-muted-foreground" />
            {relationship}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function RiskActionCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}) {
  return (
    <Card className="bg-card transition-colors hover:border-primary/50">
      <CardHeader className="flex flex-row items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" size="sm">
          <Link to={href}>
            Open
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
