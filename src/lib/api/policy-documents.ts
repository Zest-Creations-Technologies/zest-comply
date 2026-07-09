import { apiClient } from "./client";
import type {
  PolicyDocument,
  PolicyDocumentListResponse,
  PolicyDocumentVersionListResponse,
} from "./types";

export const policyDocumentsApi = {
  listBySession(sessionId: string): Promise<PolicyDocumentListResponse> {
    return apiClient.get<PolicyDocumentListResponse>(
      `/policy-documents?session_id=${sessionId}`
    );
  },

  get(documentId: string): Promise<PolicyDocument> {
    return apiClient.get<PolicyDocument>(`/policy-documents/${documentId}`);
  },

  update(documentId: string, content: string): Promise<PolicyDocument> {
    return apiClient.patch<PolicyDocument>(`/policy-documents/${documentId}`, { content });
  },

  listVersions(documentId: string): Promise<PolicyDocumentVersionListResponse> {
    return apiClient.get<PolicyDocumentVersionListResponse>(
      `/policy-documents/${documentId}/versions`
    );
  },
};
