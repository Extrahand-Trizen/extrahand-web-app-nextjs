'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth/context';
import { getBadgeProgress } from '@/lib/api/badge';
import { referralsApi } from '@/lib/api/endpoints/referrals';
import { addressesApi } from '@/lib/api/endpoints/addresses';
import { usePaymentsStore } from '@/lib/state/paymentsStore';

const STALE_TIME_MS = 5 * 60 * 1000;

export const PROFILE_ADDRESSES_QUERY_KEY = ['profileAddresses'] as const;

/**
 * Prefetches profile section data as soon as the user is on the profile area.
 * Runs in the profile layout so Badges, Referral, Payments, and Addresses
 * sections often have data ready when opened.
 */
export function ProfileDataPrefetcher() {
  const { userData } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userData?.uid) return;

    // Badge progress is slower (user-service + task-service); start it first
    queryClient.prefetchQuery({
      queryKey: ['badgeProgress'],
      queryFn: getBadgeProgress,
      staleTime: STALE_TIME_MS,
    });

    queryClient.prefetchQuery({
      queryKey: ['referralSimple'],
      queryFn: () => referralsApi.getDashboard(),
      staleTime: STALE_TIME_MS,
    });

    // Payments: populate Zustand store so Payments section has data when opened
    usePaymentsStore.getState().fetchPayments(userData.uid).catch(() => {});

    queryClient.prefetchQuery({
      queryKey: PROFILE_ADDRESSES_QUERY_KEY,
      queryFn: () => addressesApi.getAddresses(),
      staleTime: STALE_TIME_MS,
    });
  }, [userData?.uid, queryClient]);

  return null;
}
