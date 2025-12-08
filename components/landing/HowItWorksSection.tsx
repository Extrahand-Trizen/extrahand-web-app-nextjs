/**
 * How It Works Section - Clean 3-step flow
 *
 * Design principles:
 * - Separate flows for Posters and Taskers
 * - Visual connection between steps
 * - Clear, actionable descriptions
 * - Strong CTA at the end
 */

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
   FileText,
   Users,
   CheckCircle,
   ArrowRight,
   Briefcase,
   MessageSquare,
   Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UserRole = "poster" | "tasker";

const posterSteps = [
   {
      step: 1,
      icon: FileText,
      title: "Post Your Task",
      description:
         "Describe what you need done, set your budget, and choose when you need it completed.",
      highlight: "Free to post",
   },
   {
      step: 2,
      icon: Users,
      title: "Get Quotes",
      description:
         "Verified taskers in your area will send you offers. Compare ratings, reviews, and prices.",
      highlight: "Usually within hours",
   },
   {
      step: 3,
      icon: CheckCircle,
      title: "Get It Done",
      description:
         "Choose your tasker, track progress in real-time, and pay securely when the task is complete.",
      highlight: "100% satisfaction guaranteed",
   },
];

const taskerSteps = [
   {
      step: 1,
      icon: Briefcase,
      title: "Browse Tasks",
      description:
         "Find tasks that match your skills and availability. Filter by category, location, and budget.",
      highlight: "Flexible schedule",
   },
   {
      step: 2,
      icon: MessageSquare,
      title: "Make Offers",
      description:
         "Send your best offer with a personal message. Stand out with your ratings and reviews.",
      highlight: "Set your own rates",
   },
   {
      step: 3,
      icon: Wallet,
      title: "Get Paid",
      description:
         "Complete the task, upload proof of work, and receive secure payment directly to your account.",
      highlight: "Fast, secure payments",
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
      <div className="relative z-10 w-20 h-20 rounded-full bg-primary-500 flex items-center justify-center mb-6 shadow-lg shadow-primary-500/25">
         <Icon className="w-8 h-8 text-secondary-900" />
         <span className="absolute -top-2 -right-2 w-7 h-7 bg-secondary-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
            {step}
         </span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-bold text-secondary-900 mb-3">{title}</h3>
      <p className="text-secondary-600 leading-relaxed mb-4 max-w-xs">
         {description}
      </p>

      {/* Highlight badge */}
      <span className="inline-flex items-center px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full">
         <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
         {highlight}
      </span>
   </div>
);

export const HowItWorksSection: React.FC = () => {
   const [activeRole, setActiveRole] = useState<UserRole>("poster");
   const steps = activeRole === "poster" ? posterSteps : taskerSteps;

   return (
      <section id="how-it-works" className="py-20 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-12">
               <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-4">
                  How ExtraHand Works
               </h2>
               <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
                  Whether you need help or want to earn, getting started takes
                  just minutes.
               </p>
            </div>

            {/* Role toggle */}
            <div className="flex justify-center mb-12">
               <div className="inline-flex p-1.5 bg-secondary-100 rounded-xl">
                  <button
                     onClick={() => setActiveRole("poster")}
                     className={cn(
                        "px-6 py-3 rounded-lg font-semibold text-sm transition-all",
                        activeRole === "poster"
                           ? "bg-white text-secondary-900 shadow-md"
                           : "text-secondary-600 hover:text-secondary-900"
                     )}
                  >
                     I need help
                  </button>
                  <button
                     onClick={() => setActiveRole("tasker")}
                     className={cn(
                        "px-6 py-3 rounded-lg font-semibold text-sm transition-all",
                        activeRole === "tasker"
                           ? "bg-white text-secondary-900 shadow-md"
                           : "text-secondary-600 hover:text-secondary-900"
                     )}
                  >
                     I want to earn
                  </button>
               </div>
            </div>

            {/* Steps grid */}
            <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-16">
               {steps.map((step, idx) => (
                  <StepCard
                     key={`${activeRole}-${step.step}`}
                     {...step}
                     isLast={idx === steps.length - 1}
                  />
               ))}
            </div>

            {/* CTA */}
            <div className="text-center">
               <Link href={activeRole === "poster" ? "/tasks/new" : "/signup"}>
                  <Button
                     size="lg"
                     className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-bold text-lg px-10 py-6 rounded-xl shadow-lg shadow-primary-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5"
                  >
                     {activeRole === "poster"
                        ? "Post Your First Task"
                        : "Start Earning Today"}
                     <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
               </Link>
            </div>
         </div>
      </section>
   );
};

export default HowItWorksSection;
