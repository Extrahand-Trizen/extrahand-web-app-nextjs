"use client";

/**
 * Release Payment Screen
 * Confirmation flow for releasing escrow payment to tasker
 * Dedicated page section (not a modal)
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Escrow } from "@/types/payment";
import { formatCurrency, formatShortDate } from "@/lib/utils/payment";
import {
   CheckCircle,
   ArrowLeft,
   AlertTriangle,
   User,
   Loader2,
   HelpCircle,
   Flag,
} from "lucide-react";

interface ReleasePaymentScreenProps {
   escrow: Escrow;
   taskTitle: string;
   taskerName: string;
   onRelease: () => Promise<void>;
   onBack: () => void;
   onContactSupport?: () => void;
   onReportIssue?: () => void;
   className?: string;
}

export function ReleasePaymentScreen({
   escrow,
   taskTitle,
   taskerName,
   onRelease,
   onBack,
   onContactSupport,
   onReportIssue,
   className,
}: ReleasePaymentScreenProps) {
   const [isReleasing, setIsReleasing] = useState(false);
   const [confirmed, setConfirmed] = useState(false);

   const handleRelease = async () => {
      if (!confirmed) return;
      setIsReleasing(true);
      try {
         await onRelease();
      } finally {
         setIsReleasing(false);
      }
   };

   return (
      <div className={cn("max-w-md mx-auto", className)}>
         {/* Header */}
         <div className="mb-6">
            <button
               onClick={onBack}
               className="flex items-center text-gray-500 hover:text-gray-700 mb-4 text-sm"
               disabled={isReleasing}
            >
               <ArrowLeft className="w-4 h-4 mr-1" />
               Back to task
            </button>
            <h1 className="text-xl font-semibold text-gray-900">
               Release Payment
            </h1>
            <p className="text-sm text-gray-500 mt-1">
               Confirm task completion and release funds
            </p>
         </div>

         {/* Release Details Card */}
         <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
            {/* Task Info */}
            <div className="p-4 border-b border-gray-100">
               <h3 className="text-sm font-medium text-gray-900 mb-2">
                  {taskTitle}
               </h3>
               <div className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm text-gray-600">{taskerName}</span>
               </div>
            </div>

            {/* Amount */}
            <div className="p-4 border-b border-gray-100">
               <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                     Amount to release
                  </span>
                  <span className="text-xl font-semibold text-gray-900">
                     {formatCurrency(escrow.amountInRupees)}
                  </span>
               </div>
               {escrow.heldAt && (
                  <p className="text-xs text-gray-400 mt-1">
                     Held since {formatShortDate(escrow.heldAt)}
                  </p>
               )}
            </div>

            {/* Confirmation Checkbox */}
            <div className="p-4">
               <label className="flex items-start gap-3 cursor-pointer">
                  <input
                     type="checkbox"
                     checked={confirmed}
                     onChange={(e) => setConfirmed(e.target.checked)}
                     className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                     disabled={isReleasing}
                  />
                  <span className="text-sm text-gray-700">
                     I confirm the task has been completed to my satisfaction
                  </span>
               </label>
            </div>
         </div>

         {/* Warning */}
         <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2.5">
               <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
               <div className="space-y-1">
                  <p className="text-sm font-medium text-yellow-800">
                     This action cannot be undone
                  </p>
                  <p className="text-xs text-yellow-700">
                     Once released, the payment will be transferred to the
                     tasker and cannot be reversed.
                  </p>
               </div>
            </div>
         </div>

         {/* Actions */}
         <div className="space-y-3">
            <Button
               onClick={handleRelease}
               disabled={!confirmed || isReleasing}
               className="w-full h-11 text-base font-medium bg-green-600 hover:bg-green-700 disabled:opacity-50"
            >
               {isReleasing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
               ) : (
                  <>
                     <CheckCircle className="w-4 h-4 mr-2" />
                     Release Payment
                  </>
               )}
            </Button>

            {/* Secondary actions */}
            <div className="flex items-center gap-2">
               {onReportIssue && (
                  <Button
                     onClick={onReportIssue}
                     variant="outline"
                     size="sm"
                     className="flex-1 text-gray-600"
                     disabled={isReleasing}
                  >
                     <Flag className="w-3.5 h-3.5 mr-1.5" />
                     Report Issue
                  </Button>
               )}
               {onContactSupport && (
                  <Button
                     onClick={onContactSupport}
                     variant="outline"
                     size="sm"
                     className="flex-1 text-gray-600"
                     disabled={isReleasing}
                  >
                     <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
                     Contact Support
                  </Button>
               )}
            </div>
         </div>
      </div>
   );
}
