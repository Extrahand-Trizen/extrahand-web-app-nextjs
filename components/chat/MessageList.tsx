"use client";

import { useRef, useEffect } from "react";
import { format, isSameDay, isToday, isYesterday } from "date-fns";
import { MessageBubble } from "./MessageBubble";
import type { Message } from "@/types/chat";

interface MessageListProps {
   messages: Message[];
   currentUserId: string;
   isLoading?: boolean;
}

export function MessageList({
   messages,
   currentUserId,
   isLoading = false,
}: MessageListProps) {
   const scrollRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
      // Scroll to bottom when new messages arrive
      if (scrollRef.current) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
   }, [messages]);

   const getDateLabel = (date: Date) => {
      if (isToday(date)) return "Today";
      if (isYesterday(date)) return "Yesterday";
      return format(date, "MMMM d, yyyy");
   };

   const groupedMessages: { date: Date; messages: Message[] }[] = [];

   messages.forEach((message) => {
      const messageDate = new Date(message.createdAt);
      const lastGroup = groupedMessages[groupedMessages.length - 1];

      if (lastGroup && isSameDay(lastGroup.date, messageDate)) {
         lastGroup.messages.push(message);
      } else {
         groupedMessages.push({
            date: messageDate,
            messages: [message],
         });
      }
   });

   if (isLoading) {
      return (
         <div className="h-full flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3" />
               <p className="text-sm text-gray-500">Loading...</p>
            </div>
         </div>
      );
   }

   if (messages.length === 0) {
      return (
         <div className="h-full flex items-center justify-center p-8">
            <p className="text-sm text-gray-500">No messages yet</p>
         </div>
      );
   }

   return (
      <div className="h-full overflow-y-auto px-4 py-6" ref={scrollRef}>
         {groupedMessages.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
               {/* Date */}
               <div className="flex justify-center mb-4">
                  <span className="text-[10px] md:text-xs font-medium text-gray-500 px-3 py-1 bg-gray-100 rounded-full">
                     {getDateLabel(group.date)}
                  </span>
               </div>
               {/* Messages */}
               {group.messages.map((message, index) => {
                  const isCurrentUser = message.senderId === currentUserId;
                  const prevMessage = group.messages[index - 1];
                  const showAvatar =
                     !prevMessage || prevMessage.senderId !== message.senderId;
                  const showTimestamp =
                     index === group.messages.length - 1 ||
                     group.messages[index + 1]?.senderId !== message.senderId;

                  return (
                     <MessageBubble
                        key={message._id}
                        message={message}
                        isCurrentUser={isCurrentUser}
                        showAvatar={showAvatar}
                        showTimestamp={showTimestamp}
                     />
                  );
               })}
            </div>
         ))}
      </div>
   );
}
