"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
   clearConsentPreferences,
   getConsentPreferences,
   saveConsentPreferences,
} from "@/lib/consent/cookieConsent";
import { initializeAnalyticsIfConsented } from "@/lib/auth/firebase";

export function CookiePreferencesManager() {
   const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
   const [mapsEnabled, setMapsEnabled] = useState(false);

   useEffect(() => {
      const stored = getConsentPreferences();
      if (stored) {
         setAnalyticsEnabled(stored.analytics);
         setMapsEnabled(stored.maps);
      }
   }, []);

   const handleSubmitPreferences = () => {
      saveConsentPreferences({ analytics: analyticsEnabled, maps: mapsEnabled });
      if (analyticsEnabled) {
         void initializeAnalyticsIfConsented();
      }
      toast.success("Cookie preferences updated");
   };

   const handleAcceptAll = () => {
      setAnalyticsEnabled(true);
      setMapsEnabled(true);
      saveConsentPreferences({ analytics: true, maps: true });
      void initializeAnalyticsIfConsented();
      toast.success("All optional cookies enabled");
   };

   const handleEssentialOnly = () => {
      setAnalyticsEnabled(false);
      setMapsEnabled(false);
      saveConsentPreferences({ analytics: false, maps: false });
      toast.success("Only essential cookies enabled");
   };

   const handleClearWebsiteCookies = () => {
      clearConsentPreferences();
      setAnalyticsEnabled(false);
      setMapsEnabled(false);
      toast.success("Website cookie preferences cleared");
   };

   return (
      <div className="space-y-8" id="manage-preferences">
         <div>
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">Manage your cookie preferences</h2>
            <p className="mt-4 text-gray-700">
               We use the following cookie categories on ExtraHand. Choose which optional cookies you want to allow.
            </p>

            <div className="mt-6 space-y-4">
               <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start gap-3">
                     <Checkbox checked disabled className="mt-1" aria-label="Strictly Necessary Cookies" />
                     <div>
                        <h3 className="text-2xl font-semibold text-gray-900">Strictly Necessary Cookies</h3>
                        <p className="mt-3 text-gray-700">
                           These cookies are required for login, security, and saving your privacy settings. They cannot be turned off.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start gap-3">
                     <Checkbox
                        checked={mapsEnabled}
                        onCheckedChange={(checked) => setMapsEnabled(Boolean(checked))}
                        className="mt-1"
                        aria-label="Functional and Personalisation"
                     />
                     <div>
                        <h3 className="text-2xl font-semibold text-gray-900">Functional and Personalisation</h3>
                        <p className="mt-3 text-gray-700">
                           These cookies enable enhanced functionality such as maps and location-based interactions.
                           If disabled, some experiences may become more generic.
                        </p>
                     </div>
                  </div>
               </div>

               <div className="rounded-lg border border-gray-200 bg-gray-50 p-5">
                  <div className="flex items-start gap-3">
                     <Checkbox
                        checked={analyticsEnabled}
                        onCheckedChange={(checked) => setAnalyticsEnabled(Boolean(checked))}
                        className="mt-1"
                        aria-label="Analytics and Performance"
                     />
                     <div>
                        <h3 className="text-2xl font-semibold text-gray-900">Analytics and Performance</h3>
                        <p className="mt-3 text-gray-700">
                           These cookies help us understand site traffic and usage patterns so we can improve performance.
                           Data is aggregated and used for product improvements.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr_1fr]">
               <Button type="button" onClick={handleSubmitPreferences} className="h-12 rounded-full bg-amber-500 text-gray-900 hover:bg-amber-400">
                  Submit Preferences
               </Button>
               <Button type="button" onClick={handleAcceptAll} className="h-12 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200">
                  Accept All
               </Button>
               <Button type="button" onClick={handleEssentialOnly} className="h-12 rounded-full bg-amber-100 text-amber-800 hover:bg-amber-200">
                  Essential Only
               </Button>
            </div>
         </div>

         <div id="clearing-cookies" className="pt-2">
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900">Clearing Website Cookies</h3>
            <p className="mt-3 text-gray-700">
               If you wish to clear all cookie preferences and session consent data set by this website, use the
               button below. This resets your cookie choices on this device for this site.
            </p>
            <p className="mt-3 text-gray-700">
               Note: third-party cookies (for example, Google cookies already stored by your browser) are managed
               from your browser settings or the provider website.
            </p>
            <Button type="button" onClick={handleClearWebsiteCookies} className="mt-5 h-11 rounded-full bg-amber-500 text-gray-900 hover:bg-amber-400">
               Clear Website Cookies
            </Button>
         </div>
      </div>
   );
}
