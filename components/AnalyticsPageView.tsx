"use client";

/**
 * AnalyticsPageView
 *
 * Website page-view tracking for Mixpanel (mirrors the mobile app's
 * `Screen Viewed` tracking on every route change).
 *
 * Also owns the consent-aware Mixpanel bootstrap:
 *   - runs `initMixpanel()` on mount (no-op without analytics consent)
 *   - re-runs it whenever the user's consent preferences change
 *   - this mirrors `initializeAnalyticsIfConsented()` from firebase-analytics
 */

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initMixpanel, trackScreenViewed } from "@/lib/services/mixpanel";
import { CONSENT_CHANGE_EVENT } from "@/lib/consent/cookieConsent";

let consentListenerRegistered = false;

export function AnalyticsPageView() {
   const pathname = usePathname();
   const searchParams = useSearchParams();

   // Init on mount and whenever consent changes (consent-gated inside initMixpanel)
   useEffect(() => {
      if (typeof window === "undefined") return;

      initMixpanel();

      if (!consentListenerRegistered) {
         consentListenerRegistered = true;
         window.addEventListener(CONSENT_CHANGE_EVENT, () => {
            initMixpanel();
         });
      }
   }, []);

   // Fire Screen Viewed on every route change (initial mount + client nav)
   useEffect(() => {
      if (typeof window === "undefined") return;

      const query = searchParams.toString();
      const screenName = query ? `${pathname}?${query}` : pathname;
      trackScreenViewed(screenName);
   }, [pathname, searchParams]);

   return null;
}