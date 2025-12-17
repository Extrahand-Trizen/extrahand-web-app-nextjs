/**
 * Payment Types
 * Types for payment processing, transactions, and UI states
 */

// Payment Summary for checkout
export interface PaymentSummary {
   taskId: string;
   taskTitle: string;
   taskAmount: number;
   serviceFee: number;
   platformFee: number;
   totalAmount: number;
   currency: string;
   taskerName: string;
}

// Payment Transaction
export interface PaymentTransaction {
   id: string;
   type: "payment" | "payout" | "refund" | "fee";
   amount: number;
   currency: string;
   status: "pending" | "processing" | "completed" | "failed" | "cancelled";
   description: string;
   taskId?: string;
   taskTitle?: string;
   createdAt: Date;
   completedAt?: Date;
   failedAt?: Date;
   refundedAt?: Date;
}

// Payment Error
export interface PaymentError {
   code: string;
   userMessage: string;
   technicalMessage?: string;
   retryable: boolean;
   suggestedAction?: string;
}

// Payment Method Types
export type PaymentMethodType = "card" | "upi" | "netbanking" | "wallet";

export interface PaymentMethodOption {
   type: PaymentMethodType;
   label: string;
   icon: string;
   description?: string;
}
