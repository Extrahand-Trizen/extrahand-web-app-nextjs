/**
 * Chats API endpoints
 * Matches task-connect-relay routes/chats.js
 */

import { fetchWithAuth } from '../client';

export interface Chat {
  _id: string;
  participants: string[];
  relatedTask?: string;
  relatedApplication?: string;
  lastMessage?: {
    text: string;
    senderUid: string;
    timestamp: Date;
  };
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  chatId: string;
  senderUid: string;
  text: string;
  type: 'text' | 'image' | 'file';
  replyTo?: string;
  isRead: boolean;
  createdAt: Date;
}

export const chatsApi = {
  /**
   * Get user's chats
   * GET /api/v1/chats
   */
  async getChats(): Promise<{ chats: Chat[] }> {
    return fetchWithAuth('chats');
  },

  /**
   * Start a new chat
   * POST /api/v1/chats/start
   */
  async startChat(
    otherUserId: string,
    relatedTask?: string,
    relatedApplication?: string
  ): Promise<Chat> {
    return fetchWithAuth('chats/start', {
      method: 'POST',
      body: JSON.stringify({
        otherUserId,
        relatedTask,
        relatedApplication,
      }),
    });
  },

  /**
   * Get chat messages
   * GET /api/v1/chats/:chatId/messages?page=1&limit=50
   */
  async getChatMessages(
    chatId: string,
    page: number = 1,
    limit: number = 50
  ): Promise<{ messages: Message[]; pagination: any }> {
    const queryString = `?page=${page}&limit=${limit}`;
    return fetchWithAuth(`chats/${chatId}/messages${queryString}`);
  },

  /**
   * Send a message
   * POST /api/v1/chats/:chatId/messages
   */
  async sendMessage(
    chatId: string,
    text: string,
    type: 'text' | 'image' | 'file' = 'text',
    replyTo?: string
  ): Promise<Message> {
    return fetchWithAuth(`chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        text,
        type,
        replyTo,
      }),
    });
  },

  /**
   * Mark chat as read
   * POST /api/v1/chats/:chatId/read
   */
  async markChatAsRead(chatId: string): Promise<{ success: boolean }> {
    return fetchWithAuth(`chats/${chatId}/read`, {
      method: 'POST',
    });
  },

  /**
   * Get chat details
   * GET /api/v1/chats/:chatId
   */
  async getChatDetails(chatId: string): Promise<Chat> {
    return fetchWithAuth(`chats/${chatId}`);
  },
};

