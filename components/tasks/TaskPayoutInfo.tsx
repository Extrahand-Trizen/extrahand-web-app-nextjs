"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PayoutStatusBadge } from "./PayoutStatusBadge";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";

interface TaskPayoutInfoProps {
  taskId: string;
  taskTitle: string;
  amount: number;
  payoutStatus?: "processing" | "completed" | "failed" | "reversed";
  payoutAmount?: number;
  netAmount?: number;
  fees?: number;
  compact?: boolean;
}

/**
 * Compact payout info card to embed in task cards/details
 * Shows task amount and current payout status
 *
 * Usage:
 * <TaskPayoutInfo
 *   taskId="task_123"
 *   taskTitle="Fix leak"
 *   amount={500}
 *   payoutStatus="processing"
 *   netAmount={450}
 *   fees={50}
 * />
 */
export function TaskPayoutInfo({
  taskId,
  taskTitle,
  amount,
  payoutStatus,
  payoutAmount,
  netAmount,
  fees,
  compact = false,
}: TaskPayoutInfoProps) {
  const displayAmount = netAmount || amount;
  const displayFees = fees ?? (amount - (netAmount || amount));

  return (
    <div className={`space-y-2 ${compact ? "text-xs" : "text-sm"}`}>
      {/* Task Amount */}
      <div className="flex items-center justify-between">
        <span className="text-gray-600">Task Amount:</span>
        <span className="font-semibold text-gray-900">
          ₹{amount.toLocaleString()}
        </span>
      </div>

      {/* Payout Status */}
      {payoutStatus && (
        <>
          <div className="border-t pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600">Payout Status:</span>
              <PayoutStatusBadge
                status={payoutStatus}
                compact={true}
                withTooltip={true}
              />
            </div>

            {/* Fee Breakdown */}
            {displayFees > 0 && (
              <div className="bg-gray-50 rounded p-2 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">You receive:</span>
                  <span className="font-semibold text-green-700">
                    ₹{displayAmount.toLocaleString()}
                  </span>
                </div>
                {fees !== undefined && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Processing fee:</span>
                    <span>-₹{displayFees.toLocaleString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

interface TaskPayoutCardProps {
  taskId: string;
  taskTitle: string;
  amount: number;
  payoutStatus?: "processing" | "completed" | "failed" | "reversed";
  netAmount?: number;
  completedAt?: string;
}

/**
 * Standalone card for task payout info
 * Can be embedded in task detail or completion confirmation page
 */
export function TaskPayoutCard({
  taskId,
  taskTitle,
  amount,
  payoutStatus,
  netAmount,
  completedAt,
}: TaskPayoutCardProps) {
  const fees = amount - (netAmount || amount);

  const getStatusMessage = (): string => {
    switch (payoutStatus) {
      case "processing":
        return "Your payout is being processed. You'll receive the amount within 1-2 business days.";
      case "completed":
        return "Payment has been successfully transferred to your bank account.";
      case "failed":
        return "The payout failed. Please contact support for assistance.";
      case "reversed":
        return "The payout was reversed. Please check your bank account details.";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    switch (payoutStatus) {
      case "processing":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-600" />;
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1">{taskTitle}</h3>
          <p className="text-xs text-gray-500">Payout Details</p>
        </div>

        {/* Status with Icon */}
        {payoutStatus && (
          <div className="flex items-start gap-3">
            <div className="mt-0.5">{getStatusIcon()}</div>
            <div className="flex-1">
              <div className="mb-1">
                <PayoutStatusBadge
                  status={payoutStatus}
                  withTooltip={true}
                />
              </div>
              <p className="text-xs text-gray-600">
                {getStatusMessage()}
              </p>
              {completedAt && (
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(completedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Amount Breakdown */}
        <div className="bg-gray-50 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm">Task Amount</span>
            <span className="font-bold text-gray-900">
              ₹{amount.toLocaleString()}
            </span>
          </div>
          {fees > 0 && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Processing Fee</span>
              <span>-₹{fees.toLocaleString()}</span>
            </div>
          )}
          <div className="border-t pt-2 flex items-center justify-between">
            <span className="text-gray-900 font-semibold">You Receive</span>
            <span className="text-lg font-bold text-green-600">
              ₹{(netAmount || amount).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
