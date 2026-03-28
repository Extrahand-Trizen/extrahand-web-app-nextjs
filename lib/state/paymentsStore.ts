"use client";

import { create } from "zustand";
import { paymentApi } from "@/lib/api/endpoints/payment";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import type { PendingCancellationPenaltyItem, Transaction } from "@/types/profile";

type PaymentsState = {
  transactions: Transaction[];
  totalEarnings: number;
  totalSpent: number;
  pendingCancellationPenaltyTotal: number;
  pendingCancellationPenaltyItems: PendingCancellationPenaltyItem[];
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  fetchPayments: (userId: string, opts?: { force?: boolean }) => Promise<void>;
};

export const usePaymentsStore = create<PaymentsState>()((set, get) => ({
  transactions: [],
  totalEarnings: 0,
  totalSpent: 0,
  pendingCancellationPenaltyTotal: 0,
  pendingCancellationPenaltyItems: [],
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

      const [txRes, penRes] = await Promise.all([
        paymentApi.getUserTransactions(userId, { limit: 100 }),
        paymentApi.getPendingCancellationPenalties(userId),
      ]);

      let mapped: Transaction[] = [];

      const penaltyItems: PendingCancellationPenaltyItem[] =
        penRes?.success && Array.isArray(penRes.items) ? penRes.items : [];
      let pendingPenaltyTotal = 0;
      if (penRes?.success && typeof penRes.totalRemaining === "string") {
        const parsed = Number.parseFloat(penRes.totalRemaining);
        if (Number.isFinite(parsed)) pendingPenaltyTotal = Math.max(0, parsed);
      } else if (penaltyItems.length > 0) {
        for (const it of penaltyItems) {
          const r = Number.parseFloat(it.remainingAmount);
          if (Number.isFinite(r)) pendingPenaltyTotal += r;
        }
      }

      if (txRes && Array.isArray(txRes.transactions)) {
        mapped = txRes.transactions.map((tx: any) => {
          let mappedType: Transaction["type"] = "payment";
          if (tx.type === "payout" || tx.type === "earning") {
            mappedType = "payout";
          } else if (tx.type === "refund") {
            mappedType = "refund";
          } else if (tx.type === "cancellation_penalty") {
            mappedType = "penalty";
          } else if (tx.type === "escrow" || tx.type === "payment") {
            mappedType = "payment";
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

          const escrowStatusFromMeta =
            typeof metadata.escrowStatus === "string"
              ? (metadata.escrowStatus as Transaction["escrowStatus"])
              : undefined;
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
            toNumber(metadata.amountBreakdown?.taskAmount) ||
            toNumber(metadata.fees?.taskAmount);
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
            toNumber(metadata.totalPaid) ||
            toNumber(metadata.totalAmount) ||
            toNumber(metadata.amountBreakdown?.totalAmount) ||
            amount;

          const fallbackDescription =
            mappedType === "payment"
              ? "Payment"
              : mappedType === "payout"
              ? "Earnings"
              : mappedType === "refund"
              ? "Refund"
              : mappedType === "penalty"
              ? "Cancellation penalty"
              : "Transaction";

          const originalPenaltyAmt = toNumber(metadata.originalPenaltyAmount);
          const remainingPenaltyAmt =
            mappedType === "penalty"
              ? toNumber(metadata.remainingAmount) ?? amount
              : undefined;
          const grossBeforePenalties = toNumber(metadata.grossPayoutBeforePenalties);
          const cancellationPenDeducted = toNumber(metadata.cancellationPenaltyDeducted);

          const rawStatus = String(tx.status || "").toLowerCase();

          const normalizedStatus: Transaction["status"] =
            rawStatus === "held" ||
            rawStatus === "pending" ||
            rawStatus === "processing" ||
            rawStatus === "authorized"
              ? "pending"
              : rawStatus === "failed"
              ? "failed"
              : rawStatus === "cancelled"
              ? "cancelled"
              : rawStatus === "refunded"
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
            escrowStatus:
              escrowStatusFromMeta ||
              (metadata.escrow?.status as Transaction["escrowStatus"] | undefined),
            taskAmount,
            platformFee,
            gstAmount,
            totalPaid,
            ...(mappedType === "penalty"
              ? {
                  originalPenaltyAmount: originalPenaltyAmt ?? amount,
                  remainingPenaltyAmount: remainingPenaltyAmt ?? amount,
                }
              : {}),
            ...(mappedType === "payout"
              ? {
                  ...(grossBeforePenalties !== undefined
                    ? { grossPayoutBeforePenalties: grossBeforePenalties }
                    : {}),
                  ...(cancellationPenDeducted !== undefined && cancellationPenDeducted > 0
                    ? { cancellationPenaltyDeducted: cancellationPenDeducted }
                    : {}),
                }
              : {}),
          };
        });
      }

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
          mapped = mapped.map((t) => {
            if (!t.taskId || t.taskTitle) return t;
            const resolvedTitle = taskTitleMap.get(t.taskId);
            return resolvedTitle ? { ...t, taskTitle: resolvedTitle } : t;
          });
        }
      }

      // Fetch earnings summary
      const earningsRes = await paymentApi.getUserEarnings(userId);
      const totalEarnings =
        earningsRes.success && earningsRes.data
          ? earningsRes.data.totalEarnings || 0
          : 0;

      // Net spend: money paid for tasks minus refunds returned (Razorpay refunds).
      const paymentTotal = mapped
        .filter((t) => t.type === "payment")
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
      const refundTotal = mapped
        .filter((t) => t.type === "refund")
        .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);
      const totalSpent = Math.max(0, paymentTotal - refundTotal);

      set({
        transactions: mapped,
        totalEarnings,
        totalSpent,
        pendingCancellationPenaltyTotal: pendingPenaltyTotal,
        pendingCancellationPenaltyItems: penaltyItems as PendingCancellationPenaltyItem[],
        loading: false,
        error: null,
        lastFetchedAt: now,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error?.message || "Failed to load payments",
        pendingCancellationPenaltyTotal: 0,
        pendingCancellationPenaltyItems: [],
      });
    }
  },
}));

