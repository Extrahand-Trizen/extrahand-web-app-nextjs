"use client";

/**
 * Escrow Status Badge
 * Displays the current status of an escrow with appropriate styling
 */

import React from "react";
import { cn } from "@/lib/utils";
import { EscrowStatus } from "@/types/payment";
import { getEscrowStatusInfo } from "@/lib/utils/payment";
import { Clock, Lock, CheckCircle, RefreshCcw, XCircle } from "lucide-react";

interface EscrowStatusBadgeProps {
   status: EscrowStatus;
   size?: "sm" | "md" | "lg";
   showIcon?: boolean;
   className?: string;
}

const iconMap = {
   clock: Clock,
   lock: Lock,
   check: CheckCircle,
   refund: RefreshCcw,
   x: XCircle,
};

const colorClasses = {
   gray: "bg-gray-100 text-gray-700 border-gray-200",
   blue: "bg-blue-50 text-blue-700 border-blue-200",
   green: "bg-green-50 text-green-700 border-green-200",
   red: "bg-red-50 text-red-700 border-red-200",
   yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
};

const sizeClasses = {
   sm: "text-xs px-2 py-0.5",
   md: "text-sm px-2.5 py-1",
   lg: "text-sm px-3 py-1.5",
};

const iconSizeClasses = {
   sm: "w-3 h-3",
   md: "w-3.5 h-3.5",
   lg: "w-4 h-4",
};

export function EscrowStatusBadge({
   status,
   size = "md",
   showIcon = true,
   className,
}: EscrowStatusBadgeProps) {
   const statusInfo = getEscrowStatusInfo(status);
   const Icon = iconMap[statusInfo.icon];

   return (
      <span
         className={cn(
            "inline-flex items-center gap-1.5 rounded-full border font-medium",
            colorClasses[statusInfo.color],
            sizeClasses[size],
            className
         )}
      >
         {showIcon && <Icon className={iconSizeClasses[size]} />}
         {statusInfo.label}
      </span>
   );
}
