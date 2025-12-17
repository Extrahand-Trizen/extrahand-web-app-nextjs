"use client";

/**
 * Payment Demo Page
 * Demonstrates the complete escrow payment flow
 * This is for development/testing purposes
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
   PaymentInitiation,
   PaymentSuccess,
   ReleasePaymentScreen,
   EscrowStatusBlock,
   TaskerEscrowView,
   PaymentFailed,
   RefundStatus,
} from "@/components/payments";
import {
   PaymentSummary,
   Escrow,
   PaymentTransaction,
   PaymentError,
} from "@/types/payment";
import { useRazorpay } from "@/hooks/useRazorpay";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Mock data for demo
const mockPaymentSummary: PaymentSummary = {
   taskId: "task123",
   taskTitle: "Fix leaking kitchen sink and replace faucet",
   taskerName: "Rajesh Kumar",
   taskerUid: "tasker123",
   taskerId: "tasker123",
   applicationId: "app123",
   amount: 800,
   platformFee: 80,
   totalPayable: 880,
   currency: "INR",
};

const mockEscrowPending: Escrow = {
   _id: "esc123",
   escrowId: "ESC_123456",
   razorpayOrderId: "order_123",
   posterUid: "poster123",
   performerUid: "tasker123",
   taskId: "task123",
   amount: 88000,
   currency: "INR",
   amountInRupees: 880,
   status: "pending",
   autoReleaseEnabled: true,
   autoReleaseAfterDays: 7,
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
};

const mockEscrowHeld: Escrow = {
   ...mockEscrowPending,
   status: "held",
   razorpayPaymentId: "pay_123",
   paymentStatus: "captured",
   heldAt: new Date().toISOString(),
   autoReleaseDate: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
   ).toISOString(),
};

const mockEscrowReleased: Escrow = {
   ...mockEscrowHeld,
   status: "released",
   releasedAt: new Date().toISOString(),
   releaseTransactionId: "txn_release_123",
};

const mockRefundTransaction: PaymentTransaction = {
   _id: "txn_refund_123",
   transactionId: "TXN_REFUND_123",
   razorpayRefundId: "rfnd_123",
   posterUid: "poster123",
   taskId: "task123",
   amount: 88000,
   currency: "INR",
   amountInRupees: 880,
   type: "refund",
   status: "processing",
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),
};

const mockPaymentError: PaymentError = {
   code: "PAYMENT_FAILED",
   message: "Payment was declined",
   userMessage:
      "Your payment could not be processed. Please check your payment details and try again.",
   retryable: true,
};

type DemoScreen =
   | "menu"
   | "initiation"
   | "success"
   | "release"
   | "escrow-poster"
   | "escrow-tasker"
   | "failed"
   | "refund";

export default function PaymentDemoPage() {
   const router = useRouter();
   const [currentScreen, setCurrentScreen] = useState<DemoScreen>("menu");
   const { isLoaded, openCheckout } = useRazorpay();

   const handlePay = async () => {
      // In real implementation, this would:
      // 1. Call API to create escrow
      // 2. Open Razorpay checkout
      // 3. Verify payment on success
      // 4. Show success screen

      // Demo: simulate success after delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setCurrentScreen("success");
   };

   const handleRelease = async () => {
      // In real implementation, this would call the release API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert("Payment released successfully!");
      setCurrentScreen("menu");
   };

   const renderScreen = () => {
      switch (currentScreen) {
         case "initiation":
            return (
               <PaymentInitiation
                  summary={mockPaymentSummary}
                  onPay={handlePay}
                  onBack={() => setCurrentScreen("menu")}
               />
            );

         case "success":
            return (
               <PaymentSuccess
                  escrow={mockEscrowHeld}
                  taskTitle={mockPaymentSummary.taskTitle}
                  taskerName={mockPaymentSummary.taskerName}
                  onViewTask={() => setCurrentScreen("escrow-poster")}
                  onDone={() => setCurrentScreen("menu")}
               />
            );

         case "release":
            return (
               <ReleasePaymentScreen
                  escrow={mockEscrowHeld}
                  taskTitle={mockPaymentSummary.taskTitle}
                  taskerName={mockPaymentSummary.taskerName}
                  onRelease={handleRelease}
                  onBack={() => setCurrentScreen("menu")}
                  onContactSupport={() => alert("Contact support clicked")}
                  onReportIssue={() => alert("Report issue clicked")}
               />
            );

         case "escrow-poster":
            return (
               <div className="max-w-md mx-auto space-y-6">
                  <button
                     onClick={() => setCurrentScreen("menu")}
                     className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                  >
                     <ArrowLeft className="w-4 h-4 mr-1" />
                     Back to menu
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                     Escrow Status (Poster View)
                  </h2>
                  <EscrowStatusBlock
                     escrow={mockEscrowHeld}
                     userRole="poster"
                     onReleasePayment={() => setCurrentScreen("release")}
                     onViewDetails={() => alert("View details clicked")}
                  />
               </div>
            );

         case "escrow-tasker":
            return (
               <div className="max-w-md mx-auto space-y-6">
                  <button
                     onClick={() => setCurrentScreen("menu")}
                     className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                  >
                     <ArrowLeft className="w-4 h-4 mr-1" />
                     Back to menu
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                     Escrow Status (Tasker View)
                  </h2>
                  <TaskerEscrowView
                     escrow={mockEscrowHeld}
                     taskTitle={mockPaymentSummary.taskTitle}
                     posterName="Anita Kapoor"
                  />
               </div>
            );

         case "failed":
            return (
               <div className="max-w-md mx-auto space-y-6">
                  <button
                     onClick={() => setCurrentScreen("menu")}
                     className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                  >
                     <ArrowLeft className="w-4 h-4 mr-1" />
                     Back to menu
                  </button>
                  <PaymentFailed
                     error={mockPaymentError}
                     amount={mockPaymentSummary.totalPayable}
                     onRetry={() => setCurrentScreen("initiation")}
                     onContactSupport={() => alert("Contact support clicked")}
                  />
               </div>
            );

         case "refund":
            return (
               <div className="max-w-md mx-auto space-y-6">
                  <button
                     onClick={() => setCurrentScreen("menu")}
                     className="flex items-center text-gray-500 hover:text-gray-700 text-sm"
                  >
                     <ArrowLeft className="w-4 h-4 mr-1" />
                     Back to menu
                  </button>
                  <h2 className="text-lg font-semibold text-gray-900">
                     Refund Status
                  </h2>
                  <RefundStatus
                     transaction={mockRefundTransaction}
                     onViewDetails={() => alert("View details clicked")}
                  />
               </div>
            );

         default:
            return (
               <div className="max-w-md mx-auto">
                  <h1 className="text-xl font-semibold text-gray-900 mb-2">
                     Payment Flow Demo
                  </h1>
                  <p className="text-sm text-gray-500 mb-8">
                     Click on any screen to see the component in action
                  </p>

                  <div className="space-y-3">
                     <DemoButton
                        title="1. Payment Initiation"
                        description="When poster accepts an offer"
                        onClick={() => setCurrentScreen("initiation")}
                     />
                     <DemoButton
                        title="2. Payment Success"
                        description="After successful payment"
                        onClick={() => setCurrentScreen("success")}
                     />
                     <DemoButton
                        title="3. Escrow Status (Poster)"
                        description="Poster view on task page"
                        onClick={() => setCurrentScreen("escrow-poster")}
                     />
                     <DemoButton
                        title="4. Escrow Status (Tasker)"
                        description="Tasker view on task page"
                        onClick={() => setCurrentScreen("escrow-tasker")}
                     />
                     <DemoButton
                        title="5. Release Payment"
                        description="Confirm task completion"
                        onClick={() => setCurrentScreen("release")}
                     />
                     <DemoButton
                        title="6. Payment Failed"
                        description="Error state"
                        onClick={() => setCurrentScreen("failed")}
                     />
                     <DemoButton
                        title="7. Refund Status"
                        description="After refund is initiated"
                        onClick={() => setCurrentScreen("refund")}
                     />

                     <div className="pt-4 border-t border-gray-200 mt-6">
                        <Button
                           onClick={() => router.push("/profile/payments")}
                           variant="outline"
                           className="w-full"
                        >
                           View Transactions Page
                           <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                     </div>
                  </div>
               </div>
            );
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">{renderScreen()}</div>
   );
}

function DemoButton({
   title,
   description,
   onClick,
}: {
   title: string;
   description: string;
   onClick: () => void;
}) {
   return (
      <button
         onClick={onClick}
         className="w-full p-4 bg-white border border-gray-200 rounded-lg text-left hover:border-gray-300 hover:shadow-sm transition-all"
      >
         <p className="text-sm font-medium text-gray-900">{title}</p>
         <p className="text-xs text-gray-500 mt-0.5">{description}</p>
      </button>
   );
}
