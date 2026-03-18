"use client";

import dynamic from "next/dynamic";
import { HeroSection, HowItWorksSection } from "@/components/landing";

const SocialProofBar = dynamic(
   () => import("@/components/landing/SocialProofBar")
);

const CategoriesExplorer = dynamic(
   () =>
      import("@/components/landing/CategoriesExplorer").then(
         (m) => m.CategoriesExplorer
      ),
   {
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

export default function HowItWorksPage() {
   return (
      <div style={{ minHeight: "100vh", position: "relative" }}>
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