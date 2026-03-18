'use client';

/**
 * Goal Selection Page
 * User selects their main goal on ExtraHand: "Get things done" or "Earn money"
 * Shows immediately after OTP verification
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { profilesApi } from '@/lib/api/endpoints/profiles';
import { useUserStore } from '@/lib/state/userStore';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';

export default function GoalSelectionPage() {
  const router = useRouter();
  const [selectedGoal, setSelectedGoal] = useState<'get' | 'earn' | ''>('');
  const [isLoading, setIsLoading] = useState(false);
  const patchUser = useUserStore((state) => state.patchUser);

  const handleContinue = async () => {
    if (!selectedGoal) {
      toast.error('Please select an option', {
        description: 'Choose either "Get things done" or "Earn money" to continue.',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (selectedGoal === 'get') {
        // Path 1: Get things done → Set role to "poster" → Go to home
        await profilesApi.upsertProfile({
          roles: ['poster'],
        });
        
        // Update local store
        patchUser({ roles: ['poster'] });

        toast.success('Welcome! You\'re all set up as a Poster.', {
          description: 'Ready to post tasks and get help.',
        });

        router.push('/home');
      } else if (selectedGoal === 'earn') {
        // Path 2: Earn money → Save goal → Ask for location
        // Store selected goal in sessionStorage to know user wants tasker role
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('selectedGoal', 'earn');
        }

        // Navigate to location selection
        router.push('/onboarding/choose-location-method');
      }
    } catch (error) {
      console.error('Error in goal selection:', error);
      toast.error('Something went wrong', {
        description: 'Please try again.',
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24">
            <Image
              src="/assets/images/goal-selection-icon.png"
              alt="Select your goal"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: DARK }}>
            What is your main goal on ExtraHand?
          </h1>
          <p className="text-gray-600 text-base mt-2">
            Choose what you&apos;d like to do on our platform
          </p>
        </div>

        {/* Options Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          {/* Get Things Done Option */}
          <button
            onClick={() => setSelectedGoal('get')}
            className={`relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-200 text-left ${
              selectedGoal === 'get'
                ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-100'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
            disabled={isLoading}
          >
            {/* Checkmark for selected state */}
            {selectedGoal === 'get' && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
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

            {/* Icon */}
            <div className="w-12 h-12 mb-4 text-2xl">✓</div>

            {/* Text */}
            <h2 className="text-xl md:text-2xl font-bold" style={{ color: DARK }}>
              Get things done
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-2">
              Post tasks and hire skilled professionals to help you get things done
            </p>

            {/* Role Badge */}
            <div className="mt-4 inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
              Role: Poster
            </div>
          </button>

          {/* Earn Money Option */}
          <button
            onClick={() => setSelectedGoal('earn')}
            className={`relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-200 text-left ${
              selectedGoal === 'earn'
                ? 'border-green-500 bg-green-50 shadow-lg shadow-green-100'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
            }`}
            disabled={isLoading}
          >
            {/* Checkmark for selected state */}
            {selectedGoal === 'earn' && (
              <div className="absolute top-4 right-4">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
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

            {/* Icon */}
            <div className="w-12 h-12 mb-4 text-3xl">₹</div>

            {/* Text */}
            <h2 className="text-xl md:text-2xl font-bold" style={{ color: DARK }}>
              Earn money
            </h2>
            <p className="text-gray-600 text-sm md:text-base mt-2">
              Offer your services and skills to earn money by helping others
            </p>

            {/* Role Badge */}
            <div className="mt-4 inline-block px-3 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700">
              Role: Tasker
            </div>
          </button>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          disabled={!selectedGoal || isLoading}
          className="w-full h-12 text-base font-semibold"
          style={{
            backgroundColor: PRIMARY_YELLOW,
            color: DARK,
          }}
          onMouseEnter={(e) => {
            if (!(!selectedGoal || isLoading)) {
              (e.target as HTMLButtonElement).style.backgroundColor = '#f5a200';
            }
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLButtonElement).style.backgroundColor = PRIMARY_YELLOW;
          }}
        >
          {isLoading ? 'Loading...' : 'Continue'}
          {!isLoading && <ChevronRight className="w-5 h-5 ml-2" />}
        </Button>

        {/* Info Text */}
        <p className="text-center text-xs text-gray-500 mt-6">
          You can switch between roles anytime from your profile settings
        </p>
      </div>
    </div>
  );
}
