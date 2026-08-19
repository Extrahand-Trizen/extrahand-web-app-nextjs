"use client";

/**
 * AnalyticsPageView
 *
 * Website page-view tracking for Mixpanel (mirrors the mobile app's
 * `Screen Viewed` tracking on every route change).
 *
 * Mixpanel is loaded after idle so it does not compete with first paint.
 */

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function runWhenIdle(callback: () => void) {
   if (typeof window === "undefined") return () => {};

   if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(callback, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
   }

   const timeoutId = window.setTimeout(callback, 2000);
   return () => window.clearTimeout(timeoutId);
}

export function AnalyticsPageView() {
   const pathname = usePathname();
   const searchParams = useSearchParams();

   useEffect(() => {
      return runWhenIdle(() => {
         void import("@/lib/services/mixpanel").then(({ initMixpanel }) => {
            initMixpanel();
         });
      });
   }, []);

   useEffect(() => {
      const query = searchParams.toString();
      const screenName = query ? `${pathname}?${query}` : pathname;

      return runWhenIdle(() => {
         void import("@/lib/services/mixpanel").then(({ trackScreenViewed }) => {
            trackScreenViewed(screenName);
         });
      });
   }, [pathname, searchParams]);

   return null;
}
