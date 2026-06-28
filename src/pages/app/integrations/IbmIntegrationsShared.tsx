import { Link, useParams } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, Brain, Database, KeyRound, Network, Radar, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export interface IbmIntegration {
  slug: string;
  name: string;
  overview: string;
  capabilities: string[];
  icon: LucideIcon;
}

export const ibmIntegrations: IbmIntegration[] = [
  {
    slug: "openpages",
    name: "IBM OpenPages",
    overview: "Connect governance, risk, and compliance records with ZestComply reporting, approvals, and audit readiness workflows.",
    capabilities: ["Governance records", "Risk context", "Control alignment", "Audit readiness"],
    icon: ShieldCheck,
  },
  {
    slug: "qradar",
    name: "IBM QRadar Suite",
    overview: "Bring security detection context into compliance monitoring, risk workflows, and executive reporting.",
    capabilities: ["Security alerts", "Investigation context", "Risk signals", "Compliance monitoring inputs"],
    icon: Radar,
  },
  {
    slug: "guardium",
    name: "IBM Guardium",
    overview: "Use data security and protection signals to support evidence, risk, and audit readiness workflows.",
    capabilities: ["Data protection context", "Policy signals", "Evidence support", "Audit preparation"],
    icon: Database,
  },
  {
    slug: "watsonx-ai",
    name: "IBM watsonx.ai",
    overview: "Prepare governed AI assistance patterns for compliance review, reporting, and control support.",
    capabilities: ["AI workflow support", "Governed assistance", "Review context", "Report preparation"],
    icon: Brain,
  },
  {
    slug: "watsonx-data",
    name: "IBM watsonx.data",
    overview: "Prepare trusted enterprise data sources for future reporting, monitoring, and governance views.",
    capabilities: ["Data source context", "Reporting inputs", "Governance views", "Monitoring support"],
    icon: Database,
  },
  {
    slug: "verify",
    name: "IBM Verify",
    overview: "Connect identity and access context for governance, audit readiness, and administration workflows.",
    capabilities: ["Identity context", "Access review support", "Audit readiness", "Governance signals"],
    icon: KeyRound,
  },
  {
    slug: "api-connect",
    name: "IBM API Connect",
    overview: "Prepare API governance and integration context for compliance monitoring and reporting.",
    capabilities: ["API governance", "Integration context", "Control support", "Audit preparation"],
    icon: Network,
  },
  {
    slug: "instana",
    name: "IBM Instana",
    overview: "Use observability context to support operational risk, compliance monitoring, and evidence workflows.",
    capabilities: ["Observability context", "Operational signals", "Risk inputs", "Evidence support"],
    icon: SlidersHorizontal,
  },
  {
    slug: "turbonomic",
    name: "IBM Turbonomic",
    overview: "Prepare resource optimization context for operational risk, governance, and executive reporting.",
    capabilities: ["Resource context", "Operational risk inputs", "Governance support", "Report preparation"],
    icon: SlidersHorizontal,
  },
  {
    slug: "concert",
    name: "IBM Concert",
    overview: "Connect application and operations intelligence with compliance monitoring, governance, and reporting workflows.",
    capabilities: ["Application context", "Operations intelligence", "Risk signals", "Executive reporting inputs"],
    icon: Network,
  },
];

export function IntegrationPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      <p className="max-w-3xl text-muted-foreground">{description}</p>
    </div>
  );
}

export function IntegrationCard({ integration }: { integration: IbmIntegration }) {
  return (
    <Card className="bg-card transition-colors hover:border-primary/50">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <integration.icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-lg">{integration.name}</CardTitle>
            <CardDescription>{integration.overview}</CardDescription>
          </div>
        </div>
        <Badge variant="secondary">Not Connected</Badge>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" size="sm">
          <Link to={`/app/integrations/ibm/${integration.slug}`}>
            Open
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export function IntegrationEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <Card className="bg-card">
      <CardContent className="py-8">
        <p className="font-medium text-foreground">{title}</p>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export function IbmIntegrationDetailPage() {
  const { integrationSlug } = useParams();
  const integration = ibmIntegrations.find((item) => item.slug === integrationSlug) ?? ibmIntegrations[0];
  const Icon = integration.icon;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <Badge variant="secondary">Not Connected</Badge>
          <h1 className="text-3xl font-bold text-foreground">{integration.name}</h1>
          <p className="max-w-3xl text-muted-foreground">{integration.overview}</p>
        </div>
        <Button>Configure Integration</Button>
      </div>

      <Card className="bg-card">
        <CardHeader className="flex flex-row items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
            <Icon className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle>Service Overview</CardTitle>
            <CardDescription>Connect IBM service to begin synchronization.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{integration.overview}</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <IntegrationEmptyState title="Sync History" description="Sync history will appear after this integration is connected." />
        <IntegrationEmptyState title="Data Mapping" description="Data mappings will appear after configuration." />
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Future Capabilities</CardTitle>
          <CardDescription>Configured IBM data will support compliance, governance, evidence, reporting, and monitoring workflows.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {integration.capabilities.map((capability) => (
            <div key={capability} className="rounded-md border border-border p-3 text-sm text-muted-foreground">
              {capability}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
