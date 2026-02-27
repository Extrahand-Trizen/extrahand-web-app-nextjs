"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function ScrollToTop() {
   const pathname = usePathname();
   const searchParams = useSearchParams();

   useEffect(() => {
      // Ensure navigation always starts at top
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
   }, [pathname, searchParams]);

   return null;
}
