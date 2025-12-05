'use client';

/**
 * Location Input Page
 * User can select location on map or use current location
 * Matches: web-apps/extrahand-web-app/src/LocationInputScreen.tsx
 * NO API CALLS - Just routing
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { InteractiveMap } from '@/components/maps/InteractiveMap';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';

const locationTags = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'office', label: 'office', icon: '🏢' },
  { id: 'other', label: 'other', icon: '❤️' }
];

export default function LocationInputPage() {
  const router = useRouter();
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState('home');
  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number; address?: string } | null>(null);
  const [addressDetails, setAddressDetails] = useState({
    doorNo: '',
    area: '',
    city: '',
    state: '',
    pinCode: '',
    country: ''
  });
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

  const handleLocationSelect = useCallback((location: { latitude: number; longitude: number }) => {
    setSelectedLocation({
      ...location,
      address: 'Selected Location' // Mock address
    });
    
    // Mock address details
    setAddressDetails({
      doorNo: '123',
      area: 'Selected Area',
      city: 'Hyderabad',
      state: 'Telangana',
      pinCode: '500032',
      country: 'India'
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedLocation) {
      alert('Please select a location on the map first.');
      return;
    }
    
    // Navigate to location confirmation (which will auto-navigate to role selection)
    router.push('/onboarding/location-confirmation');
  }, [selectedLocation, router]);

  const handleAddressChange = (field: string, value: string) => {
    setAddressDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleTagSelect = (tagId: string) => {
    setSelectedTag(tagId);
  };

  const LocationDetailsModal = (
    <div
      className={`fixed inset-0 z-50 ${showLocationModal ? 'block' : 'hidden'}`}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={() => setShowLocationModal(false)}
    >
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl min-h-[60%] max-h-[90%] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-200">
          <h3 className="text-lg font-bold" style={{ color: DARK }}>Enter Location details</h3>
          <button
            onClick={() => setShowLocationModal(false)}
            className="w-8 h-8 flex items-center justify-center"
          >
            <span className="text-lg font-bold" style={{ color: DARK }}>✕</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Location Tagging Section */}
          <div className="mb-5">
            <p className="text-sm mb-3" style={{ color: '#666' }}>Tag this location for later</p>
            <div className="flex gap-2.5">
              {locationTags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => handleTagSelect(tag.id)}
                  className={`
                    flex items-center px-4 py-2 rounded-2xl border transition-colors
                    ${selectedTag === tag.id
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-white border-gray-300'
                    }
                  `}
                  style={selectedTag === tag.id ? { backgroundColor: PRIMARY_YELLOW, borderColor: PRIMARY_YELLOW } : {}}
                >
                  <span className="text-base mr-1.5">{tag.icon}</span>
                  <span
                    className={`text-sm ${selectedTag === tag.id ? 'text-white font-semibold' : 'text-gray-600'}`}
                  >
                    {tag.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Address Input Fields */}
          <div className="space-y-4">
            {/* Door No & Building Name */}
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Door No & Building Name"
                  value={addressDetails.doorNo}
                  onChange={(e) => handleAddressChange('doorNo', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
                />
                <p className="text-xs mt-1" style={{ color: '#666' }}>Updated based on your exact map pin</p>
              </div>
              <button
                className="py-2"
                style={{ color: PRIMARY_YELLOW }}
              >
                <span className="text-sm font-semibold">Change</span>
              </button>
            </div>

            {/* Area & Street */}
            <input
              type="text"
              placeholder="Area & Street"
              value={addressDetails.area}
              onChange={(e) => handleAddressChange('area', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
            />

            {/* City */}
            <input
              type="text"
              placeholder="Enter your City"
              value={addressDetails.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
            />

            {/* State */}
            <input
              type="text"
              placeholder="State"
              value={addressDetails.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
            />

            {/* Pin Code and Country */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Pin code"
                value={addressDetails.pinCode}
                onChange={(e) => handleAddressChange('pinCode', e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
              />
              <input
                type="text"
                placeholder="Country"
                value={addressDetails.country}
                onChange={(e) => handleAddressChange('country', e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-3 text-base bg-white"
              />
            </div>
          </div>
        </div>

        {/* Confirm Button */}
        <div className="p-5 border-t border-gray-200">
          <button
            onClick={handleConfirm}
            className="w-full rounded-lg py-4 text-center font-bold text-base"
            style={{ backgroundColor: PRIMARY_YELLOW, color: '#fff' }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      {/* Top bar */}
      <div className="w-full flex justify-between items-center p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-base font-semibold" style={{ color: DARK }}>confirm your Location</h2>
        <Link href="/onboarding/choose-location-method">
          <span className="text-base font-semibold" style={{ color: PRIMARY_YELLOW }}>Skip</span>
        </Link>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center pb-4">
        {/* Search bar */}
        <div className="w-[90%] max-w-md bg-white rounded-xl mt-4 mb-4 p-1 flex items-center border border-gray-200 flex-shrink-0">
          <span className="text-lg ml-3 mr-2" style={{ color: '#6b7280' }}>🔍</span>
          <input
            type="text"
            placeholder="Search for area, Street name..."
            className="flex-1 px-3 py-3 text-base border-0 bg-transparent outline-none"
            style={{ color: '#999' }}
          />
        </div>

        {/* Interactive Map */}
        <div className="w-[90%] max-w-md rounded-2xl mb-4 overflow-hidden shadow-md flex-shrink-0" style={{ height: '450px', position: 'relative', zIndex: 1 }}>
          <InteractiveMap
            onLocationSelect={handleLocationSelect}
            height={450}
            width="100%"
            showCurrentLocation={true}
          />
        </div>

        {/* Location details */}
        <div className="w-[90%] max-w-md flex justify-between items-center mb-1 flex-shrink-0">
          <span className="text-[15px] font-medium" style={{ color: DARK }}>Your Current Location</span>
          <button
            onClick={() => {
              // Trigger current location on map
              const event = new CustomEvent('getCurrentLocation');
              window.dispatchEvent(event);
            }}
          >
            <span className="text-[15px] font-semibold" style={{ color: PRIMARY_YELLOW }}>CHANGE</span>
          </button>
        </div>

        {/* Address display with pin icon */}
        <div className="w-[90%] max-w-md flex items-start mb-5 px-1 flex-shrink-0">
          <span className="text-lg mr-2.5 mt-0.5 flex-shrink-0" style={{ color: '#ef4444' }}>📍</span>
          <p className="flex-1 text-[15px] leading-5" style={{ color: DARK }}>
            {selectedLocation?.address || 'Tap on the map to select your location'}
          </p>
        </div>

        <button
          onClick={() => setShowLocationModal(true)}
          className="w-[90%] max-w-md rounded-lg py-3.5 text-center font-bold text-base mb-6 flex-shrink-0"
          style={{ backgroundColor: PRIMARY_YELLOW, color: '#fff' }}
        >
          Add more address details
        </button>
      </div>

      {LocationDetailsModal}
    </div>
  );
}
