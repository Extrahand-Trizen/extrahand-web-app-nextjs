"use client";

/**
 * Payment Initiation Screen
 * Full-page or section for initiating payment
 * Shows payment summary and checkout button
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PaymentSummary } from "@/types/payment";
import { PaymentSummaryCard } from "./PaymentSummaryCard";
import { formatCurrency } from "@/lib/utils/payment";
import {
   Shield,
   Lock,
   CreditCard,
   Smartphone,
   Building2,
   CheckCircle,
   ArrowLeft,
   Loader2,
} from "lucide-react";

interface PaymentInitiationProps {
   summary: PaymentSummary;
   onPay: () => Promise<void>;
   onBack?: () => void;
   isLoading?: boolean;
   className?: string;
}

export function PaymentInitiation({
   summary,
   onPay,
   onBack,
   isLoading = false,
   className,
}: PaymentInitiationProps) {
   const [isPaying, setIsPaying] = useState(false);

   const handlePay = async () => {
      setIsPaying(true);
      try {
         await onPay();
      } finally {
         setIsPaying(false);
      }
   };

   const loading = isLoading || isPaying;

   return (
      <div className={cn("max-w-4xl mx-auto", className)}>
         {/* Header */}
         <div className="mb-6">
            {onBack && (
               <button
                  onClick={onBack}
                  className="flex items-center text-gray-500 hover:text-gray-700 mb-4 text-sm"
                  disabled={loading}
               >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
               </button>
            )}
            <h1 className="text-xl font-semibold text-gray-900">
               Complete Payment
            </h1>
            <p className="text-sm text-gray-500 mt-1">
               Secure payment via Razorpay
            </p>
         </div>

         {/* Payment Summary */}
         <PaymentSummaryCard summary={summary} className="mb-6" />

         {/* Payment Methods Info */}
         <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3">
               Accepted payment methods
            </h3>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <CreditCard className="w-4 h-4" />
                  <span>Cards</span>
               </div>
               <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Smartphone className="w-4 h-4" />
                  <span>UPI</span>
               </div>
               <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  <Building2 className="w-4 h-4" />
                  <span>Net Banking</span>
               </div>
            </div>
         </div>

         {/* Security Assurances */}
         <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2.5">
               <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
               <p className="text-xs text-gray-600">
                  Secure payment via Razorpay with 256-bit encryption
               </p>
            </div>
            <div className="flex items-start gap-2.5">
               <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
               <p className="text-xs text-gray-600">
                  Payment released to tasker after completion
               </p>
            </div>
            <div className="flex items-start gap-2.5">
               <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
               <p className="text-xs text-gray-600">
                  Full refund if task is not completed
               </p>
            </div>
         </div>

         {/* Pay Button */}
         <Button
            onClick={handlePay}
            disabled={loading}
            className="w-full h-12 text-base font-medium bg-primary-600 hover:bg-primary-700"
         >
            {loading ? (
               <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
               <>
                  <Lock className="w-4 h-4 mr-2" />
                  Pay Securely
               </>
            )}
         </Button>

         {/* Footer note */}
         <p className="text-center text-xs text-gray-400 mt-4">
            By paying, you agree to our payment terms
         </p>
      </div>
   );
}
