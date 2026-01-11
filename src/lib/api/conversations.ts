// Conversations API client

import { apiClient } from "./client";
import { API_CONFIG } from "./config";
import { mockConversationSessions, delay } from "./mocks";
import type { ConversationSession, ConversationMessage, ConversationLogo } from "./types";

export const conversationsApi = {
  async getConversations(isArchived?: boolean): Promise<ConversationSession[]> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      if (isArchived !== undefined) {
        return mockConversationSessions.filter(c => c.is_archived === isArchived);
      }
      return mockConversationSessions;
    }
    try {
      const params = isArchived !== undefined ? `?is_archived=${isArchived}` : '';
      const response = await apiClient.get<{ sessions: ConversationSession[]; count: number }>(`/conversations/all${params}`);
      return response.sessions;
    } catch {
      return [];
    }
  },

  async getConversation(id: string): Promise<ConversationSession> {
    if (API_CONFIG.useMocks) {
      await delay(200);
      const conv = mockConversationSessions.find((c) => c.id === id);
      if (!conv) throw new Error("Conversation not found");
      return conv;
    }
    return apiClient.get<ConversationSession>(`/conversations/history/${id}`);
  },

  async archiveConversation(id: string): Promise<void> {
    if (API_CONFIG.useMocks) {
      await delay();
      return;
    }
    await apiClient.patch(`/conversations/archive/${id}`);
  },

  async deleteConversation(id: string): Promise<void> {
    if (API_CONFIG.useMocks) {
      await delay();
      return;
    }
    await apiClient.delete(`/conversations/delete/${id}`);
  },

  async getMessages(sessionId: string): Promise<ConversationMessage[]> {
    if (API_CONFIG.useMocks) {
      await delay(200);
      return [
        {
          id: "msg-1",
          session_id: sessionId,
          role: "assistant",
          content:
            "Welcome to Zest Comply! I'm here to help you create comprehensive compliance documentation. Let's start by understanding your organization. What industry are you in?",
          created_at: new Date(Date.now() - 60000).toISOString(),
          updated_at: new Date(Date.now() - 60000).toISOString(),
        },
      ];
    }
    const session = await apiClient.get<ConversationSession>(`/conversations/history/${sessionId}`);
    return session.messages;
  },

  /**
   * Upload a logo for a specific conversation/session
   * @param sessionId - The conversation session ID
   * @param file - PNG or JPEG file, max 5MB
   * @param widthInches - Logo width in inches (0.5-5.0)
   */
  async uploadConversationLogo(
    sessionId: string,
    file: File,
    widthInches: number = 2.0
  ): Promise<ConversationLogo> {
    if (API_CONFIG.useMocks) {
      await delay(1000);
      return {
        id: `logo-${Date.now()}`,
        session_id: sessionId,
        logo_cloud_path: URL.createObjectURL(file),
        logo_width_inches: widthInches,
        original_filename: file.name,
        file_size: file.size,
        mime_type: file.type,
        created_at: new Date().toISOString(),
      };
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("width_inches", widthInches.toString());

    return apiClient.uploadFormData<ConversationLogo>(
      `/conversations/${sessionId}/logo`,
      formData
    );
  },

  /**
   * Delete the logo for a specific conversation/session
   */
  async deleteConversationLogo(sessionId: string): Promise<{ message: string }> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return { message: "Conversation logo deleted successfully" };
    }
    return apiClient.delete<{ message: string }>(`/conversations/${sessionId}/logo`);
  },
};
