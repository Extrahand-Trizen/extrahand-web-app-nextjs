"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";

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
   "/provider-agreement",
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

   return (
      <div
         suppressHydrationWarning
         style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
         <LandingHeader />
         <main
            style={{
               flex: 1,
               minHeight: "calc(100vh - 110px)",
               position: "relative",
            }}
         >
            <div className="w-full mx-auto">{children}</div>
         </main>
         <LandingFooter />
      </div>
   );
};
