"use client";

/**
 * Chat Page
 * Shows chat conversations and messages
 * Matches: web-apps/extrahand-web-app/src/ChatScreen.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const PRIMARY_YELLOW = "#f9b233";
const PRIMARY_BLUE = "#2563EB";
const DARK = "#111827";
const GRAY = "#6b7280";
const LIGHT_BG = "#f8fafc";

interface Conversation {
   _id: string;
   chatId: string;
   otherParticipant: {
      uid: string;
      name: string;
      roles: string[];
      userType: string;
   };
   lastMessage: {
      text: string;
      senderId: string;
      timestamp: string;
   };
   unreadCount: number;
   createdAt: string;
   updatedAt: string;
}

interface Message {
   _id: string;
   chatId: string;
   text: string;
   senderId: string;
   type: string;
   status: string;
   createdAt: string;
   readBy: Array<{
      userId: string;
      readAt: string;
   }>;
}

// Mock conversations data
const mockConversations: Conversation[] = [
   {
      _id: "conv1",
      chatId: "chat1",
      otherParticipant: {
         uid: "user1",
         name: "John Doe",
         roles: ["Tasker", "Poster"],
         userType: "both",
      },
      lastMessage: {
         text: "Thanks! I can start tomorrow.",
         senderId: "user1",
         timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      unreadCount: 2,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
   },
   {
      _id: "conv2",
      chatId: "chat2",
      otherParticipant: {
         uid: "user2",
         name: "Sarah Smith",
         roles: ["Tasker"],
         userType: "tasker",
      },
      lastMessage: {
         text: "When would be a good time for you?",
         senderId: "currentUser",
         timestamp: new Date(Date.now() - 7200000).toISOString(),
      },
      unreadCount: 0,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      updatedAt: new Date(Date.now() - 7200000).toISOString(),
   },
];

// Mock messages for active chat
const mockMessages: { [chatId: string]: Message[] } = {
   chat1: [
      {
         _id: "msg1",
         chatId: "chat1",
         text: "Hi! I saw your task posting. I have experience in this area.",
         senderId: "user1",
         type: "text",
         status: "sent",
         createdAt: new Date(Date.now() - 86400000).toISOString(),
         readBy: [],
      },
      {
         _id: "msg2",
         chatId: "chat1",
         text: "Great! Can you tell me more about your experience?",
         senderId: "currentUser",
         type: "text",
         status: "sent",
         createdAt: new Date(Date.now() - 82800000).toISOString(),
         readBy: [],
      },
      {
         _id: "msg3",
         chatId: "chat1",
         text: "I have 5 years of experience and can provide references.",
         senderId: "user1",
         type: "text",
         status: "sent",
         createdAt: new Date(Date.now() - 79200000).toISOString(),
         readBy: [],
      },
      {
         _id: "msg4",
         chatId: "chat1",
         text: "Thanks! I can start tomorrow.",
         senderId: "user1",
         type: "text",
         status: "sent",
         createdAt: new Date(Date.now() - 3600000).toISOString(),
         readBy: [],
      },
   ],
   chat2: [
      {
         _id: "msg5",
         chatId: "chat2",
         text: "Hello, I'm interested in your task.",
         senderId: "user2",
         type: "text",
         status: "sent",
         createdAt: new Date(Date.now() - 172800000).toISOString(),
         readBy: [],
      },
      {
         _id: "msg6",
         chatId: "chat2",
         text: "When would be a good time for you?",
         senderId: "currentUser",
         type: "text",
         status: "sent",
         createdAt: new Date(Date.now() - 7200000).toISOString(),
         readBy: [],
      },
   ],
};

// Mock current user
const mockCurrentUser = {
   uid: "currentUser",
   email: "user@example.com",
};

// Mock user search results
const mockUserSearchResults = [
   {
      uid: "user3",
      name: "Mike Johnson",
      email: "mike@example.com",
      roles: ["Tasker"],
      rating: 4.8,
      totalReviews: 45,
   },
   {
      uid: "user4",
      name: "Emily Davis",
      email: "emily@example.com",
      roles: ["Poster"],
      rating: 4.9,
      totalReviews: 120,
   },
];

const formatTime = (timestamp: string) => {
   const date = new Date(timestamp);
   const now = new Date();
   const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

   if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
         hour: "numeric",
         minute: "2-digit",
         hour12: true,
      });
   } else if (diffInHours < 48) {
      return "Yesterday";
   } else {
      return date.toLocaleDateString("en-US", {
         weekday: "short",
      });
   }
};

export default function ChatPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [isMobileView, setIsMobileView] = useState(false);
   const [loading] = useState(false);
   const [sending, setSending] = useState(false);
   const [query, setQuery] = useState("");
   const [conversations] = useState<Conversation[]>(mockConversations);
   const [activeId, setActiveId] = useState<string>("");
   const [messages, setMessages] = useState<Message[]>([]);
   const [draft, setDraft] = useState("");
   const [userSearchResults, setUserSearchResults] = useState<any[]>([]);
   const [searchingUsers] = useState(false);
   const [showUserResults, setShowUserResults] = useState(false);
   const [directChatOtherUser, setDirectChatOtherUser] = useState<any>(null);

   // Check for direct chat navigation from URL params
   useEffect(() => {
      const paramChatId = searchParams.get("chatId");
      const otherUserId = searchParams.get("otherUserId");
      const taskId = searchParams.get("taskId");
      const taskTitle = searchParams.get("taskTitle");

      if (paramChatId && paramChatId !== "undefined") {
         console.log("🔍 ChatPage: Direct navigation to chat:", paramChatId);
         setActiveId(paramChatId);

         // Mock: Set other user info if provided
         if (otherUserId) {
            setDirectChatOtherUser({
               name: "Task Owner",
               uid: otherUserId,
            });
         }
      }
   }, [searchParams]);

   useEffect(() => {
      if (typeof window === "undefined") return;

      const checkScreenSize = () => {
         const width = window.innerWidth;
         setIsMobileView(width <= 768);
      };

      checkScreenSize();
      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
   }, []);

   // Load messages when active chat changes
   useEffect(() => {
      if (activeId && mockMessages[activeId]) {
         setMessages(mockMessages[activeId]);
      } else {
         setMessages([]);
      }
   }, [activeId]);

   // Filter conversations based on search query
   const filteredConversations = useMemo(() => {
      const q = query.trim().toLowerCase();
      if (!q) return conversations;
      return conversations.filter(
         (c) =>
            c.otherParticipant.name.toLowerCase().includes(q) ||
            c.otherParticipant.roles.some((role) =>
               role.toLowerCase().includes(q)
            ) ||
            c.lastMessage?.text.toLowerCase().includes(q)
      );
   }, [conversations, query]);

   // Mock user search
   useEffect(() => {
      if (query.trim().length >= 2) {
         const filtered = mockUserSearchResults.filter(
            (user) =>
               user.name.toLowerCase().includes(query.toLowerCase()) ||
               user.email.toLowerCase().includes(query.toLowerCase())
         );
         setUserSearchResults(filtered);
         setShowUserResults(filtered.length > 0);
      } else {
         setUserSearchResults([]);
         setShowUserResults(false);
      }
   }, [query]);

   const handleSend = async () => {
      if (!draft.trim() || !activeId || sending) return;

      setSending(true);
      // Mock: Simulate API call
      setTimeout(() => {
         const newMessage: Message = {
            _id: `msg${Date.now()}`,
            chatId: activeId,
            text: draft.trim(),
            senderId: mockCurrentUser.uid,
            type: "text",
            status: "sent",
            createdAt: new Date().toISOString(),
            readBy: [],
         };
         setMessages((prev) => [...prev, newMessage]);
         setDraft("");
         setSending(false);
      }, 500);
   };

   const handleStartChatWithUser = (user: any) => {
      // Mock: Create new chat
      const newChatId = `chat${Date.now()}`;
      setActiveId(newChatId);
      setQuery("");
      setUserSearchResults([]);
      setShowUserResults(false);
      setMessages([]);
      alert(`Started chat with ${user.name} (Mock)`);
   };

   const MessageBubble = ({ message }: { message: Message }) => {
      const isMe = message.senderId === mockCurrentUser.uid;
      const time = formatTime(message.createdAt);

      return (
         <div className={`flex mb-3 ${isMe ? "justify-end" : "justify-start"}`}>
            <div
               className={`max-w-[80%] px-3 py-2 rounded-xl ${
                  isMe ? "bg-yellow-400" : "bg-white border border-gray-200"
               }`}
            >
               <p
                  className={`text-sm leading-5 ${
                     isMe ? "text-gray-900 font-semibold" : "text-gray-900"
                  }`}
               >
                  {message.text}
               </p>
               <p
                  className={`text-xs mt-1 ${
                     isMe ? "text-gray-900" : "text-gray-400"
                  }`}
               >
                  {time}
               </p>
            </div>
         </div>
      );
   };

   const activeConv = conversations.find((c) => c.chatId === activeId);
   const showList = activeId === "";

   // Mobile layout
   if (isMobileView) {
      return (
         <div className="flex flex-col min-h-screen bg-white">
            <NavBar
               title={
                  showList
                     ? "Chats"
                     : activeConv?.otherParticipant?.name ||
                       directChatOtherUser?.name ||
                       "Chat"
               }
               showBackButton={!showList}
               onBackPress={showList ? undefined : () => setActiveId("")}
            />

            {showList ? (
               <div className="flex-1 overflow-y-auto bg-white">
                  {/* Search Bar */}
                  <div className="p-3 border-b border-gray-200">
                     <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search chats or start new chat..."
                        className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-white"
                     />
                  </div>

                  <div className="flex-1 overflow-y-auto">
                     {/* User Search Results */}
                     {showUserResults && (
                        <div className="p-4">
                           <p className="text-sm font-semibold text-gray-900 mb-2 px-2">
                              Start New Chat
                           </p>
                           {searchingUsers ? (
                              <div className="py-5 text-center">
                                 <p className="text-sm text-gray-500">
                                    Searching users...
                                 </p>
                              </div>
                           ) : userSearchResults.length === 0 ? (
                              <div className="py-5 text-center">
                                 <p className="text-sm text-gray-500">
                                    No users found
                                 </p>
                              </div>
                           ) : (
                              <div className="space-y-2">
                                 {userSearchResults.map((user) => (
                                    <div
                                       key={user.uid}
                                       className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                       <div className="flex-1">
                                          <p className="text-sm font-semibold text-gray-900 mb-1">
                                             {user.name}
                                          </p>
                                          <p className="text-xs text-gray-600 mb-1">
                                             {user.roles.join(", ")} •{" "}
                                             {user.email}
                                          </p>
                                          {user.rating > 0 && (
                                             <p
                                                className="text-xs"
                                                style={{
                                                   color: PRIMARY_YELLOW,
                                                }}
                                             >
                                                ⭐ {user.rating.toFixed(1)} (
                                                {user.totalReviews} reviews)
                                             </p>
                                          )}
                                       </div>
                                       <button
                                          onClick={() =>
                                             handleStartChatWithUser(user)
                                          }
                                          className="px-3 py-1.5 rounded-2xl text-xs font-semibold text-gray-900"
                                          style={{
                                             backgroundColor: PRIMARY_YELLOW,
                                          }}
                                       >
                                          Chat
                                       </button>
                                    </div>
                                 ))}
                              </div>
                           )}
                        </div>
                     )}

                     {/* Existing Chats */}
                     {!showUserResults && (
                        <>
                           {loading ? (
                              <div className="py-5 text-center">
                                 <LoadingSpinner size="sm" />
                                 <p className="text-sm text-gray-500 mt-2">
                                    Loading chats...
                                 </p>
                              </div>
                           ) : filteredConversations.length === 0 ? (
                              <div className="py-5 text-center">
                                 <p className="text-sm text-gray-500">
                                    No chats found
                                 </p>
                              </div>
                           ) : (
                              <div>
                                 {filteredConversations.map((c) => (
                                    <button
                                       key={c.chatId}
                                       onClick={() => setActiveId(c.chatId)}
                                       className={`w-full flex items-center justify-between p-4 border-b border-gray-100 ${
                                          activeId === c.chatId
                                             ? "bg-gray-50"
                                             : "bg-white"
                                       }`}
                                    >
                                       <div className="flex-1 text-left">
                                          <p className="text-sm font-semibold text-gray-900">
                                             {c.otherParticipant.name} (
                                             {c.otherParticipant.roles.join(
                                                ", "
                                             )}
                                             )
                                          </p>
                                          <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                             {c.lastMessage?.text ||
                                                "No messages yet"}
                                          </p>
                                       </div>
                                       <div className="flex flex-col items-end ml-3">
                                          <p className="text-xs text-gray-400">
                                             {c.lastMessage
                                                ? formatTime(
                                                     c.lastMessage.timestamp
                                                  )
                                                : ""}
                                          </p>
                                          {c.unreadCount > 0 && (
                                             <div
                                                className="mt-1 px-1.5 py-0.5 rounded-full text-xs font-bold text-white"
                                                style={{
                                                   backgroundColor:
                                                      PRIMARY_BLUE,
                                                }}
                                             >
                                                {c.unreadCount}
                                             </div>
                                          )}
                                       </div>
                                    </button>
                                 ))}
                              </div>
                           )}
                        </>
                     )}
                  </div>
               </div>
            ) : (
               <div className="flex-1 flex flex-col bg-gray-50">
                  {/* Messages List */}
                  <div className="flex-1 overflow-y-auto p-4">
                     {messages.map((m) => (
                        <MessageBubble key={m._id} message={m} />
                     ))}
                  </div>

                  {/* Input Bar */}
                  <div className="flex items-center p-3 border-t border-gray-200 bg-white">
                     <input
                        type="text"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        onKeyPress={(e) => {
                           if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSend();
                           }
                        }}
                        placeholder="Type a message"
                        disabled={sending}
                        className="flex-1 h-10 border border-gray-200 rounded-full px-4 text-sm bg-white"
                     />
                     <button
                        onClick={handleSend}
                        disabled={sending || !draft.trim()}
                        className={`ml-2 px-4 h-10 rounded-full text-sm font-bold text-gray-900 ${
                           sending || !draft.trim()
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                        }`}
                        style={{ backgroundColor: PRIMARY_YELLOW }}
                     >
                        {sending ? "Sending..." : "Send"}
                     </button>
                  </div>
               </div>
            )}

            <Footer />
         </div>
      );
   }

   // Desktop layout
   return (
      <div className="flex flex-col min-h-screen bg-white">
         <NavBar
            title={
               activeId
                  ? activeConv?.otherParticipant?.name ||
                    directChatOtherUser?.name ||
                    "Chat"
                  : "Chat"
            }
         />

         <div
            className="flex-1 flex overflow-hidden"
            style={{ height: "calc(100vh - 60px)" }}
         >
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-200 flex flex-col">
               {/* Search Bar */}
               <div className="p-3 border-b border-gray-200">
                  <input
                     type="text"
                     value={query}
                     onChange={(e) => setQuery(e.target.value)}
                     placeholder="Search chats or start new chat..."
                     className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm bg-white"
                  />
               </div>

               {/* Conversations List */}
               <div className="flex-1 overflow-y-auto">
                  {/* User Search Results */}
                  {showUserResults && (
                     <div className="p-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2 px-2">
                           Start New Chat
                        </p>
                        {searchingUsers ? (
                           <div className="py-5 text-center">
                              <p className="text-sm text-gray-500">
                                 Searching users...
                              </p>
                           </div>
                        ) : userSearchResults.length === 0 ? (
                           <div className="py-5 text-center">
                              <p className="text-sm text-gray-500">
                                 No users found
                              </p>
                           </div>
                        ) : (
                           <div className="space-y-2">
                              {userSearchResults.map((user) => (
                                 <div
                                    key={user.uid}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                 >
                                    <div className="flex-1">
                                       <p className="text-sm font-semibold text-gray-900 mb-1">
                                          {user.name}
                                       </p>
                                       <p className="text-xs text-gray-600 mb-1">
                                          {user.roles.join(", ")} • {user.email}
                                       </p>
                                       {user.rating > 0 && (
                                          <p
                                             className="text-xs"
                                             style={{ color: PRIMARY_YELLOW }}
                                          >
                                             ⭐ {user.rating.toFixed(1)} (
                                             {user.totalReviews} reviews)
                                          </p>
                                       )}
                                    </div>
                                    <button
                                       onClick={() =>
                                          handleStartChatWithUser(user)
                                       }
                                       className="px-3 py-1.5 rounded-2xl text-xs font-semibold text-gray-900"
                                       style={{
                                          backgroundColor: PRIMARY_YELLOW,
                                       }}
                                    >
                                       Chat
                                    </button>
                                 </div>
                              ))}
                           </div>
                        )}
                     </div>
                  )}

                  {/* Existing Chats */}
                  {!showUserResults && (
                     <>
                        {loading ? (
                           <div className="py-5 text-center">
                              <LoadingSpinner size="sm" />
                              <p className="text-sm text-gray-500 mt-2">
                                 Loading chats...
                              </p>
                           </div>
                        ) : filteredConversations.length === 0 ? (
                           <div className="py-5 text-center">
                              <p className="text-sm text-gray-500">
                                 No chats found
                              </p>
                           </div>
                        ) : (
                           <div>
                              {filteredConversations.map((c) => (
                                 <button
                                    key={c.chatId}
                                    onClick={() => setActiveId(c.chatId)}
                                    className={`w-full flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 ${
                                       c.chatId === activeId
                                          ? "bg-gray-50"
                                          : "bg-white"
                                    }`}
                                 >
                                    <div className="flex-1 text-left">
                                       <p className="text-sm font-semibold text-gray-900">
                                          {c.otherParticipant.name} (
                                          {c.otherParticipant.roles.join(", ")})
                                       </p>
                                       <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                          {c.lastMessage?.text ||
                                             "No messages yet"}
                                       </p>
                                    </div>
                                    <div className="flex flex-col items-end ml-3">
                                       <p className="text-xs text-gray-400">
                                          {c.lastMessage
                                             ? formatTime(
                                                  c.lastMessage.timestamp
                                               )
                                             : ""}
                                       </p>
                                       {c.unreadCount > 0 && (
                                          <div
                                             className="mt-1 px-1.5 py-0.5 rounded-full text-xs font-bold text-white"
                                             style={{
                                                backgroundColor: PRIMARY_BLUE,
                                             }}
                                          >
                                             {c.unreadCount}
                                          </div>
                                       )}
                                    </div>
                                 </button>
                              ))}
                           </div>
                        )}
                     </>
                  )}
               </div>
            </div>

            {/* Chat Pane */}
            <div className="flex-1 flex flex-col bg-gray-50">
               {activeId ? (
                  <>
                     {/* Messages List */}
                     <div className="flex-1 overflow-y-auto p-4">
                        {messages.map((m) => (
                           <MessageBubble key={m._id} message={m} />
                        ))}
                     </div>

                     {/* Input Bar */}
                     <div className="flex items-center p-3 border-t border-gray-200 bg-white">
                        <input
                           type="text"
                           value={draft}
                           onChange={(e) => setDraft(e.target.value)}
                           onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                 e.preventDefault();
                                 handleSend();
                              }
                           }}
                           placeholder="Type a message"
                           disabled={sending}
                           className="flex-1 h-10 border border-gray-200 rounded-full px-4 text-sm bg-white"
                        />
                        <button
                           onClick={handleSend}
                           disabled={sending || !draft.trim()}
                           className={`ml-2 px-4 h-10 rounded-full text-sm font-bold text-gray-900 ${
                              sending || !draft.trim()
                                 ? "opacity-50 cursor-not-allowed"
                                 : ""
                           }`}
                           style={{ backgroundColor: PRIMARY_YELLOW }}
                        >
                           {sending ? "Sending..." : "Send"}
                        </button>
                     </div>
                  </>
               ) : (
                  <div className="flex-1 flex items-center justify-center p-10">
                     <div className="text-center">
                        <p className="text-lg font-semibold text-gray-900 mb-2">
                           Select a chat to start messaging
                        </p>
                        <p className="text-sm text-gray-500">
                           Or search for users to start a new conversation
                        </p>
                     </div>
                  </div>
               )}
            </div>
         </div>

         <Footer />
      </div>
   );
}
