'use client';

/**
 * Choose Location Method Page
 * User selects how they want to provide their location
 * Matches: web-apps/extrahand-web-app/src/ChooseLocationMethodScreen.tsx
 */

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';

export default function ChooseLocationMethodPage() {
  const router = useRouter();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileView(width <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleCurrentLocation = () => {
    // Navigate to location input (current location method)
    router.push('/onboarding/location-input');
  };

  const handleManualLocation = () => {
    // Navigate to search location (manual entry method)
    router.push('/onboarding/search-location');
  };

  // Mobile layout
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6 pt-20 relative">
        {/* Back Button */}
        <Link 
          href="/" 
          className="absolute top-10 left-4 flex items-center gap-2 z-10"
        >
          <span className="text-2xl text-secondary-900">‹</span>
          <span className="text-base font-medium text-secondary-900">Back</span>
        </Link>

        <div className="w-full max-w-[300px] flex flex-col items-center">
          {/* Pin Icon */}
          <div className="flex flex-col items-center mb-10">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mb-1"
              style={{ backgroundColor: PRIMARY_YELLOW }}
            >
              <div className="w-9 h-9 rounded-full bg-white"></div>
            </div>
            <div className="w-0.5 h-14 -mb-8" style={{ backgroundColor: DARK }}></div>
            <div 
              className="w-16 h-16 rounded-full"
              style={{ backgroundColor: `${PRIMARY_YELLOW}40` }}
            ></div>
          </div>

          {/* Question */}
          <h2 className="text-lg font-medium text-center mb-10" style={{ color: DARK }}>
            Where do you want your services?
          </h2>

          {/* Buttons */}
          <button
            onClick={handleCurrentLocation}
            className="w-full max-w-[300px] rounded-lg py-4 text-center font-bold text-base mb-4"
            style={{ backgroundColor: PRIMARY_YELLOW, color: '#fff' }}
          >
            At my current location
          </button>

          <button
            onClick={handleManualLocation}
            className="w-full max-w-[300px] rounded-lg py-4 text-center font-bold text-base"
            style={{ backgroundColor: PRIMARY_YELLOW, color: '#fff' }}
          >
            I'll enter my location manually
          </button>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Pin Icon */}
        <div className="flex flex-col items-center mb-8">
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mb-1"
            style={{ backgroundColor: PRIMARY_YELLOW }}
          >
            <div className="w-9 h-9 rounded-full bg-white"></div>
          </div>
          <div className="w-0.5 h-14 -mb-8" style={{ backgroundColor: DARK }}></div>
          <div 
            className="w-16 h-16 rounded-full"
            style={{ backgroundColor: `${PRIMARY_YELLOW}40` }}
          ></div>
        </div>

        {/* Question */}
        <h2 className="text-base font-medium text-center mb-8" style={{ color: DARK }}>
          Where do you want your services?
        </h2>

        {/* Buttons */}
        <button
          onClick={handleCurrentLocation}
          className="w-[90%] rounded-lg py-4 text-center font-bold text-base mb-4"
          style={{ backgroundColor: PRIMARY_YELLOW, color: '#fff' }}
        >
          At my current location
        </button>

        <button
          onClick={handleManualLocation}
          className="w-[90%] rounded-lg py-4 text-center font-bold text-base"
          style={{ backgroundColor: PRIMARY_YELLOW, color: '#fff' }}
        >
          I'll enter my location manually
        </button>
      </div>
    </div>
  );
}
