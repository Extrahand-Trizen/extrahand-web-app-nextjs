"use client";

import { format } from "date-fns";
import { Check, CheckCheck, Clock, XCircle } from "lucide-react";
import type { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
   message: Message;
   isCurrentUser: boolean;
   showAvatar?: boolean;
   showTimestamp?: boolean;
}

export function MessageBubble({
   message,
   isCurrentUser,
   showAvatar = true,
   showTimestamp = false,
}: MessageBubbleProps) {
   const getStatusIcon = () => {
      switch (message.status) {
         case "sending":
            return <Clock className="w-3 h-3 text-secondary-400" />;
         case "sent":
            return <Check className="w-3 h-3 text-secondary-400" />;
         case "delivered":
            return <CheckCheck className="w-3 h-3 text-secondary-400" />;
         case "read":
            return <CheckCheck className="w-3 h-3 text-blue-600" />;
         case "failed":
            return <XCircle className="w-3 h-3 text-red-500" />;
         default:
            return null;
      }
   };

   return (
      <div
         className={cn(
            "flex gap-2 mb-3",
            isCurrentUser ? "flex-row-reverse" : "flex-row"
         )}
      >
         {/* Avatar */}
         {showAvatar ? (
            <div className="w-7 h-7 rounded-full bg-gray-700 text-white flex items-center justify-center text-xs font-medium shrink-0">
               {message.senderName[0].toUpperCase()}
            </div>
         ) : (
            <div className="w-7 shrink-0" />
         )}

         {/* Message Content */}
         <div
            className={cn(
               "flex flex-col gap-1 max-w-[70%] md:max-w-[55%]",
               isCurrentUser ? "items-end" : "items-start"
            )}
         >
            {/* Message Bubble */}
            <div
               className={cn(
                  "px-3 py-2 rounded-lg",
                  isCurrentUser
                     ? "bg-primary-600 text-white"
                     : "bg-gray-100 text-gray-900",
                  message.status === "failed" && "opacity-60"
               )}
            >
               <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
                  {message.text}
               </p>
            </div>

            {/* Timestamp & Status */}
            {showTimestamp && (
               <div
                  className={cn(
                     "flex items-center gap-1.5 px-1",
                     isCurrentUser ? "flex-row-reverse" : "flex-row"
                  )}
               >
                  <span className="text-[10px] md:text-xs text-gray-500">
                     {format(new Date(message.createdAt), "h:mm a")}
                  </span>
                  {isCurrentUser && getStatusIcon()}
               </div>
            )}
         </div>
      </div>
   );
}
