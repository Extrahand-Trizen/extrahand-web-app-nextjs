"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";
import { LaunchBanner } from "@/components/layout/LaunchBanner";

type RouteChromeVariant = "public" | "protected";

interface RouteChromeProps {
   children: ReactNode;
   variant: RouteChromeVariant;
}

export function RouteChrome({ children, variant }: RouteChromeProps) {
   const pathname = usePathname();
   const normalized = pathname && pathname.length > 1 && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
   const showLaunchBanner = normalized === "/" || normalized === "/home";

   if (variant === "public") {
      return (
         <div
            suppressHydrationWarning
            style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
         >
            <LandingHeader />
            {showLaunchBanner ? <LaunchBanner /> : null}
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
   }

   return (
      <div suppressHydrationWarning>
         <LandingHeader />
         {showLaunchBanner ? <LaunchBanner /> : null}
         <main className="min-h-[calc(100vh - 110px)]">
            <div className="w-full mx-auto">{children}</div>
         </main>
         <LandingFooter />
      </div>
   );
}
