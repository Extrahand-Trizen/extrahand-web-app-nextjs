/**
 * Hook for managing in-app notifications with polling
 */

'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useAuth } from '@/lib/auth/context';
import NotificationPollingService, {
  InAppNotification,
  NotificationResponse
} from '@/lib/notifications/pollingService';

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
 * Hook for managing in-app notifications
 * Handles both polling and display of notifications
 */
export const useInAppNotifications = (
  options?: UseInAppNotificationsOptions
): UseInAppNotificationsReturn => {
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const pollingInitializedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize polling service
  useEffect(() => {
    if (pollingInitializedRef.current) return;
    
    NotificationPollingService.initialize({
      enabled: options?.enabled ?? true,
      interval: options?.pollingInterval ?? 30000,
      onNotification: (notification) => {
        // Add notification to list
        setNotifications(prev => {
          const exists = prev.some(n => n.id === notification.id);
          if (!exists) {
            return [notification, ...prev];
          }
          return prev;
        });

        // Update unread count
        if (!notification.read) {
          setUnreadCount(prev => prev + 1);
        }

        // Call custom callback if provided
        if (options?.onNotification) {
          options.onNotification(notification);
        }
      },
      onError: (err) => {
        setError(err);
        if (options?.onError) {
          options.onError(err);
        }
      }
    });

    pollingInitializedRef.current = true;
  }, [options?.enabled, options?.pollingInterval, options?.onNotification, options?.onError]);

  // Start polling when user is authenticated
  useEffect(() => {
    if (!user?.uid || !pollingInitializedRef.current) return;

    NotificationPollingService.startPolling(user.uid, options?.pollingInterval);

    return () => {
      // Don't stop polling on unmount, just when component is removed
      // NotificationPollingService.stopPolling();
    };
  }, [user?.uid, options?.pollingInterval]);

  // Fetch initial notifications
  const fetchNotifications = useCallback(
    async (limit: number = 50, skip: number = 0) => {
      if (!user?.uid) return [];

      try {
        setIsLoading(true);
        setError(null);

        const fetched = await NotificationPollingService.fetchNotifications(
          user.uid,
          limit,
          skip,
          false
        );

        if (fetched) {
          if (skip === 0) {
            // Replace if first fetch
            setNotifications(fetched);
          } else {
            // Append if pagination
            setNotifications(prev => [...prev, ...fetched]);
          }

          // Update unread count
          const unread = fetched.filter(n => !n.read).length;
          setUnreadCount(unread);

          return fetched;
        }

        return [];
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to fetch notifications');
        setError(error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [user?.uid]
  );

  // Fetch notifications on mount
  useEffect(() => {
    if (user?.uid && notifications.length === 0) {
      fetchNotifications();
    }
  }, [user?.uid, fetchNotifications, notifications.length]);

  // Mark notification as read
  const markAsRead = useCallback(
    async (notificationId: string): Promise<boolean> => {
      try {
        const success = await NotificationPollingService.markAsRead(notificationId);

        if (success) {
          // Update local state
          setNotifications(prev =>
            prev.map(n =>
              n.id === notificationId
                ? { ...n, read: true, readAt: new Date() }
                : n
            )
          );

          // Update unread count
          setUnreadCount(prev => Math.max(0, prev - 1));
        }

        return success;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to mark as read'));
        return false;
      }
    },
    []
  );

  // Mark all notifications as read
  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    try {
      const success = await NotificationPollingService.markAllAsRead();

      if (success) {
        // Update local state
        setNotifications(prev =>
          prev.map(n => ({
            ...n,
            read: true,
            readAt: new Date()
          }))
        );

        setUnreadCount(0);
      }

      return success;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark all as read'));
      return false;
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(
    async (notificationId: string): Promise<boolean> => {
      try {
        const success = await NotificationPollingService.deleteNotification(notificationId);

        if (success) {
          // Remove from local state
          setNotifications(prev => prev.filter(n => n.id !== notificationId));

          // Update unread count
          const deletedNotif = notifications.find(n => n.id === notificationId);
          if (deletedNotif && !deletedNotif.read) {
            setUnreadCount(prev => Math.max(0, prev - 1));
          }
        }

        return success;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete notification'));
        return false;
      }
    },
    [notifications]
  );

  // Stop polling
  const stopPolling = useCallback(() => {
    NotificationPollingService.stopPolling();
  }, []);

  // Start polling
  const startPolling = useCallback((interval?: number) => {
    if (user?.uid) {
      NotificationPollingService.startPolling(user.uid, interval);
    }
  }, [user?.uid]);

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
    startPolling
  };
};

export default useInAppNotifications;
