import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { PageSkeleton, StatusBadge } from "./shared";

function splitList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinList(value: unknown[] | undefined) {
  return (value ?? []).map((item) => String(item)).join("\n");
}

export default function CompanyProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const profileId = searchParams.get("profile");
  const isEditMode = Boolean(profileId);

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

  const profileQuery = useQuery({
    queryKey: ["human-validation", "profile", profileId],
    queryFn: () => humanValidationApi.getProfile(profileId!),
    enabled: isEditMode,
  });

  const conversationsQuery = useQuery({
    queryKey: ["conversations", "human-validation"],
    queryFn: () => conversationsApi.getConversations(false),
  });

  const packagesQuery = useQuery({
    queryKey: ["packages", "human-validation", "profile-form"],
    queryFn: () => packagesApi.listPackages({ limit: 100 }),
  });

  useEffect(() => {
    const profile = profileQuery.data;
    if (!profile) return;

    setConversationId(profile.conversation_session_id);
    setPackageId(profile.package_id || "none");
    setLegalName(profile.legal_name || "");
    setBusinessUnit(profile.business_unit || "");
    setSystemOwnerName(profile.system_owner_name || "");
    setSystemOwnerEmail(profile.system_owner_email || "");
    setComplianceOwnerName(profile.compliance_owner_name || "");
    setComplianceOwnerEmail(profile.compliance_owner_email || "");
    setScopeSummary(profile.scope_summary || "");
    setLocations(joinList(profile.in_scope_locations));
    setSystems(joinList(profile.in_scope_systems));
    setDataTypes(joinList(profile.data_types));
    setThirdParties(joinList(profile.third_parties));
    setAssumptions(joinList(profile.assumptions));
    setExclusions(joinList(profile.exclusions));
  }, [profileQuery.data]);

  const packages = packagesQuery.data?.packages ?? [];
  const filteredPackages = useMemo(() => {
    if (!conversationId) return packages;
    return packages.filter((pkg) => pkg.session_id === conversationId);
  }, [conversationId, packages]);

  const profilePayload = {
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
  };

  const createMutation = useMutation({
    mutationFn: () => humanValidationApi.createProfile({
      conversation_session_id: conversationId,
      package_id: packageId === "none" ? null : packageId,
      ...profilePayload,
    }),
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: ["human-validation", "queue"] });
      toast({ title: "Company profile created", description: "The profile is ready for Governance & Approvals." });
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

  const updateMutation = useMutation({
    mutationFn: () => humanValidationApi.updateProfile(profileId!, profilePayload),
    onSuccess: (profile) => {
      queryClient.invalidateQueries({ queryKey: ["human-validation", "queue"] });
      queryClient.invalidateQueries({ queryKey: ["human-validation", "profile", profile.id] });
      toast({ title: "Company profile saved", description: "Governance details were updated." });
      navigate(`/app/human-validation/approvals/${profile.id}`);
    },
    onError: (error) => {
      toast({
        title: "Could not save profile",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const isLoading = conversationsQuery.isLoading || packagesQuery.isLoading || profileQuery.isLoading;
  const isError = conversationsQuery.isError || packagesQuery.isError || profileQuery.isError;
  const error = conversationsQuery.error || packagesQuery.error || profileQuery.error;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="space-y-2">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-foreground">Company Profile</h1>
          {profileQuery.data && <StatusBadge status={profileQuery.data.status} />}
        </div>
        <p className="text-muted-foreground">
          {isEditMode
            ? "Update the business context reviewers need before approval."
            : "Capture the business context reviewers need before approval."}
        </p>
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
            if (isEditMode) {
              updateMutation.mutate();
            } else {
              createMutation.mutate();
            }
          }}
        >
          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Workflow Link</CardTitle>
              <CardDescription>
                {isEditMode
                  ? "Profile links are set when the profile is created."
                  : "Select the generated workflow this validation profile belongs to."}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label>Conversation Session</Label>
                <Select
                  value={conversationId}
                  onValueChange={(value) => { setConversationId(value); setPackageId("none"); }}
                  required
                  disabled={isEditMode}
                >
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
                <Select value={packageId} onValueChange={setPackageId} disabled={isEditMode}>
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
            <Button type="button" variant="outline" onClick={() => navigate(isEditMode && profileId ? `/app/human-validation/approvals/${profileId}` : "/app/human-validation")}>Cancel</Button>
            <Button type="submit" disabled={(!conversationId && !isEditMode) || isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Save Profile" : "Create Profile"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
