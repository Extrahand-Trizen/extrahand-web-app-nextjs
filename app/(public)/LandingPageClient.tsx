"use client";

/**
 * Landing Page
 * Redirects authenticated users to home page
 */

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { HeroSection, HowItWorksSection, ServicesSection } from "@/components/landing";
import { useAuth } from "@/lib/auth/context";

// Defer below-the-fold marketing sections to reduce initial bundle size.
const SocialProofBar = dynamic(
   () => import("@/components/landing/SocialProofBar")
);

const TestimonialsSection = dynamic(
   () => import("@/components/landing/TestimonialsSection")
);

const FAQSection = dynamic(
   () => import("@/components/landing/FAQSection")
);

const FinalCTASection = dynamic(
   () => import("@/components/landing/FinalCTASection")
);

export default function LandingPageClient() {
   const router = useRouter();
   const { currentUser, userData, loading } = useAuth();
   const isAuthenticated = Boolean(currentUser) || Boolean(userData);
   const [allowHowItWorks, setAllowHowItWorks] = useState(() => {
      if (typeof window === "undefined") return false;
      return window.location.hash === "#how-it-works";
   });
   const [hasAppliedHashScroll, setHasAppliedHashScroll] = useState(() => {
      if (typeof window === "undefined") return true;
      return window.location.hash !== "#how-it-works";
   });

   const scrollToHowItWorks = useCallback((onDone?: () => void) => {
      if (typeof window === "undefined") return;

      let attempts = 0;
      const maxAttempts = 30;

      const tryScroll = () => {
         const element = document.getElementById("how-it-works");
         if (element) {
            const headerOffset = 88;
            const top =
               element.getBoundingClientRect().top + window.scrollY - headerOffset;

            window.scrollTo({ top: Math.max(top, 0), behavior: "auto" });
            onDone?.();
            return;
         }

         attempts += 1;
         if (attempts < maxAttempts) {
            window.setTimeout(tryScroll, 100);
         } else {
            onDone?.();
         }
      };

      tryScroll();
   }, []);

   useEffect(() => {
      if (typeof window === "undefined") return;

      const updateAllow = () => {
         const hasHowItWorksHash = window.location.hash === "#how-it-works";
         setAllowHowItWorks(hasHowItWorksHash);
         setHasAppliedHashScroll(!hasHowItWorksHash);
      };

      updateAllow();
      window.addEventListener("hashchange", updateAllow);
      return () => window.removeEventListener("hashchange", updateAllow);
   }, []);

   // Authenticated users on "/" are sent to /home unless they opened /#how-it-works.
   // Client-side navigation can apply the hash after pathname updates; defer redirect
   // so footer "How it Works" works after sign-in.
   useEffect(() => {
      if (loading || !isAuthenticated) return;

      let cancelled = false;
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      const syncHashAllow = () => {
         if (typeof window === "undefined") return false;
         if (window.location.hash === "#how-it-works") {
            setAllowHowItWorks(true);
            setHasAppliedHashScroll(false);
            return true;
         }
         return false;
      };

      if (syncHashAllow()) return () => { cancelled = true; };

      const scheduleRedirectIfStillPlainHome = () => {
         timeoutId = window.setTimeout(() => {
            if (cancelled) return;
            if (syncHashAllow()) return;
            router.replace("/home");
         }, 200);
      };

      requestAnimationFrame(() => {
         if (cancelled) return;
         if (syncHashAllow()) return;
         requestAnimationFrame(() => {
            if (cancelled) return;
            if (syncHashAllow()) return;
            scheduleRedirectIfStillPlainHome();
         });
      });

      return () => {
         cancelled = true;
         if (timeoutId !== undefined) clearTimeout(timeoutId);
      };
   }, [isAuthenticated, loading, router]);

   useEffect(() => {
      // Only scroll to section if explicitly requested via hash
      if (!allowHowItWorks) {
         return;
      }

      // Trigger immediately; retry logic handles any late-mount edge case.
      scrollToHowItWorks(() => setHasAppliedHashScroll(true));

      return;
   }, [allowHowItWorks, scrollToHowItWorks]);

   const shouldHideForHashJump = allowHowItWorks && !hasAppliedHashScroll;

   // Show nothing while checking authentication or redirecting
   if (loading || (isAuthenticated && !allowHowItWorks)) {
      return (
         <div style={{ minHeight: '100vh', width: '100%' }}>
            {/* Placeholder to prevent layout shift */}
         </div>
      );
   }

   return (
      <div
         style={{
            minHeight: "100vh",
            position: "relative",
            visibility: shouldHideForHashJump ? "hidden" : "visible",
         }}
      >
         <HeroSection />
         <SocialProofBar />
         <HowItWorksSection />
         <ServicesSection />
         <TestimonialsSection />
         <FAQSection />
         <FinalCTASection />
      </div>
   );
}