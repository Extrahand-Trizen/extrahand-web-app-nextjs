/**
 * Payment-related type definitions
 */

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number; // Amount in paise
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

export interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface Escrow {
  id: string;
  escrowId: string;
  razorpayOrderId: string;
  taskId: string;
  applicationId?: string;
  posterUid: string;
  performerUid: string;
  amount: string; // Amount in paise
  amountInRupees: string;
  currency: string;
  status: 'pending' | 'held' | 'released' | 'refunded' | 'cancelled';
  razorpayPaymentId?: string;
  paymentStatus?: 'pending' | 'authorized' | 'captured' | 'failed';
  autoReleaseEnabled: boolean;
  autoReleaseAfterDays?: number;
  autoReleaseDate?: string;
  heldAt?: string;
  releasedAt?: string;
  releaseTransactionId?: string;
  refundedAt?: string;
  refundTransactionId?: string;
  refundReason?: string;
  expiresAt?: string;
  errorMessage?: string;
  errorCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEscrowRequest {
  taskId: string;
  applicationId?: string;
  posterUid: string;
  performerUid: string;
  amount: number; // Amount in rupees
  currency?: string;
  autoReleaseAfterDays?: number;
  metadata?: Record<string, any>;
}

export interface CreateEscrowResponse {
  success: boolean;
  escrow?: Escrow;
  order?: RazorpayOrder;
  error?: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface FeeBreakdown {
  taskAmount: number;
  platformFee: number;
  platformFeeGst: number;
  platformFeeTotal: number;
  processingFeeShare: number;
  processingFeeGst: number;
  processingFeeTotal: number;
  totalAmount: number; // Amount poster pays (task + all fees)
  metadata?: {
    platformFeePercentage?: number;
    processingFeeSplitRatio?: number;
    gstPercentage?: number;
    calculatedAt?: string;
    currency?: string;
  };
}


export interface UserEarnings {
  totalEarnings: number;
  fromPayouts: number;
  fromCompensation: number;
  payoutCount: number;
  compensationCount: number;
  averagePayout: number;
  largestPayout: number;
  smallestPayout: number;
  lastPayoutDate?: string;
}

export interface UserPayments {
  totalPayments: number;
  paymentCount: number;
  totalRefunds: number;
  refundCount: number;
  totalFees: number;
  lastPaymentDate?: string;
}

export interface Transaction {
  id: string;
  transactionId: string;
  escrowId?: string;
  type: string;
  amount: string;
  balanceBefore: string;
  balanceAfter: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface TransactionHistory {
  transactions: Transaction[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface Payout {
  payoutId: string;
  amount: string;
  netAmount: string;
  fees: {
    platformCommission: string;
    gstOnCommission: string;
    tds?: string;
  };
  bankTransferId?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  type: 'release' | 'cancellation_compensation';
  description?: string;
  createdAt: string;
  completedAt?: string;
}
