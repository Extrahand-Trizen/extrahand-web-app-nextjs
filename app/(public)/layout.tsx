"use client";

import { useEffect } from "react";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";

export default function PublicLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   // Ensure scroll starts at top for public pages
   useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
   }, []);

   return (
      <div suppressHydrationWarning style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
         <LandingHeader />
         <main style={{ flex: 1, minHeight: 'calc(100vh - 110px)', position: 'relative' }}>
            <div className="w-full mx-auto">{children}</div>
         </main>
         <LandingFooter />
      </div>
   );
}
