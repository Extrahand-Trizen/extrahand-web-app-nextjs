"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { RouteChrome } from "@/components/layout/RouteChrome";

const INFO_ROUTES_WITH_PUBLIC_CHROME = new Set([
   "/tasker-guidelines",
   "/success-stories",
   "/resources",
   "/trust-safety",
   "/pricing",
   "/about-us",
   "/careers",
   "/press",
   "/faqs",
   "/privacy-policy",
   "/terms-and-conditions",
   "/refund-policy",
   "/tasker-agreement",
   "/community-guidelines",
   "/report-an-issue",
]);

interface ConditionalPublicChromeProps {
   children: ReactNode;
}

const normalizePathname = (pathname: string): string => {
   if (pathname.length > 1 && pathname.endsWith("/")) {
      return pathname.slice(0, -1);
   }

   return pathname;
};

export const ConditionalPublicChrome = ({
   children,
}: ConditionalPublicChromeProps) => {
   const pathname = usePathname();
   const normalizedPathname = normalizePathname(pathname || "");
   const shouldShowPublicChrome = INFO_ROUTES_WITH_PUBLIC_CHROME.has(
      normalizedPathname
   );

   if (!shouldShowPublicChrome) {
      return <>{children}</>;
   }

   return <RouteChrome variant="public">{children}</RouteChrome>;
};
