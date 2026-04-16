/**
 * Analytics initialization handler integrated with consent system
 * Checks consent preferences before initializing Firebase Analytics
 */

import { Analytics, getAnalytics as firebaseGetAnalytics } from 'firebase/analytics';
import type { FirebaseApp } from 'firebase/app';
import { getConsentPreferences, CONSENT_CHANGE_EVENT } from '@/lib/consent/cookieConsent';

let analyticsInstance: Analytics | null = null;
let consentListenerRegistered = false;

function resolveFirebaseApp(providedApp?: FirebaseApp): FirebaseApp | null {
  if (providedApp) {
    return providedApp;
  }

  try {
    const { getApps } = require('firebase/app');
    const apps = getApps();
    return apps.length > 0 ? apps[0] : null;
  } catch {
    return null;
  }
}

function tryInitializeAnalytics(app?: FirebaseApp): void {
  if (analyticsInstance) {
    return;
  }

  const preferences = getConsentPreferences();
  if (!preferences?.analytics) {
    return;
  }

  const resolvedApp = resolveFirebaseApp(app);
  if (!resolvedApp) {
    console.warn('Firebase app not initialized yet');
    return;
  }

  analyticsInstance = firebaseGetAnalytics(resolvedApp);
  console.debug('Analytics initialized with user consent');
}

/**
 * Initialize Firebase Analytics only if current consent allows it
 * Integrates with the shared consent system
 */
export function initializeAnalyticsIfConsented(app?: FirebaseApp): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    tryInitializeAnalytics(app);
  } catch (error) {
    console.warn('Failed to initialize analytics:', error);
  }

  if (!consentListenerRegistered) {
    consentListenerRegistered = true;

    window.addEventListener(CONSENT_CHANGE_EVENT, () => {
      try {
        tryInitializeAnalytics();
        if (analyticsInstance) {
          console.debug('Analytics enabled after consent change');
        }
      } catch (error) {
        console.warn('Failed to initialize analytics after consent change:', error);
      }
    });
  }
}

export function getAnalytics(): Analytics | null {
  return analyticsInstance;
}
