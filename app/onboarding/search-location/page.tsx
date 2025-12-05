'use client';

/**
 * Search Location Page
 * Search for location using address search
 * Matches: web-apps/extrahand-web-app/src/SearchLocationScreen.tsx
 * NO API CALLS - Uses mock data, just routing
 */

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';
const GRAY = '#888';
const LIGHT_GRAY = '#f5f5f5';

// Mock search results - in real app, these would come from Google Places API
const mockSearchResults = [
  {
    id: '1',
    name: 'Gachibowli',
    address: 'Hyderabad, Telangana, India'
  },
  {
    id: '2',
    name: 'Gachibowli ORR Entrance toward...',
    address: 'Telecom Nagar, Gachibowli, Hyderabad, Telangana, India'
  },
  {
    id: '3',
    name: 'Gachibowli Circle',
    address: 'Mushroom Rock Road, Gachibowli, Hyderabad, Telangana, India'
  },
  {
    id: '4',
    name: 'Gachibowli Stadium',
    address: 'Diamond Hills, Rajiv Gandhi Nagar, Gachibowli, Hyderabad, Telangana, India'
  },
  {
    id: '5',
    name: 'Gachibowli Flyover',
    address: 'Gachibowli, Hyderabad, Telangana, India'
  }
];

export default function SearchLocationPage() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('Gachibowli');
  const [isMobileView, setIsMobileView] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobileView(width <= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    // Focus the search input when component mounts
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleUseCurrentLocation = () => {
    // Navigate to location confirmation with current location data
    router.push('/onboarding/location-confirmation');
  };

  const handleLocationSelect = (location: typeof mockSearchResults[0]) => {
    // Navigate to location confirmation with selected location
    router.push('/onboarding/location-confirmation');
  };

  // Mobile layout
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-white pt-20">
        {/* Back Button */}
        <Link 
          href="/onboarding/choose-location-method" 
          className="absolute top-10 left-4 flex items-center gap-2 z-10"
        >
          <span className="text-2xl font-bold" style={{ color: DARK }}>‹</span>
          <span className="text-base font-bold" style={{ color: DARK }}>Back</span>
        </Link>

        <div className="flex-1 px-4">
          {/* Search Header */}
          <div className="mb-4">
            <input
              ref={searchInputRef}
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search location..."
              className="w-full h-12 border rounded-3xl px-5 text-base bg-white"
              style={{ 
                borderColor: PRIMARY_YELLOW,
                color: DARK
              }}
            />
          </div>

          {/* Use Current Location Option */}
          <button
            onClick={handleUseCurrentLocation}
            className="w-full flex items-center py-4 px-4 rounded-xl mb-3"
            style={{ backgroundColor: PRIMARY_YELLOW }}
          >
            <span className="text-xl mr-3">🎯</span>
            <span className="text-base font-bold text-white">Use current location</span>
          </button>

          {/* Search Results */}
          <div className="flex-1 overflow-y-auto">
            {mockSearchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => handleLocationSelect(result)}
                className="w-full flex items-center py-4 border-b"
                style={{ borderBottomColor: LIGHT_GRAY }}
              >
                <span className="text-lg mr-3" style={{ color: GRAY }}>📍</span>
                <div className="flex-1 text-left">
                  <p className="text-base font-medium mb-0.5" style={{ color: DARK }}>
                    {result.name}
                  </p>
                  <p className="text-sm leading-5" style={{ color: GRAY }}>
                    {result.address}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Powered by Google */}
          <div className="flex justify-center items-center py-4 border-t" style={{ borderTopColor: LIGHT_GRAY }}>
            <span className="text-xs" style={{ color: GRAY }}>powered by </span>
            <span className="text-xs font-bold" style={{ color: '#4285F4' }}>Google</span>
          </div>
        </div>
      </div>
    );
  }

  // Desktop layout
  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col h-screen">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b" style={{ borderBottomColor: LIGHT_GRAY }}>
          <input
            ref={searchInputRef}
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search location..."
            className="flex-1 h-10 border rounded-3xl px-4 text-base"
            style={{ 
              borderColor: PRIMARY_YELLOW,
              color: DARK
            }}
          />
        </div>

        {/* Use Current Location Option */}
        <button
          onClick={handleUseCurrentLocation}
          className="flex items-center py-4 px-4 mx-4 mt-3 rounded-xl"
          style={{ backgroundColor: PRIMARY_YELLOW }}
        >
          <span className="text-xl mr-3 text-white">🎯</span>
          <span className="text-base font-bold text-white">Use current location</span>
        </button>

        {/* Search Results */}
        <div className="flex-1 overflow-y-auto">
          {mockSearchResults.map((result) => (
            <button
              key={result.id}
              onClick={() => handleLocationSelect(result)}
              className="w-full flex items-center py-4 px-4 border-b"
              style={{ borderBottomColor: LIGHT_GRAY }}
            >
              <span className="text-lg mr-3" style={{ color: GRAY }}>📍</span>
              <div className="flex-1 text-left">
                <p className="text-base font-medium mb-0.5" style={{ color: DARK }}>
                  {result.name}
                </p>
                <p className="text-sm leading-5" style={{ color: GRAY }}>
                  {result.address}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Powered by Google */}
        <div className="flex justify-center items-center py-4 border-t" style={{ borderTopColor: LIGHT_GRAY }}>
          <span className="text-xs" style={{ color: GRAY }}>powered by </span>
          <span className="text-xs font-bold" style={{ color: '#4285F4' }}>Google</span>
        </div>
      </div>
    </div>
  );
}
