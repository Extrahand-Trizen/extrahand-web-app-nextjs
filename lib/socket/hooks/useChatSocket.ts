"use client";

import { useEffect, useCallback, useState } from "react";
import { useSocket } from "../SocketProvider";
import type { Message } from "@/types/chat";

interface UseChatSocketOptions {
  chatId: string | null;
  onNewMessage?: (message: Message) => void;
  onTyping?: (data: { profileId: string; isTyping: boolean }) => void;
  onMessageRead?: (data: any) => void;
}

export function useChatSocket({
  chatId,
  onNewMessage,
  onTyping,
  onMessageRead,
}: UseChatSocketOptions) {
  const { chatSocket } = useSocket();
  const [isJoined, setIsJoined] = useState(false);

  // Join/leave chat room
  useEffect(() => {
    if (!chatSocket || !chatId) {
      setIsJoined(false);
      return;
    }

    // Join the chat room
    chatSocket.emit("chat:join", { chatId });
    setIsJoined(true);

    // Cleanup: leave room on unmount
    return () => {
      chatSocket.emit("chat:leave", { chatId });
      setIsJoined(false);
    };
  }, [chatSocket, chatId]);

  // Listen for new messages
  useEffect(() => {
    if (!chatSocket || !chatId) return;

    const handleNewMessage = (message: any) => {
      // Format the message to match expected type
      const formattedMessage: Message = {
        _id: message._id,
        chatId: message.chatId || chatId,
        taskId: message.taskId,
        text: message.text,
        senderId: message.senderId,
        senderName: message.sender?.name || "User",
        type: message.type || "text",
        status: message.status || "sent",
        createdAt: new Date(message.createdAt),
        readBy: message.readBy || [],
      };

      onNewMessage?.(formattedMessage);
    };

    chatSocket.on("message:new", handleNewMessage);

    return () => {
      chatSocket.off("message:new", handleNewMessage);
    };
  }, [chatSocket, chatId, onNewMessage]);

  // Listen for typing indicators
  useEffect(() => {
    if (!chatSocket || !chatId || !onTyping) return;

    const handleTyping = (data: { profileId: string; chatId: string; isTyping: boolean }) => {
      if (data.chatId === chatId) {
        onTyping({ profileId: data.profileId, isTyping: data.isTyping });
      }
    };

    chatSocket.on("user:typing", handleTyping);

    return () => {
      chatSocket.off("user:typing", handleTyping);
    };
  }, [chatSocket, chatId, onTyping]);

  // Listen for read receipts
  useEffect(() => {
    if (!chatSocket || !chatId || !onMessageRead) return;

    console.log("🔔 Setting up message:read listener for chat:", chatId);

    const handleRead = (data: any) => {
      console.log("📨 Raw message:read event received:", data);
      onMessageRead(data);
    };

    chatSocket.on("message:read", handleRead);

    return () => {
      console.log("🔕 Removing message:read listener for chat:", chatId);
      chatSocket.off("message:read", handleRead);
    };
  }, [chatSocket, chatId, onMessageRead]);

  // Emit typing start
  const emitTypingStart = useCallback(() => {
    if (chatSocket && chatId && isJoined) {
      chatSocket.emit("typing:start", { chatId });
    }
  }, [chatSocket, chatId, isJoined]);

  // Emit typing stop
  const emitTypingStop = useCallback(() => {
    if (chatSocket && chatId && isJoined) {
      chatSocket.emit("typing:stop", { chatId });
    }
  }, [chatSocket, chatId, isJoined]);

  return {
    isConnected: !!chatSocket?.connected,
    isJoined,
    emitTypingStart,
    emitTypingStop,
  };
}
