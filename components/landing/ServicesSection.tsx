"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
   CheckCircle2,
   Sparkles,
   ArrowRight,
   Layers,
   Shield,
   Zap,
   Briefcase,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const whyChoosePoints = [
   {
      icon: Layers,
      title: "Compare Service Providers Easily",
      description: "Compare profiles, ratings, and offers to pick the right pro.",
      color: "text-blue-600",
      iconBg: "bg-blue-50",
   },
   {
      icon: Shield,
      title: "Set Your Own Budget for Services",
      description: "Post your task with your budget and receive matching quotes.",
      color: "text-green-600",
      iconBg: "bg-green-50",
   },
   {
      icon: CheckCircle2,
      title: "Verified & Skilled Professionals",
      description: "Work with trusted taskers verified for quality and reliability.",
      color: "text-amber-600",
      iconBg: "bg-amber-50",
   },
   {
      icon: Sparkles,
      title: "Transparent Communication",
      description: "Clear in-app communication keeps you updated at every step.",
      color: "text-purple-600",
      iconBg: "bg-purple-50",
   },
   {
      icon: Zap,
      title: "Quick Response & Booking",
      description: "Get fast responses and confirm bookings in just a few taps.",
      color: "text-orange-600",
      iconBg: "bg-orange-50",
   },
   {
      icon: Briefcase,
      title: "All Services in One Platform",
      description: "From home fixes to daily tasks, manage everything in one place.",
      color: "text-red-600",
      iconBg: "bg-red-50",
   },
];

export const ServicesSection: React.FC = () => {
   return (
      <section className="relative py-14 md:py-24 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(255,245,220,0.5),rgba(255,255,255,1))] overflow-hidden">
         <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-primary-200/25 blur-3xl" />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* One Platform Section - H2 */}
            <div className="mb-16 md:mb-24 overflow-hidden rounded-2xl border border-secondary-200 bg-white shadow-sm">
               <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-7 px-6 py-8 md:px-10 md:py-12 lg:px-12">
                     <div className="max-w-2xl">
                        <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700">
                           <Sparkles className="size-3.5" />
                           India&apos;s Smart Home Services Platform
                        </div>

                        <h2 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-secondary-900 md:text-4xl xl:text-5xl">
                           One Platform to Book{" "}
                           <span className="text-primary-500">Home Services</span>{" "}
                           Within Your Budget
                        </h2>

                        <p className="mt-5 max-w-xl text-base leading-relaxed text-secondary-600 md:text-lg">
                           ExtraHand connects customers with verified service providers.
                           Post your requirement, set your budget, and get the best service
                           at your price with no surprises.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                           <Link href="/tasks/new" className="w-full sm:w-auto">
                              <Button size="lg" className="group w-full gap-2 px-7">
                                 Post Your Requirement
                                 <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                              </Button>
                           </Link>
                           <Link href="/tasks" className="w-full sm:w-auto">
                              <Button
                                 size="lg"
                                 variant="outline"
                                 className="w-full border-secondary-300 bg-white px-7 hover:bg-secondary-50"
                              >
                                 Get Quotes Now
                              </Button>
                           </Link>
                        </div>
                     </div>
                  </div>

                  <div className="lg:col-span-5 border-t border-secondary-200 bg-secondary-50/40 px-6 py-8 md:px-10 md:py-12 lg:border-l lg:border-t-0 lg:px-10">
                     <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary-400">
                        How it works
                     </p>
                     <p className="mt-1 text-lg font-bold text-secondary-900">
                        Four steps, done simply
                     </p>

                     <div className="mt-6 space-y-3">
                        {[
                           "Post Your Requirement",
                           "Set Your Budget",
                           "Get Matched with Experts",
                           "Book Instantly",
                        ].map((step, idx) => (
                           <div
                              key={step}
                              className="flex items-center gap-3 rounded-xl border border-secondary-200 bg-white px-4 py-3"
                           >
                              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                                 {String(idx + 1).padStart(2, "0")}
                              </span>
                              <span className="font-semibold text-secondary-900">{step}</span>
                           </div>
                        ))}
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
                     Why Choose ExtraHand
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
