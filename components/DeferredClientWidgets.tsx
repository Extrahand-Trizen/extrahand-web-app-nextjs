"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
   CONSENT_CHANGE_EVENT,
   getConsentPreferences,
} from "@/lib/consent/cookieConsent";
import {
   getGa4IdleTimeoutMs,
   scheduleWhenIdle,
   shouldLoadGa4,
   shouldLoadOtpPollingBridge,
} from "@/lib/thirdParty/scriptPolicy";

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

function AuthenticatedOtpBridge() {
   const pathname = usePathname();
   const [enabled, setEnabled] = useState(false);

   useEffect(() => {
      if (shouldLoadOtpPollingBridge(pathname)) {
         setEnabled(true);
      }
   }, [pathname]);

   if (!enabled) return null;
   return <PollingOtpToastBridge />;
}

function loadGa4() {
   if (typeof window === "undefined") return;
   if (document.getElementById("ga4-src")) return;
   if (!getConsentPreferences()?.analytics) return;

   const w = window as unknown as Window & {
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

function Ga4Loader() {
   const pathname = usePathname();

   useEffect(() => {
      if (!shouldLoadGa4(pathname)) return;

      const start = () => loadGa4();
      const onConsent = () => start();

      window.addEventListener(CONSENT_CHANGE_EVENT, onConsent);

      if (!getConsentPreferences()?.analytics) {
         return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onConsent);
      }

      const cancelIdle = scheduleWhenIdle(start, getGa4IdleTimeoutMs(pathname));

      return () => {
         cancelIdle();
         window.removeEventListener(CONSENT_CHANGE_EVENT, onConsent);
      };
   }, [pathname]);

   return null;
}

export function DeferredClientWidgets() {
   return (
      <Suspense fallback={null}>
         <Ga4Loader />
         <AnalyticsPageView />
         <AuthenticatedOtpBridge />
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
