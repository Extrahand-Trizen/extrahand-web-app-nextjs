"use client";

import { formatDistanceToNow } from "date-fns";
import type { TaskChat, ChatParticipant, UserRole } from "@/types/chat";

interface ChatListItemProps {
   chat: TaskChat;
   otherParticipant: ChatParticipant;
   currentUserRole: UserRole;
   isActive: boolean;
   onClick: () => void;
}

export function ChatListItem({
   chat,
   otherParticipant,
   currentUserRole,
   isActive,
   onClick,
}: ChatListItemProps) {
   const { taskMetadata, lastMessage, unreadCount } = chat;

   return (
      <button
         onClick={onClick}
         className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
            isActive ? "bg-primary-50" : ""
         }`}
      >
         <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="relative shrink-0">
               <div className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-medium">
                  {otherParticipant.name[0].toUpperCase()}
               </div>
               {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center">
                     <span className="text-[10px] font-semibold text-white">
                        {unreadCount}
                     </span>
                  </div>
               )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
               {/* Header Row */}
               <div className="flex items-baseline justify-between gap-2 mb-0.5">
                  <h3
                     className={`text-sm truncate ${
                        unreadCount > 0
                           ? "font-semibold text-gray-900"
                           : "font-medium text-gray-700"
                     }`}
                  >
                     {otherParticipant.name}
                  </h3>
                  {lastMessage && (
                     <span className="text-xs text-gray-500 shrink-0">
                        {formatDistanceToNow(new Date(lastMessage.timestamp), {
                           addSuffix: true,
                        }).replace("about ", "")}
                     </span>
                  )}
               </div>

               {/* Task Title */}
               <p className="text-xs text-gray-600 truncate mb-1">
                  {taskMetadata.taskTitle}
               </p>

               {/* Last Message */}
               {lastMessage && (
                  <p
                     className={`text-xs truncate ${
                        unreadCount > 0
                           ? "font-medium text-gray-900"
                           : "text-gray-500"
                     }`}
                  >
                     {lastMessage.preview}
                  </p>
               )}
            </div>
         </div>
      </button>
   );
}
