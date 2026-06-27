import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { conversationsApi, humanValidationApi, packagesApi } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { PageSkeleton } from "./shared";

function splitList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function CompanyProfilePage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conversationId, setConversationId] = useState("");
  const [packageId, setPackageId] = useState("none");
  const [legalName, setLegalName] = useState("");
  const [businessUnit, setBusinessUnit] = useState("");
  const [systemOwnerName, setSystemOwnerName] = useState("");
  const [systemOwnerEmail, setSystemOwnerEmail] = useState("");
  const [complianceOwnerName, setComplianceOwnerName] = useState("");
  const [complianceOwnerEmail, setComplianceOwnerEmail] = useState("");
  const [scopeSummary, setScopeSummary] = useState("");
  const [locations, setLocations] = useState("");
  const [systems, setSystems] = useState("");
  const [dataTypes, setDataTypes] = useState("");
  const [thirdParties, setThirdParties] = useState("");
  const [assumptions, setAssumptions] = useState("");
  const [exclusions, setExclusions] = useState("");

  const conversationsQuery = useQuery({
    queryKey: ["conversations", "human-validation"],
    queryFn: () => conversationsApi.getConversations(false),
  });

  const packagesQuery = useQuery({
    queryKey: ["packages", "human-validation", "profile-form"],
    queryFn: () => packagesApi.listPackages({ limit: 100 }),
  });

  const packages = packagesQuery.data?.packages ?? [];
  const filteredPackages = useMemo(() => {
    if (!conversationId) return packages;
    return packages.filter((pkg) => pkg.session_id === conversationId);
  }, [conversationId, packages]);

  const createMutation = useMutation({
    mutationFn: () => humanValidationApi.createProfile({
      conversation_session_id: conversationId,
      package_id: packageId === "none" ? null : packageId,
      legal_name: legalName || null,
      business_unit: businessUnit || null,
      system_owner_name: systemOwnerName || null,
      system_owner_email: systemOwnerEmail || null,
      compliance_owner_name: complianceOwnerName || null,
      compliance_owner_email: complianceOwnerEmail || null,
      scope_summary: scopeSummary || null,
      in_scope_locations: splitList(locations),
      in_scope_systems: splitList(systems),
      data_types: splitList(dataTypes),
      third_parties: splitList(thirdParties),
      assumptions: splitList(assumptions),
      exclusions: splitList(exclusions),
      metadata_json: {},
    }),
    onSuccess: (profile) => {
      toast({ title: "Validation profile created", description: "The profile is ready for review workflow setup." });
      navigate(`/app/human-validation/approvals/${profile.id}`);
    },
    onError: (error) => {
      toast({
        title: "Could not create profile",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const isLoading = conversationsQuery.isLoading || packagesQuery.isLoading;
  const isError = conversationsQuery.isError || packagesQuery.isError;
  const error = conversationsQuery.error || packagesQuery.error;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Company Profile</h1>
        <p className="text-muted-foreground">Capture the business context reviewers need before approval.</p>
      </div>

      {isLoading && <PageSkeleton />}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>{error instanceof Error ? error.message : "Failed to load profile form data."}</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            createMutation.mutate();
          }}
        >
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Workflow Link</CardTitle>
              <CardDescription>Select the generated workflow this validation profile belongs to.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Conversation Session</Label>
                <Select value={conversationId} onValueChange={(value) => { setConversationId(value); setPackageId("none"); }} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a conversation" />
                  </SelectTrigger>
                  <SelectContent>
                    {(conversationsQuery.data ?? []).map((conversation) => (
                      <SelectItem key={conversation.id} value={conversation.id}>
                        {conversation.company_name || conversation.recommended_framework || conversation.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Package</Label>
                <Select value={packageId} onValueChange={setPackageId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Optional package" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No package selected</SelectItem>
                    {filteredPackages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id}>
                        {pkg.manifest_json?.company?.name || pkg.package_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Company Inputs</CardTitle>
              <CardDescription>These details support human review and approval decisions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="legal-name">Legal Name</Label>
                  <Input id="legal-name" value={legalName} onChange={(e) => setLegalName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="business-unit">Business Unit</Label>
                  <Input id="business-unit" value={businessUnit} onChange={(e) => setBusinessUnit(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="system-owner-name">System Owner Name</Label>
                  <Input id="system-owner-name" value={systemOwnerName} onChange={(e) => setSystemOwnerName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="system-owner-email">System Owner Email</Label>
                  <Input id="system-owner-email" type="email" value={systemOwnerEmail} onChange={(e) => setSystemOwnerEmail(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="compliance-owner-name">Compliance Owner Name</Label>
                  <Input id="compliance-owner-name" value={complianceOwnerName} onChange={(e) => setComplianceOwnerName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="compliance-owner-email">Compliance Owner Email</Label>
                  <Input id="compliance-owner-email" type="email" value={complianceOwnerEmail} onChange={(e) => setComplianceOwnerEmail(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="scope-summary">Scope Summary</Label>
                <Textarea id="scope-summary" value={scopeSummary} onChange={(e) => setScopeSummary(e.target.value)} rows={4} />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Scope Details</CardTitle>
              <CardDescription>Enter one item per line.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2"><Label>In-scope Locations</Label><Textarea value={locations} onChange={(e) => setLocations(e.target.value)} rows={4} /></div>
              <div className="grid gap-2"><Label>In-scope Systems</Label><Textarea value={systems} onChange={(e) => setSystems(e.target.value)} rows={4} /></div>
              <div className="grid gap-2"><Label>Data Types</Label><Textarea value={dataTypes} onChange={(e) => setDataTypes(e.target.value)} rows={4} /></div>
              <div className="grid gap-2"><Label>Third Parties</Label><Textarea value={thirdParties} onChange={(e) => setThirdParties(e.target.value)} rows={4} /></div>
              <div className="grid gap-2"><Label>Assumptions</Label><Textarea value={assumptions} onChange={(e) => setAssumptions(e.target.value)} rows={4} /></div>
              <div className="grid gap-2"><Label>Exclusions</Label><Textarea value={exclusions} onChange={(e) => setExclusions(e.target.value)} rows={4} /></div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => navigate("/app/human-validation")}>Cancel</Button>
            <Button type="submit" disabled={!conversationId || createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Profile
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

