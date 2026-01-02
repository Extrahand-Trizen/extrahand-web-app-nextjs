"use client";

/**
 * Task-based Chat Page - Real API Integration
 * - Loads chats from backend
 * - Real-time message sending
 * - Proper error handling
 */

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatList, ConversationView } from "@/components/chat";
import { chatsApi, type Message } from "@/lib/api/endpoints/chats";
import { toast } from "sonner";

// Convert backend chat to TaskChat format for components
interface TaskChat {
  _id: string;
  chatId: string;
  taskId: string;
  taskMetadata: {
    taskId: string;
    taskTitle: string;
    taskStatus: string;
    posterId: string;
    posterName: string;
    taskerId?: string;
    taskerName?: string;
  };
  participants: Array<{
    uid: string;
    name: string;
    avatar?: string;
    role: "poster" | "tasker";
  }>;
  lastMessage?: {
    text: string;
    senderId: string;
    timestamp: Date;
  };
  unreadCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get("chatId");

  const [chats, setChats] = useState<TaskChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>("");

  // Load user's chats on mount
  useEffect(() => {
    async function loadChats() {
      try {
        setIsLoadingChats(true);
        const response = await chatsApi.getChats();
        
        // Convert backend chats to TaskChat format
        const convertedChats: TaskChat[] = response.chats.map((chat: any) => ({
          _id: chat._id,
          chatId: chat.chatId,
          taskId: chat.relatedTask || "",
          taskMetadata: {
            taskId: chat.relatedTask || "",
            taskTitle: "Task", // TODO: Fetch from task service if needed
            taskStatus: "assigned" as const,
            posterId: chat.participants[0] || "",
            posterName: chat.otherParticipant?.name || "User",
            taskerId: chat.participants[1],
            taskerName: chat.otherParticipant?.name || "User",
          },
          participants: chat.participants.map((p: string, idx: number) => ({
            uid: p,
            name: idx === 0 ? "You" : chat.otherParticipant?.name || "User",
            avatar: chat.otherParticipant?.profileImage,
            role: idx === 0 ? "poster" : "tasker",
          })),
          lastMessage: chat.lastMessage,
          unreadCount: chat.unreadCount || 0,
          isActive: chat.isActive,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
        }));

        setChats(convertedChats);
        
        // Get current user ID from first chat
        if (convertedChats.length > 0) {
          setCurrentUserId(convertedChats[0].participants[0].uid);
        }
      } catch (error: any) {
        console.error("Failed to load chats:", error);
        toast.error("Failed to load chats");
      } finally {
        setIsLoadingChats(false);
      }
    }

    loadChats();
  }, []);

  // Auto-select chat from URL
  useEffect(() => {
    if (initialChatId && chats.length > 0) {
      setActiveChatId(initialChatId);
    }
  }, [initialChatId, chats]);

  // Load messages when chat is selected
  useEffect(() => {
    async function loadMessages() {
      if (!activeChatId) return;
      
      // Skip if messages already loaded
      if (messages[activeChatId]) return;

      try {
        setIsLoadingMessages(true);
        const response = await chatsApi.getChatMessages(activeChatId);
        
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: response.messages.map((m: any) => ({
            _id: m._id,
            chatId: m.chatId,
            taskId: "", // Not needed for display
            text: m.text,
            senderId: m.senderId,
            senderName: m.sender?.name || "User",
            type: m.type,
            status: m.status,
            createdAt: new Date(m.createdAt),
            updatedAt: m.updatedAt ? new Date(m.updatedAt) : new Date(m.createdAt),
            readBy: m.readBy || [],
            sender: m.sender,
          })),
        }));

        // Mark chat as read
        await chatsApi.markChatAsRead(activeChatId);
      } catch (error: any) {
        console.error("Failed to load messages:", error);
        toast.error("Failed to load messages");
      } finally {
        setIsLoadingMessages(false);
      }
    }

    loadMessages();
  }, [activeChatId, messages]);

  const activeChat = chats.find((c) => c.chatId === activeChatId) || null;
  const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

  const handleChatSelect = useCallback((chatId: string) => {
    setActiveChatId(chatId);
    window.history.pushState({}, "", `/chat?chatId=${chatId}`);
  }, []);

  const handleBack = useCallback(() => {
    setActiveChatId(null);
    window.history.pushState({}, "", "/chat");
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      if (!activeChatId || !activeChat) return;

      const optimisticId = `temp_${Date.now()}`;
      const optimistic: Message = {
        _id: optimisticId,
        chatId: activeChatId,
        taskId: activeChat.taskId,
        text,
        senderId: currentUserId,
        senderName: "You",
        type: "text",
        status: "sending",
        createdAt: new Date(),
        readBy: [],
      };

      // Optimistic update
      setMessages((prev) => ({
        ...prev,
        [activeChatId]: [...(prev[activeChatId] || []), optimistic],
      }));

      try {
        // Send message to API
        const response = await chatsApi.sendMessage(activeChatId, text);

        // Replace optimistic message with real one
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: (prev[activeChatId] || []).map((m) =>
            m._id === optimisticId
              ? {
                  ...m,
                  _id: response._id,
                  status: "sent",
                  createdAt: new Date(response.createdAt),
                }
              : m
          ),
        }));

        // Update chat's last message
        setChats((prev) =>
          prev.map((chat) =>
            chat.chatId === activeChatId
              ? {
                  ...chat,
                  lastMessage: {
                    text,
                    senderId: currentUserId,
                    timestamp: new Date(),
                  },
                }
              : chat
          )
        );
      } catch (error: any) {
        console.error("Failed to send message:", error);
        
        // Mark message as failed
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: (prev[activeChatId] || []).map((m) =>
            m._id === optimisticId ? { ...m, status: "failed" } : m
          ),
        }));
        
        toast.error("Failed to send message");
      }
    },
    [activeChatId, activeChat, currentUserId]
  );

  const handleViewTask = useCallback(
    (taskId: string) => {
      router.push(`/tasks/${taskId}`);
    },
    [router]
  );

  if (isLoadingChats) {
    return (
      <div className="w-full max-w-7xl mx-auto md:px-4 md:py-3">
        <div className="h-[calc(100vh-80px)] min-h-[500px] bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading chats...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto md:px-4 md:py-3">
      {/* Fixed height container that respects footer */}
      <div className="h-[calc(100vh-80px)] min-h-[500px] bg-white overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] h-full">
          {/* Conversation List */}
          <div
            className={`h-full border-r border-gray-200 ${
              activeChatId ? "hidden lg:flex" : "flex"
            } flex-col overflow-hidden`}
          >
            <ChatList
              chats={chats}
              currentUserId={currentUserId}
              activeChat={activeChatId}
              onChatSelect={handleChatSelect}
            />
          </div>

          {/* Chat Area */}
          <div
            className={`h-full ${
              activeChatId ? "flex" : "hidden lg:flex"
            } flex-col overflow-hidden`}
          >
            <ConversationView
              chat={activeChat}
              messages={activeMessages}
              currentUserId={currentUserId}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
              onViewTask={handleViewTask}
              isLoading={isLoadingMessages}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
