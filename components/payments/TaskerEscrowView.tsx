"use client";

/**
 * Tasker Escrow View
 * Read-only escrow status display for taskers/performers
 * Shows held amount and expected release conditions
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Escrow } from "@/types/payment";
import { EscrowStatusBadge } from "./EscrowStatusBadge";
import {
   formatCurrency,
   formatShortDate,
   getDaysUntilAutoRelease,
} from "@/lib/utils/payment";
import {
   Lock,
   Clock,
   CheckCircle,
   Calendar,
   Shield,
   Wallet,
   Info,
} from "lucide-react";

interface TaskerEscrowViewProps {
   escrow: Escrow;
   taskTitle: string;
   posterName: string;
   className?: string;
}

export function TaskerEscrowView({
   escrow,
   taskTitle,
   posterName,
   className,
}: TaskerEscrowViewProps) {
   const daysUntilAutoRelease = escrow.autoReleaseDate
      ? getDaysUntilAutoRelease(escrow.autoReleaseDate)
      : null;

   return (
      <div
         className={cn(
            "bg-white border border-gray-200 rounded-lg overflow-hidden",
            className
         )}
      >
         {/* Header */}
         <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">
                     Your Earnings
                  </span>
               </div>
               <EscrowStatusBadge status={escrow.status} size="sm" />
            </div>
         </div>

         {/* Content */}
         <div className="p-4 space-y-4">
            {/* Amount */}
            <div className="text-center py-2">
               <p className="text-xs text-gray-500 mb-1">
                  {escrow.status === "held"
                     ? "Amount held for you"
                     : escrow.status === "released"
                     ? "Amount received"
                     : "Pending amount"}
               </p>
               <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(escrow.amountInRupees)}
               </p>
            </div>

            {/* Status-specific content */}
            {escrow.status === "held" && (
               <>
                  {/* Release conditions */}
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
                     <div className="flex items-start gap-2.5">
                        <Shield className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                           <p className="text-sm font-medium text-blue-900">
                              Secured in Escrow
                           </p>
                           <p className="text-xs text-blue-700 leading-relaxed">
                              This payment is being held securely. You'll
                              receive it once{" "}
                              <span className="font-medium">{posterName}</span>{" "}
                              confirms the task is completed.
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Auto-release info */}
                  {escrow.autoReleaseEnabled &&
                     daysUntilAutoRelease !== null && (
                        <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                           <span className="text-gray-600 flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-gray-400" />
                              Auto-release
                           </span>
                           <span className="text-gray-900 font-medium">
                              in {daysUntilAutoRelease} day
                              {daysUntilAutoRelease !== 1 ? "s" : ""}
                           </span>
                        </div>
                     )}

                  {/* Held since */}
                  {escrow.heldAt && (
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                           <Calendar className="w-4 h-4" />
                           Held since
                        </span>
                        <span className="text-gray-700">
                           {formatShortDate(escrow.heldAt)}
                        </span>
                     </div>
                  )}
               </>
            )}

            {escrow.status === "released" && (
               <>
                  <div className="bg-green-50 border border-green-100 rounded-lg p-3">
                     <div className="flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <div className="space-y-1">
                           <p className="text-sm font-medium text-green-900">
                              Payment Released
                           </p>
                           <p className="text-xs text-green-700 leading-relaxed">
                              The payment has been released to your account. It
                              will be available for payout within 1-2 business
                              days.
                           </p>
                        </div>
                     </div>
                  </div>

                  {escrow.releasedAt && (
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Released on</span>
                        <span className="text-gray-700">
                           {formatShortDate(escrow.releasedAt)}
                        </span>
                     </div>
                  )}
               </>
            )}

            {escrow.status === "refunded" && (
               <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <div className="flex items-start gap-2.5">
                     <Info className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                     <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                           Payment Refunded
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">
                           This payment was refunded to the poster.
                           {escrow.refundReason && (
                              <span className="block mt-1">
                                 Reason: {escrow.refundReason}
                              </span>
                           )}
                        </p>
                     </div>
                  </div>
               </div>
            )}

            {escrow.status === "pending" && (
               <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3">
                  <div className="flex items-start gap-2.5">
                     <Clock className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
                     <p className="text-xs text-yellow-700 leading-relaxed">
                        The poster hasn't completed the payment yet. You'll be
                        notified once the funds are secured in escrow.
                     </p>
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}
