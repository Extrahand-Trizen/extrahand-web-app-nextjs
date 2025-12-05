'use client';

/**
 * Location Confirmation Page
 * Shows selected location and auto-navigates to role selection
 * Matches: web-apps/extrahand-web-app/src/LocationConfirmationScreen.tsx
 * NO API CALLS - Just routing
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';

export default function LocationConfirmationPage() {
  const router = useRouter();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileView(width <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Auto-navigate to role selection after 1 second
    const timer = setTimeout(() => {
      router.push('/onboarding/role-selection');
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  // Mock location data (in real app, this would come from previous screen or session)
  const areaName = 'Selected Location';
  const fullAddress = 'Hyderabad, Telangana, India';

  // Mobile layout
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-20 relative">
        {/* Back Button */}
        <Link 
          href="/onboarding/location-input" 
          className="absolute top-10 left-4 flex items-center gap-2 z-10"
        >
          <span className="text-2xl" style={{ color: DARK }}>‹</span>
          <span className="text-base font-bold" style={{ color: DARK }}>Back</span>
        </Link>

        <div className="flex flex-col items-center justify-center flex-1 pt-5 pb-5 px-6">
          <div className="flex flex-col items-center mb-10">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-1"
              style={{ backgroundColor: PRIMARY_YELLOW }}
            >
              <span className="text-white text-4xl font-bold">✓</span>
            </div>
          </div>
          <p 
            className="text-sm mb-2 font-medium"
            style={{ color: PRIMARY_YELLOW }}
          >
            Delivering service at
          </p>
          <h2 
            className="text-2xl font-bold text-center mb-2"
            style={{ color: DARK }}
          >
            {areaName}
          </h2>
          <p 
            className="text-base text-center leading-6"
            style={{ color: '#888' }}
          >
            {fullAddress}
          </p>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] flex flex-col items-center flex-1 pt-15">
        <div className="flex flex-col items-center mb-8">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mb-1"
            style={{ backgroundColor: PRIMARY_YELLOW }}
          >
            <span className="text-white text-4xl font-bold">✓</span>
          </div>
        </div>
        <p 
          className="text-sm mb-2 font-medium"
          style={{ color: PRIMARY_YELLOW }}
        >
          Delivering service at
        </p>
        <h2 
          className="text-2xl font-bold text-center mb-2"
          style={{ color: DARK }}
        >
          {areaName}
        </h2>
        <p 
          className="text-base text-center leading-6"
          style={{ color: '#888' }}
        >
          {fullAddress}
        </p>
      </div>
    </div>
  );
}
