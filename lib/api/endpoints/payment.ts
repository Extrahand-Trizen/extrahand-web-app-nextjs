/**
 * Payment API endpoints
 * Routes through API Gateway to payment service
 */

import { fetchWithAuth } from '../client';
import type {
  CreateEscrowRequest,
  CreateEscrowResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
  Escrow,
  UserEarnings,
  UserPayments,
  TransactionHistory,
  FeeBreakdown,
} from '@/types/payment';

export const paymentApi = {
  /**
   * Create escrow and Razorpay order
   * POST /api/v1/payment/escrow/create
   */
  async createEscrow(data: CreateEscrowRequest): Promise<CreateEscrowResponse> {
    return fetchWithAuth('/payment/escrow/create', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Verify payment signature
   * POST /api/v1/payment/verify-payment
   */
  async verifyPayment(data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
    return fetchWithAuth('/payment/verify-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Cancel escrow and trigger Razorpay refund when applicable
   * POST /api/v1/payment/cancel
   */
  async cancelPayment(body: {
    taskId?: string;
    escrowId?: string;
    razorpayOrderId?: string;
    reason?: string;
    userId?: string;
    cancelledBy?: 'poster' | 'performer';
    taskStartDate?: string;
    assignedAt?: string;
    feeBaseAmount?: number;
  }): Promise<{
    success: boolean;
    cancelled?: boolean;
    refundRequired?: boolean;
    refund?: unknown;
    error?: string;
  }> {
    return fetchWithAuth('/payment/cancel', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },

  /**
   * Get escrow status
   * GET /api/v1/payment/escrow/status/:escrowId
   */
  async getEscrowStatus(escrowId: string): Promise<{ success: boolean; escrow?: Escrow; error?: string }> {
    return fetchWithAuth(`/payment/escrow/status/${escrowId}`);
  },

  /**
   * Get escrow by task ID
   * GET /api/v1/payment/escrow/task/:taskId
   */
  async getEscrowByTaskId(taskId: string): Promise<{ success: boolean; escrow?: Escrow; error?: string }> {
    return fetchWithAuth(`/payment/escrow/task/${taskId}`);
  },

  /**
   * Process payout manually - DISABLED (payouts/release handled elsewhere)
   * POST /api/v1/payment/payout/process
   */
  // async processPayout(data: {
  //   razorpayOrderId: string;
  //   performerUid: string;
  //   bankAccountId?: string;
  // }): Promise<{ success: boolean; payout?: Payout; error?: string }> {
  //   return fetchWithAuth('/payment/payout/process', {
  //     method: 'POST',
  //     body: JSON.stringify(data),
  //   });
  // },

  /**
   * Get user earnings summary
   * GET /api/v1/payment/earnings/:userId
   */
  async getUserEarnings(
    userId: string,
    linkedUserIds?: string
  ): Promise<{ success: boolean; data?: UserEarnings; error?: string }> {
    const q = new URLSearchParams();
    if (linkedUserIds?.trim()) q.set('linkedUserIds', linkedUserIds.trim());
    const suffix = q.toString() ? `?${q.toString()}` : '';
    return fetchWithAuth(`/payment/earnings/${userId}${suffix}`);
  },

  /**
   * Pending tasker cancellation penalties (deducted from future payouts).
   * GET /api/v1/payment/earnings/:userId/pending-cancellation-penalties
   */
  async getPendingCancellationPenalties(
    userId: string,
    linkedUserIds?: string
  ): Promise<{
    success: boolean;
    totalRemaining?: string;
    items?: Array<{
      penaltyId: string;
      taskId: string;
      taskTitle: string | null;
      amount: string;
      remainingAmount: string;
      cancelledAt: string;
      reason: string | null;
    }>;
    error?: string;
  }> {
    const q = new URLSearchParams();
    if (linkedUserIds?.trim()) q.set('linkedUserIds', linkedUserIds.trim());
    const suffix = q.toString() ? `?${q.toString()}` : '';
    return fetchWithAuth(`/payment/earnings/${userId}/pending-cancellation-penalties${suffix}`);
  },

  /**
   * Get current user earnings
   * GET /api/v1/payment/earnings/me
   */
  async getMyEarnings(): Promise<{ success: boolean; data?: UserEarnings; error?: string }> {
    return fetchWithAuth('/payment/earnings/me');
  },

  /**
   * Get user payments summary
   * GET /api/v1/payment/earnings/:userId/payments
   */
  async getUserPayments(userId: string): Promise<{ success: boolean; data?: UserPayments; error?: string }> {
    return fetchWithAuth(`/payment/earnings/${userId}/payments`);
  },

  /**
   * Get transaction history
   * GET /api/v1/payment/transactions/user/:userId
   */
  async getUserTransactions(
    userId: string,
    params?: { page?: number; limit?: number; linkedUserIds?: string }
  ): Promise<TransactionHistory> {
    const search = new URLSearchParams();
    if (params?.limit != null) search.set('limit', String(params.limit));
    if (params?.page != null) search.set('page', String(params.page));
    if (params?.linkedUserIds?.trim()) search.set('linkedUserIds', params.linkedUserIds.trim());
    const queryString = search.toString() ? `?${search.toString()}` : '';
    const response = await fetchWithAuth(`/payment/transactions/user/${userId}${queryString}`);
    return response.data || response;
  },

  /**
   * Get transaction summary totals
   * GET /api/v1/payment/transactions/user/:userId/summary
   */
  async getTransactionSummary(
    userId: string,
    params?: { linkedUserIds?: string }
  ): Promise<{
    success: boolean;
    summary?: {
      totalPayments: string;
      totalPayouts: string;
      totalRefunds: string;
      totalCompensation: string;
      totalFees: string;
      netEarnings: string;
      transactionCount: number;
    };
    error?: string;
  }> {
    const search = new URLSearchParams();
    if (params?.linkedUserIds?.trim()) search.set('linkedUserIds', params.linkedUserIds.trim());
    const queryString = search.toString() ? `?${search.toString()}` : '';
    return fetchWithAuth(`/payment/transactions/user/${userId}/summary${queryString}`);
  },

  /**
   * Calculate fees for an amount (category-aware when taskCategory provided)
   * GET /api/v1/payment/fees/calculate?amount=:amount&taskCategory=:taskCategory
   */
  async calculateFees(
    amount: number,
    taskCategory?: string
  ): Promise<{ success: boolean; fees?: FeeBreakdown; error?: string }> {
    const params = new URLSearchParams({ amount: String(amount) });
    if (taskCategory?.trim()) params.set('taskCategory', taskCategory.trim());
    return fetchWithAuth(`/payment/fees/calculate?${params.toString()}`);
  },

  async upsertBankAccount(data: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankName?: string;
    email?: string;
    phone?: string;
    setAsDefault?: boolean;
  }): Promise<{
    success: boolean;
    data?: {
      bankAccountId: string;
      maskedAccountNumber: string;
      fundAccountId: string;
    };
    message?: string;
    error?: string;
  }> {
    return fetchWithAuth('/payment/bank-accounts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMyBankAccounts(): Promise<{
    success: boolean;
    data?: Array<{
      id: string;
      bankName: string;
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
      isVerified: boolean;
      isDefault: boolean;
      createdAt: string;
    }>;
    error?: string;
  }> {
    return fetchWithAuth('/payment/bank-accounts/me');
  },

  async processTaskCompletionPayout(data: {
    taskId: string;
    performerUid: string;
    amount: number;
    taskTitle?: string;
  }): Promise<{
    success: boolean;
    payout?: any;
    requiresBankAccount?: boolean;
    message?: string;
    error?: string;
  }> {
    return fetchWithAuth('/payment/payout/task-completion', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};
