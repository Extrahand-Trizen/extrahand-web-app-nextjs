"use client";

import React, { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Link as LinkIcon,
  X,
} from "lucide-react";

export interface PayoutNotification {
  id: string;
  type: "processing" | "completed" | "failed";
  amount: number;
  netAmount: number;
  taskTitle: string;
  taskId: string;
  payoutId: string;
  message: string;
  createdAt: string;
}

interface PayoutNotificationBannerProps {
  notification: PayoutNotification;
  onDismiss?: () => void;
  onNavigateToPayments?: () => void;
  autoDismissAfter?: number; // milliseconds, 0 = never
}

export function PayoutNotificationBanner({
  notification,
  onDismiss,
  onNavigateToPayments,
  autoDismissAfter = 0,
}: PayoutNotificationBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoDismissAfter > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, autoDismissAfter);
      return () => clearTimeout(timer);
    }
  }, [autoDismissAfter, onDismiss]);

  if (!isVisible) return null;

  const isProcessing = notification.type === "processing";
  const isCompleted = notification.type === "completed";
  const isFailed = notification.type === "failed";

  const getIcon = () => {
    if (isProcessing) return <Clock className="h-5 w-5 text-blue-600" />;
    if (isCompleted) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (isFailed) return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  const getBgColor = () => {
    if (isProcessing) return "bg-blue-50 border-blue-200";
    if (isCompleted) return "bg-green-50 border-green-200";
    if (isFailed) return "bg-red-50 border-red-200";
  };

  const getTextColor = () => {
    if (isProcessing) return "text-blue-900";
    if (isCompleted) return "text-green-900";
    if (isFailed) return "text-red-900";
  };

  const getStatusBadgeColor = () => {
    if (isProcessing) return "bg-blue-100 text-blue-800";
    if (isCompleted) return "bg-green-100 text-green-800";
    if (isFailed) return "bg-red-100 text-red-800";
  };

  const getStatusText = () => {
    if (isProcessing) return "Processing";
    if (isCompleted) return "Completed";
    if (isFailed) return "Failed";
  };

  return (
    <Alert className={`${getBgColor()} border`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-sm ${getTextColor()}`}>
              Payout {getStatusText()}
            </h3>
            <Badge className={getStatusBadgeColor()} variant="secondary">
              {getStatusText()}
            </Badge>
          </div>
          <p className={`text-xs ${getTextColor()} opacity-90 mb-2`}>
            {notification.message}
          </p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-sm font-bold text-gray-900">
              ₹{notification.netAmount.toLocaleString()}
            </div>
            {isProcessing && (
              <p className="text-xs text-gray-600">
                Will be transferred to your bank account within 1-2 business
                days
              </p>
            )}
            {isCompleted && (
              <p className="text-xs text-green-700 font-medium">
                Successfully transferred to your bank account
              </p>
            )}
          </div>
          {onNavigateToPayments && isCompleted && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onNavigateToPayments}
              className="mt-3 h-7 px-2 text-xs -ml-2"
            >
              <LinkIcon className="w-3 h-3 mr-1" />
              View in Payments
            </Button>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={() => {
              setIsVisible(false);
              onDismiss();
            }}
            className={`shrink-0 p-1 rounded hover:bg-black/10 transition-colors`}
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        )}
      </div>
    </Alert>
  );
}
