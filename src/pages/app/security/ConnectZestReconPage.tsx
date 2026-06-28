import { useState } from "react";
import { KeyRound, Radar } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ZestReconBadge } from "./SecurityShared";

const syncOptions = [
  "Findings",
  "Assets",
  "Alerts",
  "Vulnerabilities",
  "Attack Surface",
  "Compliance Mappings",
];

export default function ConnectZestReconPage() {
  const [selected, setSelected] = useState<string[]>(syncOptions);

  const toggleOption = (option: string) => {
    setSelected((current) => (
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option]
    ));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div className="space-y-3">
        <ZestReconBadge />
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Connect ZestRecon</h1>
          <p className="text-muted-foreground">Configure the ZestRecon workspace and sync categories that should feed Security Operations.</p>
        </div>
      </div>

      <Alert>
        <AlertDescription>Connection setup will activate after integration keys are configured.</AlertDescription>
      </Alert>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Connection Details</CardTitle>
          <CardDescription>Store these values once backend integration support is enabled.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="workspace-url">ZestRecon Workspace URL</Label>
            <Input id="workspace-url" type="url" autoComplete="off" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="api-key">API Key / Token</Label>
            <Input id="api-key" type="password" autoComplete="off" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="workspace-name">Organization / Workspace Name</Label>
            <Input id="workspace-name" autoComplete="organization" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Sync Options</CardTitle>
          <CardDescription>Select the security data categories ZestComply should ingest after connection.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {syncOptions.map((option) => (
            <label key={option} className="flex items-center gap-3 rounded-md border border-border p-3">
              <Checkbox checked={selected.includes(option)} onCheckedChange={() => toggleOption(option)} />
              <span className="text-sm text-foreground">{option}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button disabled>
          <KeyRound className="mr-2 h-4 w-4" />
          Save Connection
        </Button>
      </div>

      <div className="flex justify-start">
        <Button asChild variant="outline">
          <a href="https://zestrecon.com" target="_blank" rel="noopener noreferrer">
            <Radar className="mr-2 h-4 w-4" />
            Visit zestrecon.com
          </a>
        </Button>
      </div>
    </div>
  );
}
