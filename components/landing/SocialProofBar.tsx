/**
 * Social Proof Bar - Logos and metrics strip
 *
 * Positioned right after hero to build immediate trust
 * Shows key metrics and trust indicators
 */

"use client";

import { Star, Users, CheckCircle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const metrics = [
   {
      icon: Users,
      value: "50,000+",
      label: "Happy Customers",
   },
   {
      icon: CheckCircle,
      value: "1,00,000+",
      label: "Tasks Completed",
   },
   {
      icon: Star,
      value: "4.8/5",
      label: "Average Rating",
   },
   {
      icon: TrendingUp,
      value: "98%",
      label: "Satisfaction Rate",
   },
];

export const SocialProofBar: React.FC = () => {
   return (
      <section className="py-8 bg-white border-y border-secondary-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
               {metrics.map((metric, idx) => (
                  <div
                     key={idx}
                     className="flex flex-col items-center text-center group"
                  >
                     <div className="w-12 h-12 rounded-full bg-primary-50 flex items-center justify-center mb-3 group-hover:bg-primary-100 transition-colors">
                        <metric.icon className="w-6 h-6 text-primary-600" />
                     </div>
                     <p className="text-2xl sm:text-3xl font-bold text-secondary-900">
                        {metric.value}
                     </p>
                     <p className="text-sm text-secondary-500 mt-1">
                        {metric.label}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};

export default SocialProofBar;
