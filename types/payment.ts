/**
 * Payment & Escrow Types
 * Types for payment processing, escrow management, and transactions
 */

// Escrow status types
export type EscrowStatus =
   | "pending"
   | "held"
   | "released"
   | "refunded"
   | "cancelled";

// Payment status types
export type PaymentStatus =
   | "pending"
   | "processing"
   | "completed"
   | "failed"
   | "cancelled";

// Transaction types
export type TransactionType =
   | "escrow"
   | "release"
   | "refund"
   | "payout"
   | "direct_payment";

// Payment method types
export type PaymentMethodType =
   | "card"
   | "upi"
   | "netbanking"
   | "wallet"
   | "other";

// Escrow interface (maps to IEscrow from backend)
export interface Escrow {
   _id: string;
   escrowId: string;
   razorpayOrderId: string;
   posterUid: string;
   performerUid: string;
   taskId: string;
   applicationId?: string;
   amount: number; // Amount in paise
   currency: string;
   amountInRupees: number;
   status: EscrowStatus;
   razorpayPaymentId?: string;
   paymentStatus?: "pending" | "authorized" | "captured" | "failed";
   releasedAt?: string;
   releaseTransactionId?: string;
   refundedAt?: string;
   refundTransactionId?: string;
   refundReason?: string;
   autoReleaseEnabled: boolean;
   autoReleaseAfterDays?: number;
   autoReleaseDate?: string;
   heldAt?: string;
   expiresAt?: string;
   errorMessage?: string;
   errorCode?: string;
   createdAt: string;
   updatedAt: string;
}

// Payment transaction interface (maps to IPaymentTransaction from backend)
export interface PaymentTransaction {
   _id: string;
   transactionId: string;
   razorpayOrderId?: string;
   razorpayPaymentId?: string;
   razorpayRefundId?: string;
   posterUid: string;
   performerUid?: string;
   taskId: string;
   applicationId?: string;
   amount: number; // Amount in paise
   currency: string;
   amountInRupees: number;
   type: TransactionType;
   status: PaymentStatus;
   escrowId?: string;
   paymentMethod?: PaymentMethodType;
   razorpayData?: {
      order?: Record<string, unknown>;
      payment?: Record<string, unknown>;
      refund?: Record<string, unknown>;
   };
   metadata?: Record<string, unknown>;
   completedAt?: string;
   failedAt?: string;
   errorMessage?: string;
   errorCode?: string;
   createdAt: string;
   updatedAt: string;
}

// Payment summary for initiating payment
export interface PaymentSummary {
   taskId: string;
   taskTitle: string;
   taskerName: string;
   taskerUid: string;
   taskerId: string;
   applicationId: string;
   amount: number; // Base amount in rupees
   platformFee: number; // Platform fee in rupees
   totalPayable: number; // Total in rupees
   currency: string;
}

// Razorpay checkout options
export interface RazorpayCheckoutOptions {
   key: string;
   amount: number; // Amount in paise
   currency: string;
   name: string;
   description: string;
   order_id: string;
   prefill?: {
      name?: string;
      email?: string;
      contact?: string;
   };
   notes?: Record<string, string>;
   theme?: {
      color?: string;
   };
   handler: (response: RazorpayPaymentResponse) => void;
   modal?: {
      ondismiss?: () => void;
      escape?: boolean;
      animation?: boolean;
   };
}

// Razorpay payment response
export interface RazorpayPaymentResponse {
   razorpay_payment_id: string;
   razorpay_order_id: string;
   razorpay_signature: string;
}

// Create escrow request
export interface CreateEscrowRequest {
   taskId: string;
   applicationId: string;
   performerUid: string;
   amount: number; // Amount in rupees
}

// Create escrow response
export interface CreateEscrowResponse {
   success: boolean;
   escrow?: Escrow;
   razorpayOrderId?: string;
   error?: string;
}

// Verify payment request
export interface VerifyPaymentRequest {
   escrowId: string;
   razorpay_payment_id: string;
   razorpay_order_id: string;
   razorpay_signature: string;
}

// Release payment request
export interface ReleasePaymentRequest {
   escrowId: string;
   taskId: string;
}

// Release payment response
export interface ReleasePaymentResponse {
   success: boolean;
   transaction?: PaymentTransaction;
   error?: string;
}

// Refund request
export interface RefundRequest {
   escrowId: string;
   taskId: string;
   reason: string;
}

// Refund response
export interface RefundResponse {
   success: boolean;
   refund?: PaymentTransaction;
   error?: string;
}

// Transaction list filters
export interface TransactionFilters {
   status?: PaymentStatus | "all";
   type?: TransactionType | "all";
   dateFrom?: string;
   dateTo?: string;
}

// Transaction list response
export interface TransactionListResponse {
   transactions: PaymentTransaction[];
   pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
   };
}

// Escrow with task details (for display)
export interface EscrowWithDetails extends Escrow {
   taskTitle?: string;
   posterName?: string;
   performerName?: string;
}

// Transaction with task details (for display)
export interface TransactionWithDetails extends PaymentTransaction {
   taskTitle?: string;
   posterName?: string;
   performerName?: string;
}

// User role in payment context
export type PaymentUserRole = "poster" | "performer";

// Payment action types
export type PaymentAction =
   | "initiate_payment"
   | "release_payment"
   | "request_refund"
   | "view_details";

// Escrow status display info
export interface EscrowStatusInfo {
   status: EscrowStatus;
   label: string;
   description: string;
   color: "gray" | "blue" | "green" | "red" | "yellow";
   icon: "clock" | "lock" | "check" | "refund" | "x";
}

// Payment error types
export interface PaymentError {
   code: string;
   message: string;
   userMessage: string; // User-friendly message
   retryable: boolean;
}
