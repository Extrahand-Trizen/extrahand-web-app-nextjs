"use client";

import { create } from "zustand";
import { paymentApi } from "@/lib/api/endpoints/payment";
import type { Transaction } from "@/types/profile";

type PaymentsState = {
  transactions: Transaction[];
  totalEarnings: number;
  totalSpent: number;
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
  fetchPayments: (userId: string, opts?: { force?: boolean }) => Promise<void>;
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
      const txRes = await paymentApi.getUserTransactions(userId, { limit: 100 });
      let mapped: Transaction[] = [];

      if (txRes && Array.isArray(txRes.transactions)) {
        mapped = txRes.transactions.map((tx: any) => {
          let mappedType: Transaction["type"] = "payment";
          if (tx.type === "payout" || tx.type === "earning") {
            mappedType = "payout";
          }

          return {
            id: tx.transactionId || tx.id,
            type: mappedType,
            amount: parseFloat(tx.amount),
            currency: "INR",
            status:
              tx.status === "held" || tx.status === "pending"
                ? "pending"
                : "completed",
            description: tx.description || "",
            createdAt: new Date(tx.date || tx.createdAt),
            taskId: tx.metadata?.taskId,
            taskTitle: tx.metadata?.taskTitle,
          };
        });
      }

      // Fetch earnings summary
      const earningsRes = await paymentApi.getUserEarnings(userId);
      const totalEarnings =
        earningsRes.success && earningsRes.data
          ? earningsRes.data.totalEarnings || 0
          : 0;

      const totalSpent = mapped
        .filter((t) => t.type === "payment" && t.status === "completed")
        .reduce((sum, t) => sum + t.amount, 0);

      set({
        transactions: mapped,
        totalEarnings,
        totalSpent,
        loading: false,
        error: null,
        lastFetchedAt: now,
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error?.message || "Failed to load payments",
      });
    }
  },
}));

