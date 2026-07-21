import { apiClient } from "./client";
import type { AdminBrandingSettings, AdminNotificationSettings, AdminOrganizationSettings, AdminSecuritySettings, UserInviteRequest, UserInviteResponse, OrganizationMemberListResponse, OrganizationMember, PasswordConfirmationRequest, DeletionConfirmationResponse } from "./types";

export const adminSettingsApi = {
  getOrganization(): Promise<AdminOrganizationSettings> {
    return apiClient.get<AdminOrganizationSettings>("/admin/organization");
  },

  updateOrganization(payload: AdminOrganizationSettings): Promise<AdminOrganizationSettings> {
    return apiClient.put<AdminOrganizationSettings>("/admin/organization", payload);
  },

  getBranding(): Promise<AdminBrandingSettings> {
    return apiClient.get<AdminBrandingSettings>("/admin/branding");
  },

  updateBranding(payload: AdminBrandingSettings): Promise<AdminBrandingSettings> {
    return apiClient.put<AdminBrandingSettings>("/admin/branding", payload);
  },

  uploadBrandingLogo(file: File): Promise<AdminBrandingSettings> {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.uploadFormData<AdminBrandingSettings>("/admin/branding/logo", formData);
  },

  deleteBrandingLogo(): Promise<void> {
    return apiClient.delete<void>("/admin/branding/logo");
  },

  getNotifications(): Promise<AdminNotificationSettings> {
    return apiClient.get<AdminNotificationSettings>("/admin/notifications");
  },

  updateNotifications(payload: AdminNotificationSettings): Promise<AdminNotificationSettings> {
    return apiClient.put<AdminNotificationSettings>("/admin/notifications", payload);
  },

  getSecuritySettings(): Promise<AdminSecuritySettings> {
    return apiClient.get<AdminSecuritySettings>("/admin/security-settings");
  },

  updateSecuritySettings(payload: Pick<AdminSecuritySettings, "require_mfa">): Promise<AdminSecuritySettings> {
    return apiClient.put<AdminSecuritySettings>("/admin/security-settings", payload);
  },

  inviteUser(payload: UserInviteRequest): Promise<UserInviteResponse> {
    return apiClient.post<UserInviteResponse>("/admin/users/invite", payload);
  },

  listOrganizationMembers(): Promise<OrganizationMemberListResponse> {
    return apiClient.get<OrganizationMemberListResponse>("/admin/organization/members");
  },

  updateMemberRole(userId: string, role: "admin" | "member" | "viewer"): Promise<OrganizationMember> {
    return apiClient.patch<OrganizationMember>(`/admin/organization/members/${userId}`, { role });
  },

  // Permanently deletes the organization and every member's account
  // (anonymized, not hard-deleted - see zct-backend app/api/v1/admin.py).
  // Org-admin only; server clears the acting admin's auth cookies too.
  deleteOrganization(payload: PasswordConfirmationRequest): Promise<DeletionConfirmationResponse> {
    return apiClient.delete<DeletionConfirmationResponse>("/admin/organization", {
      body: JSON.stringify(payload),
    });
  },
};
