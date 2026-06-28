import { IntegrationCard, IntegrationEmptyState, IntegrationPageHeader, ibmIntegrations } from "./IbmIntegrationsShared";

export default function IbmIntegrationsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <IntegrationPageHeader
        title="IBM Enterprise Integrations"
        description="Configure IBM services for enterprise compliance operations, governance context, evidence workflows, monitoring signals, and executive reporting inputs."
      />

      <div className="grid gap-4 md:grid-cols-2">
        {ibmIntegrations.map((integration) => (
          <IntegrationCard key={integration.slug} integration={integration} />
        ))}
      </div>

      <IntegrationEmptyState
        title="No IBM integrations connected."
        description="Connect IBM service to begin synchronization."
      />
    </div>
  );
}
