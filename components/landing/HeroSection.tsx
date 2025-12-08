"use client";

/**
 * Hero Section component for landing page
 * Responsive hero section with CTA buttons
 */

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/design/utils";

export const HeroSection: React.FC = () => {
   return (
      <section className="min-h-[80vh] flex items-center bg-white pb-5 overflow-x-hidden">
         <div className="w-full max-w-[1400px] mx-auto px-5 md:px-16 pb-1 flex flex-col md:flex-row items-start justify-between gap-0">
            {/* Text Content */}
            <div className="flex-1 pt-0 pb-8 flex flex-col justify-center items-start text-left pl-0 md:flex-1 min-w-0">
               <h1 className="text-4xl md:text-[53px] font-extrabold text-secondary-900 font-sans tracking-tight mb-4 leading-tight">
                  Get your tasks done
                  <span className="block text-primary-500 text-[0.9em]">
                     wherever you are
                  </span>
               </h1>
               <p className="text-xl text-secondary-500 max-w-[550px] leading-relaxed mb-9 mt-2 font-sans">
                  Post any task, anywhere. Trusted locals will handle it for
                  you.
               </p>
               <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <Link href="/signup">
                     <Button
                        variant="primary"
                        size="lg"
                        className="bg-primary-500 text-secondary-900 font-bold text-lg px-8 py-4 rounded-lg shadow-lg shadow-primary-500/25 hover:bg-primary-600 transition-all flex items-center gap-2.5"
                     >
                        Get Started
                        <span className="text-lg text-secondary-900">→</span>
                     </Button>
                  </Link>
                  <Button
                     variant="outline"
                     size="lg"
                     className="bg-white text-primary-500 font-bold text-lg px-8 py-4 rounded-lg border-2 border-primary-500 hover:bg-primary-50 transition-all flex items-center gap-2.5"
                  >
                     <span className="text-lg text-primary-500">▶</span>
                     Watch Demo
                  </Button>
               </div>
            </div>

            {/* Image/Mockup */}
            <div className="flex-1 flex justify-end items-center min-h-[300px] relative min-w-0 overflow-hidden">
               <div className="relative w-full min-h-[320px] flex justify-end items-center animate-[slideUp_1s_ease]">
                  <img
                     src="/assets/images/herocard.png"
                     alt="Extrahand Mobile App"
                     className="w-full max-w-[520px] h-auto rounded-3xl"
                     onError={(e) => {
                        // Fallback image
                        (e.target as HTMLImageElement).src =
                           "/assets/mobilescreens/approve-task.jpg";
                     }}
                  />
               </div>
            </div>
         </div>

         <style jsx>{`
            @keyframes slideUp {
               0% {
                  opacity: 0;
                  transform: translateY(40px);
               }
               100% {
                  opacity: 1;
                  transform: translateY(0);
               }
            }

            @media (max-width: 768px) {
               .hero-container {
                  flex-direction: column !important;
                  gap: 32px !important;
                  padding: 0 !important;
               }
            }
         `}</style>
      </section>
   );
};
