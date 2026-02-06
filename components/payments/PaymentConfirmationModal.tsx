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
import { initiateRazorpayPayment, formatCurrency, formatAmountFromRazorpay } from "@/lib/services/razorpay";
import type { RazorpayPaymentResponse, FeeBreakdown as IFeeBreakdown } from "@/types/payment";
import { Loader2, CreditCard, Shield, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

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
  };
  posterUid: string;
  onSuccess: (escrowId: string, paymentId: string) => void;
  onError?: (error: Error) => void;
}

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

  const amount = application.proposedBudget.amount;

  // Calculate fees when modal opens (category-aware for correct GST/fees)
  useEffect(() => {
    if (open) {
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
        throw new Error(response.error || 'Failed to calculate fees');
      }
    } catch (err: any) {
      console.error('Error calculating fees:', err);
      setError(err.message || 'Failed to calculate fees');
    } finally {
      setIsCalculating(false);
    }
  };

  const handlePayment = async () => {
    try {
      setIsPaymentProcessing(true);
      setError(null);

      if (!posterUid) {
        throw new Error('Please log in to complete payment');
      }
      if (!fees) {
        throw new Error('Fee calculation required before payment');
      }

      // Step 1: Create escrow and get Razorpay order
      console.log('Creating escrow...');
      const escrowResponse = await paymentApi.createEscrow({
        taskId: task.id,
        applicationId: application.id,
        posterUid: posterUid,
        performerUid: application.applicantId,
        amount: fees.totalAmount, // Use total amount including fees, not just task amount
        autoReleaseAfterDays: 5 / (24 * 60), // 5 minutes for testing (convert minutes to fractional days)
        taskCategory: task.category ?? undefined,
      });

      if (!escrowResponse.success || !escrowResponse.order) {
        throw new Error(escrowResponse.error || 'Failed to create payment order');
      }

      const { order, escrow } = escrowResponse;
      setEscrowId(escrow?.escrowId || null);

      // Step 2: Open Razorpay checkout
      console.log('Opening Razorpay checkout...');
      await initiateRazorpayPayment(
        order,
        {
          name: 'ExtraHand',
          description: `Payment for: ${task.title}`,
          notes: {
            taskId: task.id,
            applicationId: application.id,
          },
        },
        {
          onSuccess: async (response: RazorpayPaymentResponse) => {
            try {
              // Step 3: Verify payment
              console.log('Verifying payment...');
              const verifyResponse = await paymentApi.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verifyResponse.success) {
                // Payment successful!
                console.log('✅ Payment verified successfully');
                onSuccess(escrow?.escrowId || '', response.razorpay_payment_id);
                onOpenChange(false);
              } else {
                throw new Error(verifyResponse.error || 'Payment verification failed');
              }
            } catch (verifyError: any) {
              console.error('Payment verification error:', verifyError);
              setError(verifyError.message || 'Payment verification failed');
              onError?.(verifyError);
            } finally {
              setIsPaymentProcessing(false);
            }
          },
          onDismiss: () => {
            console.log('Payment cancelled by user');
            setIsPaymentProcessing(false);
            setError('Payment cancelled');
          },
          onError: (error: Error) => {
            console.error('Payment error:', error);
            setError(error.message);
            setIsPaymentProcessing(false);
            onError?.(error);
          },
        }
      );
    } catch (err: any) {
      console.error('Payment initialization error:', err);
      setError(err.message || 'Failed to initialize payment');
      setIsPaymentProcessing(false);
      onError?.(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" showCloseButton={!isPaymentProcessing}>
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
          {/* Loading State */}
          {isCalculating && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <span className="ml-2 text-sm text-gray-500">Calculating fees...</span>
            </div>
          )}

          {/* Not logged in */}
          {!posterUid && !isCalculating && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please log in to complete payment.</AlertDescription>
            </Alert>
          )}

          {/* Error State */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Payment Summary */}
          {!isCalculating && fees && (
            <>
              <div className="space-y-3">
                {/* Task Info */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">Task</p>
                  <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                </div>

                {/* Fee Breakdown */}
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Task Amount</span>
                    <span className="font-medium">{formatCurrency(amount)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Platform Fee ({((fees.metadata?.platformFeePercentage || 0.1) * 100).toFixed(0)}%)
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
                      +{formatCurrency(fees.platformFeeGst + fees.processingFeeGst)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment Gateway Fee</span>
                    <span className="text-gray-600">
                      +{formatCurrency(fees.processingFeeShare)}
                    </span>
                  </div>

                  <div className="border-t pt-2 mt-2"></div>

                  <div className="flex justify-between text-base font-semibold">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-primary">{formatCurrency(fees.totalAmount)}</span>
                  </div>
                </div>

                {/* Assurances */}
                <div className="space-y-2 bg-green-50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-green-800">
                      Money held securely until task completion
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-green-800">
                      Auto-released after 24-hour grace period
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-green-800">
                      Full refund if task not completed
                    </p>
                  </div>
                </div>
              </div>
            </>
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
      </DialogContent>
    </Dialog>
  );
}
