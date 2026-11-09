"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LandingHeader } from "@/components/layout/LandingHeader";
import {
   AppDownloadBanner,
   dismissAppDownloadBanner,
   isAppDownloadBannerDismissed,
} from "@/components/layout/AppDownloadBanner";

type WindowWithIdleCallback = Window & {
   requestIdleCallback?: (
      callback: () => void,
      options?: { timeout: number }
   ) => number;
   cancelIdleCallback?: (handle: number) => void;
};

/**
 * Always keep LandingHeader in document flow.
 * App download prompt is a fixed overlay (no spacer) so it cannot push
 * hero/CTA content and inflate CLS when it appears after idle.
 */
export function LandingTopBar() {
   const pathname = usePathname();

   return (
      <>
         <LandingHeader />
         <MobileAppBanner key={pathname} pathname={pathname} />
      </>
   );
}

function MobileAppBanner({ pathname }: { pathname: string }) {
   const [bannerDismissed, setBannerDismissed] = useState(
      isAppDownloadBannerDismissed
   );
   const [bannerReady, setBannerReady] = useState(false);

   useEffect(() => {
      if (bannerDismissed || isAppDownloadBannerDismissed()) return;

      if (pathname === "/") {
         const hero = document.getElementById("homepage-hero");
         if (hero) {
            const revealAfterHero = () => {
               if (hero.getBoundingClientRect().bottom <= 0) {
                  setBannerReady(true);
                  return true;
               }
               return false;
            };

            if (typeof window.IntersectionObserver === "function") {
               const observer = new IntersectionObserver(([entry]) => {
                  if (!entry.isIntersecting) {
                     setBannerReady(true);
                     observer.disconnect();
                  }
               });
               observer.observe(hero);
               return () => observer.disconnect();
            }

            const handleScroll = () => {
               if (revealAfterHero()) {
                  window.removeEventListener("scroll", handleScroll);
               }
            };
            window.addEventListener("scroll", handleScroll, { passive: true });
            const frameId = window.requestAnimationFrame(handleScroll);
            return () => {
               window.cancelAnimationFrame(frameId);
               window.removeEventListener("scroll", handleScroll);
            };
         }
      }

      const revealBanner = () => setBannerReady(true);
      const win = window as WindowWithIdleCallback;
      if (win.requestIdleCallback) {
         const id = win.requestIdleCallback(revealBanner, { timeout: 4000 });
         return () => win.cancelIdleCallback?.(id);
      }
      const timeoutId = window.setTimeout(revealBanner, 3000);
      return () => window.clearTimeout(timeoutId);
   }, [bannerDismissed, pathname]);

   const handleDismiss = () => {
      dismissAppDownloadBanner();
      setBannerDismissed(true);
   };

   const showMobileBanner = bannerReady && !bannerDismissed;

   if (!showMobileBanner) return null;
   return (
      <div className="md:hidden">
         <AppDownloadBanner onDismiss={handleDismiss} />
      </div>
   );
}
