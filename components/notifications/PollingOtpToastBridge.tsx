"use client";

import { useRef } from "react";
import { toast } from "sonner";
import { useInAppNotifications } from "@/hooks/useInAppNotifications";
import type { InAppNotification } from "@/lib/notifications/pollingService";

const DISMISSED_OTP_TOASTS_KEY = "dismissed-task-start-otp-toasts";

function loadDismissedOtpToasts(): Set<string> {
  if (typeof window === "undefined") return new Set<string>();

  try {
    const raw = window.localStorage.getItem(DISMISSED_OTP_TOASTS_KEY);
    if (!raw) return new Set<string>();

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set<string>();

    return new Set(parsed.filter((id): id is string => typeof id === "string"));
  } catch {
    return new Set<string>();
  }
}

function saveDismissedOtpToasts(ids: Set<string>) {
  if (typeof window === "undefined") return;

  try {
    // Keep storage bounded to avoid unbounded growth.
    const limited = Array.from(ids).slice(-500);
    window.localStorage.setItem(DISMISSED_OTP_TOASTS_KEY, JSON.stringify(limited));
  } catch {
    // No-op if storage is unavailable.
  }
}

export function PollingOtpToastBridge() {
  const shownToastIdsRef = useRef<Set<string>>(new Set());
  const dismissedToastIdsRef = useRef<Set<string>>(loadDismissedOtpToasts());

  const { markAsRead } = useInAppNotifications({
    pollingInterval: 10000,
    onNotification: (notification: InAppNotification) => {
      if (notification.data?.otpType !== "task_start") return;

      const toastId = `task-start-otp-${notification.id}`;
      if (dismissedToastIdsRef.current.has(toastId)) return;
      if (shownToastIdsRef.current.has(toastId)) return;
      shownToastIdsRef.current.add(toastId);

      toast.info(notification.title || "Task Start OTP", {
        id: toastId,
        description: notification.body,
        duration: Number.POSITIVE_INFINITY,
        onDismiss: async () => {
          dismissedToastIdsRef.current.add(toastId);
          saveDismissedOtpToasts(dismissedToastIdsRef.current);
          await markAsRead(notification.id);
        },
      });
    },
  });

  return null;
}

export default PollingOtpToastBridge;