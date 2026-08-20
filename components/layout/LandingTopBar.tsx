"use client";

import { useEffect, useState } from "react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import {
   AppDownloadBanner,
   dismissAppDownloadBanner,
   isAppDownloadBannerDismissed,
} from "@/components/layout/AppDownloadBanner";

export function LandingTopBar() {
   const [bannerDismissed, setBannerDismissed] = useState(true);
   const [bannerReady, setBannerReady] = useState(false);

   useEffect(() => {
      const dismissed = isAppDownloadBannerDismissed();
      setBannerDismissed(dismissed);
      if (dismissed) return;

      const revealBanner = () => setBannerReady(true);
      if ("requestIdleCallback" in window) {
         const id = window.requestIdleCallback(revealBanner, { timeout: 4000 });
         return () => window.cancelIdleCallback(id);
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
         <div className="md:hidden">
            {showMobileBanner ? (
               <AppDownloadBanner onDismiss={handleDismiss} />
            ) : (
               <LandingHeader />
            )}
         </div>
         <div className="hidden md:block">
            <LandingHeader />
         </div>
      </>
   );
}
