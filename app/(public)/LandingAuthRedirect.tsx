"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";

/**
 * Sends signed-in users from "/" to "/home" without blocking first paint.
 * The landing page HTML must render immediately for mobile LCP.
 */
export default function LandingAuthRedirect() {
   const router = useRouter();
   const { currentUser, userData, loading } = useAuth();
   const isAuthenticated = Boolean(currentUser) || Boolean(userData);

   useEffect(() => {
      if (loading || !isAuthenticated) return;
      if (typeof window === "undefined") return;
      if (window.location.hash === "#how-it-works") return;

      let cancelled = false;
      let timeoutId: number | undefined;

      const shouldStayOnHowItWorks = () =>
         window.location.hash === "#how-it-works";

      const scheduleRedirect = () => {
         timeoutId = window.setTimeout(() => {
            if (cancelled || shouldStayOnHowItWorks()) return;
            router.replace("/home");
         }, 200);
      };

      requestAnimationFrame(() => {
         if (cancelled || shouldStayOnHowItWorks()) return;
         requestAnimationFrame(() => {
            if (cancelled || shouldStayOnHowItWorks()) return;
            scheduleRedirect();
         });
      });

      return () => {
         cancelled = true;
         if (timeoutId !== undefined) clearTimeout(timeoutId);
      };
   }, [isAuthenticated, loading, router]);

   return null;
}
