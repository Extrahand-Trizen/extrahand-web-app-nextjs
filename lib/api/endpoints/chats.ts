/**
 * Chats API endpoints
 * Matches task-connect-relay routes/chats.js
 */

import { fetchWithAuth } from '../client';

export interface Chat {
  _id: string;
  chatId: string;  // Format: "chat_uid1_uid2"
  participants: string[];  // Array of MongoDB user IDs
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Date;
  };
  otherParticipant?: {   // Profile data from chat service
    uid: string;
    name: string;
    profileImage?: string;
  };
  relatedTask?: string;
  relatedApplication?: string;
  unreadCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  text: string;
  type: 'text' | 'image' | 'file' | 'system';
  status: 'sent' | 'delivered' | 'read' | 'sending' | 'failed';
  metadata?: {
    fileName?: string;
    fileSize?: number;
    fileType?: string;
    fileUrl?: string;
    replyTo?: string;
  };
  sender?: {             // Sender profile data
    uid: string;
    name: string;
    profileImage?: string;
  };
  // Frontend-only fields for compatibility with old types
  taskId?: string;
  senderName?: string;
  readBy?: Array<{
    userId: string;
    readAt: Date;
  }>;
  createdAt: Date;
  updatedAt?: Date;
}

export const chatsApi = {
  /**
   * Get user's chats
   * GET /api/v1/chats
   */
  async getChats(): Promise<{ chats: Chat[] }> {
    const response = await fetchWithAuth('chats');
    return response.data || { chats: [] };
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
    const response = await fetchWithAuth('chats/start', {
      method: 'POST',
      body: JSON.stringify({
        otherUserId,
        relatedTask,
        relatedApplication,
      }),
    });
    // API returns: { success, data: { chat } }
    return response.data?.chat || response.data || response;
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
    const response = await fetchWithAuth(`chats/${chatId}/messages${queryString}`);
    // API returns: { success, data: [...], pagination }
    // We need: { messages: [...], pagination }
    return {
      messages: response.data || [],
      pagination: response.pagination || {}
    };
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
    const response = await fetchWithAuth(`chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        text,
        type,
        replyTo,
      }),
    });
    // API returns: { success, data: { message: {...} } }
    return response.data?.message || response.data || response;
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
    const response = await fetchWithAuth(`chats/${chatId}`);
    // API returns: { success, data: { chat } }
    return response.data?.chat || response.data || response;
  },

  /**
   * Start a chat for a task (with validation)
   * POST /api/v1/chats/task/:taskId/start
   * 
   * This validates that the current user is either the poster or assigned tasker
   * before allowing chat creation.
   */
  async startChatForTask(taskId: string): Promise<{ chat: Chat }> {
    const response = await fetchWithAuth(`chats/task/${taskId}/start`, {
      method: 'POST',
    });
    return response.data || { chat: null };
  },
};

