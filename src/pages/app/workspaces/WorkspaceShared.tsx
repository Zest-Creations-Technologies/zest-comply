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
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-lg shadow-black/10">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Workspace</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {primaryAction && (
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <Link to={primaryAction.href}>
                {primaryAction.title}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card
            key={item.title}
            className="group bg-card shadow-sm shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/10"
          >
            <CardHeader className="flex flex-row items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <item.icon className="h-5 w-5" />
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
                <Link to={item.href}>
                  Open
                  <ArrowRight className="ml-2 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
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
    <Card className="border-dashed bg-card/60">
      <CardContent className="py-8">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
