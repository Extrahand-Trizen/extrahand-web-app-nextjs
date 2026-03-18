'use client';

/**
 * Skills Selection Page (Onboarding)
 * User selects their skills/services after choosing "Earn money" goal
 * Shows categories that match tasker role
 * Appears after location confirmation
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin, LocateFixed } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { profilesApi } from '@/lib/api/endpoints/profiles';
import { useUserStore } from '@/lib/state/userStore';
import { postTaskCategories } from '@/lib/data/categories';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';

const HYDERABAD_LOCATION_SUGGESTIONS = [
  'Madhapur, Hyderabad',
  'Kondapur, Hyderabad',
  'Gachibowli, Hyderabad',
  'Hitech City, Hyderabad',
  'Kukatpally, Hyderabad',
  'Miyapur, Hyderabad',
  'Jubilee Hills, Hyderabad',
  'Banjara Hills, Hyderabad',
  'Begumpet, Hyderabad',
  'Ameerpet, Hyderabad',
  'Secunderabad, Hyderabad',
  'Uppal, Hyderabad',
  'LB Nagar, Hyderabad',
  'Manikonda, Hyderabad',
  'Nallagandla, Hyderabad',
];

export default function SkillsSelectionPage() {
  const router = useRouter();
  const categories = postTaskCategories;
  const [locationInput, setLocationInput] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const patchUser = useUserStore((state) => state.patchUser);

  const filteredLocations = HYDERABAD_LOCATION_SUGGESTIONS.filter((item) =>
    item.toLowerCase().includes(locationInput.trim().toLowerCase())
  ).slice(0, 6);

  const resolveCoordinatesToAddress = async (
    latitude: number,
    longitude: number
  ): Promise<string> => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!res.ok) {
        throw new Error('Reverse geocoding failed');
      }

      const data = await res.json();
      const fullAddress = (data?.display_name || '').trim();
      if (fullAddress) return fullAddress;

      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    } catch {
      return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
    }
  };

  const handleDetectCurrentLocation = async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      toast.error('GPS not supported', {
        description: 'Your browser does not support GPS location.',
      });
      return;
    }

    setDetectingLocation(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 12000,
          maximumAge: 0,
        });
      });

      const { latitude, longitude } = position.coords;
      const fullAddress = await resolveCoordinatesToAddress(latitude, longitude);
      setLocationInput(fullAddress);
      setShowSuggestions(false);

      toast.success('Location detected', {
        description: fullAddress,
      });
    } catch (error) {
      console.error('GPS detection failed', error);
      toast.error('Unable to detect location', {
        description: 'Please allow location permission or type area and city manually.',
      });
    } finally {
      setDetectingLocation(false);
    }
  };

  const toggleSkill = (categorySlug: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(categorySlug)) {
        return prev.filter((s) => s !== categorySlug);
      } else {
        return [...prev, categorySlug];
      }
    });
  };

  const handleContinue = async () => {
    if (!locationInput.trim()) {
      toast.error('Please enter your location', {
        description: 'Type your area and choose a location from suggestions.',
      });
      return;
    }

    if (selectedSkills.length === 0) {
      toast.error('Please select at least one skill', {
        description: 'Choose the skills you want to offer on ExtraHand.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Save selected skills and role to user profile
      const skillsList = selectedSkills.map((slug) => {
        const category = categories.find((c) => c.id === slug);
        return {
          name: category?.label || slug,
          category: slug,
        };
      });

      await profilesApi.upsertProfile({
        roles: ['tasker'],
        skills: {
          list: skillsList,
        },
      });

      // Update local store with tasker role
      patchUser({
        roles: ['tasker'],
      });

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pendingTaskerLocationText', locationInput.trim());
      }

      toast.success('Profile setup complete!', {
        description: 'Welcome to ExtraHand. Let\'s get you earning!',
      });

      // Redirect to home
      setTimeout(() => {
        router.push('/home');
      }, 800);
    } catch (error) {
      console.error('Error saving skills:', error);
      toast.error('Something went wrong', {
        description: 'Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 md:px-6 py-8">
        <div className="w-full max-w-3xl">
          {/* Heading */}
          <div className="text-center mb-5">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: DARK }}>
              Select your skills
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              Enter your location and choose the services you want to offer.
            </p>
          </div>

          <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
            <div className="mb-3 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <MapPin className="h-5 w-5" />
              </div>
            </div>

            <p className="mb-2 text-sm font-medium text-gray-900">Your location *</p>

            <Button
              type="button"
              variant="outline"
              className="mb-3 w-full"
              onClick={handleDetectCurrentLocation}
              disabled={detectingLocation || isSubmitting}
            >
              {detectingLocation ? (
                'Detecting current location...'
              ) : (
                <>
                  <LocateFixed className="mr-2 h-4 w-4" />
                  Detect current location using GPS
                </>
              )}
            </Button>

            <p className="mb-2 text-xs text-gray-500">or type area and city</p>

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                value={locationInput}
                placeholder="Type area/city, e.g. Madh"
                className="pl-10"
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                onChange={(e) => {
                  setLocationInput(e.target.value);
                  setShowSuggestions(true);
                }}
              />

              {showSuggestions && locationInput.trim().length > 0 && filteredLocations.length > 0 && (
                <div className="absolute z-20 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
                  {filteredLocations.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="block w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setLocationInput(item);
                        setShowSuggestions(false);
                      }}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Categories */}
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No categories available</p>
            </div>
          ) : (
            <>
              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleSkill(category.id || '')}
                    className={`relative p-3 md:p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedSkills.includes(category.id || '')
                        ? 'border-yellow-400 bg-yellow-50 shadow-lg shadow-yellow-100'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                    }`}
                    disabled={isSubmitting}
                  >
                    {/* Checkmark for selected state */}
                    {selectedSkills.includes(category.id || '') && (
                      <div className="absolute top-3 right-3">
                        <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Category Name */}
                    <h3 className="font-semibold text-gray-900 text-sm leading-5">
                      {category.label}
                    </h3>
                  </button>
                ))}
              </div>

              {/* Selected Count Info */}
              <div className="text-center mb-6">
                <p className="text-sm text-gray-600">
                  {selectedSkills.length === 0
                    ? 'Select at least one skill to continue'
                    : `You've selected ${selectedSkills.length} skill${selectedSkills.length !== 1 ? 's' : ''}`}
                </p>
              </div>

              {/* Continue Button */}
              <Button
                onClick={handleContinue}
                disabled={!locationInput.trim() || selectedSkills.length === 0 || isSubmitting}
                className="w-full h-12 text-base font-semibold"
                style={{
                  backgroundColor: PRIMARY_YELLOW,
                  color: DARK,
                }}
                onMouseEnter={(e) => {
                  if (!(selectedSkills.length === 0 || isSubmitting)) {
                    (e.target as HTMLButtonElement).style.backgroundColor =
                      '#f5a200';
                  }
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    PRIMARY_YELLOW;
                }}
              >
                {isSubmitting ? 'Setting up...' : 'Continue'}
                {!isSubmitting && <ChevronRight className="w-5 h-5 ml-2" />}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
