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
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { profilesApi } from '@/lib/api/endpoints/profiles';
import { useUserStore } from '@/lib/state/userStore';
import { postTaskCategories } from '@/lib/data/categories';

const PRIMARY_YELLOW = '#f9b233';
const DARK = '#222';

export default function SkillsSelectionPage() {
  const router = useRouter();
  const categories = postTaskCategories;
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const patchUser = useUserStore((state) => state.patchUser);

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

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50 flex flex-col">
      {/* Header with Back Button */}
      <div className="px-4 md:px-6 py-4 border-b border-gray-200">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 md:px-6 py-8">
        <div className="w-full max-w-3xl">
          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold" style={{ color: DARK }}>
              Select your skills
            </h1>
            <p className="text-gray-600 text-base mt-2">
              Choose the services you want to offer. You can add more later.
            </p>
          </div>

          {/* Categories */}
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No categories available</p>
            </div>
          ) : (
            <>
              {/* Categories Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleSkill(category.id || '')}
                    className={`relative p-4 md:p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
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
                    <h3 className="font-semibold text-gray-900 text-sm md:text-base">
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
                disabled={selectedSkills.length === 0 || isSubmitting}
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

              {/* Info Text */}
              <p className="text-center text-xs text-gray-500 mt-6">
                You can update your skills anytime from your profile settings
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
