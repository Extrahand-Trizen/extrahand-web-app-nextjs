"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Socket, io } from "socket.io-client";
import { useUserStore } from "@/lib/state/userStore";

// Simple client-side logger
const logger = {
  info: (...args: any[]) => {
    if (process.env.NODE_ENV !== "production") {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => console.warn(...args),
  error: (...args: any[]) => console.error(...args),
};

interface SocketContextValue {
  chatSocket: Socket | null;
  taskSocket: Socket | null;
  isConnected: boolean;
  isConnecting: boolean;
}

const SocketContext = createContext<SocketContextValue | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const [chatSocket, setChatSocket] = useState<Socket | null>(null);
  const [taskSocket, setTaskSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const user = useUserStore((state) => state.user);
  const profileId = user?._id;

  // Initialize Socket.IO connections
  useEffect(() => {
    if (!profileId) {
      // User not authenticated, disconnect sockets if any
      if (chatSocket) {
        chatSocket.disconnect();
        setChatSocket(null);
      }
      if (taskSocket) {
        taskSocket.disconnect();
        setTaskSocket(null);
      }
      setIsConnected(false);
      return;
    }

    setIsConnecting(true);

    // Chat service socket
    const chatServiceUrl =
      process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || "http://localhost:4003";
    const chatSock = io(chatServiceUrl, {
      auth: {
        profileId,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Task service socket
    const taskServiceUrl =
      process.env.NEXT_PUBLIC_TASK_SERVICE_URL || "http://localhost:4002";
    const taskSock = io(taskServiceUrl, {
      auth: {
        profileId,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Chat socket event listeners
    chatSock.on("connect", () => {
      logger.info("✅ Connected to chat service");
      setIsConnected(true);
      setIsConnecting(false);
    });

    chatSock.on("disconnect", (reason) => {
      logger.warn(`🔌 Disconnected from chat service: ${reason}`);
      setIsConnected(false);
    });

    chatSock.on("connect_error", (error) => {
      logger.error("❌ Chat socket connection error:", error);
      setIsConnecting(false);
    });

    // Task socket event listeners
    taskSock.on("connect", () => {
      logger.info("✅ Connected to task service");
    });

    taskSock.on("disconnect", (reason) => {
      logger.warn(`🔌 Disconnected from task service: ${reason}`);
    });

    taskSock.on("connect_error", (error) => {
      logger.error("❌ Task socket connection error:", error);
    });

    setChatSocket(chatSock);
    setTaskSocket(taskSock);

    // Cleanup on unmount
    return () => {
      chatSock.disconnect();
      taskSock.disconnect();
    };
  }, [profileId]);

  const value: SocketContextValue = {
    chatSocket,
    taskSocket,
    isConnected,
    isConnecting,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
