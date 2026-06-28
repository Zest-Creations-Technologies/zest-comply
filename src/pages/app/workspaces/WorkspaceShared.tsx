import { Link } from "react-router-dom";
import type React from "react";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface WorkspaceLink {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  status?: string;
}

export function WorkspacePage({
  title,
  description,
  primaryAction,
  items,
  children,
}: {
  title: string;
  description: string;
  primaryAction?: WorkspaceLink;
  items: WorkspaceLink[];
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="max-w-3xl space-y-2">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        {primaryAction && (
          <Button asChild>
            <Link to={primaryAction.href}>
              {primaryAction.title}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.title} className="bg-card transition-colors hover:border-primary/50">
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
              </div>
              {item.status && <Badge variant="secondary">{item.status}</Badge>}
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" size="sm">
                <Link to={item.href}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {children && <div className="grid gap-4 md:grid-cols-2">{children}</div>}
    </div>
  );
}

export function WorkspaceEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-card">
      <CardContent className="py-8">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
