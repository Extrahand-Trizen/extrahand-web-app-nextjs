"use client";

/**
 * Step 4: Review & Submit
 * Summary of task details with edit links and guidelines checkbox
 * Using React Hook Form with Zod validation
 */

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormData } from "../TaskCreationFlow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { format, differenceInCalendarDays } from "date-fns";
import {
   MapPin,
   Calendar,
   Clock,
   IndianRupee,
   AlertCircle,
   Edit2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewStepProps {
   form: UseFormReturn<TaskFormData>;
   onEdit: (step: number) => void;
   isSubmitting: boolean;
}

const CATEGORIES: Record<string, { label: string }> = {
   "home-cleaning": { label: "Home Cleaning" },
   "deep-cleaning": { label: "Deep Cleaning" },
   plumbing: { label: "Plumbing" },
   "water-tanker-services": { label: "Water & Tanker Services" },
   electrical: { label: "Electrical" },
   carpenter: { label: "Carpenter" },
   painting: { label: "Painting" },
   "ac-repair": { label: "AC Repair & Service" },
   "appliance-repair": { label: "Appliance Repair" },
   "pest-control": { label: "Pest Control" },
   "car-washing": { label: "Car Washing / Car Cleaning" },
   gardening: { label: "Gardening" },
   handyperson: { label: "Handyperson / General Repairs" },
   "furniture-assembly": { label: "Furniture Assembly" },
   "security-patrol": { label: "Security Patrol / Watchman" },
   "beauty-services": { label: "Beauty Services" },
   "massage-spa": { label: "Massage / Spa" },
   "fitness-trainers": { label: "Fitness Trainers" },
   tutors: { label: "Tutors" },
   "it-support": { label: "IT Support / Laptop Repair" },
   "photographer-videographer": { label: "Photographer / Videographer" },
   "event-services": { label: "Event Services" },
   "pet-services": { label: "Pet Services" },
   "driver-chauffeur": { label: "Driver / Chauffeur" },
   "cooking-home-chef": { label: "Cooking / Home Chef" },
   "laundry-ironing": { label: "Laundry / Ironing" },
   other: { label: "Other" },
};

const URGENCY_OPTIONS: Record<string, { label: string; surcharge: number }> = {
   standard: { label: "Standard", surcharge: 0 },
   soon: { label: "Soon", surcharge: 20 },
   urgent: { label: "Urgent", surcharge: 50 },
};

export function ReviewStep({
   form,
   onEdit,
   isSubmitting,
}: ReviewStepProps) {
   const data = form.watch();
   const agreedToGuidelines = form.watch("agreedToGuidelines");

   // Calculate warnings
   const warnings: string[] = [];
   if (data.budgetType === "fixed" && data.budget && data.budget < 200) {
      warnings.push(
         "Your budget is below typical range. You may receive fewer offers."
      );
   }
   if (data.flexibility === "exact") {
      warnings.push(
         "Exact timing may limit available taskers. Consider adding flexibility."
      );
   }

   const category = CATEGORIES[data.category] || { label: "Other" };
   const urgency = URGENCY_OPTIONS[data.urgency] || {
      label: "Standard",
      surcharge: 0,
   };
   const totalBudget =
      data.budgetType === "fixed" && data.budget
         ? data.budget + urgency.surcharge
         : null;

   const recurringDays =
      data.recurringEnabled && data.recurringStartDate && data.recurringEndDate
         ? differenceInCalendarDays(data.recurringEndDate, data.recurringStartDate) + 1
         : null;

   return (
      <div className="space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
               Review your task
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
               Check everything looks good before posting
            </p>
         </div>

         {/* Warnings */}
         {warnings.length > 0 && (
            <div className="p-3 md:p-4 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
               {warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-3">
                     <AlertCircle className="size-4 md:size-5 text-amber-600 shrink-0 mt-0.5" />
                     <p className="text-xs md:text-sm text-amber-800">{warning}</p>
                  </div>
               ))}
            </div>
         )}

         {/* Task Details Card */}
         <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
               <h3 className="md:text-base font-semibold text-gray-900">
                  Task Details
               </h3>
               <button
                  type="button"
                  onClick={() => onEdit(1)}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
               >
                  <Edit2 className="w-4 h-4" />
                  Edit
               </button>
            </div>

            <div className="space-y-3">
               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-sm md:text-base font-medium text-gray-900">
                        {category.label}
                     </span>
                     {data.subcategory && (
                        <>
                           <span className="text-gray-400">•</span>
                           <span className="text-xs md:text-sm text-gray-600">
                              {data.subcategory}
                           </span>
                        </>
                     )}
                  </div>
               </div>

               <div>
                  <h4 className="text-sm md:text-base font-semibold text-gray-900 mb-1">
                     {data.title}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                     {data.description}
                  </p>
               </div>

               {data.requirements.length > 0 && (
                  <div>
                     <span className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">
                        Requirements
                     </span>
                     <div className="flex flex-wrap gap-2">
                        {data.requirements.map((req, index) => (
                           <Badge
                              key={index}
                              variant="secondary"
                              className="h-4 md:h-6 px-1 md:px-3 text-[9px] md:text-xs bg-gray-100 text-gray-700"
                           >
                              {req}
                           </Badge>
                        ))}
                     </div>
                  </div>
               )}

               {data.estimatedDuration && (
                  <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                     <Clock className="w-4 h-4" />
                     <span>
                        Estimated {Math.floor(data.estimatedDuration / 24)} days{" "}
                        {(data.estimatedDuration % 24).toFixed(1)} hours
                     </span>
                  </div>
               )}
            </div>
         </div>

         {/* Location & Schedule Card */}
         <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
               <h3 className="md:text-base font-semibold text-gray-900">
                  Location & Schedule
               </h3>
               <button
                  type="button"
                  onClick={() => onEdit(2)}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
               >
                  <Edit2 className="w-4 h-4" />
                  Edit
               </button>
            </div>

            <div className="space-y-3">
               <div className="flex items-start gap-3">
                  <MapPin className="size-4 md:size-5 text-gray-400 shrink-0 mt-0.5" />
                  <div>
                     <p className="text-xs md:text-sm font-medium text-gray-900">
                        {data.location.address}
                     </p>
                     {data.location.city && (
                        <p className="text-[9px] md:text-xs text-gray-500 mt-1">
                           {data.location.city}
                           {data.location.state && `, ${data.location.state}`}
                        </p>
                     )}
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <Calendar className="size-4 md:size-5 text-gray-400" />
                  <span className="text-xs md:text-sm text-gray-900">
                     {data.recurringEnabled
                        ? data.recurringStartDate && data.recurringEndDate
                           ? `${format(data.recurringStartDate, "MMM d, yyyy")} - ${format(
                                data.recurringEndDate,
                                "MMM d, yyyy"
                             )} (${recurringDays} days)`
                           : "Date range not set"
                        : data.scheduledDate
                        ? format(data.scheduledDate, "EEEE, MMMM d, yyyy")
                        : "Date not set"}
                  </span>
               </div>

               <div className="flex items-center gap-3">
                  <Clock className="size-4 md:size-5 text-gray-400" />
                  <div className="flex items-center gap-2">
                     <span className="text-xs md:text-sm text-gray-900">
                        {format(data.scheduledTimeStart, "MMM d, h:mm aa")} -{" "}
                        {format(data.scheduledTimeEnd, "MMM d, h:mm aa")}
                     </span>
                     {data.flexibility !== "exact" && (
                        <Badge
                           variant="secondary"
                           className="h-5 px-2 text-[10px] md:text-xs bg-primary-50 text-primary-700"
                        >
                           {data.flexibility === "flexible" && "±1 hour"}
                           {data.flexibility === "very_flexible" && "±3 hours"}
                        </Badge>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* Budget Card */}
         <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <div className="flex items-start justify-between">
               <h3 className="md:text-base font-semibold text-gray-900">Budget</h3>
               <button
                  type="button"
                  onClick={() => onEdit(3)}
                  className="flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
               >
                  <Edit2 className="w-4 h-4" />
                  Edit
               </button>
            </div>

            <div className="space-y-2">
               {data.budgetType === "fixed" && totalBudget ? (
                  <div className="flex items-center justify-between p-2 md:p-4 bg-gray-50 rounded-lg">
                     <div className="flex items-center gap-3">
                        <IndianRupee className="size-4 md:size-5 text-gray-600" />
                        <div>
                           <span className="text-xs md:text-sm text-gray-600 block">
                              Fixed price
                           </span>
                           {urgency.surcharge > 0 && (
                              <span className="text-[9px] md:text-xs text-gray-500">
                                 ₹{data.budget} + ₹{urgency.surcharge} urgency
                                 fee
                              </span>
                           )}
                        </div>
                     </div>
                     <span className="text-xl md:text-2xl font-bold text-gray-900">
                        ₹{totalBudget}
                     </span>
                  </div>
               ) : (
                  <div className="flex items-center gap-3 p-2 md:p-4 bg-gray-50 rounded-lg">
                     <svg
                        className="size-4 md:size-5 text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           strokeWidth={2}
                           d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                     </svg>
                     <span className="text-xs md:text-sm text-gray-900 font-medium">
                        Negotiable - Review offers from taskers
                     </span>
                  </div>
               )}

               <div className="flex items-center gap-2 pt-1">
                  <Badge
                     variant="secondary"
                     className={cn(
                        "h-4 md:h-6 px-3 text-[9px] md:text-xs font-medium",
                        data.urgency === "urgent" &&
                           "bg-orange-100 text-orange-700",
                        data.urgency === "soon" && "bg-primary-100 text-primary-700",
                        data.urgency === "standard" &&
                           "bg-gray-100 text-gray-700"
                     )}
                  >
                     {urgency.label}
                  </Badge>
                  {data.urgency === "urgent" && (
                     <span className="text-xs text-gray-500">
                        Priority placement
                     </span>
                  )}
               </div>
            </div>
         </div>

         {/* Guidelines Checkbox */}
         <FormField
            control={form.control}
            name="agreedToGuidelines"
            render={({ field }) => (
               <FormItem className="space-y-0">
                  <div className="inline-flex items-start gap-2">
                     <FormControl>
                        <Checkbox
                           checked={field.value}
                           onCheckedChange={field.onChange}
                           className="mt-0.5"
                        />
                     </FormControl>

                     {/* inline text container */}
                     <FormLabel className="inline text-xs md:text-sm font-normal text-gray-700 leading-relaxed cursor-pointer">
                        I agree to ExtraHand&apos;s{" "}
                        <a
                           href="/terms-and-conditions"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline text-primary-600 hover:underline"
                        >
                           Terms and Services
                        </a>{" "}
                        and{" "}
                        <a
                           href="/coming-soon?type=info&label=Community%20Guidelines"
                           target="_blank"
                           rel="noopener noreferrer"
                           className="inline text-primary-600 hover:underline"
                        >
                           Community Guidelines
                        </a>
                        . I understand that taskers are independent contractors.
                     </FormLabel>
                  </div>

                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Submit Button */}
         <div className="pt-4 space-y-3">
            <Button
               type="submit"
               disabled={!agreedToGuidelines || isSubmitting}
               className="w-full h-10 font-medium bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300"
               size="lg"
            >
               {isSubmitting ? "Posting..." : "Post Task"}
            </Button>
            <p className="text-xs text-center text-gray-500">
               Your task will be visible to taskers in your area immediately
            </p>
         </div>
      </div>
   );
}
