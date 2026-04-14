"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll to the element matching `location.hash` after navigation (and on hash-only changes).
 */
export function useScrollToHash() {
   const pathname = usePathname();

   useEffect(() => {
      const scrollToHash = () => {
         const raw = typeof window !== "undefined" ? window.location.hash : "";
         if (!raw || raw.length <= 1) return;
         const id = decodeURIComponent(raw.slice(1));
         if (!id) return;
         const el = document.getElementById(id);
         if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
         }
      };

      scrollToHash();
      const t = window.setTimeout(scrollToHash, 150);
      window.addEventListener("hashchange", scrollToHash);
      return () => {
         window.clearTimeout(t);
         window.removeEventListener("hashchange", scrollToHash);
      };
   }, [pathname]);
}
