"use client";

/**
 * Landing Page
 *
 * Marketing surfaces should stay accessible even when someone is logged in,
 * so we no longer auto-redirect authenticated visitors away from this page.
 */

import dynamic from "next/dynamic";
import { HeroSection } from "@/components/landing";

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
   return (
      <>
         <HeroSection />
         <SocialProofBar />
         <HowItWorksSection />
         <CategoriesExplorer />
         <TrustSection />
         <TestimonialsSection />
         <FinalCTASection />
      </>
   );
}
