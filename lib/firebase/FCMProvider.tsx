/**
 * FCM Notification Provider
 * Manages FCM initialization, token registration, and foreground message handling
 */

'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/lib/auth/context';
import { logEnvironmentVariables } from '@/lib/debug/envLogger';
import {
  requestNotificationPermission,
  registerFCMToken,
  onForegroundMessage,
  areNotificationsSupported,
  getNotificationPermissionStatus,
} from '@/lib/firebase/messaging';

interface FCMNotification {
  id: string;
  title: string;
  body: string;
  type?: string;
  data?: Record<string, string | number | boolean>;
  timestamp: Date;
  read: boolean;
}

interface FCMContextValue {
  notifications: FCMNotification[];
  unreadCount: number;
  isSupported: boolean;
  permissionStatus: NotificationPermission | null;
  isInitialized: boolean;
  requestPermission: () => Promise<boolean>;
  markAsRead: (id: string) => void;
  clearAll: () => void;
}

const FCMContext = createContext<FCMContextValue | undefined>(undefined);

export const useFCM = (): FCMContextValue => {
  const context = useContext(FCMContext);
  if (!context) {
    throw new Error('useFCM must be used within FCMProvider');
  }
  return context;
};

interface FCMProviderProps {
  children: ReactNode;
}

export const FCMProvider: React.FC<FCMProviderProps> = ({ children }) => {
  const { currentUser, userData } = useAuth();
  const [notifications, setNotifications] = useState<FCMNotification[]>([]);
  const [isSupported] = useState(() => areNotificationsSupported());
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission | null>(() => 
    typeof window !== 'undefined' ? getNotificationPermissionStatus() : null
  );
  const [isInitialized, setIsInitialized] = useState(false);
  const actorUid = userData?.uid || currentUser?.uid;

  // Initialize FCM when user is authenticated
  useEffect(() => {
    if (!actorUid || !isSupported || isInitialized) {
      return;
    }

    const initializeFCM = async () => {
      try {
        // Log environment variables for debugging
        logEnvironmentVariables();
        
        console.log('🚀 Initializing FCM for user:', actorUid);

        // Check if permission was previously granted
        const currentPermission = getNotificationPermissionStatus();
        
        if (currentPermission === 'granted') {
          // Auto-register token if permission already granted
          const token = await requestNotificationPermission();
          
          if (token) {
            await registerFCMToken(token, actorUid);
            setIsInitialized(true);
            setPermissionStatus(currentPermission);
            console.log('✅ FCM initialized successfully');
          }
        } else if (currentPermission === 'default') {
          // Permission not yet requested - will be done when user clicks notification settings
          console.log('ℹ️ Notification permission not yet requested');
        } else {
          console.log('❌ Notification permission denied');
          setPermissionStatus(currentPermission);
        }
      } catch (err) {
        console.error('❌ Failed to initialize FCM:', err);
      }
    };

    initializeFCM();
  }, [actorUid, isSupported, isInitialized]);

  // Listen for foreground messages
  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    console.log('👂 Setting up foreground message listener');

    const unsubscribe = onForegroundMessage((payload) => {
      console.log('📨 Received foreground notification:', payload);

      const actionUrl =
        (payload.data?.actionUrl as string | undefined) ||
        (payload.data?.url as string | undefined) ||
        (payload.data?.taskUrl as string | undefined);

      const shouldRedirectToApproval =
        payload.data?.action === 'approve_completion' &&
        typeof actionUrl === 'string' &&
        actionUrl.includes('/track');

      const navigateToAction = () => {
        if (!actionUrl) return;

        try {
          // Support both absolute and relative URLs.
          const nextHref = actionUrl.startsWith('http')
            ? actionUrl
            : `${window.location.origin}${actionUrl.startsWith('/') ? actionUrl : `/${actionUrl}`}`;

          if (window.location.href !== nextHref) {
            window.location.assign(nextHref);
          }
        } catch {
          // Ignore navigation parsing errors.
        }
      };

      // Create notification object
      const notification: FCMNotification = {
        id: `fcm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        title: payload.notification?.title || 'Notification',
        body: payload.notification?.body || '',
        type: payload.data?.type,
        data: payload.data,
        timestamp: new Date(),
        read: false,
      };

      // Add to notifications list
      setNotifications((prev) => [notification, ...prev]);

      // Immediate navigation for approval-required tasks.
      if (shouldRedirectToApproval && actionUrl) {
        navigateToAction();
      }

      // Show browser notification if tab is not focused
      if (document.hidden) {
        const browserNotification = new Notification(notification.title, {
          body: notification.body,
          icon: '/logo.webp',
          badge: '/logo.webp',
          tag: notification.type || 'general',
        });

        // Clicking foreground browser notification should also deep-link.
        browserNotification.onclick = () => {
          window.focus();
          navigateToAction();
        };
      }

      // Play notification sound (optional)
      try {
        const audio = new Audio('/notification-sound.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Ignore audio play errors (user interaction required)
        });
      } catch {
        // Audio not available
      }
    });

    return unsubscribe;
  }, [isInitialized]);

  // Request notification permission
  const requestPermission = async (): Promise<boolean> => {
    try {
      if (!isSupported) {
        console.error('❌ Notifications not supported');
        return false;
      }

      if (!actorUid) {
        console.error('❌ User not authenticated');
        return false;
      }

      const token = await requestNotificationPermission();
      
      if (token) {
        const registered = await registerFCMToken(token, actorUid);
        
        if (registered) {
          setIsInitialized(true);
          setPermissionStatus('granted');
          console.log('✅ Notification permission granted and token registered');
          return true;
        }
      }

      return false;
    } catch (err) {
      console.error('❌ Failed to request notification permission:', err);
      return false;
    }
  };

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  // Calculate unread count
  const unreadCount = notifications.filter((n) => !n.read).length;

  const value: FCMContextValue = {
    notifications,
    unreadCount,
    isSupported,
    permissionStatus,
    isInitialized,
    requestPermission,
    markAsRead,
    clearAll,
  };

  return <FCMContext.Provider value={value}>{children}</FCMContext.Provider>;
};
