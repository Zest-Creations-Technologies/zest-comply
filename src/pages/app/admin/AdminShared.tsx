import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="max-w-3xl text-muted-foreground">{description}</p>
    </div>
  );
}

export function AdminEmptyState({
  icon: Icon = Settings,
  title,
  description,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: { label: string; href: string };
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
        {action && (
          <Button asChild>
            <Link to={action.href}>{action.label}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function AdminActionCard({
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

export function AdminFieldGrid({ fields }: { fields: string[] }) {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Profile Fields</CardTitle>
        <CardDescription>These settings will use organization data when administration APIs are connected.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field} className="rounded-md border border-border p-3">
            <p className="text-sm font-medium text-foreground">{field}</p>
            <p className="mt-1 text-sm text-muted-foreground">Not configured</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
