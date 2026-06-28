import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { IntegrationCard, IntegrationEmptyState, IntegrationPageHeader, ibmIntegrations } from "./IbmIntegrationsShared";

export default function IntegrationCenterPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <IntegrationPageHeader
          title="Integration Center"
          description="Connect IBM enterprise services to enrich compliance, governance, evidence, reporting, monitoring, and administration workflows."
        />
        <Button asChild>
          <Link to="/app/integrations/ibm">IBM Integrations</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {ibmIntegrations.slice(0, 4).map((integration) => (
          <IntegrationCard key={integration.slug} integration={integration} />
        ))}
      </div>

      <IntegrationEmptyState
        title="IBM services are not connected."
        description="Connect IBM service to begin synchronization."
      />

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4" />
        IBM integrations only
      </div>
    </div>
  );
}
