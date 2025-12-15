"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { User, Star, Shield, ArrowRight } from "lucide-react";

interface InsuranceCoverFeature {
   icon?: string;
   subtitle?: string;
   subdescription?: string;
}

interface InsuranceCoverSectionProps {
   title?: string;
   description?: string;
   features: InsuranceCoverFeature[];
   buttonText?: string;
}

const getIcon = (iconName?: string) => {
   switch (iconName) {
      case "human":
         return <User className="w-6 h-6 text-slate-700" />;
      case "star":
         return <Star className="w-6 h-6 text-amber-500 fill-amber-500" />;
      default:
         return <Shield className="w-6 h-6 text-slate-700" />;
   }
};

export const InsuranceCoverSection: React.FC<InsuranceCoverSectionProps> = ({
   title,
   description,
   features,
   buttonText,
}) => {
   if (!features || features.length === 0) return null;

   return (
      <section className="py-16 md:py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
               {/* Left Content */}
               <div>
                  {title && (
                     <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
                        {title}
                     </h2>
                  )}
                  {description && (
                     <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        {description}
                     </p>
                  )}
                  {buttonText && (
                     <Button className="h-11 px-6 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm">
                        {buttonText}
                        <ArrowRight className="w-4 h-4 ml-2" />
                     </Button>
                  )}
               </div>

               {/* Right Features */}
               <div className="space-y-8">
                  {features.map((feature, index) => (
                     <div key={index} className="flex gap-4">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                           {getIcon(feature.icon)}
                        </div>
                        <div>
                           {feature.subtitle && (
                              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                 {feature.subtitle}
                              </h3>
                           )}
                           {feature.subdescription && (
                              <p className="text-slate-600 leading-relaxed">
                                 {feature.subdescription}
                              </p>
                           )}
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
};
