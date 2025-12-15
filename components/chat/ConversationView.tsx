"use client";

import { ArrowLeft, MoreVertical, ExternalLink, Flag, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { MessageList } from "./MessageList";
import { MessageComposer } from "./MessageComposer";
import type { TaskChat, Message } from "@/types/chat";

interface ConversationViewProps {
   chat: TaskChat | null;
   messages: Message[];
   currentUserId: string;
   onSendMessage: (text: string) => Promise<void>;
   onBack?: () => void;
   onViewTask?: (taskId: string) => void;
   isLoading?: boolean;
}

export function ConversationView({
   chat,
   messages,
   currentUserId,
   onSendMessage,
   onBack,
   onViewTask,
   isLoading = false,
}: ConversationViewProps) {
   if (!chat) {
      return (
         <Card className="h-full flex items-center justify-center">
            <div className="text-center max-w-sm p-8">
               <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mx-auto mb-4">
                  <ArrowLeft className="w-8 h-8 text-secondary-400" />
               </div>
               <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  Select a chat
               </h3>
               <p className="text-sm text-secondary-600">
                  Choose a conversation from the list to start messaging
               </p>
            </div>
         </Card>
      );
   }

   const otherParticipant = chat.participants.find(
      (p) => p.uid !== currentUserId
   );
   const currentUserRole =
      chat.participants.find((p) => p.uid === currentUserId)?.role || "poster";

   const isChatActive =
      chat.isActive &&
      (chat.taskMetadata.taskStatus === "assigned" ||
         chat.taskMetadata.taskStatus === "started" ||
         chat.taskMetadata.taskStatus === "in_progress");

   const getStatusBadge = () => {
      const status = chat.taskMetadata.taskStatus;
      if (status === "completed") {
         return (
            <Badge className="bg-green-50 text-green-700 border-green-200 text-[9px] md:text-xs">
               Completed
            </Badge>
         );
      }
      if (status === "in_progress" || status === "started") {
         return (
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[9px] md:text-xs">
               Active
            </Badge>
         );
      }
      if (status === "assigned") {
         return (
            <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[9px] md:text-xs">
               Assigned
            </Badge>
         );
      }
      if (status === "cancelled") {
         return (
            <Badge variant="secondary" className="text-[9px] md:text-xs">
               Cancelled
            </Badge>
         );
      }
      return null;
   };

   return (
      <div className="h-full flex flex-col">
         {/* Compact Task Header */}
         <div className="flex-none bg-white">
            {/* User Info Row */}
            <div className="flex items-center gap-3 px-4 py-3">
               {onBack && (
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={onBack}
                     className="lg:hidden shrink-0 -ml-2"
                  >
                     <ArrowLeft className="w-5 h-5 text-gray-700" />
                  </Button>
               )}

               {otherParticipant && (
                  <>
                     <div className="w-9 h-9 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-medium shrink-0">
                        {otherParticipant.name[0].toUpperCase()}
                     </div>
                     <div className="flex-1 min-w-0">
                        <h2 className="text-sm font-semibold text-gray-900 truncate">
                           {otherParticipant.name}
                        </h2>
                        <p className="text-xs text-gray-500">
                           {otherParticipant.role === "poster"
                              ? "Task Poster"
                              : "Tasker"}
                        </p>
                     </div>
                  </>
               )}

               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="shrink-0">
                        <MoreVertical className="w-5 h-5 text-gray-500" />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                     <DropdownMenuItem
                        onClick={() => onViewTask?.(chat.taskId)}
                        className="cursor-pointer"
                     >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Task Details
                     </DropdownMenuItem>
                     <DropdownMenuSeparator />
                     <DropdownMenuItem className="cursor-pointer text-orange-600">
                        <Flag className="w-4 h-4 mr-2" />
                        Report Issue
                     </DropdownMenuItem>
                     <DropdownMenuItem className="cursor-pointer text-red-600">
                        <Ban className="w-4 h-4 mr-2" />
                        Block User
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>

            {/* Task Context Bar */}
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
               <div className="flex items-center gap-3 text-[10px] md:text-xs">
                  <span className="text-gray-600">Task:</span>
                  <span className="font-medium text-gray-900 truncate flex-1">
                     {chat.taskMetadata.taskTitle}
                  </span>
                  {getStatusBadge()}
               </div>
            </div>
         </div>

         {/* Messages */}
         <div className="flex-1 min-h-0 overflow-hidden bg-white">
            <MessageList
               messages={messages}
               currentUserId={currentUserId}
               isLoading={isLoading}
            />
         </div>

         {/* Input */}
         <div className="flex-none border-t border-gray-200 bg-white">
            <MessageComposer
               onSendMessage={onSendMessage}
               disabled={!isChatActive}
               placeholder={
                  isChatActive
                     ? "Type a message..."
                     : "This conversation is closed"
               }
            />
         </div>
      </div>
   );
}
