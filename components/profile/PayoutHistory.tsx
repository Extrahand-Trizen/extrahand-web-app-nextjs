"use client";

import React, { useEffect, useState } from "react";
import { usePayoutStatus } from "@/lib/hooks/usePayments";
import { PayoutStatusCard } from "./PayoutStatusCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  maxItems?: number;
  showPending?: boolean;
  showCompleted?: boolean;
}

export function PayoutHistory({
  payoutIds = [],
  maxItems = 10,
  showPending = true,
  showCompleted = true,
}: PayoutHistoryProps) {
  const [payoutDetails, setPayoutDetails] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const fetchPayoutDetails = async () => {
      try {
        setLoading(true);
        const token = await (window as any).auth?.currentUser?.getIdToken();
        if (!token) {
          setError("Not authenticated");
          return;
        }

        const responses = await Promise.allSettled(
          payoutIds.slice(0, maxItems).map((id) =>
            fetch(`/api/payment/payout/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            }).then((r) => r.json())
          )
        );

        const payouts = responses
          .filter(
            (r): r is PromiseFulfilledResult<any> => r.status === "fulfilled"
          )
          .map((r) => r.value.payout)
          .filter(Boolean);

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

    if (payoutIds.length > 0) {
      fetchPayoutDetails();
      intervalId = setInterval(fetchPayoutDetails, 10_000);
    } else {
      setLoading(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [payoutIds, maxItems]);

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
