"use client";

/**
 * FloatingChatWidget - Floating chat button and panel
 * Can be opened/closed via button in bottom-right corner
 */

import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageBubble } from "@/components/chat/MessageBubble";
import type { Message } from "@/types/chat";
import { format, isToday, isYesterday } from "date-fns";
import { cn } from "@/lib/utils";

interface FloatingChatWidgetProps {
   taskId: string;
   otherUserId: string;
   otherUserName: string;
   currentUserId: string;
   messages: Message[];
   onSendMessage: (text: string) => Promise<void>;
   isLoading?: boolean;
}

export function FloatingChatWidget({
   taskId: _taskId,
   otherUserId: _otherUserId,
   otherUserName,
   currentUserId,
   messages,
   onSendMessage,
   isLoading = false,
}: FloatingChatWidgetProps) {
   const [isOpen, setIsOpen] = useState(false);
   const [message, setMessage] = useState("");
   const [isSending, setIsSending] = useState(false);
   const [unreadCount, setUnreadCount] = useState(0);
   const scrollRef = useRef<HTMLDivElement>(null);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   // Scroll to bottom when messages change
   useEffect(() => {
      if (scrollRef.current && isOpen) {
         scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
   }, [messages, isOpen]);

   // Track unread messages when chat is closed
   useEffect(() => {
      if (!isOpen && messages.length > 0) {
         // Count messages from other user that are newer than last seen
         const lastMessage = messages[messages.length - 1];
         if (lastMessage.senderId !== currentUserId) {
            setUnreadCount((prev) => prev + 1);
         }
      }
   }, [messages, isOpen, currentUserId]);

   // Clear unread count when opening chat
   useEffect(() => {
      if (isOpen) {
         setUnreadCount(0);
      }
   }, [isOpen]);

   const handleSend = async () => {
      const trimmedMessage = message.trim();
      if (!trimmedMessage || isSending) return;

      setIsSending(true);
      try {
         await onSendMessage(trimmedMessage);
         setMessage("");
         textareaRef.current?.focus();
      } catch (error) {
         console.error("Send message error:", error);
      } finally {
         setIsSending(false);
      }
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         handleSend();
      }
   };

   const getDateLabel = (date: Date) => {
      if (isToday(date)) return "Today";
      if (isYesterday(date)) return "Yesterday";
      return format(date, "MMM d");
   };

   return (
      <>
         {/* Floating Toggle Button */}
         <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
               "fixed bottom-6 right-6 z-50",
               "w-14 h-14 rounded-full shadow-lg",
               "flex items-center justify-center",
               "bg-primary-600 hover:bg-primary-700",
               "text-white transition-all duration-200",
               "hover:scale-110 active:scale-95",
               isOpen && "scale-0 opacity-0"
            )}
            aria-label="Toggle chat"
         >
            <MessageCircle className="w-6 h-6" />
            {unreadCount > 0 && (
               <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md">
                  {unreadCount > 9 ? "9+" : unreadCount}
               </span>
            )}
         </button>

         {/* Floating Chat Panel */}
         <div
            className={cn(
               "fixed bottom-6 right-6 z-50",
               "w-[380px] h-[550px]",
               "bg-white rounded-2xl shadow-2xl",
               "flex flex-col overflow-hidden",
               "border border-secondary-200",
               "transition-all duration-300 ease-out",
               isOpen
                  ? "scale-100 opacity-100 pointer-events-auto"
                  : "scale-95 opacity-0 pointer-events-none"
            )}
         >
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-secondary-200 bg-gradient-to-r from-primary-500 to-primary-600">
               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-4 h-4 text-white" />
               </div>
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                     {otherUserName}
                  </p>
                  <p className="text-xs text-white/80">Task Chat</p>
               </div>
               <div className="flex items-center gap-1">
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => setIsOpen(false)}
                     className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
                  >
                     <Minimize2 className="w-4 h-4" />
                  </Button>
                  <Button
                     variant="ghost"
                     size="icon"
                     onClick={() => setIsOpen(false)}
                     className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
                  >
                     <X className="w-4 h-4" />
                  </Button>
               </div>
            </div>

            {/* Messages Area */}
            <div
               ref={scrollRef}
               className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0 bg-secondary-50/30"
            >
               {isLoading && messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                     <div className="text-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto mb-2" />
                        <p className="text-xs text-secondary-500">
                           Loading...
                        </p>
                     </div>
                  </div>
               ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                     <div className="text-center max-w-[200px]">
                        <MessageCircle className="w-10 h-10 text-secondary-300 mx-auto mb-3" />
                        <p className="text-sm text-secondary-500">
                           No messages yet. Start the conversation!
                        </p>
                     </div>
                  </div>
               ) : (
                  messages.map((msg, index) => {
                     const showDate =
                        index === 0 ||
                        new Date(msg.createdAt).getDate() !==
                           new Date(messages[index - 1].createdAt).getDate();

                     return (
                        <div key={msg._id}>
                           {showDate && (
                              <div className="flex justify-center my-3">
                                 <span className="text-xs text-secondary-500 px-3 py-1 bg-white border border-secondary-200 rounded-full shadow-sm">
                                    {getDateLabel(new Date(msg.createdAt))}
                                 </span>
                              </div>
                           )}
                           <MessageBubble
                              message={msg}
                              isCurrentUser={msg.senderId === currentUserId}
                              showAvatar={false}
                              showTimestamp={false}
                           />
                        </div>
                     );
                  })
               )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-secondary-200 bg-white">
               <div className="flex items-end gap-2">
                  <Textarea
                     ref={textareaRef}
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     onKeyDown={handleKeyDown}
                     placeholder="Type a message..."
                     disabled={isSending}
                     className="min-h-[44px] max-h-32 resize-none text-sm border-secondary-300 focus:border-primary-500 focus:ring-primary-500 rounded-lg"
                     rows={1}
                  />
                  <Button
                     type="button"
                     size="icon"
                     onClick={handleSend}
                     disabled={!message.trim() || isSending}
                     className="h-11 w-11 shrink-0 bg-primary-600 hover:bg-primary-700 rounded-lg shadow-sm"
                  >
                     {isSending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                     ) : (
                        <Send className="w-4 h-4" />
                     )}
                  </Button>
               </div>
            </div>
         </div>
      </>
   );
}
