import { apiClient } from "./client";
import type {
  PolicyDocument,
  PolicyRevisionDiscussionMessage,
  PolicyRevisionDiscussionMessageListResponse,
  PolicyRevisionProposal,
  PolicyRevisionProposalListResponse,
} from "./types";

export const policyRevisionsApi = {
  listPendingTargetReview(): Promise<PolicyRevisionProposalListResponse> {
    return apiClient.get<PolicyRevisionProposalListResponse>(
      "/policy-revision-proposals/pending-target-review"
    );
  },

  get(proposalId: string): Promise<PolicyRevisionProposal> {
    return apiClient.get<PolicyRevisionProposal>(
      `/policy-revision-proposals/${proposalId}`
    );
  },

  confirmTarget(
    proposalId: string,
    policyDocumentId: string | null
  ): Promise<PolicyRevisionProposal> {
    return apiClient.patch<PolicyRevisionProposal>(
      `/policy-revision-proposals/${proposalId}/target`,
      { policy_document_id: policyDocumentId }
    );
  },

  getDiscussion(proposalId: string): Promise<PolicyRevisionDiscussionMessageListResponse> {
    return apiClient.get<PolicyRevisionDiscussionMessageListResponse>(
      `/policy-revision-proposals/${proposalId}/discussion`
    );
  },

  sendDiscussionMessage(
    proposalId: string,
    content: string
  ): Promise<PolicyRevisionDiscussionMessage> {
    return apiClient.post<PolicyRevisionDiscussionMessage>(
      `/policy-revision-proposals/${proposalId}/discussion`,
      { content }
    );
  },

  draftPolicy(proposalId: string): Promise<PolicyRevisionProposal> {
    return apiClient.post<PolicyRevisionProposal>(
      `/policy-revision-proposals/${proposalId}/draft-policy`
    );
  },

  decide(
    proposalId: string,
    decision: "approve" | "reject"
  ): Promise<PolicyDocument | PolicyRevisionProposal> {
    return apiClient.patch<PolicyDocument | PolicyRevisionProposal>(
      `/policy-revision-proposals/${proposalId}/decision`,
      { decision }
    );
  },
};
