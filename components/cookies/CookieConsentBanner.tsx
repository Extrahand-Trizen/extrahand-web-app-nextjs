'use client';

import React, { useState } from 'react';
import { useConsent } from '@/lib/hooks/useConsent';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Cookie Consent Banner Component
 * Displays on first visit and prompts user for consent choices
 * Manages Firebase Analytics and Google Maps consent
 */
export function CookieConsentBanner() {
  const { isFirstVisit, isLoading, acceptAll, rejectNonEssential, updateConsent, consent } = useConsent();
  const [showDetails, setShowDetails] = useState(false);
  const [localAnalytics, setLocalAnalytics] = useState(true);
  const [localMaps, setLocalMaps] = useState(true);

  // Don't render on server or if already answered
  if (isLoading || !isFirstVisit || !consent) {
    return null;
  }

  const handleSavePreferences = () => {
    updateConsent('analytics', localAnalytics);
    updateConsent('maps', localMaps);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl max-h-[90vh] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900">Cookie & Consent Preferences</h2>
            <p className="mt-2 text-sm text-gray-600">
              We use cookies and similar technologies to enhance your browsing experience and understand how you use our platform. 
              Please review your preferences below.
            </p>
          </div>
          <button
            onClick={rejectNonEssential}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Details Toggle */}
        <div className="mt-6">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            {showDetails ? (
              <>
                <ChevronUp className="h-4 w-4" />
                Hide Details
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                Show Details
              </>
            )}
          </button>

          {/* Detailed Preferences */}
          {showDetails && (
            <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg">
              {/* Essential Cookies */}
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">Essential Cookies (Required)</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Necessary for basic functionality and security. Cannot be disabled.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={true}
                    disabled
                    className="h-4 w-4 text-blue-600 rounded cursor-not-allowed"
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Analytics Cookies */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Analytics & Performance</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Helps us understand how you use our platform to improve performance and features. 
                      We use Firebase Analytics for this purpose.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localAnalytics}
                    onChange={(e) => setLocalAnalytics(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* Maps Cookies */}
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">Maps & Location Services</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Enables location-based features like task maps and location selection. 
                      Uses Google Maps which may set cookies for functionality.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localMaps}
                    onChange={(e) => setLocalMaps(e.target.checked)}
                    className="h-4 w-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Policy Links */}
        <div className="mt-4 flex gap-4 text-xs text-gray-500">
          <Link href="/privacy-policy" className="hover:text-gray-700 underline">
            Privacy Policy
          </Link>
          <span>•</span>
          <Link href="/cookie-policy" className="hover:text-gray-700 underline">
            Cookie Policy
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={rejectNonEssential}
            variant="outline"
            className="flex-1"
          >
            Reject Non-Essential
          </Button>
          {showDetails && (
            <Button
              onClick={handleSavePreferences}
              variant="outline"
              className="flex-1"
            >
              Save Preferences
            </Button>
          )}
          <Button
            onClick={acceptAll}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
