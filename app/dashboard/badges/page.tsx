'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect legacy /dashboard/badges to profile section.
 */
export default function BadgesRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/profile?section=badges');
  }, [router]);
  return null;
}
