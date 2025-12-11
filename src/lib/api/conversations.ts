// Conversations API client

import { apiClient } from './client';
import { API_CONFIG } from './config';
import { mockConversations, delay } from './mocks';
import type { Conversation, Message } from './types';

export const conversationsApi = {
  async getConversations(): Promise<Conversation[]> {
    if (API_CONFIG.useMocks) {
      await delay(300);
      return mockConversations;
    }
    return apiClient.get<Conversation[]>('/conversations');
  },

  async getConversation(id: string): Promise<Conversation> {
    if (API_CONFIG.useMocks) {
      await delay(200);
      const conv = mockConversations.find(c => c.id === id);
      if (!conv) throw new Error('Conversation not found');
      return conv;
    }
    return apiClient.get<Conversation>(`/conversations/${id}`);
  },

  async createConversation(): Promise<Conversation> {
    if (API_CONFIG.useMocks) {
      await delay();
      const newConv: Conversation = {
        id: 'conv-' + Date.now(),
        user_id: 'user-1',
        title: 'New Compliance Assessment',
        phase: 'discovery',
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return newConv;
    }
    return apiClient.post<Conversation>('/conversations');
  },

  async archiveConversation(id: string): Promise<void> {
    if (API_CONFIG.useMocks) {
      await delay();
      return;
    }
    await apiClient.post(`/conversations/${id}/archive`);
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    if (API_CONFIG.useMocks) {
      await delay(200);
      // Return mock messages
      return [
        {
          id: 'msg-1',
          conversation_id: conversationId,
          role: 'assistant',
          content: "Welcome to Zest Comply! I'm here to help you create comprehensive compliance documentation. Let's start by understanding your organization. What industry are you in?",
          created_at: new Date(Date.now() - 60000).toISOString(),
        },
      ];
    }
    return apiClient.get<Message[]>(`/conversations/${conversationId}/messages`);
  },
};
