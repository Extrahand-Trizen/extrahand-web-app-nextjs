"use client";

import { create } from "zustand";
import { paymentApi } from "@/lib/api/endpoints/payment";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import type { Transaction } from "@/types/profile";
import type { ExtraCoinsWallet } from "@/types/payment";

type PaymentsState = {
  transactions: Transaction[];
  totalEarnings: number;
  totalSpent: number;
  extraCoinsWallet: ExtraCoinsWallet | null;
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
  extraCoinsWallet: null,
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
      const walletPromise = paymentApi.getExtraCoinsWallet(
        userId,
        linkedUserIds.length > 0 ? linkedUserIds.join(",") : undefined
      );

      const txRes = await txPromise;
      let mapped: Transaction[] = [];

      if (txRes && Array.isArray(txRes.transactions)) {
        const transactionRows = txRes.transactions as unknown as Array<Record<string, unknown>>;
        mapped = transactionRows.map((tx, index) => {
          const asRecord = (value: unknown): Record<string, unknown> =>
            value && typeof value === "object" && !Array.isArray(value)
              ? (value as Record<string, unknown>)
              : {};
          const getString = (value: unknown): string | undefined => {
            if (typeof value === "string") return value;
            if (typeof value === "number" && Number.isFinite(value)) return String(value);
            return undefined;
          };
          let mappedType: Transaction["type"] = "payment";
          const txType = getString(tx.type) || "";
          if (txType === "refund") {
            mappedType = "refund";
          } else if (txType === "cancellation_penalty") {
            // Keep penalty rows visible in history but out of customer spend totals.
            mappedType = "fee";
          } else if (
            txType === "payout" ||
            txType === "earning" ||
            txType === "compensation"
          ) {
            mappedType = "payout";
          }

          const toNumber = (value: unknown): number | undefined => {
            if (typeof value === "number" && Number.isFinite(value)) return value;
            if (typeof value === "string") {
              const parsed = Number.parseFloat(value);
              if (Number.isFinite(parsed)) return parsed;
            }
            return undefined;
          };

          const amount = toNumber(tx.amount) || 0;

          const metadata = asRecord(tx.metadata);
          const metadataTask = asRecord(metadata.task);
          const amountBreakdown = asRecord(metadata.amountBreakdown);
          const fees = asRecord(metadata.fees);
          const descriptionText =
            typeof tx.description === "string" ? tx.description.trim() : "";
          const taskIdFromDescription =
            descriptionText.match(/\b[a-f0-9]{24}\b/i)?.[0] || undefined;

          const penaltyFromMetadata = toNumber(metadata.penaltyDeducted);

          const taskId =
            getString(tx.taskId) ||
            getString(metadata.taskId) ||
            getString(metadataTask._id) ||
            getString(metadataTask.id) ||
            getString(tx.relatedTaskId) ||
            taskIdFromDescription;
          const payoutIdCandidate =
            getString(tx.transactionId) ||
            getString(tx.relatedEntityId) ||
            getString(metadata.payoutId) ||
            getString(tx.id);
          const payoutId =
            mappedType === "payout" && payoutIdCandidate
              ? String(payoutIdCandidate)
              : undefined;
          const taskTitle =
            getString(tx.taskTitle) ||
            getString(metadata.taskTitle) ||
            getString(metadata.taskName) ||
            getString(metadata.taskDescription) ||
            getString(metadataTask.title) ||
            getString(metadata.title) ||
            getString(tx.title);

          const taskAmount =
            toNumber(metadata.taskAmount) ||
            toNumber(metadata.grossAmount) ||
            toNumber(amountBreakdown.taskAmount) ||
            toNumber(fees.taskAmount) ||
            (mappedType === "payout" && penaltyFromMetadata && penaltyFromMetadata > 0
              ? amount + penaltyFromMetadata
              : undefined);
          const platformFee =
            toNumber(metadata.platformFee) ||
            toNumber(metadata.platformFeeAmount) ||
            toNumber(metadata.platformCommission) ||
            toNumber(amountBreakdown.platformFee) ||
            toNumber(fees.platformFee);
          const gstAmount =
            toNumber(metadata.gstAmount) ||
            toNumber(metadata.platformFeeGst) ||
            toNumber(metadata.gstOnCommission) ||
            toNumber(metadata.gst) ||
            toNumber(amountBreakdown.gst) ||
            toNumber(fees.gst);
          const totalPaid =
            mappedType === "payout"
              ? toNumber(metadata.totalPaid) ||
                toNumber(metadata.grossAmount) ||
                toNumber(metadata.taskAmount) ||
                toNumber(amountBreakdown.taskAmount) ||
                amount
              : toNumber(metadata.totalPaid) ||
                toNumber(metadata.grossAmount) ||
                toNumber(metadata.totalAmount) ||
                toNumber(amountBreakdown.totalAmount) ||
                amount;

          const grossAmount = toNumber(metadata.grossAmount);
          const netAmount = toNumber(metadata.netAmount);
          const penaltyDeducted = toNumber(metadata.penaltyDeducted) ||
            (typeof grossAmount === "number" && typeof netAmount === "number"
              ? grossAmount - netAmount
              : undefined);
          
          // Only include penaltyDeducted if it's actually > 0
          const effectivePenaltyDeducted = penaltyDeducted && toNumber(penaltyDeducted) > 0 ? penaltyDeducted : undefined;
          const penaltyLines =
            Array.isArray(metadata.penaltyLines) && effectivePenaltyDeducted
              ? metadata.penaltyLines
                  .map((line) => {
                    const row = asRecord(line);
                    const penaltyId = getString(row.penaltyId);
                    const lineTaskId = getString(row.taskId);
                    if (!penaltyId || !lineTaskId) return null;
                    return {
                      penaltyId,
                      taskId: lineTaskId,
                      applied: getString(row.applied) || "0",
                      remainingAfter: getString(row.remainingAfter) || "0",
                    };
                  })
                  .filter(
                    (
                      line
                    ): line is {
                      penaltyId: string;
                      taskId: string;
                      applied: string;
                      remainingAfter: string;
                    } => Boolean(line)
                  )
              : undefined;

          const fallbackDescription =
            mappedType === "payment"
              ? "Payment"
              : mappedType === "payout"
              ? "Earnings"
              : "Transaction";

          const rawStatus = String(getString(tx.status) || "").toLowerCase();
          const escrowStatusRaw = String(
            getString(metadata.escrowStatus) || getString(asRecord(metadata.escrow).status) || ""
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

          const createdAtRaw = tx.date ?? tx.createdAt;
          const createdAt =
            typeof createdAtRaw === "string" ||
            typeof createdAtRaw === "number" ||
            createdAtRaw instanceof Date
              ? new Date(createdAtRaw)
              : new Date();

          return {
            id: getString(tx.transactionId) || getString(tx.id) || `tx-${index}`,
            payoutId,
            type: mappedType,
            amount,
            currency: "INR",
            status: normalizedStatus,
            description: getString(tx.description) || fallbackDescription,
            createdAt,
            taskId,
            taskTitle,
            metadata,
            rawStatus,
            taskCategory:
              getString(metadata.taskCategory) || getString(metadataTask.category) || getString(metadata.category),
            taskStatus: (getString(metadata.taskStatus) || getString(metadataTask.status)) as Transaction["taskStatus"],
            assignedToName:
              getString(metadata.assignedToName) || getString(metadataTask.assignedToName),
            paidToName:
              getString(metadata.paidToName) || getString(metadata.performerName) || getString(metadata.taskerName),
            posterUid: getString(metadata.posterUid),
            escrowStatus: (getString(metadata.escrowStatus) || getString(asRecord(metadata.escrow).status)) as Transaction["escrowStatus"],
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
              const taskRecord =
                task && typeof task === "object"
                  ? (task as unknown as Record<string, unknown>)
                  : undefined;
              const title = taskRecord?.title;
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

      const [earningsSettled, summarySettled, walletSettled] = await Promise.allSettled([
        earningsPromise,
        summaryPromise,
        walletPromise,
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

      const resolvedWallet =
        walletSettled.status === "fulfilled" &&
        walletSettled.value?.success &&
        walletSettled.value?.wallet
          ? walletSettled.value.wallet
          : get().extraCoinsWallet;

      set((state) => ({
        ...state,
        totalEarnings,
        totalSpent,
        extraCoinsWallet: resolvedWallet,
        error: null,
        lastFetchedAt: now,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to load payments";
      set({
        loading: false,
        error: message,
      });
    }
  },
}));

