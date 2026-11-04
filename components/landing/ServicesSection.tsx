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
   LayoutGrid,
   CalendarDays,
   FileText,
   UsersRound,
   CircleCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { redirectToAppStore } from "@/lib/utils/getAppStoreUrl";

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
            <div
               aria-label="Home service booking steps"
               className="mb-16 scroll-mt-28 overflow-hidden rounded-3xl border border-secondary-200/90 bg-gradient-to-br from-white via-secondary-50/20 to-primary-50/15 shadow-[0_8px_30px_rgb(0,0,0,0.03)] md:mb-24"
               data-home-tab-step
               role="region"
               tabIndex={-1}
            >
               <div className="grid grid-cols-1 lg:grid-cols-12">
                  
                  {/* Left Column: Heading & Description */}
                  <div className="relative lg:col-span-7 px-6 py-8 md:px-10 md:py-12 lg:px-12 flex flex-col justify-between">
                     <div className="pointer-events-none absolute -left-10 top-6 h-24 w-24 rounded-full bg-primary-200/10 blur-2xl" />
                     <div className="max-w-2xl">
                        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-semibold text-secondary-800">
                           <Sparkles className="size-3.5 text-primary-500 animate-pulse" />
                           Find Trusted Local Professionals
                        </div>

                        <h3 className="text-2xl sm:text-3xl lg:text-[2.2rem] font-extrabold leading-[1.25] text-secondary-900 mb-6">
                           Need a plumber, electrician, cleaner, painter, carpenter, AC technician, or{" "}
                           <span className="bg-gradient-to-r from-primary-600 to-amber-600 bg-clip-text text-transparent">
                              any home service professional?
                           </span>
                        </h3>

                        <p className="text-secondary-600 text-sm md:text-base leading-relaxed mb-8">
                           ExtraHand makes it easy to book trusted and verified professionals for your everyday home service needs. Simply choose the service you need, select your preferred schedule, and confirm your booking. We&apos;ll assign a suitable professional to get the job done.
                        </p>

                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                           <Button size="lg" onClick={() => redirectToAppStore()} className="group w-full sm:w-auto gap-2.5 bg-gradient-to-r from-primary-500 to-amber-500 hover:from-primary-600 hover:to-amber-600 text-white font-bold px-8 py-6 rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/35 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
                              Book a Service
                              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                           </Button>
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
                           {
                             title: "Choose Your Service",
                             description: "Select the home service you need.",
                             icon: LayoutGrid,
                           },
                           {
                             title: "Select Date & Time",
                             description: "Choose your preferred service schedule.",
                             icon: CalendarDays,
                           },
                           {
                             title: "Confirm Your Booking",
                             description: "Review the details and confirm your booking.",
                             icon: FileText,
                           },
                           {
                             title: "Get Matched with a Professional",
                             description: "ExtraHand assigns a suitable verified professional.",
                             icon: UsersRound,
                           },
                           {
                             title: "Get Your Service Done",
                             description: "Your assigned professional arrives and completes the service.",
                             icon: CircleCheck,
                           },
                        ].map((item, idx) => (
                           <div
                             key={item.title}
                             className="group flex items-start gap-3 relative pl-8 lg:pl-10"
                           >
                             <div className="absolute left-0 lg:left-2 top-2.5 size-6 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center z-10 transition-all duration-300 group-hover:bg-primary-500 group-hover:scale-110 shadow-sm">
                                {idx + 1}
                             </div>
                              
                             <div className="flex-1 bg-white border border-secondary-100 rounded-2xl px-3 py-2.5 md:px-4 md:py-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-primary-200/80 transition-all duration-300 hover:-translate-y-0.5 flex items-center gap-3">
                                <div className="size-9 md:size-10 shrink-0 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                                   <item.icon className="size-4 md:size-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                   <span className="font-bold text-secondary-800 text-[13px] sm:text-sm leading-snug block transition-colors group-hover:text-secondary-950">
                                      {item.title}
                                   </span>
                                   <span className="mt-0.5 text-[11px] md:text-xs text-secondary-500 leading-snug block">
                                      {item.description}
                                   </span>
                                </div>
                             </div>
                           </div>
                        ))}
                     </div>
                  </div>

               </div>
            </div>

            {/* Why Choose ExtraHand - H2 */}
            <div
               aria-label="Why customers trust ExtraHand"
               className="scroll-mt-28"
               data-home-tab-step
               role="region"
               tabIndex={-1}
            >
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
