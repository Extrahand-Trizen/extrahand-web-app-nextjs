"use client";

/**
 * Task-based Chat Page (Fixed Layout)
 * - Properly constrained height
 * - No overflow issues
 * - Works with footer
 * - Shows empty state by default
 */

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChatList, ConversationView } from "@/components/chat";
import {
   mockTaskChats,
   mockChatMessages,
   CURRENT_USER_ID,
} from "@/lib/data/mockChatData";
import type { Message, TaskChat } from "@/types/chat";
import { toast } from "sonner";

export default function ChatPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const initialChatId = searchParams.get("chatId");

   const [chats] = useState<TaskChat[]>(mockTaskChats);
   const [activeChatId, setActiveChatId] = useState<string | null>(null);
   const [messages, setMessages] =
      useState<Record<string, Message[]>>(mockChatMessages);
   const [isLoadingMessages] = useState(false);

   // Only auto-select if chatId is in URL
   useEffect(() => {
      if (initialChatId) {
         setActiveChatId(initialChatId);
      }
   }, [initialChatId]);

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

         const optimistic: Message = {
            _id: `temp_${Date.now()}`,
            chatId: activeChatId,
            taskId: activeChat.taskId,
            text,
            senderId: CURRENT_USER_ID,
            senderName: "You",
            type: "text",
            status: "sending",
            createdAt: new Date(),
            readBy: [],
         };

         setMessages((prev) => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), optimistic],
         }));

         try {
            await new Promise((r) => setTimeout(r, 500));

            setMessages((prev) => ({
               ...prev,
               [activeChatId]: (prev[activeChatId] || []).map((m) =>
                  m._id === optimistic._id
                     ? { ...m, _id: `msg_${Date.now()}`, status: "sent" }
                     : m
               ),
            }));

            setTimeout(() => {
               setMessages((prev) => ({
                  ...prev,
                  [activeChatId]: (prev[activeChatId] || []).map((m) =>
                     m.createdAt === optimistic.createdAt
                        ? { ...m, status: "delivered" }
                        : m
                  ),
               }));
            }, 800);
         } catch {
            setMessages((prev) => ({
               ...prev,
               [activeChatId]: (prev[activeChatId] || []).map((m) =>
                  m._id === optimistic._id ? { ...m, status: "failed" } : m
               ),
            }));
            toast.error("Failed to send message");
         }
      },
      [activeChatId, activeChat]
   );

   const handleViewTask = useCallback(
      (taskId: string) => {
         router.push(`/tasks/${taskId}`);
      },
      [router]
   );

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
                     currentUserId={CURRENT_USER_ID}
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
                     currentUserId={CURRENT_USER_ID}
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
