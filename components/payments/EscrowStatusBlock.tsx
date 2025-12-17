"use client";

/**
 * Escrow Status Block
 * Displays escrow status and details within task pages
 * Shows relevant information and actions based on user role
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Escrow, PaymentUserRole } from "@/types/payment";
import { EscrowStatusBadge } from "./EscrowStatusBadge";
import {
   formatCurrency,
   formatShortDate,
   getDaysUntilAutoRelease,
   canReleaseEscrow,
} from "@/lib/utils/payment";
import {
   Lock,
   Calendar,
   Clock,
   ArrowRight,
   Info,
   CheckCircle,
   Shield,
} from "lucide-react";

interface EscrowStatusBlockProps {
   escrow: Escrow;
   userRole: PaymentUserRole;
   onReleasePayment?: () => void;
   onViewDetails?: () => void;
   className?: string;
}

export function EscrowStatusBlock({
   escrow,
   userRole,
   onReleasePayment,
   onViewDetails,
   className,
}: EscrowStatusBlockProps) {
   const isPoster = userRole === "poster";
   const isPerformer = userRole === "performer";
   const showReleaseAction = isPoster && canReleaseEscrow(escrow.status);
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
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-900">
                     Payment Escrow
                  </span>
               </div>
               <EscrowStatusBadge status={escrow.status} size="sm" />
            </div>
         </div>

         {/* Content */}
         <div className="p-4 space-y-4">
            {/* Amount */}
            <div className="flex items-baseline justify-between">
               <span className="text-sm text-gray-500">
                  {escrow.status === "held" ? "Amount held" : "Amount"}
               </span>
               <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(escrow.amountInRupees)}
               </span>
            </div>

            {/* Status-specific content */}
            {escrow.status === "held" && (
               <>
                  {/* Held date */}
                  {escrow.heldAt && (
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                           <Lock className="w-3.5 h-3.5" />
                           Secured on
                        </span>
                        <span className="text-gray-700">
                           {formatShortDate(escrow.heldAt)}
                        </span>
                     </div>
                  )}

                  {/* Auto-release info */}
                  {escrow.autoReleaseEnabled &&
                     daysUntilAutoRelease !== null && (
                        <div className="flex items-center justify-between text-sm">
                           <span className="text-gray-500 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              Auto-release in
                           </span>
                           <span className="text-gray-700">
                              {daysUntilAutoRelease} day
                              {daysUntilAutoRelease !== 1 ? "s" : ""}
                           </span>
                        </div>
                     )}

                  {/* Info text based on role */}
                  <div className="bg-gray-50 rounded-md p-3">
                     <p className="text-xs text-gray-600 leading-relaxed">
                        {isPoster ? (
                           <>
                              Your payment is securely held. Release it when the
                              task is completed to your satisfaction.
                           </>
                        ) : (
                           <>
                              {formatCurrency(escrow.amountInRupees)} is held in
                              escrow. You'll receive this amount once the poster
                              confirms task completion.
                           </>
                        )}
                     </p>
                  </div>
               </>
            )}

            {escrow.status === "released" && (
               <>
                  {escrow.releasedAt && (
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center gap-1.5">
                           <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                           Released on
                        </span>
                        <span className="text-gray-700">
                           {formatShortDate(escrow.releasedAt)}
                        </span>
                     </div>
                  )}
                  <div className="bg-green-50 rounded-md p-3">
                     <p className="text-xs text-green-700 leading-relaxed">
                        {isPoster
                           ? "Payment has been released to the tasker."
                           : "Payment has been released to your account."}
                     </p>
                  </div>
               </>
            )}

            {escrow.status === "refunded" && (
               <>
                  {escrow.refundedAt && (
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Refunded on</span>
                        <span className="text-gray-700">
                           {formatShortDate(escrow.refundedAt)}
                        </span>
                     </div>
                  )}
                  {escrow.refundReason && (
                     <div className="bg-gray-50 rounded-md p-3">
                        <p className="text-xs text-gray-600 leading-relaxed">
                           Reason: {escrow.refundReason}
                        </p>
                     </div>
                  )}
               </>
            )}

            {escrow.status === "pending" && isPoster && (
               <div className="bg-yellow-50 rounded-md p-3">
                  <p className="text-xs text-yellow-700 leading-relaxed">
                     Complete payment to secure funds in escrow.
                  </p>
               </div>
            )}
         </div>

         {/* Actions */}
         {(showReleaseAction || onViewDetails) && (
            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/30 flex items-center gap-2">
               {showReleaseAction && onReleasePayment && (
                  <Button
                     onClick={onReleasePayment}
                     size="sm"
                     className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                     <CheckCircle className="w-4 h-4 mr-1.5" />
                     Release Payment
                  </Button>
               )}
               {onViewDetails && (
                  <Button
                     onClick={onViewDetails}
                     variant="outline"
                     size="sm"
                     className={cn(!showReleaseAction && "flex-1")}
                  >
                     View Details
                     <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
               )}
            </div>
         )}
      </div>
   );
}
