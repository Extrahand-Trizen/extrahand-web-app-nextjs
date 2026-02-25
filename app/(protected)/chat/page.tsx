"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, Send, ArrowLeft, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatsApi, type Chat, type Message } from "@/lib/api/endpoints/chats";
import { useSocket } from "@/lib/socket/SocketProvider";
import { useChatSocket } from "@/lib/socket/hooks/useChatSocket";
import { useUserStore } from "@/lib/state/userStore";
import { formatDistanceToNow } from "date-fns";

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const { chatSocket } = useSocket();

  // State
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showMobileList, setShowMobileList] = useState(true);
  const chatIdParam = searchParams.get("chatId");
  const otherUserIdParam = searchParams.get("otherUserId");
  const taskIdParam = searchParams.get("taskId");

  // Load chats on mount
  useEffect(() => {
    loadChats();
  }, []);

  // Handle URL params to open specific chat
  useEffect(() => {
    // Priority 1: If taskId and otherUserId are provided, create/get chat for that user and task
    if (taskIdParam && otherUserIdParam) {
      startNewChat(otherUserIdParam, taskIdParam);
      return;
    }

    // Priority 2: If taskId is provided (poster/tasker), start/get chat for that task
    if (taskIdParam) {
      startChatForTask(taskIdParam);
      return;
    }

    // Priority 3: If only otherUserId is provided, start new direct chat
    if (otherUserIdParam && !chatIdParam) {
      startNewChat(otherUserIdParam, undefined);
    }
  }, [chatIdParam, otherUserIdParam, taskIdParam]);

  // If chatId is provided without task/user params, select or fetch the chat
  useEffect(() => {
    if (!chatIdParam || taskIdParam || otherUserIdParam) return;
    if (chats.length === 0) return;

    const chat = chats.find((c) => c.chatId === chatIdParam || c._id === chatIdParam);
    if (chat) {
      handleSelectChat(chat);
      return;
    }

    loadChatById(chatIdParam);
  }, [chatIdParam, otherUserIdParam, taskIdParam, chats]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const { chats: loadedChats } = await chatsApi.getChats();
      setChats(loadedChats);
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = async (otherUserId: string, taskId?: string) => {
    try {
      const chat = await chatsApi.startChat(otherUserId, taskId);
      setChats((prev) => {
        const existingIndex = prev.findIndex(
          (c) => c.chatId === chat.chatId || c._id === chat._id
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = chat;
          return updated;
        }
        return [chat, ...prev];
      });
      setSelectedChat(chat);
      await loadMessages(chat.chatId);
      setShowMobileList(false);
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  const startChatForTask = async (taskId: string) => {
    try {
      setLoading(true);
      const { chat } = await chatsApi.startChatForTask(taskId);
      
      // Add/update chat in list
      setChats((prev) => {
        const existingIndex = prev.findIndex(
          (c) => c.chatId === chat.chatId || c.relatedTask === taskId
        );
        if (existingIndex >= 0) {
          // Update existing chat
          const updated = [...prev];
          updated[existingIndex] = chat;
          return updated;
        } else {
          // Add new chat at the top
          return [chat, ...prev];
        }
      });

      setSelectedChat(chat);
      await loadMessages(chat.chatId);
      setShowMobileList(false);
    } catch (error) {
      console.error("Failed to start chat for task:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadChatById = async (chatId: string) => {
    try {
      const chat = await chatsApi.getChatDetails(chatId);
      setChats((prev) => {
        const existingIndex = prev.findIndex(
          (c) => c.chatId === chat.chatId || c._id === chat._id
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = chat;
          return updated;
        }
        return [chat, ...prev];
      });
      setSelectedChat(chat);
      await loadMessages(chat.chatId);
      setShowMobileList(false);
    } catch (error) {
      console.error("Failed to load chat details:", error);
    }
  };

  const handleSelectChat = async (chat: Chat) => {
    setSelectedChat(chat);
    setShowMobileList(false);
    await loadMessages(chat.chatId);
    
    // Mark as read
    if (chat.unreadCount > 0) {
      try {
        await chatsApi.markChatAsRead(chat.chatId);
        setChats((prev) =>
          prev.map((c) =>
            c.chatId === chat.chatId ? { ...c, unreadCount: 0 } : c
          )
        );
      } catch (error) {
        console.error("Failed to mark chat as read:", error);
      }
    }
  };

  const loadMessages = async (chatId: string) => {
    try {
      const { messages: loadedMessages } = await chatsApi.getChatMessages(chatId);
      setMessages(loadedMessages);
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
  };

  // Handle new messages from socket
  const handleNewSocketMessage = useCallback(
    (message: Message) => {
      if (message.chatId === selectedChat?.chatId) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some((m) => m._id === message._id)) {
            return prev;
          }
          return [...prev, message];
        });

        // Update last message in chat list
        setChats((prev) =>
          prev.map((c) =>
            c.chatId === message.chatId
              ? {
                  ...c,
                  lastMessage: {
                    text: message.text,
                    senderId: message.senderId,
                    timestamp: new Date(message.createdAt),
                  },
                }
              : c
          )
        );
      } else {
        // Increment unread count for other chats
        setChats((prev) =>
          prev.map((c) =>
            c.chatId === message.chatId
              ? { ...c, unreadCount: c.unreadCount + 1 }
              : c
          )
        );
      }
    },
    [selectedChat]
  );

  // Setup socket listeners
  useChatSocket({
    chatId: selectedChat?.chatId || null,
    onNewMessage: handleNewSocketMessage,
  });

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedChat || sending) return;

    const tempMessage: Message = {
      _id: `temp-${Date.now()}`,
      chatId: selectedChat.chatId,
      senderId: user?._id || "",
      text: messageText,
      type: "text",
      status: "sending",
      sender: {
        uid: user?._id || "",
        name: user?.name || "",
        profileImage: user?.profileImage,
      },
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setMessageText("");
    setSending(true);

    try {
      const sentMessage = await chatsApi.sendMessage(
        selectedChat.chatId,
        messageText
      );

      // Replace temp message with real message
      setMessages((prev) =>
        prev.map((m) => (m._id === tempMessage._id ? sentMessage : m))
      );

      // Update last message in chat list
      setChats((prev) =>
        prev.map((c) =>
          c.chatId === selectedChat.chatId
            ? {
                ...c,
                lastMessage: {
                  text: sentMessage.text,
                  senderId: sentMessage.senderId,
                  timestamp: new Date(sentMessage.createdAt),
                },
              }
            : c
        )
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      // Mark message as failed
      setMessages((prev) =>
        prev.map((m) =>
          m._id === tempMessage._id ? { ...m, status: "failed" } : m
        )
      );
    } finally {
      setSending(false);
    }
  };

  const filteredChats = chats.filter((chat) => {
    const otherParticipant = chat.otherParticipant;
    if (!otherParticipant) return false;
    
    return otherParticipant.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
  });

  const formatMessageTime = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Chat list component
  const ChatList = () => (
    <div className="h-full flex flex-col bg-white border-r border-secondary-200">
      {/* Header */}
      <div className="p-4 border-b border-secondary-200">
        <h1 className="text-xl font-bold text-secondary-900 mb-3">Messages</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MessageCircle className="w-12 h-12 text-secondary-300 mb-3" />
            <p className="text-secondary-600 font-medium">No conversations yet</p>
            <p className="text-sm text-secondary-400 mt-1">
              Start chatting from your tasks
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat._id}
              onClick={() => handleSelectChat(chat)}
              className={`w-full text-left px-4 py-3 border-b border-secondary-100 hover:bg-secondary-50 transition-colors ${
                selectedChat?.chatId === chat.chatId ? "bg-primary-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary-500 text-white flex items-center justify-center text-base font-semibold">
                    {chat.otherParticipant?.name?.[0]?.toUpperCase() || "?"}
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px] font-bold text-white">
                        {chat.unreadCount}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className="font-semibold text-secondary-900 truncate">
                      {chat.otherParticipant?.name || "Unknown"}
                    </h3>
                    {chat.lastMessage && (
                      <span className="text-xs text-secondary-500 ml-2 shrink-0">
                        {formatMessageTime(chat.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  {chat.lastMessage && (
                    <p className="text-sm text-secondary-600 truncate">
                      {chat.lastMessage.text}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );

  // Chat messages component
  const ChatMessages = () => {
    if (!selectedChat) {
      return (
        <div className="hidden md:flex flex-col items-center justify-center h-full bg-secondary-50">
          <MessageCircle className="w-16 h-16 text-secondary-300 mb-4" />
          <p className="text-secondary-600 font-medium">Select a conversation</p>
          <p className="text-sm text-secondary-400 mt-1">
            Choose a chat to start messaging
          </p>
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="p-4 border-b border-secondary-200 flex items-center gap-3">
          <button
            onClick={() => setShowMobileList(true)}
            className="md:hidden p-2 hover:bg-secondary-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold">
            {selectedChat.otherParticipant?.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-secondary-900">
              {selectedChat.otherParticipant?.name || "Unknown"}
            </h2>
            {chatSocket?.connected && (
              <p className="text-xs text-green-600">Online</p>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-secondary-400">No messages yet. Say hi! 👋</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.senderId === user?._id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? "bg-primary-500 text-secondary-900"
                        : "bg-secondary-100 text-secondary-900"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs ${
                          isOwn ? "text-secondary-700" : "text-secondary-500"
                        }`}
                      >
                        {formatMessageTime(message.createdAt)}
                      </span>
                      {isOwn && message.status && (
                        <span className="text-xs text-secondary-600">
                          {message.status === "sending" && "●"}
                          {message.status === "sent" && "✓"}
                          {message.status === "delivered" && "✓✓"}
                          {message.status === "read" && "✓✓"}
                          {message.status === "failed" && "!"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Message input */}
        <div className="p-4 border-t border-secondary-200">
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={sending}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sending}
              className="bg-primary-500 hover:bg-primary-600 text-secondary-900"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-64px)] flex">
      {/* Desktop: side by side */}
      <div className="hidden md:flex w-full">
        <div className="w-80 lg:w-96">
          <ChatList />
        </div>
        <div className="flex-1">
          <ChatMessages />
        </div>
      </div>

      {/* Mobile: toggle between list and chat */}
      <div className="md:hidden w-full">
        {showMobileList ? <ChatList /> : <ChatMessages />}
      </div>
    </div>
  );
}
