// Compliance Copilot API

import { apiClient } from "./client";
import type {
  CopilotConversation,
  CopilotConversationListResponse,
  CopilotMessage,
  CopilotMessageListResponse,
} from "./types";

export const copilotApi = {
  createConversation(): Promise<CopilotConversation> {
    return apiClient.post<CopilotConversation>("/copilot/conversations", {});
  },

  listConversations(): Promise<CopilotConversationListResponse> {
    return apiClient.get<CopilotConversationListResponse>("/copilot/conversations");
  },

  getMessages(conversationId: string): Promise<CopilotMessageListResponse> {
    return apiClient.get<CopilotMessageListResponse>(`/copilot/conversations/${conversationId}/messages`);
  },

  sendMessage(conversationId: string, message: string): Promise<CopilotMessage> {
    return apiClient.post<CopilotMessage>(`/copilot/conversations/${conversationId}/messages`, { message });
  },
};
