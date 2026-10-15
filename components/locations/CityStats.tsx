/**
 * City Stats - Production Ready
 * How it works + local activity/trust
 */

"use client";

import { Upload, Users, CheckCircle } from "lucide-react";
import type { CityInfo } from "@/lib/data/cities";
import type { CityPageContent } from "@/lib/data/city-page-content";

interface CityStatsProps {
   city: CityInfo;
   howItWorks?: CityPageContent["howItWorks"];
   statsTitle?: string;
   section?: "howItWorks" | "stats";
}

export function CityStats({
   city,
   howItWorks,
   statsTitle,
   section,
}: CityStatsProps) {
   const steps = [
      {
         id: "describe-task",
         icon: Upload,
         title: `Get help in ${city.name}`,
         description: "Describe what you need help with and set your budget.",
      },
      {
         id: "review-offers",
         icon: Users,
         title: "Get offers from local helpers",
         description:
            "Review profiles, ratings, and prices from verified helpers.",
      },
      {
         id: "choose-helper",
         icon: CheckCircle,
         title: "Choose and confirm",
         description: "Pick the right helper and get your task done.",
      },
   ];

   return (
      <section className="py-16 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {section !== "stats" && (
               <div className={section ? "" : "mb-16"}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">
                     {howItWorks?.title ?? `How ExtraHand Works in ${city.name}`}
                  </h2>
                  {howItWorks?.description ? (
                     <p className="mx-auto -mt-6 mb-8 max-w-3xl text-center text-gray-600">
                        {howItWorks.description}
                     </p>
                  ) : null}
                  <div className="grid md:grid-cols-3 gap-8">
                     {steps.map((step) => {
                        const copy = howItWorks?.steps.find(
                           (item) => item.id === step.id
                        );
                        return (
                           <div key={step.id} className="text-center">
                              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                                 <step.icon className="w-6 h-6" />
                              </div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                 {copy?.title ?? step.title}
                              </h3>
                              <p className="text-gray-600">
                                 {copy?.description ?? step.description}
                              </p>
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}

            {section !== "howItWorks" && (
               <div className="bg-gray-50 rounded-lg p-8">
                  {statsTitle ? (
                     <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
                        {statsTitle}
                     </h2>
                  ) : null}
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
                        <div className="text-sm text-gray-600">Local helpers</div>
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
            )}
         </div>
      </section>
   );
}
