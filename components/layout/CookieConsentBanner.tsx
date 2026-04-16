"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Cookie, BarChart3, MapPinned, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
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
   const [isVisible, setIsVisible] = useState(false);
   const [showPreferences, setShowPreferences] = useState(false);
   const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
   const [mapsEnabled, setMapsEnabled] = useState(false);

   const canShow = useMemo(() => CONSENT_BANNER_PATHS.has(pathname), [pathname]);

   const syncFromStoredConsent = () => {
      const preferences = getConsentPreferences();
      if (!preferences) {
         setAnalyticsEnabled(false);
         setMapsEnabled(false);
         setIsVisible(canShow);
         return;
      }

      setAnalyticsEnabled(preferences.analytics);
      setMapsEnabled(preferences.maps);
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
         setShowPreferences(true);
         setIsVisible(false);
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
         setShowPreferences(false);
      }
   }, [pathname]);

   useEffect(() => {
      if (!showPreferences) return;
      const stored = getConsentPreferences();
      if (stored) {
         setAnalyticsEnabled(stored.analytics);
         setMapsEnabled(stored.maps);
      }
   }, [showPreferences]);

   const handleAcceptAll = () => {
      saveConsentPreferences({ analytics: true, maps: true });
      void initializeAnalyticsIfConsented();
      setIsVisible(false);
      setShowPreferences(false);
   };

   const handleRejectNonEssential = () => {
      saveConsentPreferences({ analytics: false, maps: false });
      setIsVisible(false);
      setShowPreferences(false);
   };

   const handleSavePreferences = () => {
      saveConsentPreferences({ analytics: analyticsEnabled, maps: mapsEnabled });
      if (analyticsEnabled) {
         void initializeAnalyticsIfConsented();
      }
      setIsVisible(false);
      setShowPreferences(false);
   };

   if (!canShow || (!isVisible && hasConsentDecision())) {
      return null;
   }

   if (!isVisible && !showPreferences) {
      return null;
   }

   return (
      <>
         {isVisible && (
            <div className="fixed bottom-4 right-4 z-120 w-[calc(100%-2rem)] max-w-2xl">
               <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
                  <div className="p-4 sm:p-5 md:p-6">
                     <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-gray-600">
                           <Cookie className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                           <div className="flex items-start justify-between gap-3">
                              <div>
                                 <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                    We use cookies and similar technologies
                                 </h2>
                                 <p className="mt-1 text-sm text-gray-600 leading-relaxed">
                                    Essential cookies keep ExtraHand working. Optional analytics and map embeds help us improve the platform and show location features.
                                 </p>
                              </div>
                              <button
                                 type="button"
                                 onClick={handleRejectNonEssential}
                                 className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                                 aria-label="Close cookie banner"
                              >
                                 <X className="h-4 w-4" />
                              </button>
                           </div>

                           <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                              <Button
                                 type="button"
                                 onClick={handleAcceptAll}
                                 className="bg-secondary-900 text-white hover:bg-secondary-800"
                              >
                                 <ShieldCheck className="h-4 w-4" />
                                 Accept All
                              </Button>
                              <Button
                                 type="button"
                                 variant="outline"
                                 onClick={handleRejectNonEssential}
                              >
                                 Reject Non-Essential
                              </Button>
                              <Button
                                 type="button"
                                 variant="ghost"
                                 onClick={() => setShowPreferences(true)}
                              >
                                 <SlidersHorizontal className="h-4 w-4" />
                                 Manage Preferences
                              </Button>
                           </div>

                           <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                              <Link href="/cookie-policy" className="font-medium text-primary-700 hover:underline">
                                 Cookie Policy
                              </Link>
                              <span className="hidden sm:inline text-gray-300">|</span>
                              <Link href="/privacy-policy" className="font-medium text-primary-700 hover:underline">
                                 Privacy Policy
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {showPreferences && (
            <div className="fixed inset-0 z-130 flex items-end justify-center bg-black/30 px-4 py-4 sm:items-center sm:p-6">
               <div className="w-full max-w-2xl rounded-2xl bg-white shadow-lg border border-gray-200 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                     <div>
                        <h3 className="text-lg font-semibold text-gray-900">Manage Cookie Preferences</h3>
                        <p className="text-sm text-gray-500">Choose which optional features you want to allow.</p>
                     </div>
                     <button
                        type="button"
                        onClick={() => setShowPreferences(false)}
                        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Close preferences"
                     >
                        <X className="h-4 w-4" />
                     </button>
                  </div>

                  <div className="space-y-4 px-5 py-5">
                     <div className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-4">
                           <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                                 <ShieldCheck className="h-5 w-5" />
                              </div>
                              <div>
                                 <h4 className="font-semibold text-gray-900">Essential cookies</h4>
                                 <p className="text-sm text-gray-600">Always on for login, security, and core site functionality.</p>
                              </div>
                           </div>
                           <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">Always on</span>
                        </div>
                     </div>

                     <div className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-4">
                           <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                                 <BarChart3 className="h-5 w-5" />
                              </div>
                              <div>
                                 <h4 className="font-semibold text-gray-900">Analytics cookies</h4>
                                 <p className="text-sm text-gray-600">Helps us understand usage and improve the experience.</p>
                              </div>
                           </div>
                           <Switch checked={analyticsEnabled} onCheckedChange={setAnalyticsEnabled} />
                        </div>
                     </div>

                     <div className="rounded-xl border border-gray-200 p-4">
                        <div className="flex items-start justify-between gap-4">
                           <div className="flex items-start gap-3">
                              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                                 <MapPinned className="h-5 w-5" />
                              </div>
                              <div>
                                 <h4 className="font-semibold text-gray-900">Google Maps embeds</h4>
                                 <p className="text-sm text-gray-600">Loads map widgets and map-based location features.</p>
                              </div>
                           </div>
                           <Switch checked={mapsEnabled} onCheckedChange={setMapsEnabled} />
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:justify-end">
                     <Button type="button" variant="outline" onClick={handleRejectNonEssential}>
                        Reject Non-Essential
                     </Button>
                     <Button type="button" onClick={handleSavePreferences} className="bg-secondary-900 text-white hover:bg-secondary-800">
                        Save Preferences
                     </Button>
                  </div>
               </div>
            </div>
         )}
      </>
   );
}