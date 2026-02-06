"use client";

/**
 * Payout Status Card
 * Shows payment escrow and payout status on task page
 */

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Wallet } from "lucide-react";
import { paymentApi } from "@/lib/api/endpoints/payment";

interface PayoutStatusCardProps {
  taskId: string;
  taskStatus: string;
}

export function PayoutStatusCard({ taskId, taskStatus }: PayoutStatusCardProps) {
  const [escrow, setEscrow] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEscrowStatus = async () => {
      try {
        const response = await paymentApi.getEscrowByTaskId(taskId);
        if (response && response.escrow) {
          setEscrow(response.escrow);
        }
      } catch (error) {
        console.error('Failed to fetch escrow status:', error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if task is completed or in progress
    if (taskStatus === 'completed' || taskStatus === 'in_progress') {
      fetchEscrowStatus();
    } else {
      setLoading(false);
    }
  }, [taskId, taskStatus]);

  if (loading) return null;
  if (!escrow) return null;

  const amount = parseFloat(escrow.amountInRupees || escrow.amount);
  const status = escrow.status;

  return (
    <Card className="border-primary-200 bg-primary-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Wallet className="w-4 h-4 text-primary-600" />
          Payment Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {status === 'held' && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600">Escrow Amount</span>
              <span className="text-sm font-semibold text-gray-900">₹{amount.toFixed(2)}</span>
            </div>
            
            {/* Auto-release UI disabled - payouts/release handled elsewhere */}
            {/* {autoReleaseDate && taskStatus === 'completed' && (
              <div className="flex items-start gap-2 mt-2 p-2 bg-amber-50 border border-amber-100 rounded">
                <Clock className="w-4 h-4 text-amber-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-amber-900">Auto-release in</p>
                  <p className="text-xs text-amber-700">
                    {formatDistanceToNow(autoReleaseDate, { addSuffix: false })}
                  </p>
                </div>
              </div>
            )} */}

            {taskStatus !== 'completed' && (
              <div className="flex items-start gap-2 mt-2 p-2 bg-blue-50 border border-blue-100 rounded">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Payment held securely until task completion
                </p>
              </div>
            )}
          </>
        )}

        {status === 'released' && (
          <div className="flex items-start gap-2 p-2 bg-green-50 border border-green-100 rounded">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs font-medium text-green-900">Payment Released</p>
              <p className="text-xs text-green-700">₹{amount.toFixed(2)} paid to tasker</p>
            </div>
          </div>
        )}

        {status === 'pending' && (
          <Badge variant="secondary" className="text-xs">
            Payment Pending
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
