"use client";

/**
 * Payment Confirmation Modal
 * Modal that handles offer acceptance payment flow
 * Integrates with Razorpay for payment processing
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { paymentApi } from "@/lib/api/endpoints/payment";
import { initiateRazorpayPayment, formatCurrency } from "@/lib/services/razorpay";
import type { RazorpayPaymentResponse, FeeBreakdown as IFeeBreakdown } from "@/types/payment";
import {
  Loader2,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  ArrowLeft,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface PaymentConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: {
    id: string;
    title: string;
    category?: string;
  };
  application: {
    id: string;
    applicantId: string;
    proposedBudget: {
      amount: number;
    };
    selectedDates?: Array<Date | string>;
  };
  posterUid: string;
  onSuccess: (escrowId: string, paymentId: string) => void;
  onError?: (error: Error) => void;
}

// ─── Cancellation Policy View (rendered inside the same Dialog) ───────────────
function CancellationPolicyView({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Back header */}
      <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <h2 className="text-base font-bold text-gray-900 ml-1">
          Cancellation Policy
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pt-4">
        {/* Column headers */}
        <div className="flex justify-between text-xs font-semibold text-gray-400 uppercase tracking-wider px-1">
          <span>Time before task</span>
          <span>Cancellation fee</span>
        </div>

        {/* Table */}
        <div className="divide-y divide-gray-100 rounded-xl border border-gray-100 overflow-hidden">
          {/* Row 0 — Grace period */}
          <div className="flex justify-between items-center px-4 py-3 bg-green-50">
            <div>
              <p className="text-sm font-medium text-gray-800">Within 15 mins of booking</p>
              <p className="text-xs text-gray-400 mt-0.5">grace period — any task start time</p>
            </div>
            <span className="text-sm font-bold text-green-600">Free</span>
          </div>

          {/* Row 1 */}
          <div className="flex justify-between items-center px-4 py-3 bg-white">
            <div>
              <p className="text-sm font-medium text-gray-800">More than 24 hrs</p>
              <p className="text-xs text-gray-400 mt-0.5">before task start</p>
            </div>
            <span className="text-sm font-bold text-green-600">Free</span>
          </div>

          {/* Row 2 */}
          <div className="flex justify-between items-center px-4 py-3 bg-white">
            <div>
              <p className="text-sm font-medium text-gray-800">Within 24 hrs</p>
              <p className="text-xs text-gray-400 mt-0.5">of task start</p>
            </div>
            <span className="text-sm font-bold text-orange-500">10% of task amount</span>
          </div>

          {/* Row 3 */}
          <div className="flex justify-between items-center px-4 py-3 bg-white">
            <div>
              <p className="text-sm font-medium text-gray-800">Within 1 hr</p>
              <p className="text-xs text-gray-400 mt-0.5">of task start</p>
            </div>
            <span className="text-sm font-bold text-red-500">20% of task amount</span>
          </div>
        </div>

        {/* Note */}
        <div className="flex items-start gap-2 px-1">
          <AlertCircle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700 leading-relaxed">
            Platform fee and GST are non‑refundable in all cases, regardless of
            when cancellation occurs.
          </p>
        </div>

        {/* Fee goes to tasker */}
        <div className="rounded-xl bg-orange-50 border border-orange-100 p-4 flex items-start gap-3">
          <Banknote className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-orange-800">
              This fee goes to the Tasker
            </p>
            <p className="text-xs text-orange-700 mt-1 leading-relaxed">
              Their time is reserved for your task &amp; they may have turned
              down other opportunities for the booked slot.
            </p>
          </div>
        </div>
      </div>

      {/* Okay button */}
      <div className="pt-4 border-t border-gray-100 mt-4">
        <Button className="w-full" onClick={onBack}>
          Okay, I understand
        </Button>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function PaymentConfirmationModal({
  open,
  onOpenChange,
  task,
  application,
  posterUid,
  onSuccess,
  onError,
}: PaymentConfirmationModalProps) {
  const [isCalculating, setIsCalculating] = useState(true);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [fees, setFees] = useState<IFeeBreakdown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [escrowId, setEscrowId] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  // Controls which "view" is shown inside the single dialog
  const [showPolicy, setShowPolicy] = useState(false);

  const selectedDatesCount = application.selectedDates?.length ?? 0;
  const baseAmount = application.proposedBudget.amount;
  const amount = baseAmount * (selectedDatesCount || 1);

  // Reset state when modal reopens
  useEffect(() => {
    if (open) {
      setAgreedToTerms(false);
      setShowPolicy(false);
      calculateFees();
    }
  }, [open, amount, task.category]);

  const calculateFees = async () => {
    try {
      setIsCalculating(true);
      setError(null);

      const response = await paymentApi.calculateFees(amount, task.category);

      if (response.success && response.fees) {
        setFees(response.fees);
      } else {
        throw new Error(response.error || "Failed to calculate fees");
      }
    } catch (err: any) {
      console.error("Error calculating fees:", err);
      setError(err.message || "Failed to calculate fees");
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePayment = async () => {
    // Guard: must agree to terms first
    if (!agreedToTerms) {
      toast.error("Please agree to the terms & conditions", {
        description:
          "Tick the checkbox to confirm you understand the cancellation policy before proceeding.",
        duration: 4000,
      });
      return;
    }

    try {
      setIsPaymentProcessing(true);
      setError(null);

      if (!posterUid) {
        throw new Error("Please log in to complete payment");
      }
      if (!fees) {
        throw new Error("Fee calculation required before payment");
      }

      // Step 1: Create escrow and get Razorpay order
      console.log("Creating escrow...");
      const escrowResponse = await paymentApi.createEscrow({
        taskId: task.id,
        applicationId: application.id,
        posterUid: posterUid,
        performerUid: application.applicantId,
        amount: fees.totalAmount,
        autoReleaseAfterDays: 5 / (24 * 60), // 5 minutes for testing
        taskCategory: task.category ?? undefined,
      });

      if (!escrowResponse.success || !escrowResponse.order) {
        throw new Error(escrowResponse.error || "Failed to create payment order");
      }

      const { order, escrow } = escrowResponse;
      setEscrowId(escrow?.escrowId || null);

      // Step 2: Open Razorpay checkout
      console.log("Opening Razorpay checkout...");
      await initiateRazorpayPayment(
        order,
        {
          name: "ExtraHand",
          description: `Payment for: ${task.title}`,
          notes: {
            taskId: task.id,
            applicationId: application.id,
          },
        },
        {
          onSuccess: async (response: RazorpayPaymentResponse) => {
            try {
              console.log("Verifying payment...");
              const verifyResponse = await paymentApi.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyResponse.success) {
                console.log("✅ Payment verified successfully");
                onSuccess(escrow?.escrowId || "", response.razorpay_payment_id);
                onOpenChange(false);
              } else {
                throw new Error(verifyResponse.error || "Payment verification failed");
              }
            } catch (verifyError: any) {
              console.error("Payment verification error:", verifyError);
              setError(verifyError.message || "Payment verification failed");
              onError?.(verifyError);
            } finally {
              setIsPaymentProcessing(false);
            }
          },
          onDismiss: () => {
            console.log("Payment cancelled by user");
            setIsPaymentProcessing(false);
            setError("Payment cancelled");
          },
          onError: (error: Error) => {
            console.error("Payment error:", error);
            setError(error.message);
            setIsPaymentProcessing(false);
            onError?.(error);
          },
        }
      );
    } catch (err: any) {
      console.error("Payment initialization error:", err);
      setError(err.message || "Failed to initialize payment");
      setIsPaymentProcessing(false);
      onError?.(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
      <DialogContent
        className="sm:max-w-[500px]"
        showCloseButton={!isPaymentProcessing}
      >
        {/* ── POLICY VIEW ─────────────────────────────────────── */}
        {showPolicy ? (
          <CancellationPolicyView onBack={() => setShowPolicy(false)} />
        ) : (
          /* ── PAYMENT VIEW ───────────────────────────────────── */
          <>
            <DialogHeader>
              <DialogTitle>Complete Payment</DialogTitle>
              <DialogDescription>
                Secure payment via Razorpay •{" "}
                <span className="inline-flex items-center gap-1">
                  <Shield className="w-3 h-3" />
                  256-bit encryption
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Loading */}
              {isCalculating && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                  <span className="ml-2 text-sm text-gray-500">
                    Calculating fees...
                  </span>
                </div>
              )}

              {/* Not logged in */}
              {!posterUid && !isCalculating && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Please log in to complete payment.
                  </AlertDescription>
                </Alert>
              )}

              {/* Error */}
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Payment Summary */}
              {!isCalculating && fees && (
                <div className="space-y-3">
                  {/* Task Info */}
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Task</p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </p>
                  </div>

                  {/* Fee Breakdown */}
                  <div className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {selectedDatesCount > 1
                          ? `Task Amount (${formatCurrency(baseAmount)} × ${selectedDatesCount} days)`
                          : "Task Amount"}
                      </span>
                      <span className="font-medium">{formatCurrency(amount)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Platform Fee (
                        {((fees.metadata?.platformFeePercentage || 0.05) * 100).toFixed(0)}%)
                      </span>
                      <span className="text-gray-600">
                        +{formatCurrency(fees.platformFee)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        GST ({((fees.metadata?.gstPercentage || 0.18) * 100).toFixed(0)}%)
                      </span>
                      <span className="text-gray-600">
                        +{formatCurrency(fees.platformFeeGst)}
                      </span>
                    </div>

                    <div className="border-t border-gray-100 pt-2 flex justify-between text-base font-semibold">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="text-primary">
                        {formatCurrency(fees.totalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Assurances */}
                  <div className="space-y-2 bg-green-50 rounded-lg p-3">
                    {[
                      "Money held securely until task completion",
                      "Auto-released after 24-hour grace period",
                      "Refund and cancellation policy applies",
                    ].map((text) => (
                      <div key={text} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                        <p className="text-xs text-green-800">{text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Cancellation Policy Row */}
                  <div className="border border-gray-200 rounded-lg px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          Cancellation Policy
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Free cancellation more than 24 hrs before task start.
                          A fee applies otherwise.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPolicy(true)}
                        className="ml-3 flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0"
                      >
                        Read full policy
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Terms Checkbox */}
                  <label
                    htmlFor="agree-terms"
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors select-none",
                      agreedToTerms
                        ? "border-primary/40 bg-primary/5"
                        : "border-gray-200 bg-gray-50 hover:border-gray-300"
                    )}
                  >
                    <div className="mt-0.5 shrink-0">
                      <input
                        id="agree-terms"
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                        className="w-4 h-4 accent-primary cursor-pointer rounded"
                      />
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      I have read and agree to the{" "}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowPolicy(true);
                        }}
                        className="text-primary font-semibold hover:underline"
                      >
                        cancellation policy
                      </button>
                      ,{" "}
                      <a
                        href="/refund-policy"
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-semibold hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        refund policy
                      </a>
                      , and{" "}
                      <a
                        href="/terms-and-conditions"
                        target="_blank"
                        rel="noreferrer"
                        className="text-primary font-semibold hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        terms &amp; conditions
                      </a>
                      .
                    </p>
                  </label>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPaymentProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={handlePayment}
                disabled={!posterUid || isCalculating || isPaymentProcessing || !!error}
                className="min-w-[120px]"
              >
                {isPaymentProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay {fees && formatCurrency(fees.totalAmount)}
                  </>
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
