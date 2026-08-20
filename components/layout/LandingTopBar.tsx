"use client";

import { useEffect, useState } from "react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import {
   AppDownloadBanner,
   dismissAppDownloadBanner,
   isAppDownloadBannerDismissed,
} from "@/components/layout/AppDownloadBanner";

export function LandingTopBar() {
   const [bannerDismissed, setBannerDismissed] = useState(false);

   useEffect(() => {
      setBannerDismissed(isAppDownloadBannerDismissed());
   }, []);

   const handleDismiss = () => {
      dismissAppDownloadBanner();
      setBannerDismissed(true);
   };

   return (
      <>
         <div className="md:hidden">
            {bannerDismissed ? (
               <LandingHeader />
            ) : (
               <AppDownloadBanner onDismiss={handleDismiss} />
            )}
         </div>
         <div className="hidden md:block">
            <LandingHeader />
         </div>
      </>
   );
}
