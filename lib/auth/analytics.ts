/**
 * Analytics initialization with consent gating
 * Delays Firebase Analytics initialization until user consents
 * Listens for consent changes to initialize/disable tracking
 */

import { Analytics, getAnalytics as firebaseGetAnalytics } from 'firebase/analytics';
import type { FirebaseApp } from 'firebase/app';
import { CONSENT_STORAGE_KEY } from '@/lib/hooks/useConsent';

let analyticsInstance: Analytics | null = null;
let initialized = false;

/**
 * Initialize analytics only if consent is given
 * Should be called after Firebase app is initialized
 */
export function initializeAnalyticsWithConsent(app: FirebaseApp): void {
  if (typeof window === 'undefined' || initialized) {
    return;
  }

  try {
    // Check if user has given consent for analytics
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
    
    if (consent) {
      const consentData = JSON.parse(consent);
      if (consentData.analytics === true) {
        analyticsInstance = firebaseGetAnalytics(app);
        console.debug('Analytics initialized with user consent');
      }
    }
    // If no consent saved yet, don't initialize - wait for banner
    
    initialized = true;
  } catch (error) {
    console.warn('Failed to initialize analytics:', error);
    initialized = true;
  }

  // Listen for consent changes
  window.addEventListener('consentChanged', (event: Event) => {
    const customEvent = event as CustomEvent;
    const newConsent = customEvent.detail;
    
    if (newConsent.analytics === true && !analyticsInstance) {
      try {
        analyticsInstance = firebaseGetAnalytics(app);
        console.debug('Analytics enabled after consent');
      } catch (error) {
        console.warn('Failed to initialize analytics after consent:', error);
      }
    }
  });
}

export function getAnalytics(): Analytics | null {
  return analyticsInstance;
}
