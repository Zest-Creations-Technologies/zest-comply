// Evidence Collection API

import { apiClient } from "./client";
import type {
  EvidenceCreateInput,
  EvidenceDownloadResponse,
  EvidenceItem,
  EvidenceListResponse,
  EvidenceStatus,
} from "./types";

function buildEvidenceFormData(input: EvidenceCreateInput): FormData {
  const formData = new FormData();
  formData.append("title", input.title);
  if (input.description) formData.append("description", input.description);
  for (const framework of input.frameworks ?? []) formData.append("frameworks", framework);
  for (const controlId of input.control_ids ?? []) formData.append("control_ids", controlId);
  if (input.package_name) formData.append("package_name", input.package_name);
  if (input.evidence_type) formData.append("evidence_type", input.evidence_type);
  if (input.owner) formData.append("owner", input.owner);
  if (input.reviewer) formData.append("reviewer", input.reviewer);
  if (input.uploaded_by) formData.append("uploaded_by", input.uploaded_by);
  if (input.due_date) formData.append("due_date", input.due_date);
  if (input.expiration_date) formData.append("expiration_date", input.expiration_date);
  if (input.notes) formData.append("notes", input.notes);
  if (input.file) formData.append("file", input.file);
  return formData;
}

export const evidenceApi = {
  list(): Promise<EvidenceListResponse> {
    return apiClient.get<EvidenceListResponse>("/evidence");
  },

  get(evidenceId: string): Promise<EvidenceItem> {
    return apiClient.get<EvidenceItem>(`/evidence/${evidenceId}`);
  },

  create(input: EvidenceCreateInput): Promise<EvidenceItem> {
    return apiClient.uploadFormData<EvidenceItem>("/evidence", buildEvidenceFormData(input));
  },

  replaceVersion(evidenceId: string, file: File): Promise<EvidenceItem> {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.uploadFormData<EvidenceItem>(`/evidence/${evidenceId}/version`, formData);
  },

  updateStatus(evidenceId: string, status: EvidenceStatus): Promise<EvidenceItem> {
    return apiClient.patch<EvidenceItem>(`/evidence/${evidenceId}/status`, { status });
  },

  getDownloadUrl(evidenceId: string): Promise<EvidenceDownloadResponse> {
    return apiClient.get<EvidenceDownloadResponse>(`/evidence/${evidenceId}/download`);
  },
};
