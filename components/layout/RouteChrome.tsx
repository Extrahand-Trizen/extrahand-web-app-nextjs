"use client";

import { ReactNode } from "react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";

type RouteChromeVariant = "public" | "protected";

interface RouteChromeProps {
   children: ReactNode;
   variant: RouteChromeVariant;
}

export function RouteChrome({ children, variant }: RouteChromeProps) {
   if (variant === "public") {
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
   }

   return (
      <div suppressHydrationWarning>
         <LandingHeader />
         <main className="min-h-[calc(100vh - 110px)]">
            <div className="w-full mx-auto">{children}</div>
         </main>
         <LandingFooter />
      </div>
   );
}
