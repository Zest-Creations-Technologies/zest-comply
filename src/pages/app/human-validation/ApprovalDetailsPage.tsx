import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { humanValidationApi, type HumanValidationDecisionAction, type HumanValidationRole } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import { formatDateTime, PageSkeleton, profileTitle, statusLabels, StatusBadge } from "./shared";

export default function ApprovalDetailsPage() {
  const { profileId } = useParams<{ profileId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [assignmentUserId, setAssignmentUserId] = useState("");
  const [assignmentRole, setAssignmentRole] = useState<HumanValidationRole>("reviewer");
  const [decisionMessage, setDecisionMessage] = useState("");
  const [comment, setComment] = useState("");
  const [sectionReference, setSectionReference] = useState("");
  const [attestationText, setAttestationText] = useState("");

  const queryKey = useMemo(() => ["human-validation", "profile", profileId], [profileId]);

  const profileQuery = useQuery({
    queryKey,
    queryFn: () => humanValidationApi.getProfile(profileId!),
    enabled: !!profileId,
  });
  const commentsQuery = useQuery({
    queryKey: ["human-validation", "comments", profileId],
    queryFn: () => humanValidationApi.getComments(profileId!),
    enabled: !!profileId,
  });
  const signoffsQuery = useQuery({
    queryKey: ["human-validation", "signoffs", profileId],
    queryFn: () => humanValidationApi.getSignoffs(profileId!),
    enabled: !!profileId,
  });

  const refreshProfile = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["human-validation", "queue"] });
    queryClient.invalidateQueries({ queryKey: ["human-validation", "audit", profileId] });
  };

  const assignmentMutation = useMutation({
    mutationFn: () => humanValidationApi.assignReviewerOrApprover(profileId!, {
      user_id: assignmentUserId,
      role: assignmentRole,
      metadata_json: {},
    }),
    onSuccess: () => {
      setAssignmentUserId("");
      toast({ title: "Assignment saved", description: "The reviewer or approver was assigned." });
      refreshProfile();
    },
    onError: (error) => toast({ title: "Assignment failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }),
  });

  const submitMutation = useMutation({
    mutationFn: () => humanValidationApi.submitForReview(profileId!),
    onSuccess: () => {
      toast({ title: "Submitted for review", description: "The profile is ready for assigned reviewers and approvers." });
      refreshProfile();
    },
    onError: (error) => toast({ title: "Submit failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }),
  });

  const decisionMutation = useMutation({
    mutationFn: (action: HumanValidationDecisionAction) => humanValidationApi.decide(profileId!, {
      action,
      message: decisionMessage || null,
      metadata_json: {},
    }),
    onSuccess: () => {
      setDecisionMessage("");
      toast({ title: "Decision recorded", description: "The validation status was updated." });
      refreshProfile();
    },
    onError: (error) => toast({ title: "Decision failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }),
  });

  const commentMutation = useMutation({
    mutationFn: () => humanValidationApi.addComment(profileId!, {
      comment,
      section_reference: sectionReference || null,
      evidence_references: [],
      metadata_json: {},
    }),
    onSuccess: () => {
      setComment("");
      setSectionReference("");
      toast({ title: "Comment added", description: "The comment was recorded in the audit trail." });
      refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["human-validation", "comments", profileId] });
    },
    onError: (error) => toast({ title: "Comment failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }),
  });

  const signoffMutation = useMutation({
    mutationFn: () => humanValidationApi.signOff(profileId!, {
      attestation_text: attestationText || null,
    }),
    onSuccess: () => {
      setAttestationText("");
      toast({ title: "Executive sign-off recorded", description: "This profile is now signed off." });
      refreshProfile();
      queryClient.invalidateQueries({ queryKey: ["human-validation", "signoffs", profileId] });
    },
    onError: (error) => toast({ title: "Sign-off failed", description: error instanceof Error ? error.message : "Only an assigned executive signer can sign off an approved profile.", variant: "destructive" }),
  });

  const profile = profileQuery.data;
  const comments = commentsQuery.data ?? [];
  const signoffs = signoffsQuery.data ?? [];
  const canSubmit = profile?.status === "draft" || profile?.status === "changes_requested";
  const canDecide = profile?.status === "submitted" || profile?.status === "in_review" || profile?.status === "changes_requested";
  const canSignOff = profile?.status === "approved";
  const assignmentLabel = assignmentRole === "approver" ? "Assign Approver" : assignmentRole === "reviewer" ? "Assign Reviewer" : "Assign Executive Signer";

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/app/human-validation/review-queue")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {profileQuery.isLoading && <PageSkeleton />}

      {profileQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>{profileQuery.error instanceof Error ? profileQuery.error.message : "Failed to load approval details."}</AlertDescription>
        </Alert>
      )}

      {profile && (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{profileTitle(profile)}</h1>
              <p className="text-muted-foreground">Review profile details, assign reviewers, and record approval decisions.</p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={profile.status} />
              <Button asChild variant="outline">
                <Link to={`/app/human-validation/company-profile?profile=${profile.id}`}>Edit Profile</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={`/app/human-validation/audit/${profile.id}`}>View Audit Trail</Link>
              </Button>
            </div>
          </div>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Workflow Status</CardTitle>
              <CardDescription>Current Governance & Approvals lifecycle state.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Current status</p>
                <div className="flex items-center gap-2">
                  <StatusBadge status={profile.status} />
                  <span className="text-sm text-muted-foreground">{statusLabels[profile.status]}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Draft to In Review to Changes Requested, Approved, or Published.
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="bg-card lg:col-span-2">
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>Company and workflow context.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 text-sm">
                  <div><p className="text-muted-foreground">Business Unit</p><p className="text-foreground">{profile.business_unit || "Not provided"}</p></div>
                  <div><p className="text-muted-foreground">Package</p><p className="text-foreground break-all">{profile.package_id || "Not linked"}</p></div>
                  <div><p className="text-muted-foreground">System Owner</p><p className="text-foreground">{profile.system_owner_name || "Not provided"}</p><p className="text-muted-foreground">{profile.system_owner_email}</p></div>
                  <div><p className="text-muted-foreground">Compliance Owner</p><p className="text-foreground">{profile.compliance_owner_name || "Not provided"}</p><p className="text-muted-foreground">{profile.compliance_owner_email}</p></div>
                  <div><p className="text-muted-foreground">Created</p><p className="text-foreground">{formatDateTime(profile.created_at)}</p></div>
                  <div><p className="text-muted-foreground">Updated</p><p className="text-foreground">{formatDateTime(profile.updated_at)}</p></div>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Scope Summary</p>
                  <p className="text-sm text-foreground whitespace-pre-wrap">{profile.scope_summary || "No scope summary provided."}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Submit</CardTitle>
                <CardDescription>Move this profile into the review queue.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => submitMutation.mutate()} disabled={!canSubmit || submitMutation.isPending}>
                  {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit for Review
                </Button>
                {!canSubmit && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    Submit is available for Draft or Changes Requested profiles.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Assign Reviewer or Approver</CardTitle>
                <CardDescription>Enter a user ID until user search is available.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="assignment-user-id">User ID</Label>
                  <Input id="assignment-user-id" value={assignmentUserId} onChange={(e) => setAssignmentUserId(e.target.value)} placeholder="UUID" />
                </div>
                <div className="grid gap-2">
                  <Label>Role</Label>
                  <Select value={assignmentRole} onValueChange={(value) => setAssignmentRole(value as HumanValidationRole)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reviewer">Reviewer</SelectItem>
                      <SelectItem value="approver">Approver</SelectItem>
                      <SelectItem value="executive_signer">Executive Signer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={() => assignmentMutation.mutate()} disabled={!assignmentUserId || assignmentMutation.isPending}>
                  {assignmentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {assignmentLabel}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Approval Decision</CardTitle>
                <CardDescription>Approvers can approve, reject, or request changes.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="decision-message">Decision Note</Label>
                  <Textarea id="decision-message" value={decisionMessage} onChange={(e) => setDecisionMessage(e.target.value)} rows={4} />
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <Button onClick={() => decisionMutation.mutate("approve")} disabled={!canDecide || decisionMutation.isPending}>Approve</Button>
                  <Button variant="outline" onClick={() => decisionMutation.mutate("request_changes")} disabled={!canDecide || decisionMutation.isPending}>Request Changes</Button>
                  <Button variant="destructive" onClick={() => decisionMutation.mutate("reject")} disabled={!canDecide || decisionMutation.isPending}>Reject</Button>
                </div>
                {!canDecide && (
                  <p className="text-xs text-muted-foreground">
                    Approval actions are available once a profile is in review.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Executive Sign-off</CardTitle>
              <CardDescription>
                A final attestation step after approval. Requires the profile to be Approved and
                the caller to be assigned as Executive Signer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="attestation-text">Attestation (Optional)</Label>
                <Textarea
                  id="attestation-text"
                  value={attestationText}
                  onChange={(e) => setAttestationText(e.target.value)}
                  rows={3}
                  placeholder="I attest that this compliance package has been reviewed and is approved for publication."
                />
              </div>
              <Button onClick={() => signoffMutation.mutate()} disabled={!canSignOff || signoffMutation.isPending}>
                {signoffMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Off
              </Button>
              {!canSignOff && (
                <p className="text-xs text-muted-foreground">
                  Sign-off is available once a profile has been Approved.
                </p>
              )}
              {signoffs.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Sign-off history</p>
                    {signoffs.map((item) => (
                      <div key={item.id} className="rounded-md border border-border p-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-foreground">{item.signer_name || "Unknown signer"}</span>
                          <span className="text-xs text-muted-foreground">{item.signed_at ? formatDateTime(item.signed_at) : "Pending"}</span>
                        </div>
                        {item.signer_title && <p className="text-xs text-muted-foreground">{item.signer_title}</p>}
                        {item.attestation_text && <p className="mt-1 whitespace-pre-wrap text-foreground">{item.attestation_text}</p>}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Add Comment</CardTitle>
              <CardDescription>Comments are recorded for governance traceability.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="section-reference">Section Reference</Label>
                <Input id="section-reference" value={sectionReference} onChange={(e) => setSectionReference(e.target.value)} placeholder="Optional" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="comment">Comment</Label>
                <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => commentMutation.mutate()} disabled={!comment.trim() || commentMutation.isPending}>
                  {commentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add Comment
                </Button>
              </div>
              <Separator />
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-medium text-foreground">Comment History</h3>
                  <p className="text-xs text-muted-foreground">{comments.length} recorded comment{comments.length === 1 ? "" : "s"}.</p>
                </div>
                {commentsQuery.isLoading && <PageSkeleton />}
                {commentsQuery.isError && (
                  <Alert variant="destructive">
                    <AlertDescription>{commentsQuery.error instanceof Error ? commentsQuery.error.message : "Failed to load comment history."}</AlertDescription>
                  </Alert>
                )}
                {!commentsQuery.isLoading && !commentsQuery.isError && comments.length === 0 && (
                  <p className="rounded-md border border-border p-4 text-sm text-muted-foreground">No comments have been added yet.</p>
                )}
                {!commentsQuery.isLoading && !commentsQuery.isError && comments.map((item) => (
                  <div key={item.id} className="rounded-md border border-border p-4">
                    <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-medium text-foreground">{item.section_reference || "General comment"}</p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(item.created_at)}</p>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-foreground">{item.comment}</p>
                    <p className="mt-2 break-all text-xs text-muted-foreground">By {item.created_by_user_id || "System"}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
