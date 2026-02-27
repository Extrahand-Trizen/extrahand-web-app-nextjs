"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ScrollToTop() {
   const pathname = usePathname();
   const searchParams = useSearchParams();

   // Immediate scroll on mount - most aggressive
   useEffect(() => {
      // Prevent browser scroll restoration
      if ('scrollRestoration' in window.history) {
         window.history.scrollRestoration = 'manual';
      }
      
      // Force scroll to top multiple ways
      requestAnimationFrame(() => {
         window.scrollTo({ top: 0, left: 0, behavior: "auto" });
         document.documentElement.scrollTop = 0;
         document.body.scrollTop = 0;
      });
   }, []);

   // Scroll on navigation
   useEffect(() => {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
         window.scrollTo({ top: 0, left: 0, behavior: "auto" });
         document.documentElement.scrollTop = 0;
         document.body.scrollTop = 0;
      });
   }, [pathname, searchParams]);

   return null;
}
