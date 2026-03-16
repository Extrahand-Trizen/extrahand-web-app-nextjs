"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";

export default function PublicLayout({
   children,
}: {
   children: React.ReactNode;
}) {
   const pathname = usePathname();

   // Keep route scroll behavior predictable while respecting hash section navigation.
   useEffect(() => {
      const scrollToHowItWorks = () => {
         if (window.location.hash !== "#how-it-works") return;

         let attempts = 0;
         const maxAttempts = 30;

         const tryScroll = () => {
            const section = document.getElementById("how-it-works");
            if (section) {
               const headerOffset = 88;
               const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;
               window.scrollTo({ top: Math.max(top, 0), behavior: "auto" });

               // Re-apply after potential layout shifts (images/fonts) or other scroll handlers.
               window.setTimeout(() => {
                  if (window.location.hash !== "#how-it-works") return;
                  const stableTop =
                     section.getBoundingClientRect().top + window.scrollY - headerOffset;
                  window.scrollTo({ top: Math.max(stableTop, 0), behavior: "auto" });
               }, 120);

               window.setTimeout(() => {
                  if (window.location.hash !== "#how-it-works") return;
                  const stableTop =
                     section.getBoundingClientRect().top + window.scrollY - headerOffset;
                  window.scrollTo({ top: Math.max(stableTop, 0), behavior: "auto" });
               }, 400);
               return;
            }

            attempts += 1;
            if (attempts < maxAttempts) {
               window.setTimeout(tryScroll, 100);
            }
         };

         tryScroll();
      };

      const handleHashChange = () => {
         scrollToHowItWorks();
      };

      window.addEventListener("hashchange", handleHashChange);
      window.addEventListener("load", handleHashChange);

      if (window.location.hash === "#how-it-works") {
         scrollToHowItWorks();
      } else {
         window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }

      return () => {
         window.removeEventListener("hashchange", handleHashChange);
         window.removeEventListener("load", handleHashChange);
      };
   }, [pathname]);

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
