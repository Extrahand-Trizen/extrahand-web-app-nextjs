"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
   Sparkles,
   ArrowRight,
   Layers,
   Shield,
   Zap,
   BadgeCheck,
   Coins,
   Scale,
   Check,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const whyChoosePoints = [
   {
      icon: BadgeCheck,
      title: "Verified Professionals",
      description: "Every service provider undergoes a verification process before joining the platform.",
      color: "text-blue-600",
      iconBg: "bg-blue-50",
   },
   {
      icon: Layers,
      title: "Flexible Hiring Options",
      description: "Choose between budget-based bidding or instant booking.",
      color: "text-green-600",
      iconBg: "bg-green-50",
   },
   {
      icon: Coins,
      title: "Transparent Pricing",
      description: "Know your costs before hiring.",
      color: "text-amber-600",
      iconBg: "bg-amber-50",
   },
   {
      icon: Zap,
      title: "Fast Response",
      description: "Get connected with nearby professionals quickly.",
      color: "text-orange-600",
      iconBg: "bg-orange-50",
   },
   {
      icon: Sparkles,
      title: "Quality Service",
      description: "Hire experienced professionals based on ratings, reviews, and completed work.",
      color: "text-purple-600",
      iconBg: "bg-purple-50",
   },
   {
      icon: Shield,
      title: "Safe & Reliable",
      description: "A trusted platform designed to make hiring local services simple.",
      color: "text-red-600",
      iconBg: "bg-red-50",
   },
];

export const ServicesSection: React.FC = () => {
   return (
      <section className="relative overflow-hidden bg-[radial-gradient(130%_85%_at_50%_0%,rgba(255,244,214,0.7),rgba(255,255,255,1))] py-14 md:py-24">
         <div className="pointer-events-none absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-primary-200/25 blur-3xl" />
         <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-linear-to-b from-primary-100/35 to-transparent" />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Introductory Banner Section */}
            <div className="mb-16 overflow-hidden rounded-3xl border border-secondary-200/90 bg-gradient-to-br from-white via-secondary-50/20 to-primary-50/15 shadow-[0_8px_30px_rgb(0,0,0,0.03)] md:mb-24">
               <div className="grid grid-cols-1 lg:grid-cols-12">
                  
                  {/* Left Column: Heading & Description */}
                  <div className="relative lg:col-span-7 px-6 py-8 md:px-10 md:py-12 lg:px-12 flex flex-col justify-between">
                     <div className="pointer-events-none absolute -left-10 top-6 h-24 w-24 rounded-full bg-primary-200/10 blur-2xl" />
                     <div className="max-w-2xl">
                        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-semibold text-secondary-800">
                           <Sparkles className="size-3.5 text-primary-500 animate-pulse" />
                           Find Trusted Local Helpers
                        </div>

                        <h3 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-[1.25] text-secondary-900 mb-6">
                           Need a plumber, electrician, cleaner, painter, carpenter, AC technician, or{" "}
                           <span className="bg-gradient-to-r from-primary-600 to-amber-600 bg-clip-text text-transparent">
                              any local service professional?
                           </span>
                        </h3>

                        <p className="text-secondary-600 text-sm md:text-base leading-relaxed mb-8">
                           ExtraHand helps you find trusted and verified service providers in your area quickly and easily. Whether you want to compare multiple offers within your budget or book a professional instantly at a fixed price, ExtraHand gives you complete flexibility.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                           <Link href="/tasks/new" className="w-full sm:w-auto">
                              <Button size="lg" className="group w-full sm:w-auto gap-2.5 bg-gradient-to-r from-primary-500 to-amber-500 hover:from-primary-600 hover:to-amber-600 text-white font-bold px-8 py-6 rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/35 transition-all duration-300 hover:-translate-y-0.5">
                                 Get Started Today
                                 <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                              </Button>
                           </Link>
                        </div>
                     </div>
                  </div>

                  {/* Right Column: Timeline Checklist */}
                  <div className="relative lg:col-span-5 border-t border-secondary-100 bg-secondary-50/10 px-6 py-8 md:px-8 md:py-10 lg:border-l lg:border-t-0 lg:px-10 flex flex-col justify-center overflow-hidden">
                     <p className="text-xs font-bold uppercase tracking-[0.22em] text-secondary-400 mb-6 px-4">
                        Get Started Today
                     </p>

                     {/* Process Flow Line */}
                     <div className="absolute left-[38px] lg:left-[54px] top-[74px] bottom-10 w-0.5 bg-secondary-200/60 pointer-events-none" />

                     <div className="space-y-4 relative">
                        {[
                           "Post Your Requirement",
                           "Set Your Budget",
                           "Receive Offers from Verified Professionals",
                           "Compare & Choose the Best Helper",
                           "Or Book Instantly at Fixed Prices",
                        ].map((item, idx) => (
                           <div
                              key={idx}
                              className="group flex items-start gap-4 relative pl-8 lg:pl-10"
                           >
                              {/* Step indicator node */}
                              <div className="absolute left-0 lg:left-2 top-2.5 size-6 rounded-full bg-emerald-500 text-white flex items-center justify-center z-10 transition-all duration-300 group-hover:bg-primary-500 group-hover:scale-110 shadow-sm">
                                 <Check className="size-3.5 stroke-[3]" />
                              </div>
                              
                              {/* Step text container */}
                              <div className="flex-1 bg-white border border-secondary-100 rounded-2xl p-4 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-primary-200/80 transition-all duration-300 hover:-translate-y-0.5 flex items-center justify-between gap-4">
                                 <span className="font-bold text-secondary-800 text-[13px] sm:text-sm leading-snug block transition-colors group-hover:text-secondary-950">
                                    {item}
                                 </span>
                                 <span className="text-[10px] font-black text-secondary-300 select-none">
                                    0{idx + 1}
                                 </span>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>

               </div>
            </div>

            {/* Why ExtraHand? Section */}
            <div className="mb-16 md:mb-24">
               <div className="text-center max-w-3xl mx-auto mb-12">
                  <h2 className="text-3xl md:text-5xl font-extrabold text-secondary-900 tracking-tight mb-4">
                     Why ExtraHand?
                  </h2>
                  <p className="text-secondary-600 text-base md:text-lg">
                     Unlike other service platforms, ExtraHand gives customers two powerful ways to hire professionals.
                  </p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Choose Your Budget */}
                  <div className="bg-white rounded-3xl border border-secondary-200/90 shadow-[0_8px_26px_rgba(15,23,42,0.06)] p-6 md:p-10 relative overflow-hidden flex flex-col justify-between">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-2xl rounded-full pointer-events-none" />
                     <div>
                        <div className="flex items-center justify-between gap-4 mb-6">
                           <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
                              Want the best deal?
                           </span>
                           <div className="size-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 flex items-center justify-center shrink-0">
                              <Scale className="size-6" />
                           </div>
                        </div>

                        <h3 className="text-2xl font-black text-secondary-900 mb-3">
                           Choose Your Budget
                        </h3>
                        
                        <p className="text-secondary-800 font-semibold text-[15px]/relaxed mb-3">
                           Simply post your requirement and tell us how much you want to spend.
                        </p>
                        
                        <p className="text-secondary-500 text-sm/relaxed mb-8">
                           Verified service providers will submit their offers, allowing you to compare prices, profiles, experience, and customer ratings before making a decision.
                        </p>
                     </div>

                     <div className="border-t border-secondary-100 pt-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-400 mb-4">
                           How It Works
                        </h4>
                        <div className="space-y-3">
                           {[
                              "Post your service requirement.",
                              "Set your preferred budget.",
                              "Receive offers from verified professionals.",
                              "Compare and select the best service provider.",
                              "Get the work done confidently.",
                           ].map((step, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                 <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold mt-0.5">
                                    {idx + 1}
                                 </span>
                                 <span className="text-secondary-700 text-sm font-medium">{step}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Instant Service */}
                  <div className="bg-white rounded-3xl border border-secondary-200/90 shadow-[0_8px_26px_rgba(15,23,42,0.06)] p-6 md:p-10 relative overflow-hidden flex flex-col justify-between">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-2xl rounded-full pointer-events-none" />
                     <div>
                        <div className="flex items-center justify-between gap-4 mb-6">
                           <span className="text-xs font-bold uppercase tracking-wider text-primary-600 bg-primary-50 px-3 py-1 rounded-full border border-primary-200/60">
                              Need help right now?
                           </span>
                           <div className="size-12 rounded-xl bg-primary-500/10 border border-primary-500/20 text-primary-600 flex items-center justify-center shrink-0">
                              <Zap className="size-6" />
                           </div>
                        </div>

                        <h3 className="text-2xl font-black text-secondary-900 mb-3">
                           Instant Service
                        </h3>
                        
                        <p className="text-secondary-800 font-semibold text-[15px]/relaxed mb-3">
                           Choose a service and book instantly at a transparent fixed price.
                        </p>
                        
                        <p className="text-secondary-500 text-sm/relaxed mb-8">
                           ExtraHand automatically assigns a verified nearby professional so your work starts faster.
                        </p>
                     </div>

                     <div className="border-t border-secondary-100 pt-6">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-secondary-400 mb-4">
                           How It Works
                        </h4>
                        <div className="space-y-3">
                           {[
                              "Select your service.",
                              "View the fixed price.",
                              "Confirm your booking.",
                              "Get matched with a verified professional.",
                              "Enjoy hassle-free service.",
                           ].map((step, idx) => (
                              <div key={idx} className="flex items-start gap-3">
                                 <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-800 text-[10px] font-bold mt-0.5">
                                    {idx + 1}
                                 </span>
                                 <span className="text-secondary-700 text-sm font-medium">{step}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Why Choose ExtraHand - H2 */}
            <div>
               <div className="mx-auto max-w-4xl text-center mb-8 md:mb-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-100 px-4 py-1.5 text-green-700 text-sm md:text-[15px] font-medium mb-4">
                     <Shield className="size-4" />
                     Your safety is our priority
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-2">
                     Why Customers Trust ExtraHand
                  </h2>
                  <p className="text-secondary-600 text-base md:text-xl/8">
                     We make your life easier by connecting you with trusted service
                     providers.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {whyChoosePoints.map((point, idx) => {
                     const Icon = point.icon;
                     return (
                        <div
                           key={idx}
                           className="group bg-white rounded-xl p-4 border border-secondary-100 shadow-sm hover:shadow-md hover:shadow-secondary-200/40 transition-all duration-300"
                        >
                           <div className="flex items-start gap-3">
                              <div
                                 className={cn(
                                    "inline-flex size-10 items-center justify-center rounded-lg shrink-0",
                                    point.iconBg
                                 )}
                              >
                                 <Icon className={cn("size-5", point.color)} />
                              </div>
                              <div>
                                 <h3 className="font-bold text-secondary-900 text-base mb-1">
                                    {point.title}
                                 </h3>
                                 <p className="text-secondary-600 text-sm/6">
                                    {point.description}
                                 </p>
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      </section>
   );
};

export default ServicesSection;
