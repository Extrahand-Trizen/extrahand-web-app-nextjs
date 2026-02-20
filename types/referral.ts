/**
 * Referral System Types
 */

export interface ReferralCode {
  _id: string;
  uid: string;
  code: string;
  createdAt: number;
}

export interface ReferralRecord {
  _id: string;
  referrerId: string;
  refereeId: string;
  referralCode: string;
  qualifiedAt: number | null;
  expiresAt: number;
  status: 'pending' | 'qualified' | 'expired';
  createdAt: number;
  updatedAt: number;
}

export interface Credit {
  _id: string;
  uid: string;
  balance: number;
  lifetime: number;
  transactions: CreditTransaction[];
  createdAt: number;
  updatedAt: number;
}

export interface CreditTransaction {
  _id: string;
  type: 'referral' | 'badge' | 'task' | 'withdrawal' | 'admin' | 'gift';
  amount: number;
  description: string;
  referenceId?: string;
  createdAt: number;
  status?: 'pending' | 'completed' | 'failed';
}

export interface ReferralStats {
  totalReferrals: number;
  qualifiedReferrals: number;
  expiredReferrals: number;
  totalCreditsEarned: number;
  currentCreditBalance: number;
}

export interface ReferralDashboardData {
  referralCode: string;
  stats: ReferralStats;
  recentReferrals: ReferralRecord[];
  creditTransactions: CreditTransaction[];
}
