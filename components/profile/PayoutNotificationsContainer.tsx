"use client";

import React from "react";
import { usePayoutNotificationsStore } from "@/lib/state/payoutNotificationsStore";
import { PayoutNotificationBanner } from "./PayoutNotificationBanner";
import { useRouter } from "next/navigation";

interface PayoutNotificationsContainerProps {
  autoDismissAfter?: number; // milliseconds, 0 = never
}

export function PayoutNotificationsContainer({
  autoDismissAfter = 8000,
}: PayoutNotificationsContainerProps) {
  const { notifications, removeNotification } =
    usePayoutNotificationsStore();
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 space-y-2 max-w-md mx-auto">
      {notifications.map((notification) => (
        <PayoutNotificationBanner
          key={notification.id}
          notification={notification}
          onDismiss={() => removeNotification(notification.id)}
          onNavigateToPayments={() => {
            router.push("/profile?tab=payments");
          }}
          autoDismissAfter={autoDismissAfter}
        />
      ))}
    </div>
  );
}
