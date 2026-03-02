'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth/context';
import { getBadgeProgress } from '@/lib/api/badge';
import { referralsApi } from '@/lib/api/endpoints/referrals';

const STALE_TIME_MS = 5 * 60 * 1000;

/**
 * Prefetches badge progress and referral dashboard as soon as the user is on
 * the profile area. Runs in the profile layout so data is often ready before
 * they open the Badges or Referral section (badge API is slower due to task-service call).
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
  }, [userData?.uid, queryClient]);

  return null;
}
