// Conversations API client

import { apiClient } from "./client";
import { API_CONFIG } from "./config";
import { mockConversationSessions, delay } from "./mocks";
import type { ConversationSession, ConversationMessage } from "./types";

export const conversationsApi = {
  async getConversations(): Promise<ConversationSession[]> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return mockConversationSessions;
    }
    try {
      const response = await apiClient.get<{ sessions: ConversationSession[]; count: number }>("/conversations/all");
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
};
