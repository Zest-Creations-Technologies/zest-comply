import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { policyDocumentsApi, policyRevisionsApi } from "@/lib/api";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Bot, Loader2, Send, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageSkeleton, StatusBadge } from "./shared";

export default function PolicyRevisionDetailsPage() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedTargetId, setSelectedTargetId] = useState("");
  const [discussionDraft, setDiscussionDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const queryKey = ["policy-revisions", "proposal", proposalId];

  const proposalQuery = useQuery({
    queryKey,
    queryFn: () => policyRevisionsApi.get(proposalId!),
    enabled: !!proposalId,
  });
  const proposal = proposalQuery.data;

  const liveDocumentsQuery = useQuery({
    queryKey: ["policy-documents", "live"],
    queryFn: policyDocumentsApi.listLivePolicyDocuments,
    enabled: proposal?.status === "suggested",
  });

  const canDiscuss = proposal?.status === "target_confirmed" || proposal?.status === "drafted";
  const canDraft = canDiscuss;
  const canDecide = proposal?.status === "drafted";

  const discussionQuery = useQuery({
    queryKey: ["policy-revisions", "discussion", proposalId],
    queryFn: () => policyRevisionsApi.getDiscussion(proposalId!),
    enabled: !!proposalId && canDiscuss,
  });
  const discussionMessages = discussionQuery.data?.messages ?? [];

  const targetDocumentQuery = useQuery({
    queryKey: ["policy-documents", proposal?.target_policy_document_id],
    queryFn: () => policyDocumentsApi.get(proposal!.target_policy_document_id!),
    enabled: !!proposal?.target_policy_document_id,
  });

  const refreshProposal = () => {
    queryClient.invalidateQueries({ queryKey });
    queryClient.invalidateQueries({ queryKey: ["policy-revisions", "pending-target-review"] });
  };

  const confirmTargetMutation = useMutation({
    mutationFn: (policyDocumentId: string | null) =>
      policyRevisionsApi.confirmTarget(proposalId!, policyDocumentId),
    onSuccess: () => {
      toast({ title: "Target confirmed", description: "You can now discuss and draft the revision." });
      refreshProposal();
    },
    onError: (error) =>
      toast({
        title: "Failed to confirm target",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      }),
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => policyRevisionsApi.sendDiscussionMessage(proposalId!, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["policy-revisions", "discussion", proposalId] });
    },
    onError: (error) =>
      toast({
        title: "Message failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      }),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [discussionMessages, sendMessageMutation.isPending]);

  const draftPolicyMutation = useMutation({
    mutationFn: () => policyRevisionsApi.draftPolicy(proposalId!),
    onSuccess: () => {
      toast({ title: "Draft ready", description: "Review the proposed revision below." });
      refreshProposal();
    },
    onError: (error) =>
      toast({
        title: "Drafting failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      }),
  });

  const decisionMutation = useMutation({
    mutationFn: (decision: "approve" | "reject") => policyRevisionsApi.decide(proposalId!, decision),
    onSuccess: (_data, decision) => {
      toast({
        title: decision === "approve" ? "Revision approved" : "Revision rejected",
        description:
          decision === "approve"
            ? "The policy has been updated."
            : "No changes were made to the policy.",
      });
      refreshProposal();
      if (decision === "approve" && proposal?.target_policy_document_id) {
        queryClient.invalidateQueries({ queryKey: ["policy-documents", proposal.target_policy_document_id] });
      }
    },
    onError: (error) =>
      toast({
        title: "Decision failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      }),
  });

  const handleSendMessage = () => {
    const text = discussionDraft.trim();
    if (!text || sendMessageMutation.isPending) return;
    setDiscussionDraft("");
    sendMessageMutation.mutate(text);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/app/policy-revisions")}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {proposalQuery.isLoading && <PageSkeleton />}

      {proposalQuery.isError && (
        <Alert variant="destructive">
          <AlertDescription>
            {proposalQuery.error instanceof Error ? proposalQuery.error.message : "Failed to load this proposal."}
          </AlertDescription>
        </Alert>
      )}

      {proposal && (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                {proposal.evidence_title || "Policy revision proposal"}
              </h1>
              <p className="text-muted-foreground">
                Confirm which policy this finding affects, discuss it, then draft and approve a revision.
              </p>
            </div>
            <StatusBadge status={proposal.status} />
          </div>

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Target Policy</CardTitle>
              <CardDescription>
                {proposal.status === "suggested"
                  ? "The AI suggested a policy this finding might affect. Confirm it, pick a different one, or draft a new standalone document instead."
                  : proposal.target_policy_document_name
                    ? `This proposal will revise: ${proposal.target_policy_document_name}`
                    : "This proposal will create a new standalone document (no existing policy matched)."}
              </CardDescription>
            </CardHeader>
            {proposal.status === "suggested" && (
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground">
                  Suggested match:{" "}
                  <span className="font-medium">
                    {proposal.suggested_policy_document_name || "No existing policy matched"}
                  </span>
                </p>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-end">
                  <Select value={selectedTargetId} onValueChange={setSelectedTargetId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pick a different existing policy..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(liveDocumentsQuery.data?.documents ?? []).map((doc) => (
                        <SelectItem key={doc.id} value={doc.id}>
                          {doc.document_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => confirmTargetMutation.mutate(selectedTargetId)}
                    disabled={!selectedTargetId || confirmTargetMutation.isPending}
                  >
                    Use Selected Policy
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {proposal.suggested_policy_document_id && (
                    <Button
                      onClick={() => confirmTargetMutation.mutate(proposal.suggested_policy_document_id)}
                      disabled={confirmTargetMutation.isPending}
                    >
                      {confirmTargetMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm Suggested Policy
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => confirmTargetMutation.mutate(null)}
                    disabled={confirmTargetMutation.isPending}
                  >
                    None of These - Create Standalone Document
                  </Button>
                </div>
              </CardContent>
            )}
          </Card>

          {canDiscuss && (
            <Card className="bg-card flex flex-col overflow-hidden">
              <CardHeader>
                <CardTitle>Discuss</CardTitle>
                <CardDescription>
                  Talk through the finding with the AI before drafting a revision. Optional.
                </CardDescription>
              </CardHeader>
              <div ref={scrollRef} className="max-h-[28rem] overflow-y-auto px-6 space-y-4">
                {discussionQuery.isLoading && (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                )}
                {!discussionQuery.isLoading && discussionMessages.length === 0 && (
                  <p className="text-sm text-muted-foreground py-4">
                    No discussion yet - send a message below to get started.
                  </p>
                )}
                {discussionMessages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex gap-3", message.role === "user" ? "flex-row-reverse" : "flex-row")}
                  >
                    <div
                      className={cn(
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      )}
                    >
                      {message.role === "user" ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div
                      className={cn(
                        "max-w-[75%] rounded-lg px-4 py-2 text-sm",
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {sendMessageMutation.isPending && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex items-center rounded-lg bg-muted px-4 py-2">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2 border-t border-border p-4">
                <Textarea
                  value={discussionDraft}
                  onChange={(event) => setDiscussionDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask the AI about this finding or the target policy..."
                  rows={1}
                  className="resize-none"
                  disabled={sendMessageMutation.isPending}
                />
                <Button onClick={handleSendMessage} disabled={!discussionDraft.trim() || sendMessageMutation.isPending}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          )}

          {canDraft && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle>Draft Policy</CardTitle>
                <CardDescription>
                  Produces a proposed revision using the finding and discussion above. The live policy
                  is not changed yet.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => draftPolicyMutation.mutate()} disabled={draftPolicyMutation.isPending}>
                  {draftPolicyMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {proposal.proposed_content ? "Redraft Policy" : "Draft Policy"}
                </Button>

                {proposal.proposed_content && (
                  <>
                    <Separator />
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-sm font-medium text-foreground">Current (live)</p>
                        <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 text-xs text-foreground">
                          {targetDocumentQuery.data?.content ||
                            "(This will be a new standalone document - no existing content.)"}
                        </pre>
                      </div>
                      <div>
                        <p className="mb-2 text-sm font-medium text-foreground">Proposed</p>
                        <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 text-xs text-foreground">
                          {proposal.proposed_content}
                        </pre>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <Card className="bg-card">
            <CardHeader>
              <CardTitle>Decision</CardTitle>
              <CardDescription>
                Approving promotes the proposed content into the real policy (or creates the standalone
                document). Rejecting discards it - the live policy stays untouched either way until
                approved.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 sm:grid-cols-2">
                <Button onClick={() => decisionMutation.mutate("approve")} disabled={!canDecide || decisionMutation.isPending}>
                  {decisionMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => decisionMutation.mutate("reject")}
                  disabled={!canDecide || decisionMutation.isPending}
                >
                  Reject
                </Button>
              </div>
              {!canDecide && (
                <p className="text-xs text-muted-foreground">
                  {proposal.status === "approved" || proposal.status === "rejected"
                    ? "This proposal has already been resolved."
                    : "Draft the policy revision above before approving or rejecting."}
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
