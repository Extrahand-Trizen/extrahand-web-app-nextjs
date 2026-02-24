"use client";

/**
 * Step 2: Location & Schedule
 * Address, date, time range, flexibility
 * Using React Hook Form with Zod validation
 */

import React, { useEffect, useMemo } from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormData } from "../TaskCreationFlow";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format, addDays, startOfDay } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { InteractiveLocationPicker } from "../../shared/InteractiveLocationPicker";
import { DateTimePicker } from "@/components/shared";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

interface LocationScheduleStepProps {
   form: UseFormReturn<TaskFormData>;
   onNext: () => Promise<void>;
}

const QUICK_DATES = [
   { label: "Today", value: 0 },
   { label: "Tomorrow", value: 1 },
   { label: "In 3 days", value: 3 },
   { label: "Next week", value: 7 },
];

export function LocationScheduleStep({
   form,
   onNext,
}: LocationScheduleStepProps) {
   const scheduledDate = form.watch("scheduledDate");
   const scheduledTimeStart = form.watch("scheduledTimeStart");
   const scheduledTimeEnd = form.watch("scheduledTimeEnd");
   const location = form.watch("location");
   const category = form.watch("category");
   const recurringEnabled = form.watch("recurringEnabled");
   const recurringStartDate = form.watch("recurringStartDate");
   const recurringEndDate = form.watch("recurringEndDate");

   const recurringEligibleCategories = [
      "home-cleaning",
      "deep-cleaning",
      "gardening",
      "pest-control",
      "laundry-ironing",
      "cooking-home-chef",
      "beauty-services",
      "massage-spa",
      "fitness-trainers",
      "tutors",
      "pet-services",
      "car-washing",
      "water-tanker-services",
   ];

   const canUseRecurring = recurringEligibleCategories.includes(category || "");


   // Minimum date is today at midnight
   const minDate = useMemo(() => startOfDay(new Date()), []);

   // Sync scheduledDate with scheduledTimeStart date portion
   useEffect(() => {
      if (scheduledDate) {
         const currentStart = form.getValues("scheduledTimeStart");
         const currentEnd = form.getValues("scheduledTimeEnd");

         // Update start time to use the selected date but keep the time
         if (currentStart) {
            const newStart = new Date(scheduledDate);
            newStart.setHours(currentStart.getHours(), currentStart.getMinutes(), 0, 0);
            
            // Only update if day changed
            if (startOfDay(currentStart).getTime() !== startOfDay(scheduledDate).getTime()) {
               form.setValue("scheduledTimeStart", newStart);
            }
         }

         // Update end time similarly
         if (currentEnd) {
            const newEnd = new Date(scheduledDate);
            newEnd.setHours(currentEnd.getHours(), currentEnd.getMinutes(), 0, 0);
            
            // Only update if day changed
            if (startOfDay(currentEnd).getTime() !== startOfDay(scheduledDate).getTime()) {
               form.setValue("scheduledTimeEnd", newEnd);
            }
         }
      }
   }, [scheduledDate, form]);

   // Ensure end time is never before start time
   useEffect(() => {
      if (!scheduledTimeStart || !scheduledTimeEnd) return;
      if (scheduledTimeEnd <= scheduledTimeStart) {
         // Auto-correct by setting end time 1 hour after start
         const newEnd = new Date(scheduledTimeStart);
         newEnd.setHours(newEnd.getHours() + 1);
         form.setValue("scheduledTimeEnd", newEnd);
      }
   }, [scheduledTimeStart, scheduledTimeEnd, form]);

   useEffect(() => {
      if (!canUseRecurring && recurringEnabled) {
         form.setValue("recurringEnabled", false);
         form.setValue("recurringStartDate", null);
         form.setValue("recurringEndDate", null);
         form.setValue("recurringFrequency", "daily");
      }
   }, [canUseRecurring, recurringEnabled, form]);

   const handleQuickDate = (daysOffset: number) => {
      const date = addDays(new Date(), daysOffset);
      form.setValue("scheduledDate", date);
   };

   return (
      <div className="space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
               Where and when?
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
               Set location and schedule for your task
            </p>
         </div>

         {/* Location Picker */}
         <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Task location</FormLabel>
                  <FormControl>
                     <InteractiveLocationPicker
                        value={field.value as any}
                        onChange={(loc) => field.onChange(loc)}
                        onCoordinatesChange={(coords) => {
                           form.setValue("location.coordinates", coords as any);
                        }}
                     />
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Pin Code (Optional) */}
         {location.city && (
            <FormField
               control={form.control}
               name="location.pinCode"
               render={({ field }) => (
                  <FormItem className="animate-in slide-in-from-top duration-200">
                     <FormLabel className="text-xs md:text-sm">Pin Code (optional)</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="e.g., 560001"
                           {...field}
                           className="h-10 text-sm"
                           maxLength={6}
                        />
                     </FormControl>
                     <FormDescription className="text-xs">
                        Helps taskers in your area find this task
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
         )}

         {/* Date */}
         <FormField
            control={form.control}
            name="recurringEnabled"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Schedule type</FormLabel>
                  <FormControl>
                     <div className="flex gap-2">
                        <button
                           type="button"
                           onClick={() => field.onChange(false)}
                           className={cn(
                              "flex-1 h-10 rounded-lg border-2 text-sm font-medium transition-all",
                              !field.value
                                 ? "border-primary-600 bg-primary-50 text-primary-600"
                                 : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                           )}
                        >
                           One-time
                        </button>
                        <button
                           type="button"
                           disabled={!canUseRecurring}
                           onClick={() => canUseRecurring && field.onChange(true)}
                           className={cn(
                              "flex-1 h-10 rounded-lg border-2 text-sm font-medium transition-all",
                              !canUseRecurring
                                 ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                                 : field.value
                                 ? "border-primary-600 bg-primary-50 text-primary-600"
                                 : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                           )}
                        >
                           Recurring
                        </button>
                     </div>
                  </FormControl>
                  {!canUseRecurring && (
                     <FormDescription className="text-xs text-gray-500">
                        Recurring schedule is available for select services only.
                     </FormDescription>
                  )}
               </FormItem>
            )}
         />

         {!recurringEnabled && (
            <FormField
               control={form.control}
               name="scheduledDate"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="text-xs md:text-sm">Task date</FormLabel>
                     <FormControl>
                        <div className="space-y-2">
                           {/* Quick date buttons */}
                           <div className="grid grid-cols-4 gap-2">
                              {QUICK_DATES.map((quick) => (
                                 <button
                                    key={quick.value}
                                    type="button"
                                    onClick={() => handleQuickDate(quick.value)}
                                    className={cn(
                                       "h-10 rounded-lg border-2 text-sm font-medium transition-all",
                                       scheduledDate &&
                                          format(scheduledDate, "yyyy-MM-dd") ===
                                             format(
                                                addDays(new Date(), quick.value),
                                                "yyyy-MM-dd"
                                             )
                                          ? "border-primary-600 bg-primary-50 text-primary-600"
                                          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                    )}
                                 >
                                    {quick.label}
                                 </button>
                              ))}
                           </div>

                           {/* Calendar picker */}
                           <Popover>
                              <PopoverTrigger asChild>
                                 <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                       "w-full h-10 justify-start text-left font-normal",
                                       !field.value && "text-gray-500"
                                    )}
                                 >
                                    <CalendarIcon className="mr-2 h-5 w-5" />
                                    {field.value ? (
                                       format(field.value, "PPP")
                                    ) : (
                                       <span>Pick a date</span>
                                    )}
                                 </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                 <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                       date <
                                       new Date(new Date().setHours(0, 0, 0, 0))
                                    }
                                    initialFocus
                                 />
                              </PopoverContent>
                           </Popover>
                        </div>
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         )}

         {recurringEnabled && (
            <div className="space-y-4">
               <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                     control={form.control}
                     name="recurringStartDate"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-xs md:text-sm">Start date</FormLabel>
                           <FormControl>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button
                                       type="button"
                                       variant="outline"
                                       className={cn(
                                          "w-full h-10 justify-start text-left font-normal",
                                          !field.value && "text-gray-500"
                                       )}
                                    >
                                       <CalendarIcon className="mr-2 h-5 w-5" />
                                       {field.value ? (
                                          format(field.value, "PPP")
                                       ) : (
                                          <span>Pick a start date</span>
                                       )}
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                       mode="single"
                                       selected={field.value || undefined}
                                       onSelect={field.onChange}
                                       disabled={(date) =>
                                          date <
                                          new Date(new Date().setHours(0, 0, 0, 0))
                                       }
                                       initialFocus
                                    />
                                 </PopoverContent>
                              </Popover>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="recurringEndDate"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-xs md:text-sm">End date</FormLabel>
                           <FormControl>
                              <Popover>
                                 <PopoverTrigger asChild>
                                    <Button
                                       type="button"
                                       variant="outline"
                                       className={cn(
                                          "w-full h-10 justify-start text-left font-normal",
                                          !field.value && "text-gray-500"
                                       )}
                                    >
                                       <CalendarIcon className="mr-2 h-5 w-5" />
                                       {field.value ? (
                                          format(field.value, "PPP")
                                       ) : (
                                          <span>Pick an end date</span>
                                       )}
                                    </Button>
                                 </PopoverTrigger>
                                 <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                       mode="single"
                                       selected={field.value || undefined}
                                       onSelect={field.onChange}
                                       disabled={(date) =>
                                          date <
                                          new Date(new Date().setHours(0, 0, 0, 0))
                                       }
                                       initialFocus
                                    />
                                 </PopoverContent>
                              </Popover>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <FormField
                  control={form.control}
                  name="recurringFrequency"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-xs md:text-sm">Frequency</FormLabel>
                        <FormControl>
                           <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="h-10">
                                 <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                 <SelectItem value="daily">Daily</SelectItem>
                                 <SelectItem value="weekly">Weekly</SelectItem>
                              </SelectContent>
                           </Select>
                        </FormControl>
                     </FormItem>
                  )}
               />

               <div className="bg-secondary-50 border border-secondary-100 rounded-lg p-3 text-xs text-secondary-600">
                  Recurring tasks let taskers pick specific dates from your range.
               </div>
            </div>
         )}

         {/* Start Date & Time */}
         <FormField
            control={form.control}
            name="scheduledTimeStart"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Start date & time</FormLabel>
                  <FormControl>
                     <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select start date & time"
                        className="h-10"
                        minDate={minDate}
                     />
                  </FormControl>
                  <FormDescription className="text-xs">When should the task begin?</FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* End Date & Time */}
         <FormField
            control={form.control}
            name="scheduledTimeEnd"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">End date & time</FormLabel>
                  <FormControl>
                     <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select end date & time"
                        className="h-10"
                        minDate={scheduledTimeStart || minDate}
                     />
                  </FormControl>
                  <FormDescription className="text-xs">
                     When should the task be completed by?
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Flexibility */}
         <FormField
            control={form.control}
            name="flexibility"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Time flexibility</FormLabel>
                  <FormControl>
                     <div className="grid grid-cols-3 gap-3">
                        {["exact", "flexible", "very_flexible"].map((flex) => (
                           <button
                              key={flex}
                              type="button"
                              onClick={() => field.onChange(flex)}
                              className={cn(
                                 "h-10 rounded-lg border-2 text-sm font-medium transition-all",
                                 field.value === flex
                                    ? "border-primary-600 bg-primary-50 text-primary-600"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                              )}
                           >
                              {flex === "exact" && "Exact time"}
                              {flex === "flexible" && "±1 hour"}
                              {flex === "very_flexible" && "±3 hours"}
                           </button>
                        ))}
                     </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                     More flexibility can get you more offers
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Continue Button */}
         <div className="pt-4">
            <Button
               type="button"
               onClick={onNext}
               className="w-full h-10 font-medium bg-primary-600 hover:bg-primary-700"
               size="lg"
            >
               Continue
            </Button>
         </div>
      </div>
   );
}
