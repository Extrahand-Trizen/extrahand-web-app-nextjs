"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { usePayoutNotificationsStore } from "@/lib/state/payoutNotificationsStore";

interface ProcessPayoutProps {
  taskId: string;
  performerUid: string;
  amount: number;
  taskTitle?: string;
}

interface PayoutResult {
  success: boolean;
  payoutId?: string;
  status?: "processing" | "completed" | "failed";
  amount?: number;
  netAmount?: number;
  message?: string;
  requiresBankAccount?: boolean;
  error?: string;
}

export function useProcessPayout() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = usePayoutNotificationsStore();

  const processPayout = useCallback(
    async (props: ProcessPayoutProps): Promise<PayoutResult> => {
      setLoading(true);
      setError(null);

      try {
        const token = await currentUser?.getIdToken();
        if (!token) {
          throw new Error("Not authenticated");
        }

        const response = await fetch("/api/payment/payout/task-completion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(props),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data.requiresBankAccount) {
            setError("Please add a bank account to receive payouts");
            return {
              success: false,
              requiresBankAccount: true,
              error: data.message || "Bank account required",
            };
          }
          throw new Error(data.error || "Failed to process payout");
        }

        // Add notification for successful payout
        const notificationId = `payout-${data.payoutId}`;
        addNotification({
          id: notificationId,
          type: data.status || "processing",
          amount: props.amount,
          netAmount: data.netAmount || props.amount,
          taskTitle: props.taskTitle || "Task",
          taskId: props.taskId,
          payoutId: data.payoutId,
          message:
            data.status === "completed"
              ? `₹${data.netAmount} has been credited to your bank account for "${props.taskTitle || "Task"}"`
              : `Payout of ₹${data.netAmount} is being processed for "${props.taskTitle || "Task"}"`,
          createdAt: new Date().toISOString(),
        });

        setLoading(false);
        return {
          success: true,
          payoutId: data.payoutId,
          status: data.status,
          amount: props.amount,
          netAmount: data.netAmount,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to process payout";
        setError(errorMessage);
        setLoading(false);
        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [currentUser, addNotification]
  );

  return { processPayout, loading, error };
}
