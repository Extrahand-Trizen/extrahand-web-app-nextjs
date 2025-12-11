/**
 * Final CTA Section - Conversion-focused ending
 *
 * Design principles:
 * - Single, clear action
 * - Urgency without pressure
 * - Restate value proposition
 * - Option for both user types
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
   "Free to post any task",
   "Get quotes within hours",
   "100% satisfaction guarantee",
   "Secure, protected payments",
];

export const FinalCTASection: React.FC = () => {
   return (
      <section className="py-12 md:py-20 bg-secondary-900 relative overflow-hidden">
         {/* Background decoration */}
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
         </div>

         <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Headline */}
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
               Ready to get things done?
            </h2>

            {/* Subtext */}
            <p className="text-sm md:text-lg text-secondary-300 max-w-2xl mx-auto mb-8">
               Join 50,000+ people who trust ExtraHand for their everyday tasks.
               Post your first task in minutes.
            </p>

            {/* Benefits checklist */}
            <div className="flex flex-col justify-center items-start md:items-center gap-4 mb-10">
               {benefits.map((benefit, idx) => (
                  <div
                     key={idx}
                     className="flex items-center gap-2 text-secondary-300"
                  >
                     <CheckCircle className="size-4 md:size-5 text-primary-400" />
                     <span className="text-xs md:text-sm font-medium">{benefit}</span>
                  </div>
               ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
               <Link href="/tasks/new">
                  <Button
                     size="lg"
                     className="bg-primary-500 hover:bg-primary-400 text-secondary-900 font-semibold md:text-lg px-8 py-4 md:px-10 md:py-6 rounded-xl shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5 w-full sm:w-auto"
                  >
                     Post a Task Now
                     <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
               </Link>
               <Link href="/earn-money">
                  <Button
                     variant="outline"
                     size="lg"
                     className="border-2 border-secondary-600 font-semibold md:text-lg px-8 py-4 md:px-10 md:py-6 rounded-xl w-full sm:w-auto"
                  >
                     Become a Tasker
                  </Button>
               </Link>
            </div>

            {/* Trust line */}
            <p className="mt-5 md:mt-8 text-xs md:text-sm text-secondary-500">
               No credit card required • Free to post • Cancel anytime
            </p>
         </div>
      </section>
   );
};

export default FinalCTASection;
