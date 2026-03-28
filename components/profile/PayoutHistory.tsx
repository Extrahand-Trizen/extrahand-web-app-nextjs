"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/context";
import { PayoutStatusCard } from "./PayoutStatusCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { Transaction } from "@/types/profile";

interface Payout {
  payoutId: string;
  status: "processing" | "completed" | "failed" | "reversed";
  amount: number;
  netAmount: number;
  grossAmount: number;
  taskTitle?: string;
  taskId?: string;
  completedAt?: string;
  createdAt: string;
}

interface PayoutHistoryProps {
  payoutIds?: string[];
  fallbackPayouts?: Transaction[];
  maxItems?: number;
  showPending?: boolean;
  showCompleted?: boolean;
}

export function PayoutHistory({
  payoutIds = [],
  fallbackPayouts = [],
  maxItems = 10,
  showPending = true,
  showCompleted = true,
}: PayoutHistoryProps) {
  const { currentUser } = useAuth();
  const [payoutDetails, setPayoutDetails] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchPayoutDetails = async () => {
      try {
        setLoading(true);
        const token = await currentUser?.getIdToken();
        if (!token) {
          setError("Not authenticated");
          return;
        }

        const responses = await Promise.allSettled(
          payoutIds.slice(0, maxItems).map((id) =>
            fetch(`/api/payment/payout/${encodeURIComponent(id)}`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then(async (response) => {
              const payload = await response.json().catch(() => ({}));
              return {
                ok: response.ok,
                payoutId: id,
                payload,
              };
            })
          )
        );

        const normalizedFromApi = responses
          .filter(
            (
              r
            ): r is PromiseFulfilledResult<{
              ok: boolean;
              payoutId: string;
              payload: { payout?: Record<string, unknown> };
            }> => r.status === "fulfilled"
          )
          .filter((r) => r.value.ok && r.value.payload?.payout)
          .map((r) => {
            const payout = r.value.payload.payout;
            const amount = Number.parseFloat(String(payout.amount ?? 0));
            const netAmount = Number.parseFloat(String(payout.netAmount ?? amount));

            return {
              payoutId: payout.payoutId || r.value.payoutId,
              status: payout.status || "processing",
              amount: Number.isFinite(amount) ? amount : 0,
              netAmount: Number.isFinite(netAmount) ? netAmount : 0,
              grossAmount: Number.isFinite(amount) ? amount : 0,
              taskTitle: payout.taskTitle,
              taskId: payout.taskId,
              createdAt: payout.createdAt || new Date().toISOString(),
              completedAt: payout.completedAt,
            } as Payout;
          });

        const apiPayoutIds = new Set(
          normalizedFromApi.map((payout) => payout.payoutId)
        );

        const fallbackRows = fallbackPayouts
          .slice(0, maxItems)
          .map((transaction) => {
            const metadata =
              transaction.metadata &&
              typeof transaction.metadata === "object" &&
              !Array.isArray(transaction.metadata)
                ? (transaction.metadata as Record<string, unknown>)
                : undefined;

            const payoutId =
              transaction.payoutId ||
              (typeof metadata?.payoutId === "string" && metadata.payoutId) ||
              (typeof metadata?.relatedEntityId === "string" &&
                metadata.relatedEntityId) ||
              (typeof metadata?.transactionId === "string" &&
                metadata.transactionId) ||
              transaction.id;

            const normalizedStatus =
              transaction.status === "pending"
                ? "processing"
                : transaction.status === "cancelled"
                ? "reversed"
                : transaction.status;

            return {
              payoutId,
              status: (normalizedStatus || "processing") as Payout["status"],
              amount: transaction.totalPaid || transaction.amount,
              netAmount: transaction.amount,
              grossAmount: transaction.totalPaid || transaction.amount,
              taskTitle: transaction.taskTitle || transaction.description,
              taskId:
                typeof transaction.taskId === "string"
                  ? transaction.taskId
                  : undefined,
              createdAt: new Date(transaction.createdAt).toISOString(),
              completedAt:
                transaction.completedAt instanceof Date
                  ? transaction.completedAt.toISOString()
                  : typeof transaction.completedAt === "string"
                  ? transaction.completedAt
                  : undefined,
            } as Payout;
          })
          .filter((payout) => !apiPayoutIds.has(payout.payoutId));

        const payouts = [...normalizedFromApi, ...fallbackRows];

        setPayoutDetails(payouts);
        setError(null);

        // If no payouts remain in "processing", stop polling.
        if (payouts.every((p) => p.status !== "processing") && intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load payouts"
        );
      } finally {
        setLoading(false);
      }
    };

    if (payoutIds.length > 0 || fallbackPayouts.length > 0) {
      fetchPayoutDetails();
      intervalId = setInterval(fetchPayoutDetails, 10_000);
    } else {
      setLoading(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [payoutIds, fallbackPayouts, maxItems, currentUser]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (payoutDetails.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No payouts yet</AlertDescription>
      </Alert>
    );
  }

  const pendingPayouts = payoutDetails.filter((p) => p.status === "processing");
  const completedPayouts = payoutDetails.filter((p) => p.status !== "processing");

  return (
    <div className="space-y-6">
      {showPending && pendingPayouts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Pending Transfers</h3>
          <div className="space-y-3">
            {pendingPayouts.map((payout) => (
              <PayoutStatusCard key={payout.payoutId} payout={payout} />
            ))}
          </div>
        </div>
      )}

      {showCompleted && completedPayouts.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Transfer History</h3>
          <div className="space-y-3">
            {completedPayouts.map((payout) => (
              <PayoutStatusCard key={payout.payoutId} payout={payout} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
