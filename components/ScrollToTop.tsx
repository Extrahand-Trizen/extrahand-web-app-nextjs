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

      let secondFrame = 0;
      const frame = window.requestAnimationFrame(() => {
         secondFrame = window.requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
         });
      });

      return () => {
         window.cancelAnimationFrame(frame);
         window.cancelAnimationFrame(secondFrame);
      };
   }, [pathname, searchParams]);

   return null;
}
