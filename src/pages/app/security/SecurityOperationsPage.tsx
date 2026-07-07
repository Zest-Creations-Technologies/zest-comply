import { Link } from "react-router-dom";
import { ExternalLink, Radar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceImpactSection, SecurityEmptyState, ZestReconBadge } from "./SecurityShared";

export default function SecurityOperationsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6 shadow-lg shadow-black/10">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Workspace</p>
            <ZestReconBadge />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Security Operations</h1>
            <p className="max-w-3xl text-muted-foreground">
              ZestComply works independently. Connect ZestRecon to enrich Security Operations with security findings, vulnerabilities, assets, alerts, attack surface data, and compliance signals.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild size="lg" className="shadow-lg shadow-primary/20">
              <Link to="/app/security/connect">
                <Radar className="mr-2 h-4 w-4" />
                Connect ZestRecon
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://zestrecon.com" target="_blank" rel="noopener noreferrer">
                Visit zestrecon.com
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/10">
          <CardHeader>
            <CardTitle>Security Data Ingestion</CardTitle>
            <CardDescription>Optional ZestRecon data can enrich compliance workflows with findings, assets, alerts, vulnerabilities, and attack surface context.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-black/10">
          <CardHeader>
            <CardTitle>Compliance Signal Routing</CardTitle>
            <CardDescription>Imported security signals can later support evidence requests, risks, governance reviews, monitoring alerts, and executive reporting.</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <SecurityEmptyState
        icon={ShieldCheck}
        title="No ZestRecon data connected"
        description="ZestComply risk workflows work with or without ZestRecon. Connect ZestRecon to begin importing security findings, assets, vulnerabilities, alerts, and attack surface data."
      />
      <ComplianceImpactSection />
    </div>
  );
}
