"use client";

import { useRef, useEffect, useCallback } from "react";
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
   const bottomRef = useRef<HTMLDivElement>(null);

   // Aggressive auto-scroll to bottom
   const scrollToBottom = useCallback(() => {
      if (scrollRef.current) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
      // Also try scrollIntoView as backup
      if (bottomRef.current) {
         bottomRef.current.scrollIntoView({ block: 'end', inline: 'nearest' });
      }
   }, []);

   // Scroll on messages change - multiple attempts
   useEffect(() => {
      // Immediate
      scrollToBottom();
      
      // After 10ms (for DOM update)
      const timer1 = setTimeout(scrollToBottom, 10);
      
      // After 100ms (for images/content)
      const timer2 = setTimeout(scrollToBottom, 100);
      
      // After 300ms (final safety net)
      const timer3 = setTimeout(scrollToBottom, 300);

      return () => {
         clearTimeout(timer1);
         clearTimeout(timer2);
         clearTimeout(timer3);
      };
   }, [messages, scrollToBottom]);

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
                  
                  // Show avatar if:
                  // 1. First message in group, OR
                  // 2. Different sender from previous, OR
                  // 3. Same sender but more than 1 minutes gap
                  const showAvatar = !prevMessage || 
                     prevMessage.senderId !== message.senderId ||
                     (new Date(message.createdAt).getTime() - new Date(prevMessage.createdAt).getTime()) > 1 * 60 * 1000;
                  
                  // Show timestamp if:
                  // 1. Last message in group, OR
                  // 2. Next message from different sender, OR
                  // 3. Next message more than 1 minute later
                  const nextMessage = group.messages[index + 1];
                  // The original `showTimestamp` calculation is removed as it's now always true.
                  // const showTimestamp =
                  //    index === group.messages.length - 1 ||
                  //    !nextMessage ||
                  //    nextMessage.senderId !== message.senderId ||
                  //    (new Date(nextMessage.createdAt).getTime() - new Date(message.createdAt).getTime()) > 1 * 60 * 1000;

                  return (
                     <MessageBubble
                        key={message._id}
                        message={message}
                        isCurrentUser={message.senderId === currentUserId}
                        showAvatar={showAvatar}
                        showTimestamp={true}
                     />
                  );
               })}
            </div>
         ))}
         {/* Scroll anchor */}
         <div ref={bottomRef} style={{ height: 1 }} />
      </div>
   );
}

