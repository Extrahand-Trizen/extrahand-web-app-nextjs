"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "lucide-react";

export type PayoutStatus = "processing" | "completed" | "failed" | "reversed";

interface PayoutStatusBadgeProps {
  status: PayoutStatus;
  amount?: number;
  showAmount?: boolean;
  compact?: boolean;
  withTooltip?: boolean;
}

export function PayoutStatusBadge({
  status,
  amount,
  showAmount = false,
  compact = false,
  withTooltip = true,
}: PayoutStatusBadgeProps) {
  const getStatusColor = (): {
    bg: string;
    text: string;
    border: string;
  } => {
    switch (status) {
      case "processing":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
        };
      case "completed":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
        };
      case "failed":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
        };
      case "reversed":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
        };
    }
  };

  const getIcon = (): JSX.Element => {
    const iconProps = { className: `w-3 h-3 ${compact ? "" : "mr-1"}` };
    switch (status) {
      case "processing":
        return <Clock {...iconProps} />;
      case "completed":
        return <CheckCircle {...iconProps} />;
      case "failed":
        return <AlertCircle {...iconProps} />;
      case "reversed":
        return <RefreshCw {...iconProps} />;
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case "processing":
        return "Processing";
      case "completed":
        return "Credited";
      case "failed":
        return "Failed";
      case "reversed":
        return "Reversed";
    }
  };

  const getTooltipText = (): string => {
    switch (status) {
      case "processing":
        return "Payout is being processed. Will reach your account within 1-2 business days";
      case "completed":
        return "Amount successfully credited to your bank account";
      case "failed":
        return "Payout failed. Please check your bank account details";
      case "reversed":
        return "Payout was reversed by the bank. Please contact support";
    }
  };

  const colors = getStatusColor();
  const badge = (
    <Badge
      variant="outline"
      className={`
        ${colors.bg} ${colors.text} ${colors.border}
        ${compact ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1"}
        flex items-center gap-1
      `}
    >
      {getIcon()}
      <span className={compact ? "hidden sm:inline" : ""}>
        {getStatusText()}
      </span>
      {showAmount && amount !== undefined && (
        <span className="ml-1 font-semibold">₹{amount.toLocaleString()}</span>
      )}
    </Badge>
  );

  if (withTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>{badge}</TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{getTooltipText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}
