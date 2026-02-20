'use client';

import Link from 'next/link';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-6">Select a section to view:</p>
        <div className="space-x-4">
          <Link href="/profile?section=referrals" className="text-blue-600 hover:underline">Referrals</Link>
          <Link href="/profile?section=badges" className="text-blue-600 hover:underline">Badges</Link>
        </div>
      </div>
    </div>
  );
}
