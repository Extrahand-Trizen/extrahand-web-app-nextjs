"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { Send, Paperclip, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface MessageComposerProps {
   onSendMessage: (text: string) => Promise<void>;
   disabled?: boolean;
   placeholder?: string;
}

export function MessageComposer({
   onSendMessage,
   disabled = false,
   placeholder = "Type a message...",
}: MessageComposerProps) {
   const [message, setMessage] = useState("");
   const [isSending, setIsSending] = useState(false);
   const textareaRef = useRef<HTMLTextAreaElement>(null);

   const handleSend = async () => {
      const trimmedMessage = message.trim();
      if (!trimmedMessage || isSending || disabled) return;

      setIsSending(true);
      try {
         await onSendMessage(trimmedMessage);
         setMessage("");
         textareaRef.current?.focus();
      } catch (error) {
         toast.error("Failed to send message. Please try again.");
         console.error("Send message error:", error);
      } finally {
         setIsSending(false);
      }
   };

   const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
         e.preventDefault();
         handleSend();
      }
   };

   return (
      <div className="p-4">
         <div className="flex items-end gap-3">
            {/* Attachment */}
            <Button
               type="button"
               variant="ghost"
               size="icon"
               className="shrink-0 text-gray-500 hover:text-gray-700"
               disabled
               title="Attach file (coming soon)"
            >
               <Paperclip className="w-5 h-5" />
            </Button>

            {/* Input */}
            <Textarea
               ref={textareaRef}
               value={message}
               onChange={(e) => setMessage(e.target.value)}
               onKeyDown={handleKeyDown}
               placeholder={placeholder}
               disabled={disabled || isSending}
               className="min-h-[40px] max-h-32 resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500"
               rows={1}
            />

            {/* Send */}
            <Button
               type="button"
               size="icon"
               onClick={handleSend}
               disabled={!message.trim() || isSending || disabled}
               className="shrink-0 bg-blue-600 hover:bg-blue-700 h-10 w-10"
            >
               {isSending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
               ) : (
                  <Send className="w-5 h-5" />
               )}
            </Button>
         </div>
      </div>
   );
}
