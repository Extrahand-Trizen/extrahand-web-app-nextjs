"use client";

import { create } from "zustand";
import type { InAppNotification } from "@/lib/notifications/pollingService";
import NotificationPollingService from "@/lib/notifications/pollingService";

type NotificationState = {
  notifications: InAppNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: Error | null;
  lastFetchedAt: number | null;

  fetchNotifications: (limit?: number, skip?: number) => Promise<InAppNotification[]>;
  fetchUnreadCount: () => Promise<number>;
  markAsRead: (notificationId: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  /** Updates UI immediately (badge → 0, all read); call markAllAsRead() after for API. */
  markAllAsReadOptimistic: () => void;
  deleteNotification: (notificationId: string) => Promise<boolean>;

  setNotifications: (notifications: InAppNotification[]) => void;
  setUnreadCount: (count: number) => void;
  addOrUpdateNotification: (notification: InAppNotification) => void;
  reset: () => void;
};

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null as Error | null,
  lastFetchedAt: null as number | null,
};

export const useNotificationStore = create<NotificationState>()((set, get) => ({
  ...initialState,

  fetchNotifications: async (limit = 50, skip = 0) => {
    set({ isLoading: true, error: null });
    try {
      const list = await NotificationPollingService.fetchNotifications(
        "", // API uses credentials; userId only used for logging
        limit,
        skip,
        false
      );
      const notifications = list ?? [];
      set((s) => {
        const merged = skip === 0 ? notifications : [...s.notifications, ...notifications];
        const unreadCount = merged.filter((n) => !n.read).length;
        return {
          notifications: merged,
          unreadCount,
          isLoading: false,
          error: null,
          lastFetchedAt: Date.now(),
        };
      });
      return notifications;
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to fetch notifications");
      set({ isLoading: false, error });
      return [];
    }
  },

  fetchUnreadCount: async () => {
    try {
      const count = await NotificationPollingService.getUnreadCount();
      set({ unreadCount: count });
      return count;
    } catch {
      return get().unreadCount;
    }
  },

  markAsRead: async (notificationId: string) => {
    try {
      const ok = await NotificationPollingService.markAsRead(notificationId);
      if (ok) {
        set((s) => ({
          notifications: s.notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true, readAt: new Date() } : n
          ),
          unreadCount: Math.max(0, s.unreadCount - 1),
        }));
      }
      return ok;
    } catch {
      return false;
    }
  },

  markAllAsRead: async () => {
    try {
      const ok = await NotificationPollingService.markAllAsRead();
      if (ok) {
        set((s) => ({
          notifications: s.notifications.map((n) => ({ ...n, read: true, readAt: new Date() })),
          unreadCount: 0,
        }));
      }
      return ok;
    } catch {
      return false;
    }
  },

  markAllAsReadOptimistic: () => {
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true, readAt: new Date() })),
      unreadCount: 0,
    }));
  },

  deleteNotification: async (notificationId: string) => {
    try {
      const ok = await NotificationPollingService.deleteNotification(notificationId);
      if (ok) {
        const deleted = get().notifications.find((n) => n.id === notificationId);
        set((s) => ({
          notifications: s.notifications.filter((n) => n.id !== notificationId),
          unreadCount: deleted && !deleted.read ? Math.max(0, s.unreadCount - 1) : s.unreadCount,
        }));
      }
      return ok;
    } catch {
      return false;
    }
  },

  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (unreadCount) => set({ unreadCount }),

  addOrUpdateNotification: (notification) => {
    set((s) => {
      const exists = s.notifications.some((n) => n.id === notification.id);
      const list = exists
        ? s.notifications.map((n) => (n.id === notification.id ? notification : n))
        : [notification, ...s.notifications];
      const unreadCount = list.filter((n) => !n.read).length;
      return { notifications: list, unreadCount };
    });
  },

  reset: () => set(initialState),
}));
