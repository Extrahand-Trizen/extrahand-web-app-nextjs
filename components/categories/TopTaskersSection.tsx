"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, User, ArrowRight } from "lucide-react";

interface TopTasker {
   meetText?: string;
   name?: string;
   yearsOnExtrahand?: string;
   profileImage?: string;
   location?: string;
   rating?: string;
   overallRatingText?: string;
   reviewsCount?: string;
   completionRate?: string;
   completionRateText?: string;
   tasksCount?: string;
}

interface TopTaskersSectionProps {
   title?: string;
   taskers: TopTasker[];
   buttonText?: string;
}

export const TopTaskersSection: React.FC<TopTaskersSectionProps> = ({
   title,
   taskers,
   buttonText,
}) => {
   if (!taskers || taskers.length === 0) return null;

   return (
      <section className="py-16 md:py-24 bg-slate-100">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            {title && (
               <div className="mb-10 md:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                     {title}
                  </h2>
               </div>
            )}

            {/* Tasker Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
               {taskers.map((tasker, index) => (
                  <Card
                     key={index}
                     className="bg-white border-slate-200 hover:shadow-lg transition-shadow"
                  >
                     <CardContent className="p-5">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                           <div className="flex-1 min-w-0">
                              {tasker.meetText && (
                                 <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                                    {tasker.meetText}
                                 </p>
                              )}
                              {tasker.name && (
                                 <h3 className="text-lg font-semibold text-slate-900 truncate">
                                    {tasker.name}
                                 </h3>
                              )}
                              {tasker.yearsOnExtrahand && (
                                 <p className="text-sm text-slate-500">
                                    {tasker.yearsOnExtrahand}
                                 </p>
                              )}
                           </div>
                           <Avatar className="w-14 h-14 flex-shrink-0">
                              {tasker.profileImage && (
                                 <AvatarImage
                                    src={tasker.profileImage}
                                    alt={tasker.name || "Tasker"}
                                 />
                              )}
                              <AvatarFallback className="bg-slate-100">
                                 <User className="w-6 h-6 text-slate-400" />
                              </AvatarFallback>
                           </Avatar>
                        </div>

                        {/* Location */}
                        {tasker.location && (
                           <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <span>{tasker.location}</span>
                           </div>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                           <div>
                              {tasker.rating && (
                                 <div className="flex items-center gap-1 mb-0.5">
                                    <span className="text-lg font-bold text-slate-900">
                                       {tasker.rating}
                                    </span>
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                 </div>
                              )}
                              {tasker.overallRatingText && (
                                 <p className="text-xs text-slate-500">
                                    {tasker.overallRatingText}
                                 </p>
                              )}
                              {tasker.reviewsCount && (
                                 <p className="text-sm text-slate-700 mt-1">
                                    {tasker.reviewsCount}
                                 </p>
                              )}
                           </div>
                           <div className="text-right">
                              {tasker.completionRate && (
                                 <p className="text-lg font-bold text-slate-900 mb-0.5">
                                    {tasker.completionRate}
                                 </p>
                              )}
                              {tasker.completionRateText && (
                                 <p className="text-xs text-slate-500">
                                    {tasker.completionRateText}
                                 </p>
                              )}
                              {tasker.tasksCount && (
                                 <p className="text-sm text-slate-700 mt-1">
                                    {tasker.tasksCount}
                                 </p>
                              )}
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>

            {/* CTA */}
            {buttonText && (
               <Button className="h-11 px-6 bg-amber-500 hover:bg-amber-600 text-white font-medium shadow-sm">
                  {buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            )}
         </div>
      </section>
   );
};
