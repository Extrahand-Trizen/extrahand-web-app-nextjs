"use client";

import { useState } from "react";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChatListItem } from "./ChatListItem";
import type { TaskChat } from "@/types/chat";

interface ChatListProps {
   chats: TaskChat[];
   currentUserId: string;
   activeChat: string | null;
   onChatSelect: (chatId: string) => void;
   isLoading?: boolean;
}

export function ChatList({
   chats,
   currentUserId,
   activeChat,
   onChatSelect,
   isLoading = false,
}: ChatListProps) {
   const [searchQuery, setSearchQuery] = useState("");

   const filteredChats = chats.filter((chat) => {
      const query = searchQuery.toLowerCase();
      return (
         chat.taskMetadata.taskTitle.toLowerCase().includes(query) ||
         chat.participants.some((p) => p.name.toLowerCase().includes(query))
      );
   });

   // Group chats by status
   const activeChats = filteredChats.filter(
      (c) =>
         c.taskMetadata.taskStatus === "assigned" ||
         c.taskMetadata.taskStatus === "started" ||
         c.taskMetadata.taskStatus === "in_progress"
   );
   const completedChats = filteredChats.filter(
      (c) => c.taskMetadata.taskStatus === "completed"
   );
   const otherChats = filteredChats.filter(
      (c) =>
         c.taskMetadata.taskStatus !== "assigned" &&
         c.taskMetadata.taskStatus !== "started" &&
         c.taskMetadata.taskStatus !== "in_progress" &&
         c.taskMetadata.taskStatus !== "completed"
   );

   if (isLoading) {
      return (
         <Card className="h-full flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4" />
               <p className="text-sm text-secondary-600">Loading chats...</p>
            </div>
         </Card>
      );
   }

   if (chats.length === 0) {
      return (
         <Card className="h-full flex items-center justify-center p-8">
            <div className="text-center max-w-sm">
               <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-secondary-400" />
               </div>
               <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  No chats yet
               </h3>
               <p className="text-sm text-secondary-600">
                  Chats will appear here when you assign a task to a tasker or
                  get assigned to a task.
               </p>
            </div>
         </Card>
      );
   }

   const renderChatSection = (chatsToRender: TaskChat[], title: string) => {
      if (chatsToRender.length === 0) return null;

      return (
         <div className="mb-2">
            <div className="px-4 py-2 bg-gray-50">
               <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {title}
               </h3>
            </div>
            {chatsToRender.map((chat) => {
               const otherParticipant = chat.participants.find(
                  (p) => p.uid !== currentUserId
               );
               const currentUserRole =
                  chat.participants.find((p) => p.uid === currentUserId)
                     ?.role || "poster";

               if (!otherParticipant) return null;

               return (
                  <ChatListItem
                     key={chat._id}
                     chat={chat}
                     otherParticipant={otherParticipant}
                     currentUserRole={currentUserRole}
                     isActive={activeChat === chat.chatId}
                     onClick={() => onChatSelect(chat.chatId)}
                  />
               );
            })}
         </div>
      );
   };

   return (
      <div className="h-full flex flex-col bg-white">
         {/* Search */}
         <div className="flex-none p-4 border-b border-gray-200 bg-white">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
               <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-10 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
               />
            </div>
         </div>

         {/* Chat List - Scrollable */}
         <div className="flex-1 min-h-0 overflow-y-auto">
            {filteredChats.length === 0 ? (
               <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No conversations yet</p>
               </div>
            ) : (
               <div className="pb-4">
                  {renderChatSection(activeChats, "Active Tasks")}
                  {activeChats.length > 0 && completedChats.length > 0 && (
                     <Separator className="my-2" />
                  )}
                  {renderChatSection(completedChats, "Completed")}
                  {(activeChats.length > 0 || completedChats.length > 0) &&
                     otherChats.length > 0 && <Separator className="my-2" />}
                  {renderChatSection(otherChats, "Other")}
               </div>
            )}
         </div>
      </div>
   );
}
