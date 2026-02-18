'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BadgeDisplaySimple from '@/components/profile/BadgeDisplaySimple';
import { ProfileSidebar } from '@/components/profile';
import { ProfileSection } from '@/types/profile';
import { ArrowLeft } from 'lucide-react';

export default function BadgesPage() {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    console.log('✅ Badges page mounted successfully');
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleNavigate = (section: ProfileSection) => {
    if (section === 'badges') {
      // Already on badges page
      return;
    }
    if (section === 'referrals') {
      router.push('/dashboard/referrals');
      return;
    }
    // Navigate to profile page with section
    router.push(`/profile?section=${section}`);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <div className="mb-8">
            <Link href="/profile" className="text-blue-600 hover:underline">
              ← Back to Overview
            </Link>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Badges</h1>

          {/* Main Content */}
          <BadgeDisplaySimple className="mb-12" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 max-w-7xl mx-auto">
      <div className="flex">
        <ProfileSidebar
          activeSection="badges"
          onSectionChange={handleNavigate}
          className="hidden lg:block sticky top-0"
        />
        <main className="flex-1 min-h-screen">
          <div className="max-w-4xl mx-auto py-8">
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Overview
            </button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Badges</h1>
            
            <BadgeDisplaySimple className="mb-12" />
          </div>
        </main>
      </div>
    </div>
  );
}
