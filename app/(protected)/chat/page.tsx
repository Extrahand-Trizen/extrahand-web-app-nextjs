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
import { chatsApi } from "@/lib/api/endpoints/chats";
import type { TaskChat, Message } from "@/types/chat";
import { toast } from "sonner";
import { useUserStore } from "@/lib/state/userStore";
import { useChatSocket } from "@/lib/socket/hooks/useChatSocket";

export default function ChatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialChatId = searchParams.get("chatId");
  
  // Get current user profile from store (contains MongoDB _id)
  const userProfile = useUserStore((state) => state.user);

  const [chats, setChats] = useState<TaskChat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, string[]>>({});

  // Load user's chats on mount
  useEffect(() => {
    async function loadChats() {
      if (!userProfile?._id) {
        console.log("Waiting for user profile to load...");
        return;
      }
      
      try {
        setIsLoadingChats(true);
        const response = await chatsApi.getChats();
        
        const currentUserId = userProfile._id;
        
        // Convert backend chats to TaskChat format
        const convertedChats: TaskChat[] = response.chats.map((chat: any) => {
          const otherParticipantId = chat.otherParticipant?._id;
          
          // Get actual requester and assignee IDs from task details
          // DO NOT use participants array order - it's sorted, not role-based!
          const taskRequesterId = chat.taskDetails?.requesterId;
          const taskAssigneeId = chat.taskDetails?.assigneeId;
          
          // Determine if current user is poster (requester) or tasker (assignee)
          // by comparing their ID with the actual task role IDs
          const currentUserIsPoster = taskRequesterId === currentUserId;
          const otherUserIsPoster = taskRequesterId === otherParticipantId;
          
          // Assign roles based on actual task roles
          const currentUserRole = currentUserIsPoster ? "poster" : "tasker";
          const otherUserRole = otherUserIsPoster ? "poster" : "tasker";

          return {
            _id: chat._id,
            chatId: chat.chatId,
            taskId: chat.relatedTask || "",
            taskMetadata: {
              taskId: chat.relatedTask || "",
              taskTitle: chat.taskDetails?.title || "Task",
              taskStatus: (chat.taskDetails?.status || "assigned") as "assigned" | "open" | "started" | "in_progress" | "review" | "completed" | "cancelled",
              posterId: taskRequesterId,
              posterName: chat.taskDetails?.requesterName || "Task Owner",
              taskerId: taskAssigneeId,
              taskerName: chat.taskDetails?.assigneeName || "Tasker",
            },
            participants: [
              // Current user
              {
                uid: currentUserId,
                name: "You",
                avatar: undefined,
                role: currentUserRole,
              },
              // Other participant
              {
                uid: otherParticipantId,
                name: chat.otherParticipant?.name || "User",
                avatar: chat.otherParticipant?.profileImage,
                role: otherUserRole,
              },
            ],
            lastMessage: chat.lastMessage,
            unreadCount: chat.unreadCount || 0,
            isActive: chat.isActive,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
          };
        });

        setChats(convertedChats);
      } catch (error: any) {
        console.error("Failed to load chats:", error);
        toast.error("Failed to load chats");
      } finally {
        setIsLoadingChats(false);
      }
    }

    if (userProfile?._id) {
      loadChats();
    }
  }, [userProfile?._id]);

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
        
        // Get taskId from active chat
        const chat = chats.find((c) => c.chatId === activeChatId);
        const taskId = chat?.taskId || "";
        
        setMessages((prev) => ({
          ...prev,
          [activeChatId]: response.messages.map((m: any) => {
            // Determine sender name
            // If sender is current user, show "You"
            // Otherwise show the other participant's name
            let senderName = "User";
            
            if (userProfile?._id === m.senderId) {
              // Message from current user
              senderName = "You";
            } else {
              // Message from other participant - find them in participants array
              const otherParticipant = chat?.participants.find(p => p.uid !== userProfile?._id);
              senderName = otherParticipant?.name || "User";
            }

            // Determine initial message status
            const initialStatus = m.status || "sent";
            console.log(`📝 Message ${m._id} loaded with status:`, initialStatus, "from", m.senderId === userProfile._id ? "ME" : "OTHER");

            return {
              _id: m._id,
              chatId: m.chatId,
              taskId: taskId,
              text: m.text,
              senderId: m.senderId,
              senderName: senderName,
              type: m.type,
              status: initialStatus,
              createdAt: new Date(m.createdAt),
              updatedAt: m.updatedAt ? new Date(m.updatedAt) : new Date(m.createdAt),
              readBy: m.readBy || [],
              sender: m.sender,
            };
          }),
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

  // Real-time chat: Listen for new messages via Socket.IO
  const handleNewSocketMessage = useCallback((message: Message) => {
    if (!userProfile?._id) return;
    
    // Only add if it's from the other user (our own messages are added optimistically)
    if (message.senderId !== userProfile._id) {
      const chatId = message.chatId;
      
      setMessages((prev) => {
        const chatMessages = prev[chatId] || [];
        
        // Check if message already exists to avoid duplicates
        if (chatMessages.some((m) => m._id === message._id)) {
          return prev;
        }
        
        return {
          ...prev,
          [chatId]: [...chatMessages, message],
        };
      });
      
      // Update last message in chat list
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.chatId === chatId
            ? {
                ...chat,
                lastMessage: {
                  text: message.text,
                  senderId: message.senderId,
                  timestamp: message.createdAt,
                },
                unreadCount: activeChatId === chatId ? 0 : (chat.unreadCount || 0) + 1,
              }
            : chat
        )
      );
    }
  }, [userProfile, activeChatId]);

  // Handle typing indicators
  const handleTyping = useCallback(
    (data: { profileId: string; isTyping: boolean }) => {
      if (!activeChatId) return;

      console.log("👨‍💻 Typing event received:", data, "Current chat:", activeChatId);

      setTypingUsers((prev) => {
        const chatTyping = prev[activeChatId] || [];

        if (data.isTyping) {
          // Add user to typing list if not already there
          if (!chatTyping.includes(data.profileId)) {
            console.log("✅ Adding user to typing list:", data.profileId);
            return {
              ...prev,
              [activeChatId]: [...chatTyping, data.profileId],
            };
          }
        } else {
          // Remove user from typing list
          console.log("❌ Removing user from typing list:", data.profileId);
          return {
            ...prev,
            [activeChatId]: chatTyping.filter((id) => id !== data.profileId),
          };
        }

        return prev;
      });
    },
    [activeChatId]
  );

  // Handle read receipts
  const handleMessageRead = useCallback(
    (data: { userId: string; chatId: string }) => {
      console.log("✅ Message read event received:", data);
      
      // Only update if we're NOT the one who read (i.e., someone else read our messages)
      if (data.userId === userProfile?._id) {
        console.log("⏭️ Skipping - this is our own read receipt");
        return;
      }
      
      // Mark all OUR messages in this chat as read (if not already)
      if (data.chatId) {
        setMessages((prev) => {
          const chatMessages = prev[data.chatId];
          
          if (!chatMessages) {
            return prev;
          }
          
          // Check if any of our messages need updating
          const hasUnreadMessages = chatMessages.some(
            (msg) => msg.senderId === userProfile?._id && msg.status !== "read"
          );
          
          if (!hasUnreadMessages) {
            console.log("⏭️ All our messages already marked as read");
            return prev; // No update needed
          }
          
          console.log(`📝 Updating unread messages to 'read' status`);
          
          // Create new array with updated messages (only our unread messages)
          const updatedMessages = chatMessages.map((msg) => {
            // Only update our messages that aren't already read
            if (msg.senderId === userProfile?._id && msg.status !== "read") {
              console.log(`✓ Message ${msg._id}: ${msg.status} -> read`);
              return {
                ...msg,
                status: "read" as const,
              };
            }
            return msg;
          });
          
          return {
            ...prev,
            [data.chatId]: updatedMessages,
          };
        });
      }
    },
    [userProfile?._id]
  );

  // Initialize Socket.IO for real-time updates
  const { emitTypingStart, emitTypingStop } = useChatSocket({
    chatId: activeChatId,
    onNewMessage: handleNewSocketMessage,
    onTyping: handleTyping,
    onMessageRead: handleMessageRead,
  });

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
      if (!activeChatId || !activeChat || !userProfile?._id) return;

      const optimisticId = `temp_${Date.now()}`;
      const optimistic: Message = {
        _id: optimisticId,
        chatId: activeChatId,
        taskId: activeChat.taskId,
        text,
        senderId: userProfile._id,
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
                    senderId: userProfile._id,
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
    [activeChatId, activeChat, userProfile?._id]
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
              currentUserId={userProfile?._id || ""}
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
              currentUserId={userProfile?._id || ""}
              onSendMessage={handleSendMessage}
              onBack={handleBack}
              onViewTask={handleViewTask}
              isLoading={isLoadingMessages}
              typingUsers={typingUsers[activeChatId] || []}
              onTypingStart={emitTypingStart}
              onTypingStop={emitTypingStop}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
