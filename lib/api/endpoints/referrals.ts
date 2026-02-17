/**
 * Referrals API endpoints
 * Handles referral dashboard, credits, and related operations
 */

import { fetchWithAuth } from '../client';

export interface ReferralDashboard {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  pendingReferrals: number;
  successfulReferrals: number;
  failedReferrals: number;
  totalEarnings: number;
  conversionRate: number;
  creditBalance: number;
  recentTransactions: CreditTransaction[];
}

export interface CreditTransaction {
  transactionId: string;
  type: 'earned_referral' | 'used_payment' | 'withdrawal' | 'gift_received' | 'gift_sent' | 'bonus';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  createdAt: Date;
  processedAt?: Date;
  relatedUid?: string;
}

export interface ReferralCode {
  code: string;
  link: string;
  createdAt: Date;
  usedAt?: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface ReferrerInfo {
  uid: string;
  name: string;
  referralCode: string;
}

export interface BatchJobLog {
  jobId: string;
  jobName: string;
  jobType: 'daily_badge_check' | 'check_expired_referrals' | 'verify_credentials' | 'auto_payout';
  status: 'running' | 'completed' | 'failed' | 'pending';
  startedAt: Date;
  completedAt?: Date;
  executedAt?: Date;
  duration?: number; // in milliseconds
  processedCount: number;
  successCount: number;
  failureCount: number;
  errorMessage?: string;
  logs: string[];
}

export const referralsApi = {
  /**
   * Get referral dashboard with stats and recent transactions
   * GET /api/v1/referral/dashboard
   */
  async getDashboard(): Promise<ReferralDashboard> {
    return fetchWithAuth('referral/dashboard');
  },

  /**
   * Get referral code for current user
   * GET /api/v1/referral/code
   */
  async getReferralCode(): Promise<ReferralCode> {
    return fetchWithAuth('referral/code');
  },

  /**
   * Get credit balance for current user
   * GET /api/v1/referral/credits/balance
   */
  async getCreditBalance(): Promise<{ balance: number; currency: string }> {
    return fetchWithAuth('referral/credits/balance');
  },

  /**
   * Get transaction history
   * GET /api/v1/referral/credits/transactions
   */
  async getTransactions(
    params?: {
      type?: string;
      status?: string;
      limit?: number;
      page?: number;
    }
  ): Promise<{
    transactions: CreditTransaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query = new URLSearchParams();
    if (params?.type) query.append('type', params.type);
    if (params?.status) query.append('status', params.status);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page) query.append('page', params.page.toString());

    const url = `referral/credits/transactions${query.toString() ? '?' + query.toString() : ''}`;
    return fetchWithAuth(url);
  },

  /**
   * Get referral info for a specific user (if referred)
   * GET /api/v1/referral/info
   */
  async getReferralInfo(): Promise<ReferrerInfo | null> {
    try {
      return fetchWithAuth('referral/info');
    } catch (error: any) {
      if (error.status === 404) {
        return null; // User not referred
      }
      throw error;
    }
  },

  /**
   * Withdraw credits
   * POST /api/v1/referral/credits/withdraw
   */
  async withdrawCredits(amount: number): Promise<{
    success: boolean;
    withdrawal: {
      id: string;
      amount: number;
      requestedAt: Date;
      status: string;
    };
  }> {
    return fetchWithAuth('referral/credits/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  /**
   * Gift credits to another user
   * POST /api/v1/referral/credits/gift
   */
  async giftCredits(recipientUid: string, amount: number, message?: string): Promise<{
    success: boolean;
    transaction: CreditTransaction;
  }> {
    return fetchWithAuth('referral/credits/gift', {
      method: 'POST',
      body: JSON.stringify({ recipientUid, amount, message }),
    });
  },

  /**
   * Get batch job logs (admin only, but can be accessed for general info)
   * GET /api/v1/referral/batch-jobs/logs
   */
  async getBatchJobLogs(
    params?: {
      jobType?: string;
      status?: string;
      limit?: number;
      page?: number;
    }
  ): Promise<{
    logs: BatchJobLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const query = new URLSearchParams();
    if (params?.jobType) query.append('jobType', params.jobType);
    if (params?.status) query.append('status', params.status);
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page) query.append('page', params.page.toString());

    const url = `referral/batch-jobs/logs${query.toString() ? '?' + query.toString() : ''}`;
    return fetchWithAuth(url);
  },

  /**
   * Get last execution time of batch jobs
   * GET /api/v1/referral/batch-jobs/status
   */
  async getBatchJobStatus(): Promise<{
    lastDailyBadgeCheck?: Date;
    lastReferralExpiryCheck?: Date;
    lastVerificationBatch?: Date;
    nextScheduledRun?: Date;
  }> {
    return fetchWithAuth('referral/batch-jobs/status');
  },
};
