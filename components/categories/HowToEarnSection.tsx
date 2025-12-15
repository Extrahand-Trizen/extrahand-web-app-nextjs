"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HowToEarnStep {
   image?: string;
   subtitle?: string;
   description?: string;
}

interface HowToEarnSectionProps {
   title?: string;
   steps: HowToEarnStep[];
   buttonText?: string;
}

export const HowToEarnSection: React.FC<HowToEarnSectionProps> = ({
   title,
   steps,
   buttonText,
}) => {
   if (!steps || steps.length === 0) return null;

   return (
      <section className="py-16 md:py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-12 md:mb-16">
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                  {title || "How to earn money on Extrahand"}
               </h2>
            </div>

            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12 mb-12">
               {steps.map((step, index) => (
                  <div key={index} className="group">
                     {/* Step Number */}
                     <div className="flex items-center gap-3 mb-4">
                        <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600">
                           {index + 1}
                        </span>
                        {step.subtitle && (
                           <h3 className="text-lg font-semibold text-slate-900">
                              {step.subtitle}
                           </h3>
                        )}
                     </div>

                     {/* Image */}
                     {step.image && (
                        <div className="relative w-full h-44 mb-4 rounded-xl overflow-hidden bg-slate-100">
                           {step.image.startsWith("data:") ||
                           step.image.startsWith("http") ? (
                              <img
                                 src={step.image}
                                 alt={step.subtitle || `Step ${index + 1}`}
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                           ) : (
                              <Image
                                 src={step.image}
                                 alt={step.subtitle || `Step ${index + 1}`}
                                 fill
                                 className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                           )}
                        </div>
                     )}

                     {/* Description */}
                     {step.description && (
                        <p className="text-slate-600 leading-relaxed">
                           {step.description}
                        </p>
                     )}
                  </div>
               ))}
            </div>

            {/* CTA */}
            {buttonText && (
               <Button className="h-11 px-6 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm">
                  {buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            )}
         </div>
      </section>
   );
};
