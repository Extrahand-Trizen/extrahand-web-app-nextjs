"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ClipboardList, MapPin, ArrowRight } from "lucide-react";

interface EarningsCardProps {
   selectedTasks: string;
   setSelectedTasks: (value: string) => void;
   earnings: Record<string, string>;
   location: string;
   earningsPeriod: string;
   disclaimer: string;
   // Optional dynamic labels
   cardTitle?: string;
   taskLabel?: string;
   locationLabel?: string;
   buttonText?: string;
}

export const EarningsCard: React.FC<EarningsCardProps> = ({
   selectedTasks,
   setSelectedTasks,
   earnings,
   location,
   earningsPeriod,
   disclaimer,
   cardTitle,
   taskLabel,
   locationLabel,
   buttonText,
}) => {
   return (
      <Card className="w-full bg-white border-0 shadow-xl">
         <CardHeader className="md:pb-4">
            <CardTitle className="md:text-lg font-semibold text-slate-900 text-center">
               {cardTitle || "See what you could earn"}
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            {/* Task Frequency */}
            <div className="space-y-2">
               <label className="text-xs md:text-sm font-medium text-slate-600">
                  {taskLabel || "Tasks per week"}
               </label>
               <Select value={selectedTasks} onValueChange={setSelectedTasks}>
                  <SelectTrigger className="w-full h-10 bg-slate-50 border-slate-200 focus:border-slate-400 focus:ring-slate-400">
                     <div className="flex items-center gap-3">
                        <ClipboardList className="w-5 h-5 text-slate-400" />
                        <SelectValue placeholder="Select frequency" />
                     </div>
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="1-2 tasks per week">
                        1-2 tasks per week
                     </SelectItem>
                     <SelectItem value="3-5 tasks per week">
                        3-5 tasks per week
                     </SelectItem>
                     <SelectItem value="5+ tasks per week">
                        5+ tasks per week
                     </SelectItem>
                  </SelectContent>
               </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
               <label className="text-xs md:text-sm font-medium text-slate-600">
                  {locationLabel || "Your location"}
               </label>
               <div className="flex items-center gap-3 h-10 text-sm px-4 bg-slate-50 border border-slate-200 rounded-md">
                  <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                  <span className="text-slate-700 truncate">{location}</span>
               </div>
            </div>

            {/* Earnings Display */}
            <div className="py-6 border-y border-slate-100">
               <div className="text-center">
                  <p className="text-4xl font-bold text-slate-900 mb-1">
                     {earnings[selectedTasks]}
                  </p>
                  <p className="text-sm text-slate-500">{earningsPeriod}</p>
               </div>
            </div>

            {/* CTA Button */}
            <Button className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-white font-semibold text-base shadow-sm">
               {buttonText || "Get started"}
               <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            {/* Disclaimer */}
            <p className="text-xs text-slate-400 text-center leading-relaxed">
               {disclaimer}
            </p>
         </CardContent>
      </Card>
   );
};
