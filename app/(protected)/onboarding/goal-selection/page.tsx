'use client';

/**
 * Goal Selection Page
 * User selects their main goal on ExtraHand: "Get things done" or "Earn money"
 * Shows immediately after OTP verification
 */

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
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
        description: 'Choose either "Get Help" or "Earn Money" to continue.',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Both goals should complete location step first.
      // Save only role here, then location page persists location + role together.
      const selectedRole = selectedGoal === 'earn' ? 'tasker' : 'poster';
      await profilesApi.upsertProfile({
        roles: [selectedRole],
      });

      patchUser({ roles: [selectedRole] });
      router.push(`/onboarding/skills-selection?goal=${selectedGoal}`);
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
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold" style={{ color: DARK }}>
            What is your main goal on ExtraHand?
          </h1>
          <p className="text-gray-600 text-base mt-2">
            Choose what you&apos;d like to do on our platform
          </p>
        </div>

        {/* Options Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-5">
          {/* Get Things Done Option */}
          <button
            onClick={() => setSelectedGoal('get')}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left min-h-[150px] flex flex-col ${
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
            <div className="w-8 h-8 mb-2 text-xl">✓</div>

            {/* Text */}
            <h2 className="text-xl font-bold mt-1" style={{ color: DARK }}>
              Get Help
            </h2>
            <p className="text-gray-600 text-sm mt-1.5 leading-6">
              Post tasks and hire skilled professionals to help you get things done
            </p>
          </button>

          {/* Earn Money Option */}
          <button
            onClick={() => setSelectedGoal('earn')}
            className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left min-h-[150px] flex flex-col ${
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
            <div className="w-8 h-8 mb-2 text-2xl">₹</div>

            {/* Text */}
            <h2 className="text-xl font-bold mt-1" style={{ color: DARK }}>
              Earn Money
            </h2>
            <p className="text-gray-600 text-sm mt-1.5 leading-6">
              Offer your services and skills to earn money by helping others
            </p>
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
      </div>
    </div>
  );
}
