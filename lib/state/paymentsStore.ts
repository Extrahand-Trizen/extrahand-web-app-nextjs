"use client";

import { create } from "zustand";
import { paymentApi } from "@/lib/api/endpoints/payment";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import type { Transaction } from "@/types/profile";

type PaymentsState = {
  transactions: Transaction[];
  totalEarnings: number;
  totalSpent: number;
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  fetchPayments: (
    userId: string,
    opts?: { force?: boolean; linkedUserIds?: string[] }
  ) => Promise<void>;
};

export const usePaymentsStore = create<PaymentsState>()((set, get) => ({
  transactions: [],
  totalEarnings: 0,
  totalSpent: 0,
  loading: false,
  error: null,
  lastFetchedAt: null,

  async fetchPayments(userId, opts) {
    const { loading, lastFetchedAt } = get();
    if (!userId) return;

    // Avoid overlapping requests
    if (loading) return;

    const now = Date.now();
    const STALE_MS = 60_000;
    if (!opts?.force && lastFetchedAt && now - lastFetchedAt < STALE_MS) {
      return;
    }

    try {
      set({ loading: true, error: null });

      // Fetch transaction history
      const linkedUserIds = Array.from(
        new Set(
          (opts?.linkedUserIds || [])
            .map((id) => (typeof id === "string" ? id.trim() : ""))
            .filter((id) => id.length > 0 && id !== userId)
        )
      );
      const txPromise = paymentApi.getUserTransactions(userId, {
        limit: 100,
        linkedUserIds: linkedUserIds.length > 0 ? linkedUserIds.join(",") : undefined,
      });
      const earningsPromise = paymentApi.getUserEarnings(
        userId,
        linkedUserIds.length > 0 ? linkedUserIds.join(",") : undefined
      );
      const summaryPromise = paymentApi.getTransactionSummary(userId, {
        linkedUserIds: linkedUserIds.length > 0 ? linkedUserIds.join(",") : undefined,
      });

      const txRes = await txPromise;
      let mapped: Transaction[] = [];

      if (txRes && Array.isArray(txRes.transactions)) {
        mapped = txRes.transactions.map((tx: any) => {
          let mappedType: Transaction["type"] = "payment";
          if (tx.type === "refund") {
            mappedType = "refund";
          } else if (tx.type === "cancellation_penalty") {
            // Keep penalty rows visible in history but out of customer spend totals.
            mappedType = "fee";
          } else if (
            tx.type === "payout" ||
            tx.type === "earning" ||
            tx.type === "compensation"
          ) {
            mappedType = "payout";
          }

          const amount = Number.parseFloat(tx.amount);

          const metadata = tx.metadata || {};
          const descriptionText =
            typeof tx.description === "string" ? tx.description.trim() : "";
          const taskIdFromDescription =
            descriptionText.match(/\b[a-f0-9]{24}\b/i)?.[0] || undefined;

          const toNumber = (value: unknown): number | undefined => {
            if (typeof value === "number" && Number.isFinite(value)) return value;
            if (typeof value === "string") {
              const parsed = Number.parseFloat(value);
              if (Number.isFinite(parsed)) return parsed;
            }
            return undefined;
          };

          const penaltyFromMetadata = toNumber(metadata.penaltyDeducted);

          const taskId =
            tx.taskId ||
            metadata.taskId ||
            metadata.task?._id ||
            metadata.task?.id ||
            tx.relatedTaskId ||
            taskIdFromDescription;
          const payoutIdCandidate =
            tx.transactionId ||
            tx.relatedEntityId ||
            metadata.payoutId ||
            tx.id;
          const payoutId = mappedType === "payout" ? String(payoutIdCandidate) : undefined;
          const taskTitle =
            tx.taskTitle ||
            metadata.taskTitle ||
            metadata.taskName ||
            metadata.taskDescription ||
            metadata.task?.title ||
            metadata.title ||
            tx.title;

          const taskAmount =
            toNumber(metadata.taskAmount) ||
            toNumber(metadata.grossAmount) ||
            toNumber(metadata.amountBreakdown?.taskAmount) ||
            toNumber(metadata.fees?.taskAmount) ||
            (mappedType === "payout" && penaltyFromMetadata && penaltyFromMetadata > 0
              ? amount + penaltyFromMetadata
              : undefined);
          const platformFee =
            toNumber(metadata.platformFee) ||
            toNumber(metadata.platformFeeAmount) ||
            toNumber(metadata.amountBreakdown?.platformFee) ||
            toNumber(metadata.fees?.platformFee);
          const gstAmount =
            toNumber(metadata.gstAmount) ||
            toNumber(metadata.platformFeeGst) ||
            toNumber(metadata.gst) ||
            toNumber(metadata.amountBreakdown?.gst) ||
            toNumber(metadata.fees?.gst);
          const totalPaid =
            mappedType === "payout"
              ? amount
              : toNumber(metadata.totalPaid) ||
                toNumber(metadata.grossAmount) ||
                toNumber(metadata.totalAmount) ||
                toNumber(metadata.amountBreakdown?.totalAmount) ||
                amount;

          const penaltyDeducted =
            metadata.penaltyDeducted ||
            (metadata.netAmount && metadata.grossAmount
              ? toNumber(metadata.grossAmount) - toNumber(metadata.netAmount)
              : undefined);
          
          // Only include penaltyDeducted if it's actually > 0
          const effectivePenaltyDeducted = penaltyDeducted && toNumber(penaltyDeducted) > 0 ? penaltyDeducted : undefined;
          const penaltyLines = Array.isArray(metadata.penaltyLines) && effectivePenaltyDeducted ? metadata.penaltyLines : undefined;

          const fallbackDescription =
            mappedType === "payment"
              ? "Payment"
              : mappedType === "payout"
              ? "Earnings"
              : "Transaction";

          const rawStatus = String(tx.status || "").toLowerCase();
          const escrowStatusRaw = String(
            metadata.escrowStatus || metadata.escrow?.status || ""
          ).toLowerCase();
          const isCancelledFlow =
            (escrowStatusRaw === "cancelled" || escrowStatusRaw === "refunded") &&
            (mappedType === "payment" || mappedType === "refund");

          const normalizedStatus: Transaction["status"] =
            isCancelledFlow
              ? "cancelled"
              : rawStatus === "held" ||
            rawStatus === "pending" ||
            rawStatus === "processing" ||
            rawStatus === "authorized"
              ? "pending"
              : rawStatus === "failed"
              ? "failed"
              : rawStatus === "cancelled"
              ? "cancelled"
              : "completed";

          return {
            id: tx.transactionId || tx.id,
            payoutId,
            type: mappedType,
            amount,
            currency: "INR",
            status: normalizedStatus,
            description: tx.description || fallbackDescription,
            createdAt: new Date(tx.date || tx.createdAt),
            taskId,
            taskTitle,
            metadata,
            rawStatus,
            taskCategory:
              metadata.taskCategory || metadata.task?.category || metadata.category,
            taskStatus: metadata.taskStatus || metadata.task?.status,
            assignedToName:
              metadata.assignedToName || metadata.task?.assignedToName,
            paidToName:
              metadata.paidToName || metadata.performerName || metadata.taskerName,
            escrowStatus: metadata.escrowStatus || metadata.escrow?.status,
            taskAmount,
            platformFee,
            gstAmount,
            totalPaid,
            penaltyDeducted: effectivePenaltyDeducted,
            penaltyLines,
          };
        });
      }

      const mappedNetSpent = Math.max(
        0,
        mapped
          .filter((t) => t.type === "payment" && t.status !== "failed")
          .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0) -
          mapped
            .filter((t) => t.type === "refund" && t.status === "completed")
            .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0)
      );

      // Show transaction rows as soon as they are available.
      set({
        transactions: mapped,
        totalSpent: mappedNetSpent,
        loading: false,
        error: null,
        lastFetchedAt: now,
      });

      // Backfill missing task titles so payment rows can show task names instead of generic labels.
      const missingTitleTaskIds = Array.from(
        new Set(
          mapped
            .filter((t) => t.taskId && !t.taskTitle)
            .map((t) => t.taskId as string)
        )
      );

      if (missingTitleTaskIds.length > 0) {
        const taskTitleMap = new Map<string, string>();

        await Promise.all(
          missingTitleTaskIds.map(async (taskId) => {
            try {
              const task = await tasksApi.getTask(taskId);
              const title = (task as any)?.title;
              if (typeof title === "string" && title.trim()) {
                taskTitleMap.set(taskId, title.trim());
              }
            } catch {
              // Ignore fetch failures; UI will fall back to generic task label.
            }
          })
        );

        if (taskTitleMap.size > 0) {
          const enriched = mapped.map((t) => {
            if (!t.taskId || t.taskTitle) return t;
            const resolvedTitle = taskTitleMap.get(t.taskId);
            return resolvedTitle ? { ...t, taskTitle: resolvedTitle } : t;
          });

          set((state) => {
            if (!state.transactions.length) return state;
            return { ...state, transactions: enriched };
          });
        }
      }

      const [earningsSettled, summarySettled] = await Promise.allSettled([
        earningsPromise,
        summaryPromise,
      ]);

      const totalEarnings =
        earningsSettled.status === "fulfilled" && earningsSettled.value?.success && earningsSettled.value?.data
          ? earningsSettled.value.data.totalEarnings || 0
          : 0;

      const summaryTotalPayments =
        summarySettled.status === "fulfilled"
          ? Number.parseFloat(summarySettled.value?.summary?.totalPayments || "0")
          : NaN;
      const summaryTotalRefunds =
        summarySettled.status === "fulfilled"
          ? Number.parseFloat(summarySettled.value?.summary?.totalRefunds || "0")
          : NaN;

      const totalSpentFromSummary =
        Number.isFinite(summaryTotalPayments) && Number.isFinite(summaryTotalRefunds)
          ? Math.max(0, summaryTotalPayments - summaryTotalRefunds)
          : mappedNetSpent;

      // Keep UI-consistent behavior: cancelled outgoing payments should not contribute
      // to Total Spent even before/without a refund row.
      const totalSpent = mapped.length > 0 ? mappedNetSpent : totalSpentFromSummary;

      set((state) => ({
        ...state,
        totalEarnings,
        totalSpent,
        error: null,
        lastFetchedAt: now,
      }));
    } catch (error: any) {
      set({
        loading: false,
        error: error?.message || "Failed to load payments",
      });
    }
  },
}));

