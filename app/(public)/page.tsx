"use client";

/**
 * Landing Page
 *
 * Marketing surfaces should stay accessible even when someone is logged in,
 * so we no longer auto-redirect authenticated visitors away from this page.
 */

import {
   HeroSection,
   SocialProofBar,
   HowItWorksSection,
   CategoriesExplorer,
   TrustSection,
   TestimonialsSection,
   FinalCTASection,
} from "@/components/landing";

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
