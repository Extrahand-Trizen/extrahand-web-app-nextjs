"use client";

/**
 * Transaction Row
 * Individual transaction item for the transactions list
 * Expandable to show more details
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   TransactionWithDetails,
   TransactionType,
   PaymentStatus,
} from "@/types/payment";
import {
   formatCurrency,
   formatPaymentDate,
   formatTransactionId,
   getTransactionTypeLabel,
   getPaymentStatusLabel,
} from "@/lib/utils/payment";
import {
   ChevronDown,
   ChevronUp,
   ArrowUpRight,
   ArrowDownLeft,
   RefreshCcw,
   CreditCard,
   Smartphone,
   Building2,
   Wallet,
   ExternalLink,
} from "lucide-react";

interface TransactionRowProps {
   transaction: TransactionWithDetails;
   currentUserUid: string;
   onViewTask?: (taskId: string) => void;
   className?: string;
}

const typeIcons: Record<
   TransactionType,
   React.ComponentType<{ className?: string }>
> = {
   escrow: ArrowUpRight,
   release: ArrowDownLeft,
   refund: RefreshCcw,
   payout: ArrowDownLeft,
   direct_payment: ArrowUpRight,
};

const statusColors: Record<PaymentStatus, string> = {
   pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
   processing: "bg-blue-100 text-blue-700 border-blue-200",
   completed: "bg-green-100 text-green-700 border-green-200",
   failed: "bg-red-100 text-red-700 border-red-200",
   cancelled: "bg-gray-100 text-gray-700 border-gray-200",
};

const paymentMethodIcons = {
   card: CreditCard,
   upi: Smartphone,
   netbanking: Building2,
   wallet: Wallet,
   other: CreditCard,
};

export function TransactionRow({
   transaction,
   currentUserUid,
   onViewTask,
   className,
}: TransactionRowProps) {
   const [isExpanded, setIsExpanded] = useState(false);

   const TypeIcon = typeIcons[transaction.type];
   const isOutgoing =
      transaction.posterUid === currentUserUid &&
      (transaction.type === "escrow" || transaction.type === "direct_payment");
   const isIncoming =
      transaction.performerUid === currentUserUid &&
      (transaction.type === "release" || transaction.type === "payout");
   const isRefund =
      transaction.type === "refund" && transaction.posterUid === currentUserUid;

   const PaymentMethodIcon = transaction.paymentMethod
      ? paymentMethodIcons[transaction.paymentMethod]
      : CreditCard;

   return (
      <div
         className={cn("border-b border-gray-100 last:border-b-0", className)}
      >
         {/* Main Row */}
         <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
         >
            <div className="flex items-center gap-3 flex-1 min-w-0">
               {/* Type Icon */}
               <div
                  className={cn(
                     "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
                     isOutgoing && "bg-red-50",
                     isIncoming && "bg-green-50",
                     isRefund && "bg-gray-100",
                     !isOutgoing && !isIncoming && !isRefund && "bg-gray-100"
                  )}
               >
                  <TypeIcon
                     className={cn(
                        "w-4 h-4",
                        isOutgoing && "text-red-600",
                        isIncoming && "text-green-600",
                        isRefund && "text-gray-600",
                        !isOutgoing &&
                           !isIncoming &&
                           !isRefund &&
                           "text-gray-600"
                     )}
                  />
               </div>

               {/* Transaction Info */}
               <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                     {getTransactionTypeLabel(transaction.type)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                     {transaction.taskTitle ||
                        `Task #${transaction.taskId.slice(-6)}`}
                  </p>
               </div>
            </div>

            {/* Amount & Status */}
            <div className="flex items-center gap-3 shrink-0">
               <div className="text-right">
                  <p
                     className={cn(
                        "text-sm font-semibold",
                        isOutgoing && "text-red-600",
                        isIncoming && "text-green-600",
                        isRefund && "text-gray-900",
                        !isOutgoing &&
                           !isIncoming &&
                           !isRefund &&
                           "text-gray-900"
                     )}
                  >
                     {isOutgoing ? "-" : isIncoming || isRefund ? "+" : ""}
                     {formatCurrency(transaction.amountInRupees)}
                  </p>
                  <p className="text-xs text-gray-400">
                     {formatPaymentDate(transaction.createdAt).split(",")[0]}
                  </p>
               </div>
               <ChevronDown
                  className={cn(
                     "w-4 h-4 text-gray-400 transition-transform",
                     isExpanded && "rotate-180"
                  )}
               />
            </div>
         </button>

         {/* Expanded Details */}
         {isExpanded && (
            <div className="px-4 pb-4 pt-1 bg-gray-50/50">
               <div className="space-y-3">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-500">Status</span>
                     <span
                        className={cn(
                           "text-xs px-2 py-0.5 rounded-full border",
                           statusColors[transaction.status]
                        )}
                     >
                        {getPaymentStatusLabel(transaction.status)}
                     </span>
                  </div>

                  {/* Transaction ID */}
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-500">
                        Transaction ID
                     </span>
                     <span className="text-xs text-gray-700 font-mono">
                        {formatTransactionId(transaction.transactionId)}
                     </span>
                  </div>

                  {/* Payment Method */}
                  {transaction.paymentMethod && (
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                           Payment Method
                        </span>
                        <span className="text-xs text-gray-700 flex items-center gap-1">
                           <PaymentMethodIcon className="w-3.5 h-3.5" />
                           {transaction.paymentMethod.charAt(0).toUpperCase() +
                              transaction.paymentMethod.slice(1)}
                        </span>
                     </div>
                  )}

                  {/* Date */}
                  <div className="flex items-center justify-between">
                     <span className="text-xs text-gray-500">Date</span>
                     <span className="text-xs text-gray-700">
                        {formatPaymentDate(transaction.createdAt)}
                     </span>
                  </div>

                  {/* Completed Date */}
                  {transaction.completedAt && (
                     <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Completed</span>
                        <span className="text-xs text-gray-700">
                           {formatPaymentDate(transaction.completedAt)}
                        </span>
                     </div>
                  )}

                  {/* View Task Link */}
                  {onViewTask && (
                     <Button
                        onClick={() => onViewTask(transaction.taskId)}
                        variant="ghost"
                        size="sm"
                        className="w-full mt-2 text-xs text-gray-600 hover:text-gray-900"
                     >
                        View Task
                        <ExternalLink className="w-3 h-3 ml-1" />
                     </Button>
                  )}
               </div>
            </div>
         )}
      </div>
   );
}
