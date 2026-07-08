import { apiClient } from "./client";
import type { AdminBrandingSettings, AdminNotificationSettings, AdminOrganizationSettings } from "./types";

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
};
