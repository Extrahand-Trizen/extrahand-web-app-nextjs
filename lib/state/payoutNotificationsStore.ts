import { create } from "zustand";
import { PayoutNotification } from "@/components/profile/PayoutNotificationBanner";

interface PayoutNotificationStore {
  notifications: PayoutNotification[];
  addNotification: (notification: PayoutNotification) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const usePayoutNotificationsStore = create<PayoutNotificationStore>(
  (set) => ({
    notifications: [],
    addNotification: (notification: PayoutNotification) =>
      set((state) => ({
        notifications: [notification, ...state.notifications],
      })),
    removeNotification: (id: string) =>
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      })),
    clearNotifications: () => set({ notifications: [] }),
  })
);
