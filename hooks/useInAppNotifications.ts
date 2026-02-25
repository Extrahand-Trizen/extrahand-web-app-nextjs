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
  const { currentUser, userData } = useAuth();
  const userId = currentUser?.uid || userData?.uid;
  
  const [notifications, setNotifications] = useState<InAppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const pollingInitializedRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize polling service
  useEffect(() => {
    if (pollingInitializedRef.current) return;
    
    console.log('🚀 Initializing notification polling service');
    
    NotificationPollingService.initialize({
      enabled: options?.enabled ?? true,
      interval: options?.pollingInterval ?? 60000, // 1 minute
      onNotification: (notification) => {
        console.log('📬 New notification received:', notification);
        
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
        console.error('❌ Polling error:', err);
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
    if (!userId || !pollingInitializedRef.current) {
      console.log('⏸️ Polling not started - userId:', userId, 'initialized:', pollingInitializedRef.current);
      return;
    }

    console.log('▶️ Starting notification polling for user:', userId);
    NotificationPollingService.startPolling(userId, options?.pollingInterval);

    return () => {
      // Don't stop polling on unmount, just when component is removed
      // NotificationPollingService.stopPolling();
    };
  }, [userId, options?.pollingInterval]);

  // Fetch initial notifications
  const fetchNotifications = useCallback(
    async (limit: number = 50, skip: number = 0) => {
      if (!userId) {
        console.log('⚠️ Cannot fetch notifications - no userId');
        return [];
      }

      try {
        setIsLoading(true);
        setError(null);

        console.log('📡 Fetching notifications for user:', userId);
        const fetched = await NotificationPollingService.fetchNotifications(
          userId,
          limit,
          skip,
          false
        );

        console.log('✅ Fetched notifications:', fetched?.length || 0);

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
        console.error('❌ Error fetching notifications:', error);
        setError(error);
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  // Fetch notifications on mount
  useEffect(() => {
    if (userId && notifications.length === 0) {
      console.log('📥 Initial fetch of notifications');
      fetchNotifications();
    }
  }, [userId, fetchNotifications, notifications.length]);

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
    if (userId) {
      console.log('▶️ Starting polling manually for user:', userId);
      NotificationPollingService.startPolling(userId, interval);
    } else {
      console.warn('⚠️ Cannot start polling - no userId');
    }
  }, [userId]);

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
