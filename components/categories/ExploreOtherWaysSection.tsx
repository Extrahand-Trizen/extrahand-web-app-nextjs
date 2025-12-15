"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ImageIcon } from "lucide-react";

interface ExploreTask {
   image?: string;
   subtitle?: string;
   subheading?: string;
}

interface ExploreOtherWaysSectionProps {
   title?: string;
   tasks: ExploreTask[];
   buttonText?: string;
   disclaimer?: string;
   onHeadingClick: (heading: string) => void;
}

export const ExploreOtherWaysSection: React.FC<
   ExploreOtherWaysSectionProps
> = ({ title, tasks, buttonText, disclaimer, onHeadingClick }) => {
   if (!tasks || tasks.length === 0) return null;

   return (
      <section className="py-16 md:py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            {title && (
               <div className="mb-10 md:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                     {title}
                  </h2>
               </div>
            )}

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
               {tasks.map((task, index) => (
                  <div
                     key={index}
                     className="group cursor-pointer"
                     onClick={() =>
                        task.subtitle && onHeadingClick(task.subtitle)
                     }
                  >
                     {/* Image */}
                     <div className="relative w-full h-56 md:h-64 rounded-xl overflow-hidden mb-4 bg-slate-100">
                        {task.image ? (
                           task.image.startsWith("data:") ||
                           task.image.startsWith("http") ? (
                              <img
                                 src={task.image}
                                 alt={task.subtitle || `Task ${index + 1}`}
                                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                           ) : (
                              <Image
                                 src={task.image}
                                 alt={task.subtitle || `Task ${index + 1}`}
                                 fill
                                 className="object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                           )
                        ) : (
                           <div className="w-full h-full flex items-center justify-center">
                              <ImageIcon className="w-12 h-12 text-slate-300" />
                           </div>
                        )}
                     </div>

                     {/* Content */}
                     {task.subtitle && (
                        <h3 className="text-xl font-semibold text-slate-900 mb-1 group-hover:text-amber-600 transition-colors">
                           {task.subtitle}
                        </h3>
                     )}
                     {task.subheading && (
                        <p className="text-slate-600 font-medium">
                           {task.subheading}
                        </p>
                     )}
                  </div>
               ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               {buttonText && (
                  <Button className="h-11 px-6 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm">
                     {buttonText}
                     <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
               )}
               {disclaimer && (
                  <p className="text-sm text-slate-500">{disclaimer}</p>
               )}
            </div>
         </div>
      </section>
   );
};
