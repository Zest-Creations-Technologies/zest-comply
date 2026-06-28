import { ExternalLink, Radar, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspaceEmptyState, WorkspacePage } from "./WorkspaceShared";

export default function SecurityWorkspacePage() {
  return (
    <WorkspacePage
      title="Security Operations"
      description="Powered by ZestRecon for findings, assets, vulnerabilities, alerts, and attack surface monitoring."
      primaryAction={{ title: "Connect ZestRecon", href: "/app/security/connect", icon: Radar }}
      items={[
        { title: "Powered by ZestRecon", description: "Connect ZestRecon to activate findings, assets, vulnerabilities, and attack surface monitoring.", href: "/app/security/zestrecon", icon: Radar, status: "Connect" },
        { title: "Security Operations", description: "Coordinate security signals with compliance obligations after connecting data sources.", href: "/app/security", icon: Shield },
      ]}
    >
      <WorkspaceEmptyState title="Findings, Assets, Alerts, Vulnerabilities, Attack Surface" description="Connect ZestRecon to begin security operations monitoring." />
      <div className="flex items-center">
        <Button asChild variant="outline">
          <a href="https://zestrecon.com" target="_blank" rel="noopener noreferrer">
            Visit zestrecon.com
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </WorkspacePage>
  );
}
