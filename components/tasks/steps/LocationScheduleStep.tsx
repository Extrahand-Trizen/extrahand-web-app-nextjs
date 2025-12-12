"use client";

/**
 * Step 2: Location & Schedule
 * Address, date, time range, flexibility
 * Using React Hook Form with Zod validation
 */

import React from "react";
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
import { format, addDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { InteractiveLocationPicker } from "../../shared/InteractiveLocationPicker";
import { DateTimePicker } from "@/components/shared";

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
   const location = form.watch("location");

   const handleQuickDate = (daysOffset: number) => {
      const date = addDays(new Date(), daysOffset);
      form.setValue("scheduledDate", date);
   };

   return (
      <div className="space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
               Where and when?
            </h2>
            <p className="text-sm text-gray-600">
               Set location and schedule for your task
            </p>
         </div>

         {/* Location Picker */}
         <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Task location</FormLabel>
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
                     <FormLabel>Pin Code (optional)</FormLabel>
                     <FormControl>
                        <Input
                           placeholder="e.g., 560001"
                           {...field}
                           className="h-12"
                           maxLength={6}
                        />
                     </FormControl>
                     <FormDescription>
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
            name="scheduledDate"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Task date</FormLabel>
                  <FormControl>
                     <div className="space-y-3">
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
                                       ? "border-blue-600 bg-blue-50 text-blue-600"
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
                                    "w-full h-12 justify-start text-left font-normal",
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

         {/* Start Date & Time */}
         <FormField
            control={form.control}
            name="scheduledTimeStart"
            render={({ field }) => (
               <FormItem>
                  <FormLabel>Start date & time</FormLabel>
                  <FormControl>
                     <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select start date & time"
                     />
                  </FormControl>
                  <FormDescription>When should the task begin?</FormDescription>
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
                  <FormLabel>End date & time</FormLabel>
                  <FormControl>
                     <DateTimePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select end date & time"
                     />
                  </FormControl>
                  <FormDescription>
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
                  <FormLabel>Time flexibility</FormLabel>
                  <FormControl>
                     <div className="grid grid-cols-3 gap-3">
                        {["exact", "flexible", "very_flexible"].map((flex) => (
                           <button
                              key={flex}
                              type="button"
                              onClick={() => field.onChange(flex)}
                              className={cn(
                                 "h-14 rounded-lg border-2 text-sm font-medium transition-all",
                                 field.value === flex
                                    ? "border-blue-600 bg-blue-50 text-blue-600"
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
                  <FormDescription>
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
               className="w-full h-12 font-medium bg-blue-600 hover:bg-blue-700"
               size="lg"
            >
               Continue
            </Button>
         </div>
      </div>
   );
}
