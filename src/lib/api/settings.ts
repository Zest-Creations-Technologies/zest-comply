// Settings API client for document customization

import { apiClient } from "./client";
import { API_CONFIG } from "./config";
import type {
  UserSettings,
  Letterhead,
  LetterheadUpdate,
  StyleMap,
  StyleMapUpdate,
  LetterheadLogoResponse,
} from "./types";

// Mock data for development
const mockLetterhead: Letterhead = {
  id: "mock-letterhead-1",
  logo_cloud_path: null,
  logo_width_inches: 2.0,
  show_logo: true,
  header_text: null,
  footer_text: null,
  top_margin: 1.0,
  bottom_margin: 1.0,
  left_margin: 1.0,
  right_margin: 1.0,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockStyleMap: StyleMap = {
  id: "mock-stylemap-1",
  user_settings_id: "mock-settings-1",
  styles_json: {
    heading_1: { font: "Arial", size: 24, bold: true, color: "000000" },
    heading_2: { font: "Arial", size: 18, bold: true, color: "000000" },
    heading_3: { font: "Arial", size: 14, bold: true, color: "000000" },
    paragraph: { font: "Arial", size: 11, color: "333333" },
    list_item: { font: "Arial", size: 11, color: "333333" },
    table: { header_bold: true, header_background: "E0E0E0", cell_font_size: 10 },
  },
  active_template: "professional",
  framework_overrides: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const mockUserSettings: UserSettings = {
  id: "mock-settings-1",
  user_id: "mock-user-1",
  letterhead: mockLetterhead,
  stylemap: mockStyleMap,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const settingsApi = {
  /**
   * Get all user settings including letterhead and stylemap
   */
  async getSettings(): Promise<UserSettings> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return mockUserSettings;
    }
    return apiClient.get<UserSettings>("/settings/");
  },

  /**
   * Get letterhead settings
   */
  async getLetterhead(): Promise<Letterhead> {
    if (API_CONFIG.useMocks) {
      await delay(200);
      return mockLetterhead;
    }
    return apiClient.get<Letterhead>("/settings/letterhead");
  },

  /**
   * Update letterhead settings
   */
  async updateLetterhead(data: LetterheadUpdate): Promise<Letterhead> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return { ...mockLetterhead, ...data, updated_at: new Date().toISOString() };
    }
    return apiClient.put<Letterhead>("/settings/letterhead", data);
  },

  /**
   * Upload logo for letterhead (uses FormData)
   * @param file - PNG or JPEG file, max 5MB
   * @param widthInches - Logo width in inches (0.5-5.0)
   */
  async uploadLogo(file: File, widthInches: number = 2.0): Promise<LetterheadLogoResponse> {
    if (API_CONFIG.useMocks) {
      await delay(1000);
      return {
        message: "Logo uploaded successfully",
        logo_cloud_path: URL.createObjectURL(file),
        logo_width_inches: widthInches,
      };
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("width_inches", widthInches.toString());

    return apiClient.uploadFormData<LetterheadLogoResponse>(
      "/settings/letterhead/logo",
      formData
    );
  },

  /**
   * Delete letterhead logo
   */
  async deleteLogo(): Promise<{ message: string }> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return { message: "Logo deleted successfully" };
    }
    return apiClient.delete<{ message: string }>("/settings/letterhead/logo");
  },

  /**
   * Get style map settings
   */
  async getStyleMap(): Promise<StyleMap> {
    if (API_CONFIG.useMocks) {
      await delay(200);
      return mockStyleMap;
    }
    return apiClient.get<StyleMap>("/settings/stylemap");
  },

  /**
   * Update style map settings
   */
  async updateStyleMap(data: StyleMapUpdate): Promise<StyleMap> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return {
        ...mockStyleMap,
        ...data,
        styles_json: { ...mockStyleMap.styles_json, ...data.styles_json },
        updated_at: new Date().toISOString(),
      };
    }
    return apiClient.put<StyleMap>("/settings/stylemap", data);
  },
};
