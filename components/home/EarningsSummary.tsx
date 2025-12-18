"use client";

/**
 * Earnings Summary Component
 * Minimal, neutral display of earnings information
 * Only shown for users with earnings history
 */

import React from "react";
import { useRouter } from "next/navigation";
import { CreditCard, ArrowRight } from "lucide-react";

interface EarningsSummaryProps {
   availableBalance?: number;
   pendingPayments?: number;
   thisMonthEarnings?: number;
   totalEarnings?: number;
}

export function EarningsSummary({
   availableBalance,
   pendingPayments,
   thisMonthEarnings,
   totalEarnings,
}: EarningsSummaryProps) {
   const router = useRouter();

   // Only show if there's any earnings data
   if (
      !availableBalance &&
      !pendingPayments &&
      !thisMonthEarnings &&
      !totalEarnings
   ) {
      return null;
   }

   const hasAnyValue =
      (availableBalance && availableBalance > 0) ||
      (pendingPayments && pendingPayments > 0) ||
      (thisMonthEarnings && thisMonthEarnings > 0) ||
      (totalEarnings && totalEarnings > 0);

   if (!hasAnyValue) {
      return null;
   }

   return (
      <button
         onClick={() => router.push("/payments")}
         className="w-full bg-white rounded-lg border border-secondary-200 p-3 hover:border-secondary-300 transition-colors group"
      >
         <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
               <CreditCard className="w-4 h-4 text-secondary-500 shrink-0" />
               <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-secondary-700 mb-0.5">
                     Earnings
                  </div>
                  <div className="flex items-center gap-3 text-xs text-secondary-600">
                     {availableBalance !== undefined &&
                        availableBalance > 0 && (
                           <span>
                              Available:{" "}
                              <span className="font-semibold text-secondary-900">
                                 ₹{availableBalance.toLocaleString("en-IN")}
                              </span>
                           </span>
                        )}
                     {pendingPayments !== undefined && pendingPayments > 0 && (
                        <span>
                           Pending:{" "}
                           <span className="font-semibold text-secondary-900">
                              ₹{pendingPayments.toLocaleString("en-IN")}
                           </span>
                        </span>
                     )}
                     {thisMonthEarnings !== undefined &&
                        thisMonthEarnings > 0 && (
                           <span>
                              This month:{" "}
                              <span className="font-semibold text-secondary-900">
                                 ₹{thisMonthEarnings.toLocaleString("en-IN")}
                              </span>
                           </span>
                        )}
                  </div>
               </div>
            </div>
            <ArrowRight className="w-4 h-4 text-secondary-400 group-hover:text-secondary-600 transition-colors shrink-0" />
         </div>
      </button>
   );
}
