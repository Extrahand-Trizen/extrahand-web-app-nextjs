/**
 * Hook for managing Google Maps API key with consent gating
 * Integrates with shared consent system
 */

import { useEffect, useState } from 'react';
import { getConsentPreferences, hasConsentFor, CONSENT_CHANGE_EVENT } from '@/lib/consent/cookieConsent';

export function useMapsApiKey() {
  const [mapsApiKey, setMapsApiKey] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [mapsConsentBlocked, setMapsConsentBlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check initial consent state and fetch if allowed
  useEffect(() => {
    const preferences = getConsentPreferences();
    
    if (preferences !== null) {
      // Consent decision has been made
      if (preferences.maps === false) {
        setMapsConsentBlocked(true);
        setMapsApiKey(null);
      } else if (preferences.maps === true) {
        // Fetch API key if consent is given
        fetchApiKey();
      }
    }
    // If preferences is null (first visit), don't set blocked - let it load
    setIsLoading(false);
  }, []);

  const fetchApiKey = async () => {
    // Check consent before fetching
    if (!hasConsentFor('maps')) {
      setMapsConsentBlocked(true);
      setMapsApiKey(null);
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch('/api/maps/key');
      const data = await response.json();
      if (data.apiKey) {
        setMapsApiKey(data.apiKey);
        setMapsConsentBlocked(false);
      } else if (data.error) {
        console.warn('Maps API key not available:', data.error);
      }
    } catch (error) {
      console.error('Failed to fetch maps API key:', error);
    } finally {
      setIsFetching(false);
    }
  };

  // Listen for consent changes
  useEffect(() => {
    const handleConsentChange = () => {
      const preferences = getConsentPreferences();
      
      if (preferences?.maps === true) {
        setMapsConsentBlocked(false);
        if (!mapsApiKey) {
          fetchApiKey();
        }
      } else if (preferences?.maps === false) {
        setMapsConsentBlocked(true);
        setMapsApiKey(null);
      }
    };

    window.addEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
  }, [mapsApiKey]);

  return {
    mapsApiKey,
    fetchApiKey,
    isFetching,
    mapsConsentBlocked,
    consentLoading: isLoading,
  };
}
