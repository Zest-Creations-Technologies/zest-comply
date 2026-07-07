import { Link } from "react-router-dom";
import { ExternalLink, Radar, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ComplianceImpactSection, SecurityEmptyState, ZestReconBadge } from "./SecurityShared";
import { toneFor } from "@/lib/tone-palette";
import { GaugeMeter } from "@/components/app/dashboard-charts";

export default function SecurityOperationsPage() {
  const dataCards = [
    { title: "Security Data Ingestion", description: "Optional ZestRecon data can enrich compliance workflows with findings, assets, alerts, vulnerabilities, and attack surface context." },
    { title: "Compliance Signal Routing", description: "Imported security signals can later support evidence requests, risks, governance reviews, monitoring alerts, and executive reporting." },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#d8b45d] via-[#f0d990] to-[#98d8c5]" />
        <div className="relative space-y-3">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#7a622b]">Workspace</p>
            <ZestReconBadge />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950">Security Operations</h1>
            <p className="max-w-3xl text-slate-600">
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
            <Button asChild variant="outline" size="lg" className="border-slate-200 bg-white hover:bg-slate-50">
              <a href="https://zestrecon.com" target="_blank" rel="noopener noreferrer">
                Visit zestrecon.com
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
          <CardContent className="p-5">
            <GaugeMeter label="Findings" value={0} max={50} variant="light" />
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
          <CardContent className="p-5">
            <GaugeMeter label="Assets tracked" value={0} max={200} variant="light" />
          </CardContent>
        </Card>
        <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
          <CardContent className="p-5">
            <GaugeMeter label="Open alerts" value={0} max={25} variant="light" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {dataCards.map((card, index) => {
          const tone = toneFor(index);
          return (
            <Card
              key={card.title}
              className={`group relative overflow-hidden border-slate-200/80 bg-white shadow-sm shadow-slate-200/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${tone.ring}`}
            >
              <div className={`absolute inset-x-0 top-0 h-0.5 ${tone.bar}`} />
              <CardHeader>
                <CardTitle className="text-slate-950">{card.title}</CardTitle>
                <CardDescription className="text-slate-500">{card.description}</CardDescription>
              </CardHeader>
            </Card>
          );
        })}
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
