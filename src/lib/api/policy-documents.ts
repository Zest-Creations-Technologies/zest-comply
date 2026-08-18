import { apiClient } from "./client";
import { getApiUrl } from "./config";
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

  // Every real (non-scanner-draft) policy document for the org, across all
  // sessions - used to let a reviewer pick an override target on a policy
  // revision proposal instead of the AI's suggestion.
  listLivePolicyDocuments(): Promise<PolicyDocumentListResponse> {
    return apiClient.get<PolicyDocumentListResponse>("/policy-documents/live");
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

  // Renders the document's CURRENT content to .docx fresh on every call -
  // unlike a pre-signed package URL, this can never go stale. Auth can't be
  // set on a plain <a href> download, so fetch as a blob (auth cookie
  // included automatically) and trigger the download client-side - same
  // pattern as telemetryApi.downloadOrgEventsCsv().
  async downloadPolicyDocumentExport(documentId: string, fallbackFilename: string): Promise<void> {
    const response = await fetch(getApiUrl(`/policy-documents/${documentId}/export`), {
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to export document");
    }

    const blob = await response.blob();
    const disposition = response.headers.get("Content-Disposition") ?? "";
    const match = disposition.match(/filename="?([^"]+)"?/);
    const filename = match?.[1] ?? fallbackFilename;

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  },
};
