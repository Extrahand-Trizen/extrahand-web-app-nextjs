"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
   Users,
   Briefcase,
   Award,
   TrendingUp,
   Calendar,
   ArrowRight,
   CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const partnerBenefits = [
   {
      icon: Users,
      title: "Get Genuine Customer Leads",
      description: "Connect directly with local customers searching for your specific expertise.",
      color: "text-amber-600",
      iconBg: "bg-amber-50 border-amber-200/60",
   },
   {
      icon: Briefcase,
      title: "Receive More Opportunities",
      description: "Access a constant stream of jobs posted daily in your neighborhood.",
      color: "text-blue-600",
      iconBg: "bg-blue-50 border-blue-200/60",
   },
   {
      icon: Award,
      title: "Build Your Local Reputation",
      description: "Showcase reviews, ratings, and badges that establish trust with clients.",
      color: "text-emerald-600",
      iconBg: "bg-emerald-50 border-emerald-200/60",
   },
   {
      icon: TrendingUp,
      title: "Grow Your Income",
      description: "Choose jobs that match your rates and grow your earnings on your own terms.",
      color: "text-pink-600",
      iconBg: "bg-pink-50 border-pink-200/60",
   },
   {
      icon: Calendar,
      title: "Manage Bookings Easily",
      description: "Use our clean dashboard tools to organize, track, and complete your bookings.",
      color: "text-purple-600",
      iconBg: "bg-purple-50 border-purple-200/60",
   },
];

export const PartnerSection: React.FC = () => {
   return (
      <section className="relative overflow-hidden bg-linear-to-b from-white to-primary-50/20 py-16 md:py-24 text-secondary-900 border-b border-secondary-100">
         {/* Background ambient light effects */}
         <div className="pointer-events-none absolute -left-40 top-1/4 h-[30rem] w-[30rem] rounded-full bg-primary-200/20 blur-3xl" />
         <div className="pointer-events-none absolute -right-40 bottom-1/4 h-[30rem] w-[30rem] rounded-full bg-amber-100/20 blur-3xl" />
         
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
               
               {/* Left Column: CTA Card */}
               <div className="lg:col-span-5 space-y-6">
                  <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-xs font-semibold text-secondary-800 uppercase tracking-wider">
                     Looking for Work?
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] tracking-tight text-secondary-900">
                     Become an ExtraHand <br />
                     <span className="bg-gradient-to-r from-primary-600 to-amber-600 bg-clip-text text-transparent">
                        Service Partner
                     </span>
                  </h2>
                  
                  <p className="text-secondary-600 text-base sm:text-lg leading-relaxed max-w-lg">
                     Join thousands of professionals who are growing their business and managing their daily bookings through ExtraHand.
                  </p>

                  <div className="pt-4">
                     <Link href="/earn-money">
                        <Button 
                           size="lg" 
                           className="group w-full sm:w-auto gap-2.5 bg-gradient-to-r from-primary-500 to-amber-500 hover:from-primary-600 hover:to-amber-600 text-white font-bold px-8 py-6 rounded-xl shadow-md shadow-primary-500/20 hover:shadow-primary-500/35 transition-all duration-300 hover:-translate-y-0.5"
                        >
                           Register as a Service Provider Today
                           <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </Button>
                     </Link>
                  </div>
               </div>

               {/* Right Column: Benefits Grid */}
               <div className="lg:col-span-7">
                  <div className="border border-secondary-200/80 bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-secondary-100/50 relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-2xl rounded-full pointer-events-none" />
                     
                     <h3 className="text-xl font-bold text-secondary-900 mb-6 flex items-center gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                           <CheckCircle2 className="size-3.5" />
                        </span>
                        Benefits for Service Providers
                     </h3>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {partnerBenefits.map((benefit, idx) => {
                           const Icon = benefit.icon;
                           return (
                              <div 
                                 key={idx}
                                 className="group flex flex-col gap-3 rounded-2xl border border-secondary-100 bg-secondary-50/20 p-5 hover:border-primary-200/60 hover:bg-primary-50/10 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden"
                              >
                                 {/* Index number on the top right */}
                                 <span className="absolute top-4 right-4 text-[10px] font-black text-secondary-300 select-none">
                                    0{idx + 1}
                                 </span>

                                 <div className={cn(
                                    "inline-flex size-10 items-center justify-center rounded-xl border shrink-0",
                                    benefit.iconBg
                                 )}>
                                    <Icon className={cn("size-5", benefit.color)} />
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-secondary-900 text-sm mb-1 group-hover:text-primary-950 transition-colors">
                                       {benefit.title}
                                    </h4>
                                    <p className="text-secondary-600 text-xs leading-relaxed">
                                       {benefit.description}
                                    </p>
                                 </div>
                              </div>
                           );
                        })}
                     </div>
                  </div>
               </div>

            </div>
         </div>
      </section>
   );
};

export default PartnerSection;
