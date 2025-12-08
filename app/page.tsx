"use client";

/**
 * Landing Page
 *
 * Complete redesign with conversion-focused architecture:
 * 1. Hero - Strong value prop + primary CTA
 * 2. Social Proof Bar - Trust metrics
 * 3. How It Works - Separate poster/tasker flows
 * 4. Categories - Popular task types
 * 5. Trust & Safety - Build confidence
 * 6. Testimonials - Real user stories
 * 7. Final CTA - Conversion push
 */

import { LandingHeader } from "@/components/layout/LandingHeader";
import { LandingFooter } from "@/components/layout/LandingFooter";
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
      <div className="min-h-screen bg-white">
         <LandingHeader />
         <main className="pb-28 md:pb-0">
            <HeroSection />
            <SocialProofBar />
            <HowItWorksSection />
            <CategoriesExplorer />
            <TrustSection />
            <TestimonialsSection />
            <FinalCTASection />
         </main>
         <LandingFooter />
      </div>
   );
}
