import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ExternalLink, KeyRound, Radar, SlidersHorizontal } from "lucide-react";
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
    <Card className="border-dashed border-slate-200 bg-slate-50/60">
      <CardContent className="flex flex-col items-start gap-4 py-10">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d8b45d]/30 bg-gradient-to-br from-[#fff7df] to-[#f3e6bd] text-[#7a622b] shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="font-medium text-slate-900">{title}</p>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/app/security/connect">
              <Radar className="mr-2 h-4 w-4" />
              Connect ZestRecon
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-slate-200 bg-white hover:bg-slate-50">
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
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
      <CardHeader>
        <CardTitle className="text-slate-950">Compliance Impact</CardTitle>
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
          <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-3 text-slate-600">
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

const CONNECTION_STEPS = [
  {
    icon: KeyRound,
    title: "Add connection details",
    description: "Enter your ZestRecon workspace URL, API key, and organization name.",
  },
  {
    icon: SlidersHorizontal,
    title: "Choose what to sync",
    description: "Select from findings, assets, alerts, vulnerabilities, attack surface, and compliance mappings.",
  },
  {
    icon: Radar,
    title: "Save and start syncing",
    description: "ZestComply begins importing selected categories on your chosen schedule.",
  },
];

export function ConnectionStepsWidget() {
  return (
    <Card className="border-slate-200/80 bg-white shadow-sm shadow-slate-200/60">
      <CardHeader>
        <CardTitle className="text-slate-950">Connect ZestRecon in three steps</CardTitle>
        <CardDescription>How the connection works once you're ready to enrich Security Operations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-6 before:absolute before:left-[19px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-slate-200">
          {CONNECTION_STEPS.map((step, index) => (
            <div key={step.title} className="relative flex items-start gap-4 pl-0">
              <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#98d8c5]/40 bg-[#eef8f3] text-[#2f6d5c] shadow-sm">
                <step.icon className="h-4 w-4" />
              </span>
              <div className="pt-1.5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Step {index + 1}</p>
                <p className="font-medium text-slate-900">{step.title}</p>
                <p className="mt-0.5 text-sm text-slate-500">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Button asChild>
            <Link to="/app/security/connect">
              <Radar className="mr-2 h-4 w-4" />
              Connect ZestRecon
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
