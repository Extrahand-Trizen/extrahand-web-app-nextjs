"use client";

/**
 * Payment Success Screen
 * Shows confirmation after successful payment
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatShortDate } from "@/lib/utils/payment";
import { CheckCircle, ArrowRight, Shield, Calendar } from "lucide-react";

interface PaymentSuccessProps {
   amount: number;
   taskTitle: string;
   taskerName: string;
   transactionId?: string;
   paidAt?: Date;
   onViewTask: () => void;
   onDone?: () => void;
   className?: string;
}

export function PaymentSuccess({
   amount,
   taskTitle,
   taskerName,
   transactionId,
   paidAt = new Date(),
   onViewTask,
   onDone,
   className,
}: PaymentSuccessProps) {
   return (
      <div className={cn("max-w-4xl mx-auto text-center", className)}>
         {/* Success Icon */}
         <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
         </div>

         {/* Title */}
         <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Payment Successful
         </h1>
         <p className="text-sm text-gray-500 mb-8">
            Your payment has been processed successfully
         </p>

         {/* Details Card */}
         <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6 text-left">
            <div className="p-4 border-b border-gray-100">
               <h3 className="text-sm font-medium text-gray-900 mb-1">
                  {taskTitle}
               </h3>
               <p className="text-xs text-gray-500">Tasker: {taskerName}</p>
            </div>

            <div className="p-4 space-y-3">
               <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount paid</span>
                  <span className="text-base font-semibold text-gray-900">
                     {formatCurrency(amount)}
                  </span>
               </div>

               <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-1.5">
                     <Calendar className="w-3.5 h-3.5" />
                     Paid on
                  </span>
                  <span className="text-gray-700">
                     {formatShortDate(paidAt)}
                  </span>
               </div>

               {transactionId && (
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-gray-500">Transaction ID</span>
                     <span className="text-gray-700 font-mono text-xs">
                        {transactionId}
                     </span>
                  </div>
               )}
            </div>
         </div>

         {/* Info Box */}
         <div className="bg-primary-50 border border-primary-100 rounded-lg p-4 mb-6 text-left">
            <div className="flex items-start gap-2.5">
               <Shield className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
               <div className="space-y-1">
                  <p className="text-sm font-medium text-primary-900">
                     What happens next?
                  </p>
                  <ul className="text-xs text-primary-700 space-y-1.5 list-disc list-inside">
                     <li>The tasker has been notified and can start work</li>
                     <li>You can track the task progress in real-time</li>
                     <li>A receipt has been sent to your email</li>
                  </ul>
               </div>
            </div>
         </div>

         {/* Actions */}
         <div className="space-y-2">
            <Button
               onClick={onViewTask}
               className="w-full bg-primary-600 hover:bg-primary-700 text-white"
            >
               View Task
               <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {onDone && (
               <Button
                  onClick={onDone}
                  variant="ghost"
                  className="w-full text-gray-600"
               >
                  Done
               </Button>
            )}
         </div>
      </div>
   );
}
