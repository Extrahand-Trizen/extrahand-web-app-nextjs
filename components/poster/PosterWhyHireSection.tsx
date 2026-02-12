"use client";

import React from "react";
import type { PosterWhyBookFeature } from "@/types/category";

interface PosterWhyHireSectionProps {
   whyBookTitle: string;
   whyBookDescription: string;
   whyBookFeatures: PosterWhyBookFeature[];
}

export default function PosterWhyHireSection({ whyBookTitle, whyBookDescription, whyBookFeatures }: PosterWhyHireSectionProps) {
   return (
      <section className="py-16 md:py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8">
               {whyBookTitle}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               <p className="text-base text-gray-700 leading-relaxed">
                  {whyBookDescription}
               </p>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {whyBookFeatures.slice(0, 4).map((f, i) => (
                     <div key={i} className="flex items-start gap-3">
                        <svg
                           className="w-6 h-6 text-blue-600 shrink-0 mt-1"
                           fill="currentColor"
                           viewBox="0 0 20 20"
                        >
                           <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                           />
                        </svg>
                        <div>
                           <h4 className="font-bold text-gray-900 mb-1">
                              {f.title}
                           </h4>
                           {f.description && (
                              <p className="text-sm text-gray-600">
                                 {f.description}
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
}
