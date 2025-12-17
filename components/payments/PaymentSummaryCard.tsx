"use client";

/**
 * Payment Summary Card
 * Shows payment breakdown before checkout
 * Used when poster accepts an offer
 */

import React from "react";
import { cn } from "@/lib/utils";
import { PaymentSummary } from "@/types/payment";
import { formatCurrency } from "@/lib/utils/payment";
import { User, FileText, Shield, Info } from "lucide-react";

interface PaymentSummaryCardProps {
   summary: PaymentSummary;
   className?: string;
}

export function PaymentSummaryCard({
   summary,
   className,
}: PaymentSummaryCardProps) {
   return (
      <div
         className={cn(
            "bg-white border border-gray-200 rounded-lg overflow-hidden",
            className
         )}
      >
         {/* Task Info */}
         <div className="p-4 border-b border-gray-100">
            <div className="flex items-start gap-3">
               <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-gray-500" />
               </div>
               <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                     {summary.taskTitle}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                     <User className="w-3.5 h-3.5 text-gray-400" />
                     <span className="text-sm text-gray-500">
                        {summary.taskerName}
                     </span>
                  </div>
               </div>
            </div>
         </div>

         {/* Payment Breakdown */}
         <div className="p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
               <span className="text-gray-600">Task amount</span>
               <span className="text-gray-900 font-medium">
                  {formatCurrency(summary.totalAmount)}
               </span>
            </div>

            {summary.platformFee > 0 && (
               <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                     Platform fee
                     <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600"
                        title="A small fee to support platform operations"
                     >
                        <Info className="w-3.5 h-3.5" />
                     </button>
                  </span>
                  <span className="text-gray-900 font-medium">
                     {formatCurrency(summary.platformFee)}
                  </span>
               </div>
            )}
         </div>

         {/* Secure Payment Note */}
         <div className="px-4 pb-4">
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-3">
               <div className="flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-primary-700 leading-relaxed">
                     Secure payment via Razorpay. Payment released to tasker
                     after task completion.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
