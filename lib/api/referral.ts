/**
 * Referral API endpoints
 */

import { createApiClient } from './base';
import type {
  ReferralRecord,
  ReferralStats,
  ReferralDashboardData,
  Credit,
  CreditTransaction,
} from '@/types/referral';

const api = createApiClient();

/**
 * Get user's referral code
 */
export async function getReferralCode(): Promise<{ code: string }> {
  const response = await api.get('/user/referral-code');
  return response.data.data;
}

/**
 * Get referral dashboard data
 */
export async function getReferralDashboard(): Promise<ReferralDashboardData> {
  const response = await api.get('/user/referral-dashboard');
  const data = response.data.data;
  
  // Transform backend response to match frontend type structure
  return {
    referralCode: data.referralCode,
    stats: {
      totalReferrals: data.totalReferrals || 0,
      qualifiedReferrals: data.successfulReferrals || 0,
      pendingReferrals: data.pendingReferrals || 0,
      expiredReferrals: data.failedReferrals || 0,
      totalCreditsEarned: data.totalEarnings || 0,
      currentCreditBalance: data.creditBalance || 0,
    },
    recentReferrals: [],
    creditTransactions: data.recentTransactions || [],
  };
}

/**
 * Get referral statistics
 */
export async function getReferralStats(): Promise<ReferralStats> {
  const response = await api.get('/user/referral-dashboard');
  const data = response.data.data;
  
  return {
    totalReferrals: data.totalReferrals || 0,
    qualifiedReferrals: data.successfulReferrals || 0,
    pendingReferrals: data.pendingReferrals || 0,
    expiredReferrals: data.failedReferrals || 0,
    totalCreditsEarned: data.totalEarnings || 0,
    currentCreditBalance: data.creditBalance || 0,
  };
}

/**
 * Get user's referrals
 */
export async function getUserReferrals(
  _status?: 'all' | 'pending' | 'qualified' | 'expired'
): Promise<ReferralRecord[]> {
  // This endpoint doesn't exist on backend yet, return empty array
  return [];
}

/**
 * Get credit account details
 */
export async function getCredits(): Promise<Credit> {
  const response = await api.get('/user/credits/balance');
  const data = response.data.data;
  
  return {
    _id: data.userId,
    uid: data.userId,
    balance: data.balance || 0,
    lifetime: data.totalEarned || 0,
    transactions: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Get credit transactions
 */
export async function getCreditTransactions(
  limit: number = 20,
  offset: number = 0
): Promise<{ transactions: CreditTransaction[]; total: number }> {
  const response = await api.get('/user/credits/transactions', {
    params: { limit, offset },
  });
  return response.data.data;
}

/**
 * Use credits for fee reduction
 */
export async function useCreditForFee(
  taskId: string,
  creditAmount: number
): Promise<{ success: boolean; newBalance: number }> {
  const response = await api.post('/user/credits/use-payment', {
    taskId,
    amount: creditAmount,
  });
  return response.data;
}

/**
 * Request credit withdrawal
 */
export async function requestCreditWithdrawal(
  amount: number,
  bankAccountId: string
): Promise<{ success: boolean; transactionId: string }> {
  const response = await api.post('/user/credits/withdraw', {
    amount,
    bankAccountId,
  });
  return response.data;
}

/**
 * Check if can qualify for referral (for invite preview)
 */
export async function checkReferralQualification(
  referralCode: string
): Promise<{ canQualify: boolean; message: string }> {
  const response = await api.get('/referral/check-qualification', {
    params: { code: referralCode },
  });
  return response.data;
}

/**
 * Get public referral code info (for share page)
 */
export async function getPublicReferralInfo(code: string): Promise<{
  referrerName: string;
  referrerPhoto: string;
  referrerRating: number;
  benefitDescription: string;
}> {
  const response = await api.get(`/referral/public/${code}`);
  return response.data;
}

/**
 * Copy referral code to clipboard helper
 */
export function copyReferralCode(code: string) {
  if (navigator?.clipboard) {
    navigator.clipboard.writeText(code);
    return true;
  }
  return false;
}

/**
 * Generate referral share URL
 */
export function generateReferralShareUrl(code: string): string {
  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : '';
  return `${baseUrl}/join?ref=${code}`;
}

/**
 * Share referral via various platforms
 */
export function shareReferralLink(
  code: string,
  platform: 'whatsapp' | 'telegram' | 'sms' | 'email' | 'copy'
): void {
  const shareUrl = generateReferralShareUrl(code);
  const message = `Join me on ExtraHand using my referral code ${code}! Earn money by doing tasks. ${shareUrl}`;

  switch (platform) {
    case 'whatsapp':
      window.open(
        `https://wa.me/?text=${encodeURIComponent(message)}`,
        '_blank'
      );
      break;
    case 'telegram':
      window.open(
        `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(message)}`,
        '_blank'
      );
      break;
    case 'sms':
      window.open(`sms:?body=${encodeURIComponent(message)}`);
      break;
    case 'email':
      window.open(
        `mailto:?subject=Join ExtraHand&body=${encodeURIComponent(message)}`
      );
      break;
    case 'copy':
      copyReferralCode(shareUrl);
      break;
  }
}
