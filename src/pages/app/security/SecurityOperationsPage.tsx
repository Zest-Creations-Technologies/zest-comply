import { Link } from "react-router-dom";
import { ExternalLink, Radar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceImpactSection, SecurityEmptyState, ZestReconBadge } from "./SecurityShared";

export default function SecurityOperationsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="space-y-3">
        <ZestReconBadge />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Security Operations</h1>
          <p className="max-w-3xl text-muted-foreground">
            ZestComply works independently. Connect ZestRecon to enrich Security Operations with security findings, vulnerabilities, assets, alerts, attack surface data, and compliance signals.
          </p>
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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card">
          <CardHeader>
            <CardTitle>Security Data Ingestion</CardTitle>
            <CardDescription>Optional ZestRecon data can enrich compliance workflows with findings, assets, alerts, vulnerabilities, and attack surface context.</CardDescription>
          </CardHeader>
        </Card>
        <Card className="bg-card">
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
