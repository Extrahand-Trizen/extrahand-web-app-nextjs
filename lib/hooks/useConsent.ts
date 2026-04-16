import { useEffect, useState, useCallback } from 'react';

/**
 * Cookie Consent Categories
 */
export interface CookieConsent {
  essential: boolean; // Always true - required for functionality
  analytics: boolean; // Firebase Analytics tracking
  maps: boolean; // Google Maps integration
  timestamp: number;
  version: string; // Consent version for re-prompting on updates
}

const CONSENT_STORAGE_KEY = 'extrahand_cookie_consent';
const CONSENT_ANSWERED_KEY = 'extrahand_consent_answered';
const CONSENT_VERSION = '1.0.0';

/**
 * Hook for managing cookie consent state and localStorage persistence
 * Handles first-visit detection and consent choice storage
 */
export function useConsent() {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load consent from localStorage on mount
  useEffect(() => {
    const loadConsent = () => {
      try {
        // Check if user has answered consent before
        const hasAnswered = localStorage.getItem(CONSENT_ANSWERED_KEY) === 'true';
        
        if (!hasAnswered) {
          setIsFirstVisit(true);
          setConsent({
            essential: true,
            analytics: false,
            maps: false,
            timestamp: Date.now(),
            version: CONSENT_VERSION,
          });
        } else {
          setIsFirstVisit(false);
          // Load saved consent
          const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
          if (saved) {
            const parsed = JSON.parse(saved) as CookieConsent;
            // Check if version changed - if so, re-prompt
            if (parsed.version !== CONSENT_VERSION) {
              setIsFirstVisit(true);
              setConsent({
                essential: true,
                analytics: false,
                maps: false,
                timestamp: Date.now(),
                version: CONSENT_VERSION,
              });
            } else {
              setConsent(parsed);
            }
          } else {
            // Fallback - shouldn't happen if hasAnswered is true
            setConsent({
              essential: true,
              analytics: false,
              maps: false,
              timestamp: Date.now(),
              version: CONSENT_VERSION,
            });
          }
        }
      } catch (error) {
        console.error('Failed to load consent from localStorage:', error);
        // Fallback to default deny
        setConsent({
          essential: true,
          analytics: false,
          maps: false,
          timestamp: Date.now(),
          version: CONSENT_VERSION,
        });
      }
      setIsLoading(false);
    };

    loadConsent();
  }, []);

  /**
   * Save consent choice to localStorage and update state
   */
  const saveConsent = useCallback((newConsent: Omit<CookieConsent, 'timestamp' | 'version'>) => {
    const consentData: CookieConsent = {
      ...newConsent,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
    
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentData));
      localStorage.setItem(CONSENT_ANSWERED_KEY, 'true');
      setConsent(consentData);
      setIsFirstVisit(false);
      
      // Dispatch custom event for other components to listen to
      window.dispatchEvent(
        new CustomEvent('consentChanged', { detail: consentData })
      );
    } catch (error) {
      console.error('Failed to save consent to localStorage:', error);
    }
  }, []);

  /**
   * Accept all non-essential cookies
   */
  const acceptAll = useCallback(() => {
    saveConsent({
      essential: true,
      analytics: true,
      maps: true,
    });
  }, [saveConsent]);

  /**
   * Reject all non-essential cookies
   */
  const rejectNonEssential = useCallback(() => {
    saveConsent({
      essential: true,
      analytics: false,
      maps: false,
    });
  }, [saveConsent]);

  /**
   * Update specific consent category
   */
  const updateConsent = useCallback((category: keyof Omit<CookieConsent, 'timestamp' | 'version'>, value: boolean) => {
    if (consent) {
      saveConsent({
        essential: consent.essential,
        analytics: category === 'analytics' ? value : consent.analytics,
        maps: category === 'maps' ? value : consent.maps,
      });
    }
  }, [consent, saveConsent]);

  return {
    consent,
    isFirstVisit,
    isLoading,
    acceptAll,
    rejectNonEssential,
    updateConsent,
    saveConsent,
  };
}
