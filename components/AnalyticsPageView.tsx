"use client";

/**
 * Mixpanel page-view tracking — only on conversion/app routes after consent.
 * SEO marketing landings skip the Mixpanel bundle entirely.
 */

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
   CONSENT_CHANGE_EVENT,
   getConsentPreferences,
} from "@/lib/consent/cookieConsent";
import {
   getMixpanelIdleTimeoutMs,
   scheduleWhenIdle,
   shouldLoadMixpanel,
} from "@/lib/thirdParty/scriptPolicy";

export function AnalyticsPageView() {
   const pathname = usePathname();
   const searchParams = useSearchParams();

   useEffect(() => {
      if (!shouldLoadMixpanel(pathname)) return;
      if (!getConsentPreferences()?.analytics) {
         const onConsent = () => {
            if (!getConsentPreferences()?.analytics) return;
            if (!shouldLoadMixpanel(pathname)) return;
            scheduleWhenIdle(() => {
               void import("@/lib/services/mixpanel").then(({ initMixpanel }) => {
                  initMixpanel();
               });
            }, getMixpanelIdleTimeoutMs(pathname));
         };
         window.addEventListener(CONSENT_CHANGE_EVENT, onConsent);
         return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onConsent);
      }

      return scheduleWhenIdle(() => {
         void import("@/lib/services/mixpanel").then(({ initMixpanel }) => {
            initMixpanel();
         });
      }, getMixpanelIdleTimeoutMs(pathname));
   }, [pathname]);

   useEffect(() => {
      if (!shouldLoadMixpanel(pathname)) return;
      if (!getConsentPreferences()?.analytics) return;

      const query = searchParams.toString();
      const screenName = query ? `${pathname}?${query}` : pathname;

      return scheduleWhenIdle(() => {
         void import("@/lib/services/mixpanel").then(({ trackScreenViewed }) => {
            trackScreenViewed(screenName);
         });
      }, getMixpanelIdleTimeoutMs(pathname));
   }, [pathname, searchParams]);

   return null;
}
