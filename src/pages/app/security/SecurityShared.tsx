import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ExternalLink, Radar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ZestReconBadge() {
  return <Badge variant="secondary">Powered by ZestRecon</Badge>;
}

export function SecurityEmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Card className="border-dashed bg-card/60">
      <CardContent className="flex flex-col items-start gap-4 py-10">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-foreground">{title}</p>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/app/security/connect">
              <Radar className="mr-2 h-4 w-4" />
              Connect ZestRecon
            </Link>
          </Button>
          <Button asChild variant="outline">
            <a href="https://zestrecon.com" target="_blank" rel="noopener noreferrer">
              Visit zestrecon.com
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function ComplianceImpactSection() {
  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Compliance Impact</CardTitle>
        <CardDescription>Optional ZestRecon security signals will later map into compliance workflows.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 text-sm md:grid-cols-2">
        {[
          "Evidence requests",
          "Risks",
          "Governance reviews",
          "Compliance monitoring alerts",
          "Executive reports",
        ].map((item) => (
          <div key={item} className="rounded-md border border-border bg-background/40 p-3 text-muted-foreground">
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
