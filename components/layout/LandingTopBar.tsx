"use client";

import { useEffect, useState } from "react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import {
   AppDownloadBanner,
   dismissAppDownloadBanner,
   isAppDownloadBannerDismissed,
} from "@/components/layout/AppDownloadBanner";

/**
 * Always keep LandingHeader in document flow.
 * App download prompt is a fixed overlay (no spacer) so it cannot push
 * hero/CTA content and inflate CLS when it appears after idle.
 */
export function LandingTopBar() {
   const [bannerDismissed, setBannerDismissed] = useState(true);
   const [bannerReady, setBannerReady] = useState(false);

   useEffect(() => {
      const dismissed = isAppDownloadBannerDismissed();
      setBannerDismissed(dismissed);
      if (dismissed) return;

      const revealBanner = () => setBannerReady(true);
      const win = typeof window !== "undefined" ? (window as any) : null;
      if (win && typeof win.requestIdleCallback === "function") {
         const id = win.requestIdleCallback(revealBanner, { timeout: 4000 });
         return () => win.cancelIdleCallback(id);
      }
      const timeoutId = window.setTimeout(revealBanner, 3000);
      return () => window.clearTimeout(timeoutId);
   }, []);

   const handleDismiss = () => {
      dismissAppDownloadBanner();
      setBannerDismissed(true);
   };

   const showMobileBanner = bannerReady && !bannerDismissed;

   return (
      <>
         <LandingHeader />
         {showMobileBanner ? (
            <div className="md:hidden">
               <AppDownloadBanner onDismiss={handleDismiss} />
            </div>
         ) : null}
      </>
   );
}
