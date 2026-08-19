"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function PublicHashScroll() {
   const pathname = usePathname();

   useEffect(() => {
      const scrollToHowItWorks = () => {
         if (window.location.hash !== "#how-it-works") return;
         document
            .getElementById("how-it-works")
            ?.scrollIntoView({ behavior: "auto", block: "start" });
      };

      window.addEventListener("hashchange", scrollToHowItWorks);

      if (window.location.hash === "#how-it-works") {
         const frame = window.requestAnimationFrame(scrollToHowItWorks);
         return () => {
            window.cancelAnimationFrame(frame);
            window.removeEventListener("hashchange", scrollToHowItWorks);
         };
      }

      return () => {
         window.removeEventListener("hashchange", scrollToHowItWorks);
      };
   }, [pathname]);

   return null;
}
