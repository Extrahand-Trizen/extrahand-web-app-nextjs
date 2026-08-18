"use client";

/**
 * AnalyticsPageView
 *
 * Website page-view tracking for Mixpanel (mirrors the mobile app's
 * `Screen Viewed` tracking on every route change).
 *
 * Also owns the Mixpanel bootstrap: runs `initMixpanel()` on mount so the
 * SDK initializes on every page (not consent-gated, matching GA4 and the
 * mobile app).
 */

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initMixpanel, trackScreenViewed } from "@/lib/services/mixpanel";

export function AnalyticsPageView() {
   const pathname = usePathname();
   const searchParams = useSearchParams();

   useEffect(() => {
      if (typeof window === "undefined") return;

      initMixpanel();
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
