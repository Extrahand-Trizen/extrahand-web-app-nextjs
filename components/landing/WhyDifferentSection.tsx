"use client";

import React from "react";
import { Coins, Zap, ShieldAlert, Sparkles, Scale, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const WhyDifferentSection: React.FC = () => {
   return (
      <section className="relative overflow-hidden py-16 md:py-24 bg-linear-to-b from-white to-primary-50/20">
         {/* Background ambient lighting */}
         <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-primary-200/20 blur-3xl" />
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
               <span className="inline-flex px-3 py-1 mb-4 text-xs font-semibold tracking-wide uppercase rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  The ExtraHand Edge
               </span>
               <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-secondary-900 mb-4">
                  Why ExtraHand is Different
               </h2>
               <p className="text-secondary-600 text-base sm:text-lg/relaxed">
                  Most service platforms offer only one way to hire, leaving you with no options. 
                  <strong className="text-secondary-950 font-bold block sm:inline"> ExtraHand gives customers complete control.</strong>
               </p>
            </div>

            {/* Comparison Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
               
               {/* Model 1: Choose Your Budget */}
               <div className="group relative rounded-3xl border border-secondary-200/80 bg-white p-8 md:p-10 shadow-lg shadow-secondary-100/50 hover:shadow-xl hover:shadow-secondary-200/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full pointer-events-none" />
                  
                  {/* Card Header & Icon */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                     <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                           Want multiple quotes?
                        </span>
                        <h3 className="text-2xl font-black text-secondary-900 mt-3">
                           Use Choose Your Budget
                        </h3>
                     </div>
                     <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <Scale className="size-7" />
                     </div>
                  </div>

                  <p className="text-secondary-600 text-sm/relaxed mb-6">
                     Post your specific requirement, name your preferred target price, and receive competing bids from trusted local professionals. Compare bids, view ratings, and hire the best match for your budget.
                  </p>

                  <div className="space-y-3 border-t border-secondary-100 pt-6">
                     <div className="flex items-center gap-2 text-sm text-secondary-700">
                        <Check className="size-4 text-emerald-600 shrink-0" />
                        <span>You specify the target price</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-secondary-700">
                        <Check className="size-4 text-emerald-600 shrink-0" />
                        <span>Compare bids from multiple experts</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-secondary-700">
                        <Check className="size-4 text-emerald-600 shrink-0" />
                        <span>Best for large, custom, or flexible tasks</span>
                     </div>
                  </div>
               </div>

               {/* Model 2: Instant Service */}
               <div className="group relative rounded-3xl border border-secondary-200/80 bg-white p-8 md:p-10 shadow-lg shadow-secondary-100/50 hover:shadow-xl hover:shadow-secondary-200/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-2xl rounded-full pointer-events-none" />
                  
                  {/* Card Header & Icon */}
                  <div className="flex items-start justify-between gap-4 mb-6">
                     <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200/60">
                           Need someone immediately?
                        </span>
                        <h3 className="text-2xl font-black text-secondary-900 mt-3">
                           Use Instant Service
                        </h3>
                     </div>
                     <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary-500/10 border border-primary-500/20 text-primary-600 shadow-inner group-hover:scale-110 transition-transform duration-300 shrink-0">
                        <Zap className="size-7" />
                     </div>
                  </div>

                  <p className="text-secondary-600 text-sm/relaxed mb-6">
                     Skip the wait and negotiations. Book instantly at pre-negotiated, transparent, standard fixed rates. We automatically assign the nearest verified professional to your job.
                  </p>

                  <div className="space-y-3 border-t border-secondary-100 pt-6">
                     <div className="flex items-center gap-2 text-sm text-secondary-700">
                        <Check className="size-4 text-emerald-600 shrink-0" />
                        <span>Standardized, transparent fixed rates</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-secondary-700">
                        <Check className="size-4 text-emerald-600 shrink-0" />
                        <span>Automatic matching & fast dispatch</span>
                     </div>
                     <div className="flex items-center gap-2 text-sm text-secondary-700">
                        <Check className="size-4 text-emerald-600 shrink-0" />
                        <span>Best for urgent, standard home repairs</span>
                     </div>
                  </div>
               </div>

            </div>

            {/* Bottom Slogan Advantage */}
            <div className="max-w-2xl mx-auto text-center">
               <div className="inline-flex items-center gap-2.5 rounded-full border border-primary-200/80 bg-primary-50 px-6 py-2.5 shadow-md shadow-primary-100/40 relative group overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-200/10 to-amber-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <Sparkles className="size-4 text-primary-500 animate-pulse shrink-0" />
                  <span className="text-sm md:text-base font-bold text-secondary-900 tracking-tight">
                     One platform. Two smart ways to hire.{" "}
                     <span className="text-primary-600 bg-gradient-to-r from-primary-600 to-amber-600 bg-clip-text text-transparent">
                        That&apos;s the ExtraHand advantage.
                     </span>
                  </span>
               </div>
            </div>
         </div>
      </section>
   );
};

export default WhyDifferentSection;
