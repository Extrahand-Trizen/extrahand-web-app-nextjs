/**
 * Hook for in-app notifications backed by Zustand notification store
 * Single source of truth: bell and notifications page share the same state
 */

'use client';

import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useNotificationStore } from '@/lib/state/notificationStore';
import NotificationPollingService, {
  type InAppNotification,
} from '@/lib/notifications/pollingService';

export type { InAppNotification };

interface UseInAppNotificationsOptions {
  enabled?: boolean;
  pollingInterval?: number;
  onNotification?: (notification: InAppNotification) => void;
  onError?: (error: Error) => void;
}

interface UseInAppNotificationsReturn {
  notifications: InAppNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (notificationId: string) => Promise<boolean>;
  fetchNotifications: (limit?: number, skip?: number) => Promise<InAppNotification[]>;
  stopPolling: () => void;
  startPolling: (interval?: number) => void;
}

/**
 * Hook for in-app notifications — reads from and updates the notification Zustand store
 */
export const useInAppNotifications = (
  options?: UseInAppNotificationsOptions
): UseInAppNotificationsReturn => {
  const { currentUser, userData } = useAuth();
  const userId = currentUser?.uid || userData?.uid;

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addOrUpdateNotification,
    fetchUnreadCount,
    reset,
  } = useNotificationStore();

  const pollingInitializedRef = useRef(false);

  // Polling disabled for now
  useEffect(() => {
    if (pollingInitializedRef.current) return;

    NotificationPollingService.initialize({
      enabled: false,
      interval: options?.pollingInterval ?? 60000,
      onNotification: (notification) => {
        addOrUpdateNotification(notification);
        fetchUnreadCount();
        options?.onNotification?.(notification);
      },
      onError: (err) => {
        options?.onError?.(err);
      },
    });

    pollingInitializedRef.current = true;
  }, [addOrUpdateNotification, fetchUnreadCount, options?.enabled, options?.pollingInterval, options?.onNotification, options?.onError]);

  // Polling disabled for now - do not start
  // useEffect(() => {
  //   if (!userId || !pollingInitializedRef.current) return;
  //   NotificationPollingService.startPolling(userId, options?.pollingInterval);
  // }, [userId, options?.pollingInterval]);

  // Clear store when user logs out
  useEffect(() => {
    if (!userId) {
      reset();
    }
  }, [userId, reset]);

  const stopPolling = useCallback(() => {
    NotificationPollingService.stopPolling();
  }, []);

  const startPolling = useCallback(
    (interval?: number) => {
      if (userId) {
        NotificationPollingService.startPolling(userId, interval);
      }
    },
    [userId]
  );

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchNotifications,
    stopPolling,
    startPolling,
  };
};

export default useInAppNotifications;
