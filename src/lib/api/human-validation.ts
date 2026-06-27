// Human Validation & Governance API

import { apiClient } from "./client";
import type {
  CompanyValidationProfile,
  CompanyValidationProfileCreate,
  CompanyValidationProfileUpdate,
  HumanValidationQueueResponse,
  ValidationAssignment,
  ValidationAssignmentCreate,
  ValidationAuditEvent,
  ValidationComment,
  ValidationCommentCreate,
  ValidationDecisionRequest,
} from "./types";

export const humanValidationApi = {
  getQueue(): Promise<HumanValidationQueueResponse> {
    return apiClient.get<HumanValidationQueueResponse>("/human-validation/queue");
  },

  createProfile(payload: CompanyValidationProfileCreate): Promise<CompanyValidationProfile> {
    return apiClient.post<CompanyValidationProfile>("/human-validation/profiles", payload);
  },

  getProfile(profileId: string): Promise<CompanyValidationProfile> {
    return apiClient.get<CompanyValidationProfile>(`/human-validation/profiles/${profileId}`);
  },

  updateProfile(
    profileId: string,
    payload: CompanyValidationProfileUpdate,
  ): Promise<CompanyValidationProfile> {
    return apiClient.patch<CompanyValidationProfile>(
      `/human-validation/profiles/${profileId}`,
      payload,
    );
  },

  assignReviewerOrApprover(
    profileId: string,
    payload: ValidationAssignmentCreate,
  ): Promise<ValidationAssignment> {
    return apiClient.post<ValidationAssignment>(
      `/human-validation/profiles/${profileId}/assignments`,
      payload,
    );
  },

  submitForReview(profileId: string): Promise<CompanyValidationProfile> {
    return apiClient.post<CompanyValidationProfile>(
      `/human-validation/profiles/${profileId}/submit`,
    );
  },

  decide(
    profileId: string,
    payload: ValidationDecisionRequest,
  ): Promise<CompanyValidationProfile> {
    return apiClient.post<CompanyValidationProfile>(
      `/human-validation/profiles/${profileId}/decision`,
      payload,
    );
  },

  addComment(
    profileId: string,
    payload: ValidationCommentCreate,
  ): Promise<ValidationComment> {
    return apiClient.post<ValidationComment>(
      `/human-validation/profiles/${profileId}/comments`,
      payload,
    );
  },

  getAuditTrail(profileId: string): Promise<ValidationAuditEvent[]> {
    return apiClient.get<ValidationAuditEvent[]>(
      `/human-validation/profiles/${profileId}/audit`,
    );
  },
};
