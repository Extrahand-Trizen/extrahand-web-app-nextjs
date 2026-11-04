"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
   ArrowRight,
   LayoutGrid,
   CalendarDays,
   CircleCheck,
   Sparkles,
} from "lucide-react";
import { redirectToAppStore } from "@/lib/utils/getAppStoreUrl";

const bookingSteps = [
   {
      title: "Choose a Service",
      icon: LayoutGrid,
      className: "justify-start",
   },
   {
      title: "Schedule & Book",
      icon: CalendarDays,
      className: "justify-center",
   },
   {
      title: "Get It Done",
      icon: CircleCheck,
      className: "justify-end",
   },
];

export const ServicesSection: React.FC = () => {
   return (
      <section className="rounded-[30px] border border-secondary-200/80 bg-[#f5f1e8] p-5 shadow-[0_4px_22px_rgba(17,24,39,0.04)] sm:p-7">
         <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr] xl:items-center">
            <div className="space-y-5">
               <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1.5 text-xs font-semibold text-secondary-800 shadow-sm">
                  <Sparkles className="size-3.5 text-primary-500" />
                  Home Services
               </div>

               <div>
                  <h2 className="max-w-[280px] text-[2.3rem] font-black leading-[0.8] tracking-[-0.06em] text-secondary-900 sm:text-[3rem]">
                     Book Trusted
                     <br />
                     Home
                     <br />
                     Services
                  </h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-secondary-600">
                     Find verified professionals for your home needs.
                  </p>
               </div>

               <Button
                  size="lg"
                  onClick={() => redirectToAppStore()}
                  className="group w-full gap-2.5 bg-gradient-to-r from-primary-500 to-amber-500 px-6 py-6 text-base font-bold text-white shadow-md shadow-primary-500/20 hover:from-primary-600 hover:to-amber-600 sm:w-auto"
               >
                  Book a Service
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
               </Button>
            </div>

            <div className="rounded-[24px] border border-secondary-200/80 bg-white/60 p-4 backdrop-blur-sm sm:p-5">
               <div className="mb-4 flex items-center justify-center">
                  <div className="text-xs font-bold uppercase tracking-[0.22em] text-secondary-400">
                     HOW IT WORKS
                  </div>
               </div>

               <div className="space-y-3">
                  {bookingSteps.map((item, idx) => {
                     const Icon = item.icon;
                     return (
                        <div
                           key={item.title}
                           className={"group flex w-full items-center gap-3 rounded-2xl border border-secondary-100 bg-white p-3 shadow-sm transition-all duration-200 hover:border-primary-200 hover:shadow-md " + item.className}
                        >
                           <div className="flex size-9 items-center justify-center rounded-full bg-emerald-500 text-sm font-bold text-white shadow-sm">
                              {idx + 1}
                           </div>
                           <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                              <Icon className="size-4" />
                           </div>
                           <div className="min-w-0 flex-1">
                              <p className="text-base font-bold text-secondary-800 whitespace-nowrap">{item.title}</p>
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
