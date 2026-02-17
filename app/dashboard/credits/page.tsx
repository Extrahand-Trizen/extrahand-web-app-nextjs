'use client';

import React from 'react';
import CreditsSection from '@/components/profile/CreditsSection';
import { useRouter } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function CreditsPage() {
  const router = useRouter();

  const handleNavigateToReferral = () => {
    router.push('/dashboard/referrals');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Credits</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Main Content */}
        <CreditsSection onNavigateToReferral={handleNavigateToReferral} />
      </div>
    </div>
  );
}
