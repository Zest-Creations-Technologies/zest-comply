import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, ExternalLink, KeyRound, Radar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { apiKeysApi } from "@/lib/api";
import { API_CONFIG } from "@/lib/api/config";
import { useAuth } from "@/contexts/AuthContext";
import { ScannerIntegrationBadge } from "./SecurityShared";
import { SCANNER_PROVIDERS, getScannerProvider } from "./scanner-providers";

function ingestPathFor(providerId: string): string {
  return `/integrations/scanners/${providerId}/reports`;
}

function pingPathFor(providerId: string): string {
  return `/integrations/scanners/${providerId}/ping`;
}

function CopyableCode({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-muted/50 p-3">
      <code className="flex-1 overflow-x-auto whitespace-pre text-xs">{value}</code>
      <Button type="button" variant="outline" size="sm" onClick={copy} aria-label={copied ? "Copied" : "Copy to clipboard"}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}

const EXAMPLE_PAYLOAD = `{
  "report_name": "Q3 2026 scan",
  "scan_date": "2026-07-20",
  "findings": [
    {
      "title": "Public S3 bucket without encryption",
      "severity": "high",
      "affected_asset": "s3://example-bucket",
      "frameworks": ["SOC 2"],
      "control_ids": ["CC6.1"]
    }
  ]
}`;

export default function ConnectSecurityScannerPage() {
  const { user } = useAuth();
  const isOrgAdmin = user?.org_role === "admin";
  const [providerId, setProviderId] = useState(SCANNER_PROVIDERS[0].id);
  const provider = getScannerProvider(providerId);

  const keysQuery = useQuery({
    queryKey: ["admin", "api-keys"],
    queryFn: apiKeysApi.list,
    enabled: isOrgAdmin,
  });

  const ingestUrl = `${API_CONFIG.baseUrl}${ingestPathFor(providerId)}`;
  const pingUrl = `${API_CONFIG.baseUrl}${pingPathFor(providerId)}`;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="space-y-3">
        <ScannerIntegrationBadge />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Connect a Security Scanner</h1>
          <p className="text-muted-foreground">
            ZestComply doesn't poll scanners or store their credentials. Instead, {provider.name} (or any scanner)
            pushes findings to ZestComply using your organization's own API key. Each finding becomes evidence you
            can review like anything else.
          </p>
        </div>
      </div>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Scanner Provider</CardTitle>
          <CardDescription>Select the scanner you're setting up - this only changes the endpoint shown below.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="provider">Provider</Label>
            <Select value={providerId} onValueChange={setProviderId}>
              <SelectTrigger id="provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCANNER_PROVIDERS.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}{option.recommended ? " (recommended)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">{provider.description}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>1. Get an API key</CardTitle>
          <CardDescription>Give this key to {provider.name} - it authenticates the findings it pushes in, the same key used for any other ZestComply API access.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isOrgAdmin ? (
            <Alert>
              <AlertDescription>Only an organization admin can view or create API keys. Ask an admin to complete this step.</AlertDescription>
            </Alert>
          ) : keysQuery.isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : keysQuery.data && keysQuery.data.keys.length > 0 ? (
            <div className="space-y-2">
              {keysQuery.data.keys.map((key) => (
                <div key={key.id} className="flex items-center justify-between rounded-md border border-border p-3 text-sm">
                  <span className="font-medium text-foreground">{key.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{key.key_prefix}...</span>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertDescription>No API keys yet - create one to give to {provider.name}.</AlertDescription>
            </Alert>
          )}
          <Button asChild variant="outline">
            <Link to="/app/admin/api-keys">
              <KeyRound className="mr-2 h-4 w-4" />
              Manage API Keys
            </Link>
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>2. Point {provider.name} at these endpoints</CardTitle>
          <CardDescription>Configure {provider.name} to authenticate with the API key above and push scan results here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Verify connection (GET)</Label>
            <CopyableCode value={pingUrl} />
          </div>
          <div className="space-y-2">
            <Label>Push findings (POST)</Label>
            <CopyableCode value={ingestUrl} />
          </div>
          <div className="space-y-2">
            <Label>Example request body</Label>
            <CopyableCode value={EXAMPLE_PAYLOAD} />
          </div>
        </CardContent>
      </Card>

      {provider.websiteUrl && (
        <div className="flex justify-start">
          <Button asChild variant="outline">
            <a href={provider.websiteUrl} target="_blank" rel="noopener noreferrer">
              <Radar className="mr-2 h-4 w-4" />
              Visit {provider.name}
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}
