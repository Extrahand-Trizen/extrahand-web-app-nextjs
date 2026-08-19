"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ScrollToTop() {
   const pathname = usePathname();
   const searchParams = useSearchParams();

   useEffect(() => {
      if ("scrollRestoration" in window.history) {
         window.history.scrollRestoration = "manual";
      }
   }, []);

   useEffect(() => {
      if (window.location.hash) return;

      const frame = window.requestAnimationFrame(() => {
         window.scrollTo(0, 0);
      });

      return () => window.cancelAnimationFrame(frame);
   }, [pathname, searchParams]);

   return null;
}
