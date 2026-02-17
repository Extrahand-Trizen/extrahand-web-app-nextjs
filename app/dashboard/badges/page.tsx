'use client';

import React from 'react';
import BadgeDisplay from '@/components/profile/BadgeDisplay';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function BadgesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              <BreadcrumbSeparator />
              <BreadcrumbPage>Badges</BreadcrumbPage>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Main Content */}
        <BadgeDisplay showProgress={true} className="mb-12" />
      </div>
    </div>
  );
}
