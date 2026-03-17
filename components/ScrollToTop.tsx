"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ScrollToTop() {
   const pathname = usePathname();
   const searchParams = useSearchParams();

   useEffect(() => {
      if (typeof window === "undefined") return;

      // Keep manual scroll restoration to avoid browser restoring stale positions
      if ("scrollRestoration" in window.history) {
         window.history.scrollRestoration = "manual";
      }

      // If there's a hash (e.g. /#how-it-works), let the section logic / browser handle it.
      if (window.location.hash) {
         return;
      }

      requestAnimationFrame(() => {
         window.scrollTo({ top: 0, left: 0, behavior: "auto" });
         document.documentElement.scrollTop = 0;
         document.body.scrollTop = 0;
      });
   }, []);

   useEffect(() => {
      if (typeof window === "undefined") return;

      // If navigating to a URL with a hash, don't override the intended anchor scroll
      if (window.location.hash) {
         return;
      }

      requestAnimationFrame(() => {
         window.scrollTo({ top: 0, left: 0, behavior: "auto" });
         document.documentElement.scrollTop = 0;
         document.body.scrollTop = 0;
      });
   }, [pathname, searchParams]);

   return null;
}
