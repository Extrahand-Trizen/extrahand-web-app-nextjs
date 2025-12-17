"use client";

/**
 * Payment Error Display
 * Shows payment failures and refund information
 * User-friendly error messages without raw error codes
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PaymentError, PaymentTransaction } from "@/types/payment";
import { formatCurrency, formatShortDate } from "@/lib/utils/payment";
import {
   AlertCircle,
   RefreshCcw,
   Clock,
   HelpCircle,
   CheckCircle,
   ArrowRight,
} from "lucide-react";

interface PaymentFailedProps {
   error: PaymentError;
   amount?: number;
   onRetry?: () => void;
   onContactSupport?: () => void;
   className?: string;
}

export function PaymentFailed({
   error,
   amount,
   onRetry,
   onContactSupport,
   className,
}: PaymentFailedProps) {
   return (
      <div
         className={cn(
            "bg-white border border-gray-200 rounded-lg overflow-hidden",
            className
         )}
      >
         <div className="p-6 text-center">
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
               <AlertCircle className="w-6 h-6 text-red-600" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
               Payment Failed
            </h3>

            {/* Message */}
            <p className="text-sm text-gray-600 mb-6 max-w-xs mx-auto">
               {error.userMessage}
            </p>

            {/* Amount if provided */}
            {amount && (
               <div className="bg-gray-50 rounded-lg p-3 mb-6">
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-lg font-semibold text-gray-900">
                     {formatCurrency(amount)}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                     No amount has been charged
                  </p>
               </div>
            )}

            {/* Actions */}
            <div className="space-y-2">
               {error.retryable && onRetry && (
                  <Button onClick={onRetry} className="w-full">
                     <RefreshCcw className="w-4 h-4 mr-2" />
                     Try Again
                  </Button>
               )}
               {onContactSupport && (
                  <Button
                     onClick={onContactSupport}
                     variant="outline"
                     className="w-full"
                  >
                     <HelpCircle className="w-4 h-4 mr-2" />
                     Contact Support
                  </Button>
               )}
            </div>
         </div>
      </div>
   );
}

interface RefundStatusProps {
   transaction: PaymentTransaction;
   onViewDetails?: () => void;
   className?: string;
}

export function RefundStatus({
   transaction,
   onViewDetails,
   className,
}: RefundStatusProps) {
   const isCompleted = transaction.status === "completed";
   const isFailed = transaction.status === "failed";
   const isPending =
      transaction.status === "pending" || transaction.status === "processing";

   return (
      <div
         className={cn(
            "bg-white border border-gray-200 rounded-lg overflow-hidden",
            className
         )}
      >
         <div className="p-4">
            {/* Status Header */}
            <div className="flex items-center gap-3 mb-4">
               <div
                  className={cn(
                     "w-10 h-10 rounded-full flex items-center justify-center",
                     isCompleted && "bg-green-100",
                     isFailed && "bg-red-100",
                     isPending && "bg-yellow-100"
                  )}
               >
                  {isCompleted && (
                     <CheckCircle className="w-5 h-5 text-green-600" />
                  )}
                  {isFailed && <AlertCircle className="w-5 h-5 text-red-600" />}
                  {isPending && <Clock className="w-5 h-5 text-yellow-600" />}
               </div>
               <div>
                  <h3 className="text-sm font-medium text-gray-900">
                     {isCompleted && "Refund Completed"}
                     {isFailed && "Refund Failed"}
                     {isPending && "Refund Processing"}
                  </h3>
                  <p className="text-xs text-gray-500">
                     {transaction.createdAt &&
                        formatShortDate(transaction.createdAt)}
                  </p>
               </div>
            </div>

            {/* Amount */}
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
               <span className="text-sm text-gray-600">Refund amount</span>
               <span className="text-base font-semibold text-gray-900">
                  {formatCurrency(transaction.amountInRupees)}
               </span>
            </div>

            {/* Status-specific info */}
            {isPending && (
               <div className="bg-yellow-50 rounded-md p-3 mt-3">
                  <p className="text-xs text-yellow-700">
                     Your refund is being processed. This typically takes 5-7
                     business days to reflect in your account.
                  </p>
               </div>
            )}

            {isCompleted && transaction.completedAt && (
               <div className="bg-green-50 rounded-md p-3 mt-3">
                  <p className="text-xs text-green-700">
                     Refund processed on{" "}
                     {formatShortDate(transaction.completedAt)}. Please check
                     your original payment method.
                  </p>
               </div>
            )}

            {isFailed && (
               <div className="bg-red-50 rounded-md p-3 mt-3">
                  <p className="text-xs text-red-700">
                     {transaction.errorMessage ||
                        "We couldn't process your refund. Please contact support for assistance."}
                  </p>
               </div>
            )}

            {/* View Details */}
            {onViewDetails && (
               <Button
                  onClick={onViewDetails}
                  variant="ghost"
                  size="sm"
                  className="w-full mt-3 text-gray-600"
               >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
               </Button>
            )}
         </div>
      </div>
   );
}
