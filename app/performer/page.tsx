'use client';

/**
 * Performer Dashboard Page
 * Shows tabs for Available Tasks and My Tasks
 * Matches: web-apps/extrahand-web-app/src/PerformerHomeScreen.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { NavBar } from '@/components/layout/NavBar';
import { Footer } from '@/components/layout/Footer';
import AvailableTasksScreen from '@/components/dashboard/AvailableTasksScreen';
import MyTasksScreen from '@/components/dashboard/MyTasksScreen';

type TabType = 'available' | 'my-tasks';

export default function PerformerPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('available');
  const [isMobileView, setIsMobileView] = useState(false);

  // Check URL parameters to set initial tab
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'my-tasks') {
      setActiveTab('my-tasks');
    } else {
      setActiveTab('available');
    }
  }, [searchParams]);

  // Check screen size for mobile/desktop layout
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileView(width < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Mobile layout
  if (isMobileView) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <NavBar />

        {/* Tab Navigation */}
        <div className="flex flex-row bg-white border-b border-gray-200">
          <button
            onClick={() => setActiveTab('available')}
            className={`flex-1 py-4 text-center border-b-2 transition-colors ${
              activeTab === 'available'
                ? 'border-blue-500 text-blue-500 font-semibold'
                : 'border-transparent text-gray-600 font-medium'
            }`}
          >
            Available Tasks
          </button>
          <button
            onClick={() => setActiveTab('my-tasks')}
            className={`flex-1 py-4 text-center border-b-2 transition-colors ${
              activeTab === 'my-tasks'
                ? 'border-blue-500 text-blue-500 font-semibold'
                : 'border-transparent text-gray-600 font-medium'
            }`}
          >
            My Tasks
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'my-tasks' ? (
            <MyTasksScreen />
          ) : (
            <AvailableTasksScreen />
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <NavBar />

      {/* Tab Navigation */}
      <div className="flex flex-row bg-white border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab('available');
            router.push('/performer?tab=available');
          }}
          className={`px-8 py-4 text-center border-b-2 transition-colors ${
            activeTab === 'available'
              ? 'border-blue-500 text-blue-500 font-semibold'
              : 'border-transparent text-gray-600 font-medium'
          }`}
        >
          Available Tasks
        </button>
        <button
          onClick={() => {
            setActiveTab('my-tasks');
            router.push('/performer?tab=my-tasks');
          }}
          className={`px-8 py-4 text-center border-b-2 transition-colors ${
            activeTab === 'my-tasks'
              ? 'border-blue-500 text-blue-500 font-semibold'
              : 'border-transparent text-gray-600 font-medium'
          }`}
        >
          My Tasks
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'my-tasks' ? (
          <MyTasksScreen />
        ) : (
          <AvailableTasksScreen />
        )}
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
