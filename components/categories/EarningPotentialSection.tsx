"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

interface EarningPotentialSectionProps {
   title?: string;
   description?: string;
   data?: {
      weekly?: { "1-2"?: string; "3-5"?: string; "5+"?: string };
      monthly?: { "1-2"?: string; "3-5"?: string; "5+"?: string };
      yearly?: { "1-2"?: string; "3-5"?: string; "5+"?: string };
   };
   disclaimer?: string;
   buttonText?: string;
   selectedPeriod: "weekly" | "monthly" | "yearly";
   onPeriodChange: (period: "weekly" | "monthly" | "yearly") => void;
}

export const EarningPotentialSection: React.FC<
   EarningPotentialSectionProps
> = ({
   title,
   description,
   data,
   disclaimer,
   buttonText,
   selectedPeriod,
   onPeriodChange,
}) => {
   if (!data) return null;
   if (!title) return null; // Don't render without title from DB

   const periodLabels = {
      weekly: "per week",
      monthly: "per month",
      yearly: "per year",
   };

   const currentData = data[selectedPeriod] || {};

   const earningTiers = [
      { key: "1-2" as const, label: "1-2 tasks/week", description: "Casual" },
      { key: "3-5" as const, label: "3-5 tasks/week", description: "Regular" },
      { key: "5+" as const, label: "5+ tasks/week", description: "Active" },
   ];

   return (
      <section className="py-16 md:py-24 bg-slate-900">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-10 md:mb-12">
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                  {title}
               </h2>
               {description && (
                  <p className="text-lg text-slate-300 max-w-2xl">
                     {description}
                  </p>
               )}
            </div>

            {/* Period Selector */}
            <div className="flex gap-2 mb-10">
               {(["weekly", "monthly", "yearly"] as const).map((period) => (
                  <button
                     key={period}
                     onClick={() => onPeriodChange(period)}
                     className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                        selectedPeriod === period
                           ? "bg-amber-500 text-white"
                           : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                     }`}
                  >
                     {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
               ))}
            </div>

            {/* Earnings Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
               {earningTiers.map((tier) => (
                  <Card key={tier.key} className="bg-white border-0 shadow-lg">
                     <CardContent className="p-6 text-center">
                        <p className="text-sm text-slate-500 mb-1">
                           {tier.description}
                        </p>
                        <p className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
                           {currentData[tier.key] || "₹0"}
                        </p>
                        <p className="text-sm text-slate-500 mb-3">
                           {periodLabels[selectedPeriod]}
                        </p>
                        <p className="text-sm font-medium text-slate-700">
                           {tier.label}
                        </p>
                     </CardContent>
                  </Card>
               ))}
            </div>

            {/* Disclaimer */}
            {disclaimer && (
               <p className="text-sm text-slate-400 mb-8 max-w-3xl">
                  {disclaimer}
               </p>
            )}

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
