"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect } from "react";
import {
   CONSENT_CHANGE_EVENT,
   getConsentPreferences,
} from "@/lib/consent/cookieConsent";

const AnalyticsPageView = dynamic(
   () =>
      import("@/components/AnalyticsPageView").then((mod) => ({
         default: mod.AnalyticsPageView,
      })),
   { ssr: false }
);

const PollingOtpToastBridge = dynamic(
   () =>
      import("@/components/notifications/PollingOtpToastBridge").then((mod) => ({
         default: mod.PollingOtpToastBridge,
      })),
   { ssr: false }
);

const Toaster = dynamic(
   () => import("@/components/ui/sonner").then((mod) => ({ default: mod.Toaster })),
   { ssr: false }
);

function loadGa4() {
   if (typeof window === "undefined") return;
   if (document.getElementById("ga4-src")) return;
   if (!getConsentPreferences()?.analytics) return;

   const w = window as Window & {
      dataLayer: unknown[];
      gtag: (...args: unknown[]) => void;
   };
   w.dataLayer = w.dataLayer || [];
   w.gtag =
      w.gtag ||
      function gtag(...args: unknown[]) {
         w.dataLayer.push(args);
      };
   w.gtag("js", new Date());
   w.gtag("config", "G-C9E6GBS27L", { send_page_view: true });

   const script = document.createElement("script");
   script.id = "ga4-src";
   script.async = true;
   script.src = "https://www.googletagmanager.com/gtag/js?id=G-C9E6GBS27L";
   document.head.appendChild(script);
}

export function DeferredClientWidgets() {
   useEffect(() => {
      const start = () => loadGa4();
      window.addEventListener(CONSENT_CHANGE_EVENT, start);

      if ("requestIdleCallback" in window) {
         const id = window.requestIdleCallback(start, { timeout: 8000 });
         return () => {
            window.cancelIdleCallback(id);
            window.removeEventListener(CONSENT_CHANGE_EVENT, start);
         };
      }
      const timeoutId = window.setTimeout(start, 4000);
      return () => {
         window.clearTimeout(timeoutId);
         window.removeEventListener(CONSENT_CHANGE_EVENT, start);
      };
   }, []);

   return (
      <Suspense fallback={null}>
         <AnalyticsPageView />
         <PollingOtpToastBridge />
         <Toaster
            position="top-right"
            expand
            visibleToasts={5}
            closeButton
            richColors
         />
      </Suspense>
   );
}
