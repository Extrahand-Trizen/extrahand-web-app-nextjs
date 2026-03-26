"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  Wallet,
  ArrowRight,
  IndianRupee,
} from "lucide-react";

interface PayoutStatus {
  status: "processing" | "completed" | "failed" | "reversed";
  amount: number;
  netAmount: number;
  taskTitle?: string;
  completedAt?: string;
  payoutId?: string;
}

interface PayoutStatusCardProps {
  payout: PayoutStatus;
  onViewPayments?: () => void;
}

export function PayoutStatusCard({ payout, onViewPayments }: PayoutStatusCardProps) {
  const statusConfig = {
    processing: {
      icon: Clock,
      label: "Processing",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-700",
      badgeVariant: "secondary" as const,
    },
    completed: {
      icon: CheckCircle2,
      label: "Credited",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-700",
      badgeVariant: "default" as const,
    },
    failed: {
      icon: AlertCircle,
      label: "Failed",
      color: "bg-red-50 border-red-200",
      textColor: "text-red-700",
      badgeVariant: "destructive" as const,
    },
    reversed: {
      icon: AlertCircle,
      label: "Reversed",
      color: "bg-yellow-50 border-yellow-200",
      textColor: "text-yellow-700",
      badgeVariant: "destructive" as const,
    },
  };

  const config = statusConfig[payout.status];
  const StatusIcon = config.icon;

  return (
    <Card className={`border ${config.color}`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <StatusIcon className={`w-5 h-5 mt-1 ${config.textColor}`} />
            <div>
              <p className="text-sm text-gray-600 mb-1">Payout {config.label}</p>
              {payout.taskTitle && (
                <p className="text-sm font-medium text-gray-900">{payout.taskTitle}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-lg font-bold">
                  <IndianRupee className="w-4 h-4" />
                  {payout.netAmount.toFixed(2)}
                </div>
                <span className="text-xs text-gray-500">
                  (after fees: Rs {(payout.amount - payout.netAmount).toFixed(2)})
                </span>
              </div>
            </div>
          </div>
          <Badge variant={config.badgeVariant}>{config.label}</Badge>
        </div>

        {payout.status === "completed" && (
          <div className="mt-4 pt-4 border-t">
            <Button
              onClick={onViewPayments}
              variant="secondary"
              size="sm"
              className="w-full"
            >
              View Payments
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {payout.completedAt && (
          <p className="text-xs text-gray-500 mt-3">
            {new Date(payout.completedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
