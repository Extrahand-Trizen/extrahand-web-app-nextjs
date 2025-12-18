"use client";

/**
 * Landing Page
 *
 * For unauthenticated users: Shows marketing content
 * For authenticated users: Redirects to unified home dashboard
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

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { LoadingSpinner } from "@/components/LoadingSpinner";
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
   const router = useRouter();
   const { currentUser, loading } = useAuth();

   // Redirect authenticated users to the unified home dashboard
   useEffect(() => {
      if (!loading && currentUser) {
         router.replace("/home");
      }
   }, [loading, currentUser, router]);

   // Show loading while checking auth
   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
         </div>
      );
   }

   // If authenticated, show nothing (will redirect)
   if (currentUser) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner size="lg" />
         </div>
      );
   }

   // Show landing page for unauthenticated users
   // Header and Footer are already in the layout
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
