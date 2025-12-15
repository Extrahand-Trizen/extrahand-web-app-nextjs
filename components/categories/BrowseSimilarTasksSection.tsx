"use client";

import React from "react";
import { Briefcase, ChevronRight } from "lucide-react";

interface BrowseSimilarTasksSectionProps {
   title?: string;
   headings: string[];
   onHeadingClick: (heading: string) => void;
}

export const BrowseSimilarTasksSection: React.FC<
   BrowseSimilarTasksSectionProps
> = ({ title, headings, onHeadingClick }) => {
   if (!headings || headings.length === 0) return null;

   const filteredHeadings = headings.filter(
      (heading) => heading && heading.trim() !== ""
   );

   // Split into columns
   const halfLength = Math.ceil(filteredHeadings.length / 2);

   return (
      <section className="py-16 md:py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
               {/* Header Column */}
               <div>
                  <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center mb-6">
                     <Briefcase className="w-7 h-7 text-white" />
                  </div>
                  {title && (
                     <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                        {title}
                     </h2>
                  )}
               </div>

               {/* Tasks Column 1 */}
               <div className="space-y-3">
                  {filteredHeadings
                     .slice(0, halfLength)
                     .map((heading, index) => (
                        <button
                           key={index}
                           onClick={() => onHeadingClick(heading)}
                           className="flex items-center justify-between w-full py-3 px-4 text-left text-slate-700 bg-white rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group"
                        >
                           <span className="font-medium">{heading}</span>
                           <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                        </button>
                     ))}
               </div>

               {/* Tasks Column 2 */}
               <div className="space-y-3">
                  {filteredHeadings.slice(halfLength).map((heading, index) => (
                     <button
                        key={index + halfLength}
                        onClick={() => onHeadingClick(heading)}
                        className="flex items-center justify-between w-full py-3 px-4 text-left text-slate-700 bg-white rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group"
                     >
                        <span className="font-medium">{heading}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </section>
   );
};
