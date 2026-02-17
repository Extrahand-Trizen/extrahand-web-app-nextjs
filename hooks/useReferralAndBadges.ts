/**
 * Custom hooks for referral and badge system
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getReferralDashboard,
  getReferralStats,
  getUserReferrals,
  getCredits,
  getCreditTransactions,
} from '@/lib/api/referral';
import {
  getBadgeProgress,
  checkBadgeUpgrade,
  getEliteBadgeStatus,
} from '@/lib/api/badge';
import type { ReferralDashboardData, Credit } from '@/types/referral';
import type { BadgeProgressData } from '@/types/badge';

/**
 * Hook to fetch referral dashboard data
 */
export function useReferralDashboard() {
  return useQuery<ReferralDashboardData>({
    queryKey: ['referralDashboard'],
    queryFn: getReferralDashboard,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to fetch referral statistics
 */
export function useReferralStats() {
  return useQuery({
    queryKey: ['referralStats'],
    queryFn: getReferralStats,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to fetch user's referrals with optional status filter
 */
export function useUserReferrals(status?: 'all' | 'pending' | 'qualified' | 'expired') {
  return useQuery({
    queryKey: ['userReferrals', status],
    queryFn: () => getUserReferrals(status),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to fetch credit account details
 */
export function useCredits() {
  return useQuery<Credit>({
    queryKey: ['credits'],
    queryFn: getCredits,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to fetch credit transaction history
 */
export function useCreditTransactions(limit: number = 20, offset: number = 0) {
  return useQuery({
    queryKey: ['creditTransactions', limit, offset],
    queryFn: () => getCreditTransactions(limit, offset),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to fetch badge progress information
 */
export function useBadgeProgress() {
  return useQuery<BadgeProgressData>({
    queryKey: ['badgeProgress'],
    queryFn: getBadgeProgress,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to check and upgrade badge
 */
export function useCheckBadgeUpgrade() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkBadgeUpgrade,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['badgeProgress'] });
    },
  });
}

/**
 * Hook to get Elite badge application status
 */
export function useEliteBadgeStatus() {
  return useQuery({
    queryKey: ['eliteBadgeStatus'],
    queryFn: getEliteBadgeStatus,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
