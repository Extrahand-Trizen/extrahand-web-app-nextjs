/**
 * Payment Utilities
 * Helper functions for payment-related operations
 */

import {
   EscrowStatus,
   PaymentStatus,
   TransactionType,
   EscrowStatusInfo,
   PaymentError,
} from "@/types/payment";

/**
 * Format currency amount in INR
 */
export function formatCurrency(
   amount: number,
   currency: string = "INR"
): string {
   return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
   }).format(amount);
}

/**
 * Format amount from paise to rupees
 */
export function paiseToRupees(paise: number): number {
   return paise / 100;
}

/**
 * Format amount from rupees to paise
 */
export function rupeesToPaise(rupees: number): number {
   return Math.round(rupees * 100);
}

/**
 * Get escrow status display information
 */
export function getEscrowStatusInfo(status: EscrowStatus): EscrowStatusInfo {
   const statusMap: Record<EscrowStatus, EscrowStatusInfo> = {
      pending: {
         status: "pending",
         label: "Pending Payment",
         description: "Awaiting payment to hold funds in escrow",
         color: "yellow",
         icon: "clock",
      },
      held: {
         status: "held",
         label: "Funds Held",
         description: "Payment secured in escrow",
         color: "blue",
         icon: "lock",
      },
      released: {
         status: "released",
         label: "Released",
         description: "Funds released to tasker",
         color: "green",
         icon: "check",
      },
      refunded: {
         status: "refunded",
         label: "Refunded",
         description: "Funds returned to poster",
         color: "gray",
         icon: "refund",
      },
      cancelled: {
         status: "cancelled",
         label: "Cancelled",
         description: "Escrow cancelled",
         color: "red",
         icon: "x",
      },
   };

   return statusMap[status];
}

/**
 * Get payment status label
 */
export function getPaymentStatusLabel(status: PaymentStatus): string {
   const labels: Record<PaymentStatus, string> = {
      pending: "Pending",
      processing: "Processing",
      completed: "Completed",
      failed: "Failed",
      cancelled: "Cancelled",
   };
   return labels[status];
}

/**
 * Get transaction type label
 */
export function getTransactionTypeLabel(type: TransactionType): string {
   const labels: Record<TransactionType, string> = {
      escrow: "Escrow Payment",
      release: "Payment Released",
      refund: "Refund",
      payout: "Payout",
      direct_payment: "Direct Payment",
   };
   return labels[type];
}

/**
 * Format date for display
 */
export function formatPaymentDate(dateString: string): string {
   const date = new Date(dateString);
   return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
   });
}

/**
 * Format date for short display
 */
export function formatShortDate(dateString: string): string {
   const date = new Date(dateString);
   return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
   });
}

/**
 * Calculate days until auto-release
 */
export function getDaysUntilAutoRelease(autoReleaseDate: string): number {
   const releaseDate = new Date(autoReleaseDate);
   const now = new Date();
   const diffTime = releaseDate.getTime() - now.getTime();
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   return Math.max(0, diffDays);
}

/**
 * Parse Razorpay error to user-friendly message
 */
export function parsePaymentError(error: unknown): PaymentError {
   // Default error
   const defaultError: PaymentError = {
      code: "UNKNOWN_ERROR",
      message: "An unexpected error occurred",
      userMessage:
         "Something went wrong with your payment. Please try again or contact support.",
      retryable: true,
   };

   if (!error) return defaultError;

   // Handle Razorpay specific errors
   if (typeof error === "object" && error !== null) {
      const err = error as Record<string, unknown>;
      const errError = err.error as Record<string, unknown> | undefined;

      const code =
         (err.code as string) || (errError?.code as string) || "UNKNOWN_ERROR";
      const message =
         (err.message as string) ||
         (errError?.description as string) ||
         defaultError.message;

      const errorMap: Record<
         string,
         { userMessage: string; retryable: boolean }
      > = {
         BAD_REQUEST_ERROR: {
            userMessage:
               "There was an issue with the payment request. Please try again.",
            retryable: true,
         },
         GATEWAY_ERROR: {
            userMessage:
               "Payment gateway is temporarily unavailable. Please try again in a few minutes.",
            retryable: true,
         },
         SERVER_ERROR: {
            userMessage: "Our servers encountered an issue. Please try again.",
            retryable: true,
         },
         PAYMENT_FAILED: {
            userMessage:
               "Your payment could not be processed. Please check your payment details and try again.",
            retryable: true,
         },
         PAYMENT_CANCELLED: {
            userMessage: "Payment was cancelled. No amount has been charged.",
            retryable: true,
         },
         INSUFFICIENT_FUNDS: {
            userMessage:
               "Insufficient funds in your account. Please use a different payment method.",
            retryable: true,
         },
         CARD_DECLINED: {
            userMessage:
               "Your card was declined. Please try a different card or payment method.",
            retryable: true,
         },
      };

      const errorInfo = errorMap[code] || {
         userMessage: defaultError.userMessage,
         retryable: true,
      };

      return {
         code,
         message,
         ...errorInfo,
      };
   }

   return defaultError;
}

/**
 * Generate a transaction reference ID for display
 */
export function formatTransactionId(transactionId: string): string {
   if (!transactionId) return "-";
   // Show first 4 and last 4 characters
   if (transactionId.length <= 12) return transactionId;
   return `${transactionId.slice(0, 4)}...${transactionId.slice(-4)}`;
}

/**
 * Calculate platform fee (example: 10%)
 */
export function calculatePlatformFee(
   amount: number,
   feePercentage: number = 10
): number {
   return Math.round((amount * feePercentage) / 100);
}

/**
 * Check if escrow can be released
 */
export function canReleaseEscrow(status: EscrowStatus): boolean {
   return status === "held";
}

/**
 * Check if escrow can be refunded
 */
export function canRefundEscrow(status: EscrowStatus): boolean {
   return status === "held";
}
