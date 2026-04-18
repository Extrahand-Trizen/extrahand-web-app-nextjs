/**
 * How It Works Section - Simple 4-step booking flow
 */

"use client";

import React from "react";
import { FileText, Users, CheckCircle, CalendarCheck, Wallet } from "lucide-react";

const bookingSteps = [
   {
      step: 1,
      icon: FileText,
      title: "Post Your Task or Choose a Service",
      description: "Share what you need and include your preferred budget.",
      highlight: "Easy to start",
   },
   {
      step: 2,
      icon: Users,
      title: "Get Matched with Verified Experts",
      description: "Review trusted professionals matched to your requirement.",
      highlight: "Verified professionals",
   },
   {
      step: 3,
      icon: CalendarCheck,
      title: "Select Time & Confirm Booking",
      description: "Pick a convenient slot and confirm quickly.",
      highlight: "Flexible scheduling",
   },
   {
      step: 4,
      icon: Wallet,
      title: "Get Work Done at Your Doorstep",
      description: "Sit back while experts complete the job safely and on time.",
      highlight: "Simple and budget-friendly",
   },
];

interface StepCardProps {
   step: number;
   icon: React.ComponentType<{ className?: string }>;
   title: string;
   description: string;
   highlight: string;
   isLast: boolean;
}

const StepCard: React.FC<StepCardProps> = ({
   step,
   icon: Icon,
   title,
   description,
   highlight,
   isLast,
}) => (
   <div className="relative flex flex-col items-center text-center">
      {/* Connector line - hidden on mobile and for last item */}
      {!isLast && (
         <div className="hidden md:block absolute top-10 left-[calc(50%+40px)] w-[calc(100%-80px)] h-0.5 bg-secondary-200">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 border-t-2 border-r-2 border-secondary-300 rotate-45" />
         </div>
      )}

      {/* Step number with icon */}
      <div className="relative z-10 w-14 h-14 md:w-20 md:h-20 rounded-full bg-primary-500 flex items-center justify-center mb-4 md:mb-6 shadow-lg shadow-primary-500/25">
         <Icon className="size-6 md:size-8 text-secondary-900" />
         <span className="absolute -top-2 -right-2 w-6 md:size-8 h-6 bg-secondary-900 text-white rounded-full flex items-center justify-center text-xs md:text-sm font-bold">
            {step}
         </span>
      </div>

      {/* Content */}
      <h3 className="md:text-xl font-bold text-secondary-900 mb-2 md:mb-3">{title}</h3>
      <p className="text-xs md:text-base text-secondary-600 leading-relaxed mb-3 md:mb-4 max-w-xs">
         {description}
      </p>

      {/* Highlight badge */}
      <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-xs md:text-sm font-medium rounded-full">
         <CheckCircle className="size-3 md:size-3.5 mr-1.5" />
         {highlight}
      </span>
   </div>
);

export const HowItWorksSection: React.FC = () => {
   return (
      <section id="how-it-works" className="py-12 md:py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-12">
               <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-4">
                  How It Works
               </h2>
               <p className="text-sm md:text-lg text-secondary-600 max-w-2xl mx-auto">
                  Simple, Smart & Budget-Friendly Booking
               </p>
            </div>

            {/* Steps grid */}
            <div className="grid md:grid-cols-4 gap-6 md:gap-8">
               {bookingSteps.map((step, idx) => (
                  <StepCard
                     key={step.step}
                     {...step}
                     isLast={idx === bookingSteps.length - 1}
                  />
               ))}
            </div>
         </div>
      </section>
   );
};

export default HowItWorksSection;
