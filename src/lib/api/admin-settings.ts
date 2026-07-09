import { apiClient } from "./client";
import type { AdminBrandingSettings, AdminNotificationSettings, AdminOrganizationSettings, PlatformSettings, UserInviteRequest, UserInviteResponse, OrganizationMemberListResponse, OrganizationMember } from "./types";

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

  getNotifications(): Promise<AdminNotificationSettings> {
    return apiClient.get<AdminNotificationSettings>("/admin/notifications");
  },

  updateNotifications(payload: AdminNotificationSettings): Promise<AdminNotificationSettings> {
    return apiClient.put<AdminNotificationSettings>("/admin/notifications", payload);
  },

  getPlatformSettings(): Promise<PlatformSettings> {
    return apiClient.get<PlatformSettings>("/admin/platform-settings");
  },

  updatePlatformSettings(payload: PlatformSettings): Promise<PlatformSettings> {
    return apiClient.put<PlatformSettings>("/admin/platform-settings", payload);
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
};
