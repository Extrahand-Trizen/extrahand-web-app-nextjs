"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { useInAppNotifications } from "@/hooks/useInAppNotifications";
import type { InAppNotification } from "@/lib/notifications/pollingService";

export function PollingOtpToastBridge() {
  const shownToastIdsRef = useRef<Set<string>>(new Set());

  useInAppNotifications({
    pollingInterval: 10000,
    onNotification: (notification: InAppNotification) => {
      if (notification.data?.otpType !== "task_start") return;

      const toastId = `task-start-otp-${notification.id}`;
      if (shownToastIdsRef.current.has(toastId)) return;
      shownToastIdsRef.current.add(toastId);

      toast.info(notification.title || "Task Start OTP", {
        id: toastId,
        description: notification.body,
        duration: Number.POSITIVE_INFINITY,
      });
    },
  });

  return null;
}

export default PollingOtpToastBridge;