"use client";

import dynamic from "next/dynamic";
import { Suspense, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
   scheduleWhenIdle,
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

function LazyToaster() {
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      const cancel = scheduleWhenIdle(() => setMounted(true), 3000);
      return () => cancel();
   }, []);

   if (!mounted) return null;
   return (
      <Toaster
         position="top-right"
         expand
         visibleToasts={5}
         closeButton
         richColors
      />
   );
}

export function DeferredClientWidgets() {
   return (
      <Suspense fallback={null}>
         <AnalyticsPageView />
         <AuthenticatedOtpBridge />
         <LazyToaster />
      </Suspense>
   );
}

