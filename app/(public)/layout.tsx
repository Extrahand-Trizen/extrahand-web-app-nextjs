"use client";

import dynamic from "next/dynamic";
import { RouteChrome } from "@/components/layout/RouteChrome";
import { PublicHashScroll } from "@/components/layout/PublicHashScroll";

const CookieConsentBanner = dynamic(
   () => import("@/components/layout/CookieConsentBanner"),
   { ssr: false }
);

export default function PublicLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   return (
      <RouteChrome variant="public">
         <PublicHashScroll />
         {children}
         <CookieConsentBanner />
      </RouteChrome>
   );
}
