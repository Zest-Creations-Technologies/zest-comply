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
import { formatDateTime, PageSkeleton, profileTitle, StatusBadge } from "./shared";

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

  const queryKey = useMemo(() => ["human-validation", "profile", profileId], [profileId]);

  const profileQuery = useQuery({
    queryKey,
    queryFn: () => humanValidationApi.getProfile(profileId!),
    enabled: !!profileId,
  });

  const refreshProfile = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["human-validation", "queue"] });
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
    },
    onError: (error) => toast({ title: "Comment failed", description: error instanceof Error ? error.message : "Please try again.", variant: "destructive" }),
  });

  const profile = profileQuery.data;

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
                <Link to={`/app/human-validation/audit/${profile.id}`}>View Audit Trail</Link>
              </Button>
            </div>
          </div>

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
                <Button className="w-full" onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending}>
                  {submitMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit for Review
                </Button>
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
                  Save Assignment
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
                  <Button onClick={() => decisionMutation.mutate("approve")} disabled={decisionMutation.isPending}>Approve</Button>
                  <Button variant="outline" onClick={() => decisionMutation.mutate("request_changes")} disabled={decisionMutation.isPending}>Request Changes</Button>
                  <Button variant="destructive" onClick={() => decisionMutation.mutate("reject")} disabled={decisionMutation.isPending}>Reject</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Add Comment</CardTitle>
              <CardDescription>Comments are recorded for governance traceability. Comment history will appear after the backend exposes a comments list endpoint.</CardDescription>
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
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
