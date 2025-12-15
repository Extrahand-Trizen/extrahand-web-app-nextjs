"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { WhyJoinFeature } from "@/types/category";
import { Clock, Zap, Lock, Lightbulb, ArrowRight } from "lucide-react";

interface WhyJoinSectionProps {
   title: string;
   features: WhyJoinFeature[];
   buttonText: string;
}

const iconMap = [Clock, Zap, Lock, Lightbulb];

export const WhyJoinSection: React.FC<WhyJoinSectionProps> = ({
   title,
   features,
   buttonText,
}) => {
   return (
      <section className="py-16 md:py-24 px-4 bg-stone-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-12 md:mb-16">
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  {title}
               </h2>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-12">
               {features.map((feature, index) => {
                  const IconComponent = iconMap[index] || Clock;
                  return (
                     <div key={index} className="flex gap-5">
                        <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl p-1 bg-white shadow-sm flex items-center justify-center mb-5 group-hover:shadow-md transition-shadow">
                           <IconComponent className="size-6 md:size-7 text-slate-700" />
                        </div>
                        <div className="flex flex-col">
                           <h4 className="md:text-lg font-semibold text-slate-900 mb-2">
                              {feature.title}
                           </h4>
                           <p className="text-slate-600 leading-relaxed text-xs md:text-sm">
                              {feature.description}
                           </p>
                        </div>
                     </div>
                  );
               })}
            </div>

            {/* CTA */}
            <div>
               <Button className="h-11 px-6 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm">
                  {buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
         </div>
      </section>
   );
};
