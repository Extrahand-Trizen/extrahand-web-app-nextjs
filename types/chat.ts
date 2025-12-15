/**
 * Chat type definitions for task-based marketplace
 * Each chat is scoped to a single task
 */

export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
export type UserRole = 'poster' | 'tasker';

export interface ChatParticipant {
  uid: string;
  name: string;
  avatar?: string;
  role: UserRole; // Role in this specific task
}

export interface TaskChatMetadata {
  taskId: string;
  taskTitle: string;
  taskStatus: 'open' | 'assigned' | 'started' | 'in_progress' | 'review' | 'completed' | 'cancelled';
  posterId: string;
  posterName: string;
  taskerId?: string;
  taskerName?: string;
  assignedAt?: Date;
}

export interface Message {
  _id: string;
  chatId: string; // Derived from taskId
  taskId: string;
  text: string;
  senderId: string;
  senderName: string;
  type: 'text' | 'image' | 'system';
  status: MessageStatus;
  createdAt: Date;
  updatedAt?: Date;
  readBy: Array<{
    userId: string;
    readAt: Date;
  }>;
}

export interface TaskChat {
  _id: string;
  chatId: string; // taskId-based unique identifier
  taskId: string;
  taskMetadata: TaskChatMetadata;
  participants: ChatParticipant[];
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Date;
    preview?: string;
  };
  unreadCount: number;
  isActive: boolean; // Can chat if task is assigned and not completed/cancelled
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatListItem {
  chat: TaskChat;
  otherParticipant: ChatParticipant;
  currentUserRole: UserRole;
}

export interface SendMessagePayload {
  chatId: string;
  taskId: string;
  text: string;
  type?: 'text' | 'image';
}

export interface MessageGroup {
  senderId: string;
  senderName: string;
  messages: Message[];
  timestamp: Date;
}
