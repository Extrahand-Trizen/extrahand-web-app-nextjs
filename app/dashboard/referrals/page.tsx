'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect legacy /dashboard/referrals to profile section.
 */
export default function ReferralsRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/profile?section=referrals');
  }, [router]);
  return null;
}
