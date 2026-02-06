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
  async getUserEarnings(userId: string): Promise<{ success: boolean; data?: UserEarnings; error?: string }> {
    return fetchWithAuth(`/payment/earnings/${userId}`);
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
  async getUserTransactions(userId: string, params?: { page?: number; limit?: number }): Promise<TransactionHistory> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await fetchWithAuth(`/payment/transactions/user/${userId}${queryString}`);
    return response.data || response;
  },

  /**
   * Calculate fees for an amount
   * GET /api/v1/payment/fees/calculate?amount=:amount
   */
  async calculateFees(amount: number): Promise<{ success: boolean; fees?: FeeBreakdown; error?: string }> {
    return fetchWithAuth(`/payment/fees/calculate?amount=${amount}`);
  },
};
