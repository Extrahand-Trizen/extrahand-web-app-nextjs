/**
 * City Stats - Production Ready
 * How it works + local activity/trust
 */

"use client";

import { Upload, Users, CheckCircle, TrendingUp } from "lucide-react";
import { CityInfo } from "@/lib/data/cities";

interface CityStatsProps {
   city: CityInfo;
}

export function CityStats({ city }: CityStatsProps) {
   const steps = [
      {
         icon: Upload,
         title: `Post a task in ${city.name}`,
         description: "Describe what you need help with and set your budget.",
      },
      {
         icon: Users,
         title: "Get offers from local taskers",
         description:
            "Review profiles, ratings, and prices from verified taskers.",
      },
      {
         icon: CheckCircle,
         title: "Choose and confirm",
         description: "Pick the right tasker and get your task done.",
      },
   ];

   return (
      <section className="py-16 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* How it works */}
            <div className="mb-16">
               <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                  How ExtraHand Works in {city.name}
               </h2>
               <div className="grid md:grid-cols-3 gap-8">
                  {steps.map((step, index) => (
                     <div key={index} className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                           <step.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                           {step.title}
                        </h3>
                        <p className="text-gray-600">{step.description}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* Local activity strip */}
            <div className="bg-gray-50 rounded-lg p-8">
               <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                  <div>
                     <div className="text-3xl font-bold text-gray-900 mb-1">
                        {city.activeTasks.toLocaleString()}
                     </div>
                     <div className="text-sm text-gray-600">Active tasks</div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-gray-900 mb-1">
                        {city.activeTaskers.toLocaleString()}+
                     </div>
                     <div className="text-sm text-gray-600">Local taskers</div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-gray-900 mb-1">
                        {city.completedTasks.toLocaleString()}+
                     </div>
                     <div className="text-sm text-gray-600">
                        Tasks completed
                     </div>
                  </div>
                  <div>
                     <div className="text-3xl font-bold text-gray-900 mb-1">
                        {city.avgRating} ★
                     </div>
                     <div className="text-sm text-gray-600">Average rating</div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
