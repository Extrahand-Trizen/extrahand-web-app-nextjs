"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StaticTask } from "@/types/category";
import { MapPin, Clock, ArrowRight } from "lucide-react";

interface TasksSectionProps {
   title?: string;
   description: string;
   tasks: StaticTask[];
   buttonText: string;
   lastUpdatedText?: string;
   viewTaskButtonText?: string;
}

export const TasksSection: React.FC<TasksSectionProps> = ({
   title,
   description,
   tasks,
   buttonText,
   lastUpdatedText,
   viewTaskButtonText,
}) => {
   const formatDate = () => {
      const today = new Date();
      return today.toLocaleDateString("en-US", {
         month: "short",
         day: "numeric",
         year: "numeric",
      });
   };

   return (
      <section className="py-16 md:py-24 bg-slate-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-10 md:mb-12">
               <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-3 tracking-tight">
                  {title}
               </h2>
               <p className="text-slate-600 text-lg max-w-2xl">{description}</p>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {tasks.map((task, index) => (
                  <Card
                     key={index}
                     className="group bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden"
                  >
                     <CardContent className="p-5">
                        {/* Header with price */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                           <h3 className="font-semibold text-slate-900 line-clamp-2 leading-snug">
                              {task.title}
                           </h3>
                           <span className="text-lg font-bold text-slate-900 whitespace-nowrap">
                              {task.price}
                           </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
                           {task.description}
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                           <div className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" />
                              <span>{task.date || "Local"}</span>
                           </div>
                           <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{task.timeAgo || "Just posted"}</span>
                           </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                           <Badge
                              variant="secondary"
                              className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 font-medium text-xs"
                           >
                              {task.status || "Open"}
                           </Badge>
                           <Button
                              size="sm"
                              className="bg-slate-900 hover:bg-slate-800 text-white text-xs h-8 px-4"
                           >
                              {viewTaskButtonText || "View task"}
                           </Button>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-10 pt-8 border-t border-slate-200">
               <Button className="h-11 px-6 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm">
                  {buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
               <p className="text-sm text-slate-500">
                  {lastUpdatedText || `Last updated ${formatDate()}`}
               </p>
            </div>
         </div>
      </section>
   );
};
