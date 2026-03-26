"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EarningsStat {
  pending: number;
  completed: number;
  failed: number;
  total: number;
}

interface EarningsSummaryWidgetProps {
  stats?: EarningsStat;
  loading?: boolean;
  onViewMore?: () => void;
}

export function EarningsSummaryWidget({
  stats = { pending: 0, completed: 0, failed: 0, total: 0 },
  loading = false,
  onViewMore,
}: EarningsSummaryWidgetProps) {
  const [displayStats, setDisplayStats] = useState(stats);

  useEffect(() => {
    setDisplayStats(stats);
  }, [stats]);

  if (loading) {
    return (
      <Card className="p-4 sm:p-6">
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
            <Skeleton className="h-16" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-primary-700" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Earnings Overview</h3>
              <p className="text-xs text-gray-600">
                Track your payout status
              </p>
            </div>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white rounded-lg p-3 border border-primary-100">
          <div className="text-xs text-gray-600 mb-1">Total Earnings</div>
          <div className="text-2xl sm:text-3xl font-bold text-primary-700">
            ₹{displayStats.total.toLocaleString()}
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-3 gap-2">
          {/* Pending */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-900">
                Processing
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-blue-700">
              ₹{displayStats.pending.toLocaleString()}
            </div>
            <p className="text-[10px] text-blue-600 mt-1">
              1-2 business days
            </p>
          </div>

          {/* Completed */}
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-xs font-medium text-green-900">
                Credited
              </span>
            </div>
            <div className="text-lg sm:text-xl font-bold text-green-700">
              ₹{displayStats.completed.toLocaleString()}
            </div>
            <p className="text-[10px] text-green-600 mt-1">In your account</p>
          </div>

          {/* Failed */}
          {displayStats.failed > 0 && (
            <div className="bg-red-50 rounded-lg p-3 border border-red-200">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-medium text-red-900">Failed</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-red-700">
                ₹{displayStats.failed.toLocaleString()}
              </div>
              <p className="text-[10px] text-red-600 mt-1">Action needed</p>
            </div>
          )}
        </div>

        {/* CTA Button */}
        <Button
          onClick={onViewMore}
          asChild
          variant="default"
          className="w-full bg-primary-600 hover:bg-primary-700"
        >
          <Link href="/profile?tab=payments">
            View Full Earnings
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>

        {/* Info */}
        <p className="text-[10px] text-gray-600 text-center">
          Payouts are transferred via RazorpayX to your registered bank account
        </p>
      </div>
    </Card>
  );
}
