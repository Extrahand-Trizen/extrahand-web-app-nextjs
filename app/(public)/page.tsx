"use client";

/**
 * Landing Page
 * Redirects authenticated users to home page
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/landing";
import { useAuth } from "@/lib/auth/context";

// Defer below-the-fold marketing sections to reduce initial bundle size.
const SocialProofBar = dynamic(
   () => import("@/components/landing/SocialProofBar")
);

const HowItWorksSection = dynamic(
   () => import("@/components/landing/HowItWorksSection")
);

const CategoriesExplorer = dynamic(
   () =>
      import("@/components/landing/CategoriesExplorer").then(
         (m) => m.CategoriesExplorer
      ),
   {
      // Uses framer-motion; client-only is fine and keeps it out of the
      // critical landing page JS on first paint.
      ssr: false,
   }
);

const TrustSection = dynamic(
   () => import("@/components/landing/TrustSection")
);

const TestimonialsSection = dynamic(
   () => import("@/components/landing/TestimonialsSection")
);

const FinalCTASection = dynamic(
   () => import("@/components/landing/FinalCTASection")
);

export default function LandingPage() {
   const router = useRouter();
   const { currentUser, userData, loading } = useAuth();
   const isAuthenticated = Boolean(currentUser) || Boolean(userData);
   const [allowHowItWorks, setAllowHowItWorks] = useState(() => {
      if (typeof window === "undefined") return false;
      return window.location.hash === "#how-it-works";
   });

   // Force scroll to top on landing page mount
   useEffect(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
   }, []);

   useEffect(() => {
      if (typeof window === "undefined") return;

      const updateAllow = () => {
         setAllowHowItWorks(window.location.hash === "#how-it-works");
      };

      updateAllow();
      window.addEventListener("hashchange", updateAllow);
      return () => window.removeEventListener("hashchange", updateAllow);
   }, []);

   useEffect(() => {
      if (loading || !isAuthenticated) return;

      const hasHowItWorksHash =
         typeof window !== "undefined" &&
         window.location.hash === "#how-it-works";

      if (hasHowItWorksHash) {
         if (!allowHowItWorks) {
            setAllowHowItWorks(true);
         }
         return;
      }

      // Redirect authenticated users to home page
      if (!allowHowItWorks) {
         router.replace("/home");
      }
   }, [allowHowItWorks, isAuthenticated, loading, router]);

   useEffect(() => {
      // Only scroll to section if explicitly requested via hash
      if (!allowHowItWorks) {
         // Ensure we're at top if no hash
         window.scrollTo({ top: 0, left: 0, behavior: "auto" });
         return;
      }
      
      // Small delay to ensure content is loaded
      const timeoutId = setTimeout(() => {
         const element = document.getElementById("how-it-works");
         if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
         }
      }, 100);
      
      return () => clearTimeout(timeoutId);
   }, [allowHowItWorks]);

   // Show nothing while checking authentication or redirecting
   if (loading || (isAuthenticated && !allowHowItWorks)) {
      return (
         <div style={{ minHeight: '100vh', width: '100%' }}>
            {/* Placeholder to prevent layout shift */}
         </div>
      );
   }

   return (
      <div style={{ minHeight: '100vh', position: 'relative' }}>
         <HeroSection />
         <SocialProofBar />
         <HowItWorksSection />
         <CategoriesExplorer />
         <TrustSection />
         <TestimonialsSection />
         <FinalCTASection />
      </div>
   );
}
