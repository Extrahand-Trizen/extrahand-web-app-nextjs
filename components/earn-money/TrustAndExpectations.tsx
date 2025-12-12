/**
 * Trust & Safety Section - Build confidence
 *
 * Design principles:
 * - Visual trust badges
 * - Clear safety features
 * - No fluff, concrete benefits
 */

"use client";

import {
   Shield,
   Lock,
   MessageCircle,
   Camera,
   Star,
   ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const trustFeatures = [
   {
      icon: Lock,
      title: "Guaranteed Payments",
      description:
         "Payments are secured on the platform and released once the task is completed as agreed.",
      color: "text-green-600",
      bgColor: "bg-green-50",
   },
   {
      icon: Star,
      title: "Fair Reviews",
      description:
         "Ratings are based only on completed tasks, helping build a reliable work history over time.",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
   },
   {
      icon: MessageCircle,
      title: "Safe Communication",
      description:
         "Chat with customers through the app without sharing personal contact details.",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
   },
   {
      icon: Camera,
      title: "Work Confirmation",
      description:
         "Share updates or photos to confirm task progress and completion when needed.",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
   },
   {
      icon: ShieldCheck,
      title: "Support When Needed",
      description:
         "If there’s a disagreement or issue, our support team helps resolve it fairly.",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
   },
];

interface TrustCardProps {
   feature: (typeof trustFeatures)[0];
}

const TrustCard: React.FC<TrustCardProps> = ({ feature }) => (
   <div className="flex items-start gap-4 p-3 md:p-5 rounded-xl bg-white border border-secondary-100 hover:border-secondary-200 hover:shadow-md transition-all">
      <div
         className={cn(
            "size-10 md:size-12 rounded-md md:rounded-xl flex items-center justify-center shrink-0",
            feature.bgColor
         )}
      >
         <feature.icon className={cn("size-5 md:size-6", feature.color)} />
      </div>
      <div>
         <h3 className="font-bold text-secondary-900 md:text-lg mb-1">
            {feature.title}
         </h3>
         <p className="text-secondary-600 text-xs md:text-sm leading-relaxed">
            {feature.description}
         </p>
      </div>
   </div>
);

export const TrustAndExpectations: React.FC = () => {
   return (
      <section id="trust" className="py-12 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section header */}
            <div className="text-center mb-12">
               <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium mb-4">
                  <Shield className="size-3 md:size-4" />
                  Your safety is our priority
               </div>
               <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-4">
                  Trust & Safety Built In
               </h2>
               <p className="text-sm md:text-lg text-secondary-600 max-w-2xl mx-auto">
                  We've built multiple layers of protection so you can get
                  things done with complete peace of mind.
               </p>
            </div>

            {/* Features grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
               {trustFeatures.map((feature, idx) => (
                  <TrustCard key={idx} feature={feature} />
               ))}
            </div>
         </div>
      </section>
   );
};
