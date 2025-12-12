/**
 * Final CTA - Conversion focused ending with dark theme
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";

export function FinalCTA() {
   return (
      <section className="relative py-16 bg-secondary-900 overflow-hidden">
         {/* Background decoration */}
         <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-10 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
         </div>

         <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-white leading-tight">
               Ready to become a tasker?
            </h2>
            <p className="text-xl text-secondary-300 mb-8 max-w-2xl mx-auto">
               Join thousands of people earning on their own schedule. Sign up
               is free and takes just minutes.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap justify-center gap-4 mb-10">
               {[
                  "No signup fee",
                  "You set your rates",
                  "Choose your tasks",
                  "Get paid fast",
               ].map((benefit) => (
                  <div
                     key={benefit}
                     className="flex items-center gap-2 text-secondary-300"
                  >
                     <CheckCircle className="w-5 h-5 text-primary-400" />
                     <span className="text-sm font-medium">{benefit}</span>
                  </div>
               ))}
            </div>

            <Button
               size="lg"
               asChild
               className="text-lg px-10 py-7 bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold shadow-2xl shadow-primary-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
               <Link href="/onboarding/role-selection?role=performer">
                  Become a Tasker
                  <ArrowRight className="ml-2 w-5 h-5" />
               </Link>
            </Button>

            <p className="text-sm text-secondary-400 mt-6">
               Already have an account?{" "}
               <Link
                  href="/login"
                  className="text-primary-400 hover:text-primary-300 font-medium"
               >
                  Sign in
               </Link>
            </p>
         </div>
      </section>
   );
}
