import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportsEmptyState({
  icon: Icon = FileText,
  title = "No reports generated yet.",
  description = "Reports will appear after assessments, evidence, reviews, and approvals are completed.",
}: {
  icon?: LucideIcon;
  title?: string;
  description?: string;
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

export function ReportActionCard({
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

export function ReportsPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="max-w-3xl text-muted-foreground">{description}</p>
    </div>
  );
}
