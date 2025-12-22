 /**
 * Payments Demo Page
 * Showcase payment flow screens - Initiation, Success, Failed, Refund Status
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
   ArrowLeft,
   CreditCard,
   CheckCircle,
   XCircle,
   RefreshCcw,
   Receipt,
   Wallet,
} from "lucide-react";
import {
   PaymentSummaryCard,
   PaymentInitiation,
   PaymentSuccess,
   PaymentFailed,
   RefundStatus,
} from "@/components/payments";
import {
   mockPaymentError,
   mockPaymentSummary,
   mockPendingRefund,
   mockRefundTransaction,
} from "@/lib/data/payments";

type DemoScreen =
   | "select"
   | "summary"
   | "initiation"
   | "success"
   | "failed"
   | "refund";

export default function PaymentsDemoPage() {
   const router = useRouter();
   const [currentScreen, setCurrentScreen] = useState<DemoScreen>("select");
   const [isLoading, setIsLoading] = useState(false);

   const simulatePayment = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      setIsLoading(false);
      setCurrentScreen("success");
   };

   const simulateFailedPayment = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 2000));
      setIsLoading(false);
      setCurrentScreen("failed");
   };

   const renderScreenSelector = () => (
      <div className="space-y-6">
         <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
               Payment Flow Demo
            </h1>
            <p className="text-gray-500">
               Preview different screens in the payment checkout process
            </p>
         </div>

         <div className="grid gap-4">
            {/* Payment Summary Card */}
            <button
               onClick={() => setCurrentScreen("summary")}
               className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-primary-300 hover:shadow-md transition-all group"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                     <Receipt className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-semibold text-gray-900">
                        Payment Summary
                     </h3>
                     <p className="text-sm text-gray-500">
                        View task amount breakdown with fees
                     </p>
                  </div>
               </div>
            </button>

            {/* Payment Initiation */}
            <button
               onClick={() => setCurrentScreen("initiation")}
               className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-primary-300 hover:shadow-md transition-all group"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                     <CreditCard className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-semibold text-gray-900">
                        Payment Initiation
                     </h3>
                     <p className="text-sm text-gray-500">
                        Complete checkout screen with payment details
                     </p>
                  </div>
               </div>
            </button>

            {/* Payment Success */}
            <button
               onClick={() => setCurrentScreen("success")}
               className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-green-300 hover:shadow-md transition-all group"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                     <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-semibold text-gray-900">
                        Payment Success
                     </h3>
                     <p className="text-sm text-gray-500">
                        Confirmation after successful payment
                     </p>
                  </div>
               </div>
            </button>

            {/* Payment Failed */}
            <button
               onClick={() => setCurrentScreen("failed")}
               className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-red-300 hover:shadow-md transition-all group"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                     <XCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-semibold text-gray-900">
                        Payment Failed
                     </h3>
                     <p className="text-sm text-gray-500">
                        Error screen with retry option
                     </p>
                  </div>
               </div>
            </button>

            {/* Refund Status */}
            <button
               onClick={() => setCurrentScreen("refund")}
               className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-yellow-300 hover:shadow-md transition-all group"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 transition-colors">
                     <RefreshCcw className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                     <h3 className="font-semibold text-gray-900">
                        Refund Status
                     </h3>
                     <p className="text-sm text-gray-500">
                        Track refund processing status
                     </p>
                  </div>
               </div>
            </button>
         </div>

         {/* Interactive Demo */}
         <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">
               🎮 Interactive Payment Flow
            </h3>
            <p className="text-sm text-gray-600 mb-4">
               Simulate a complete payment flow from checkout to result
            </p>
            <div className="flex flex-wrap gap-3">
               <Button
                  onClick={() => setCurrentScreen("initiation")}
                  className="bg-green-600 hover:bg-green-700"
               >
                  <Wallet className="w-4 h-4 mr-2" />
                  Start Payment Flow
               </Button>
            </div>
         </div>
      </div>
   );

   const renderSummaryScreen = () => (
      <div className="space-y-6">
         <div className="flex items-center gap-3 mb-6">
            <button
               onClick={() => setCurrentScreen("select")}
               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
               <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
               Payment Summary
            </h2>
         </div>

         <PaymentSummaryCard summary={mockPaymentSummary} />

         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
               <strong>Component:</strong> PaymentSummaryCard
            </p>
            <p className="text-xs text-blue-600 mt-1">
               Displays task amount, service fees, platform fees, and total with
               clear breakdown.
            </p>
         </div>

         <Button
            onClick={() => setCurrentScreen("select")}
            variant="outline"
            className="w-full"
         >
            Back to Demo Selection
         </Button>
      </div>
   );

   const renderInitiationScreen = () => (
      <div className="space-y-6">
         <PaymentInitiation
            summary={mockPaymentSummary}
            onPay={simulatePayment}
            onBack={() => setCurrentScreen("select")}
            isLoading={isLoading}
         />

         {!isLoading && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
               <p className="text-sm text-purple-800">
                  <strong>Component:</strong> PaymentInitiation
               </p>
               <p className="text-xs text-purple-600 mt-1">
                  Full checkout screen with payment summary, accepted methods,
                  and security assurances.
               </p>
               <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                     size="sm"
                     onClick={simulatePayment}
                     className="bg-green-600 hover:bg-green-700 text-xs"
                     disabled={isLoading}
                  >
                     <CheckCircle className="w-3 h-3 mr-1" />
                     Simulate Success
                  </Button>
                  <Button
                     size="sm"
                     variant="outline"
                     onClick={simulateFailedPayment}
                     className="text-xs border-red-200 text-red-600 hover:bg-red-50"
                     disabled={isLoading}
                  >
                     <XCircle className="w-3 h-3 mr-1" />
                     Simulate Failure
                  </Button>
               </div>
            </div>
         )}
      </div>
   );

   const renderSuccessScreen = () => (
      <div className="space-y-6">
         <PaymentSuccess
            amount={mockPaymentSummary.totalAmount}
            taskTitle={mockPaymentSummary.taskTitle}
            taskerName="Rajesh Kumar"
            transactionId="TXN123456789"
            onViewTask={() => alert("Navigate to task details")}
            onDone={() => setCurrentScreen("select")}
         />

         <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
               <strong>Component:</strong> PaymentSuccess
            </p>
            <p className="text-xs text-green-600 mt-1">
               Confirmation screen showing payment details, what happens next,
               and navigation options.
            </p>
         </div>

         <Button
            variant="outline"
            onClick={() => setCurrentScreen("select")}
            className="w-full"
         >
            Back to Demo Selection
         </Button>
      </div>
   );

   const renderFailedScreen = () => (
      <div className="space-y-6">
         <PaymentFailed
            error={mockPaymentError}
            amount={mockPaymentSummary.totalAmount}
            onRetry={() => setCurrentScreen("initiation")}
            onContactSupport={() => alert("Opening support chat...")}
         />

         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
               <strong>Component:</strong> PaymentFailed
            </p>
            <p className="text-xs text-red-600 mt-1">
               User-friendly error display with retry option and support
               contact.
            </p>
         </div>

         <Button
            variant="outline"
            onClick={() => setCurrentScreen("select")}
            className="w-full"
         >
            Back to Demo Selection
         </Button>
      </div>
   );

   const renderRefundScreen = () => (
      <div className="space-y-6">
         <div className="flex items-center gap-3 mb-6">
            <button
               onClick={() => setCurrentScreen("select")}
               className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
               <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
               Refund Status
            </h2>
         </div>

         <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">
               ✅ Completed Refund
            </h3>
            <RefundStatus
               transaction={mockRefundTransaction}
               onViewDetails={() => alert("View refund details")}
            />
         </div>

         <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">
               ⏳ Processing Refund
            </h3>
            <RefundStatus
               transaction={mockPendingRefund}
               onViewDetails={() => alert("View refund details")}
            />
         </div>

         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
               <strong>Component:</strong> RefundStatus
            </p>
            <p className="text-xs text-yellow-600 mt-1">
               Shows refund status (completed, processing, failed) with amount
               and timeline.
            </p>
         </div>

         <Button
            variant="outline"
            onClick={() => setCurrentScreen("select")}
            className="w-full"
         >
            Back to Demo Selection
         </Button>
      </div>
   );

   return (
      <div className="min-h-screen bg-gray-50">
         {/* Header */}
         <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
            <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
               <button
                  onClick={() => router.back()}
                  className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
               >
                  <ArrowLeft className="w-5 h-5" />
               </button>
               <h1 className="text-base font-semibold text-gray-900">
                  Payment Flow Demo
               </h1>
            </div>
         </div>

         {/* Content */}
         <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
               <p className="text-sm text-amber-800">
                  <strong>🔒 Demo Mode:</strong> These are preview screens for
                  the payment checkout flow. No actual payments will be
                  processed.
               </p>
            </div>

            {currentScreen === "select" && renderScreenSelector()}
            {currentScreen === "summary" && renderSummaryScreen()}
            {currentScreen === "initiation" && renderInitiationScreen()}
            {currentScreen === "success" && renderSuccessScreen()}
            {currentScreen === "failed" && renderFailedScreen()}
            {currentScreen === "refund" && renderRefundScreen()}
         </div>
      </div>
   );
}
