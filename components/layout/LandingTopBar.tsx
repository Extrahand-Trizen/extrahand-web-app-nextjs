"use client";

import { useEffect, useState } from "react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import {
   AppDownloadBanner,
   dismissAppDownloadBanner,
   isAppDownloadBannerDismissed,
} from "@/components/layout/AppDownloadBanner";

export function LandingTopBar() {
   const [showBanner, setShowBanner] = useState(true);

   useEffect(() => {
      setShowBanner(!isAppDownloadBannerDismissed());
   }, []);

   const handleDismiss = () => {
      dismissAppDownloadBanner();
      setShowBanner(false);
   };

   if (showBanner) {
      return <AppDownloadBanner onDismiss={handleDismiss} />;
   }

   return <LandingHeader />;
}
