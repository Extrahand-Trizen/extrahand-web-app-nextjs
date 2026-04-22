"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ShieldCheck, Cookie, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   CONSENT_CHANGE_EVENT,
   OPEN_CONSENT_PREFERENCES_EVENT,
   getConsentPreferences,
   hasConsentDecision,
   saveConsentPreferences,
} from "@/lib/consent/cookieConsent";
import { initializeAnalyticsIfConsented } from "@/lib/auth/firebase";

const CONSENT_BANNER_PATHS = new Set(["/", "/home"]);

export default function CookieConsentBanner() {
   const pathname = usePathname();
   const router = useRouter();
   const [isVisible, setIsVisible] = useState(false);

   const canShow = useMemo(() => CONSENT_BANNER_PATHS.has(pathname), [pathname]);

   const syncFromStoredConsent = () => {
      const preferences = getConsentPreferences();
      if (!preferences) {
         setIsVisible(canShow);
         return;
      }

      setIsVisible(false);

      if (preferences.analytics) {
         void initializeAnalyticsIfConsented();
      }
   };

   useEffect(() => {
      syncFromStoredConsent();

      const handleConsentChange = () => syncFromStoredConsent();
      const handleStorage = () => syncFromStoredConsent();
      const handleOpenPreferences = () => {
         router.push("/cookie-policy#manage-preferences");
      };

      window.addEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
      window.addEventListener("storage", handleStorage);
      window.addEventListener(OPEN_CONSENT_PREFERENCES_EVENT, handleOpenPreferences);

      return () => {
         window.removeEventListener(CONSENT_CHANGE_EVENT, handleConsentChange);
         window.removeEventListener("storage", handleStorage);
         window.removeEventListener(OPEN_CONSENT_PREFERENCES_EVENT, handleOpenPreferences);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [canShow]);

   useEffect(() => {
      if (!CONSENT_BANNER_PATHS.has(pathname)) {
         setIsVisible(false);
      }
   }, [pathname]);

   const handleAcceptAll = () => {
      saveConsentPreferences({ analytics: true, maps: true });
      void initializeAnalyticsIfConsented();
      setIsVisible(false);
   };

   const handleRejectNonEssential = () => {
      saveConsentPreferences({ analytics: false, maps: false });
      setIsVisible(false);
   };

   if (!canShow || (!isVisible && hasConsentDecision())) {
      return null;
   }

   if (!isVisible) {
      return null;
   }

   return (
      <>
         {isVisible && (
            <div className="fixed inset-x-2 bottom-2 z-120 max-h-[85vh] sm:inset-x-auto sm:bottom-4 sm:right-4 sm:w-[calc(100%-2rem)] sm:max-w-[640px]">
               <div className="overflow-hidden overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5">
                  <div className="h-1 w-full bg-primary-400" />
                  <div className="p-3.5 sm:p-5">
                     <div className="flex items-start gap-2.5 sm:gap-3">
                        <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600 sm:flex">
                           <Cookie className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                           <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Privacy choices</p>
                           <div className="flex items-start justify-between gap-1.5 sm:gap-3">
                              <div className="min-w-0 pr-1">
                                 <h2 className="mt-0.5 text-lg font-semibold tracking-tight text-secondary-900 sm:text-2xl">
                                    We care about your privacy
                                 </h2>
                                 <p className="mt-1.5 max-w-3xl text-sm leading-relaxed text-gray-700 sm:mt-2 sm:text-base">
                                    By clicking &quot;Accept All&quot;, you agree to storing cookies on your device for the best experience. We also use optional analytics and map cookies only when you consent.
                                 </p>
                              </div>
                              <button
                                 type="button"
                                 onClick={handleRejectNonEssential}
                                 className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                 aria-label="Close cookie banner"
                              >
                                 <X className="h-4 w-4" />
                              </button>
                           </div>

                           <div className="mt-2 flex flex-col gap-1.5 sm:mt-3 md:flex-row md:items-center md:justify-between">
                              <Button
                                 type="button"
                                 variant="ghost"
                                 onClick={() => router.push("/cookie-policy#manage-preferences")}
                                 className="h-8 w-full justify-start px-0 text-sm font-semibold text-secondary-900 hover:bg-transparent hover:text-secondary-800 sm:h-8 sm:text-base md:w-auto"
                              >
                                 <SlidersHorizontal className="h-4 w-4" />
                                 Manage Preferences
                              </Button>

                              <div className="grid w-full grid-cols-2 gap-2 sm:gap-2 md:w-auto md:grid-cols-2">
                                 <Button
                                    type="button"
                                    onClick={handleAcceptAll}
                                    className="h-9 rounded-full bg-primary-500 px-3 text-sm font-semibold text-secondary-900 hover:bg-primary-400 sm:h-9 sm:px-5"
                                 >
                                    <ShieldCheck className="h-4 w-4" />
                                    Accept All
                                 </Button>
                                 <Button
                                    type="button"
                                    onClick={handleRejectNonEssential}
                                    className="h-9 rounded-full border border-primary-500 bg-primary-100 px-3 text-sm font-semibold text-secondary-900 hover:bg-primary-200 sm:h-9 sm:px-5"
                                 >
                                    Essential Only
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}