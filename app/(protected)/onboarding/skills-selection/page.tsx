'use client';

/**
 * Poster Location Page (Onboarding)
 * User sets location using GPS after choosing "Get Help"
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ChevronRight, MapPin, LocateFixed } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { profilesApi } from '@/lib/api/endpoints/profiles';
import { useUserStore } from '@/lib/state/userStore';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';

export default function SkillsSelectionPage() {
  const router = useRouter();
  const [locationInput, setLocationInput] = useState('');
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const patchUser = useUserStore((state) => state.patchUser);

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

      toast.success('Location detected', {
        description: fullAddress,
      });
    } catch (error) {
      console.error('GPS detection failed', error);
      toast.error('Unable to detect location', {
        description: 'Please allow location permission.',
      });
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleContinue = async () => {
    if (!locationInput.trim()) {
      toast.error('Please detect your location', {
        description: 'Use GPS detection to continue.',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await profilesApi.upsertProfile({
        roles: ['poster'],
      });

      patchUser({
        roles: ['poster'],
      });

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('pendingPosterLocationText', locationInput.trim());
      }

      toast.success('Location set successfully!', {
        description: 'Welcome to ExtraHand.',
      });

      setTimeout(() => {
        router.push('/home');
      }, 600);
    } catch (error) {
      console.error('Error saving location:', error);
      toast.error('Something went wrong', {
        description: 'Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-start px-4 md:px-6 py-8">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-5">
            <h1 className="text-2xl md:text-3xl font-bold" style={{ color: DARK }}>
              Set your location
            </h1>
            <p className="text-gray-600 text-sm mt-2">
              Detect your current location using GPS.
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

            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                value={locationInput}
                placeholder="Detected location will appear here"
                className="pl-10"
                readOnly
              />
            </div>
          </div>

          <Button
            onClick={handleContinue}
            disabled={!locationInput.trim() || isSubmitting}
            className="w-full h-12 text-base font-semibold"
            style={{
              backgroundColor: PRIMARY_YELLOW,
              color: DARK,
            }}
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
            {!isSubmitting && <ChevronRight className="w-5 h-5 ml-2" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
