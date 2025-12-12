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
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-6 leading-tight">
               Ready to become a tasker?
            </h2>
            <p className="text-sm md:text-lg text-secondary-300 max-w-2xl mx-auto mb-8">
               Join thousands of people earning on their own schedule. Sign up
               is free and takes just minutes.
            </p>

            {/* Benefits */}
            <div className="flex flex-col items-center justify-center md:items-center gap-4 mb-8">
               <div className="flex flex-col text-left gap-4">
                  {[
                     "No signup fee",
                     "You set your rates",
                     "Choose your tasks",
                     "Get paid fast",
                  ].map((benefit, idx) => (
                     <div
                        key={idx}
                        className="flex items-center gap-2 text-secondary-300"
                     >
                        <CheckCircle className="size-4 md:size-5 text-primary-400" />
                        <span className="text-xs md:text-sm font-medium">
                           {benefit}
                        </span>
                     </div>
                  ))}
               </div>
            </div>

            <Button
               size="lg"
               asChild
               className="md:text-lg px-7 md:px-10 py-4 md:py-7 bg-primary-500 hover:bg-primary-400 text-secondary-900 font-bold shadow-2xl shadow-primary-500/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
               <Link href="/onboarding/role-selection?role=performer">
                  Become a Tasker
                  <ArrowRight className="ml-2 w-5 h-5" />
               </Link>
            </Button>

            <p className="text-xs md:text-sm text-secondary-400 mt-4 md:mt-6">
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
