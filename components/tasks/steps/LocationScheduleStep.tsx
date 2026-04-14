"use client";

/**
 * Step 2: Location & Schedule
 * Address, date, time range, flexibility
 * Using React Hook Form with Zod validation
 */

import React, { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormData } from "../TaskCreationFlow";
import { Button } from "@/components/ui/button";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { startOfDay, format } from "date-fns";
import { IndianRupee, ChevronLeft, ChevronRight, MapPin, Monitor } from "lucide-react";
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

export function LocationScheduleStep({
   form,
   onNext,
}: LocationScheduleStepProps) {
   const scheduledDate = form.watch("scheduledDate");
   const scheduledTimeStart = form.watch("scheduledTimeStart");
   const scheduledTimeEnd = form.watch("scheduledTimeEnd");
   const location = form.watch("location");
   const locationMode = form.watch("locationMode");
   const category = form.watch("category");
   const recurringEnabled = form.watch("recurringEnabled");
   // Watch AirTasker-style fields
   const dateOption = form.watch("dateOption");
   const needsTimeOfDay = form.watch("needsTimeOfDay");
   const timeSlot = form.watch("timeSlot");

   // State for calendar popovers
   const [datePopoverOpen, setDatePopoverOpen] = useState(false);
   const [calendarMonth, setCalendarMonth] = useState(new Date());

   // Generate calendar dates for the current month
   const getCalendarDays = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const daysInPrevMonth = firstDay.getDay();

      const days = [];
      // Previous month days (grayed out)
      for (let i = daysInPrevMonth - 1; i >= 0; i--) {
         const d = new Date(year, month, -i);
         days.push({ date: d, isCurrentMonth: false });
      }
      // Current month days
      for (let i = 1; i <= daysInMonth; i++) {
         const d = new Date(year, month, i);
         days.push({ date: d, isCurrentMonth: true });
      }
      // Next month days (grayed out)
      const remainingDays = 42 - days.length; // 6 weeks * 7 days
      for (let i = 1; i <= remainingDays; i++) {
         const d = new Date(year, month + 1, i);
         days.push({ date: d, isCurrentMonth: false });
      }
      return days;
   };

   const calendarDays = getCalendarDays(calendarMonth);

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
      "event-services",
      "senior-care-elder-care",
      "elderly-services",
   ];

   const canUseRecurring = recurringEligibleCategories.includes(category || "");

   // Get the ceiling hour (next full hour from current time)
   const getCeilingHour = () => {
      const now = new Date();
      const nextHour = new Date(now);
      if (now.getMinutes() === 0 && now.getSeconds() === 0) {
         // Already on a full hour, return it
         return new Date(now.setSeconds(0, 0));
      }
      // Round up to next hour
      nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
      return nextHour;
   };

   // Minimum date is today at midnight
   const minDate = useMemo(() => startOfDay(new Date()), []);

   // Minimum time for start date & time is the ceiling hour
   const minStartDateTime = useMemo(() => getCeilingHour(), []);

   const getMinStartForDate = (date: Date | undefined) => {
      if (!date) return minStartDateTime;
      const isToday =
         startOfDay(date).getTime() === startOfDay(new Date()).getTime();
      return isToday ? minStartDateTime : startOfDay(date);
   };

   const clampStartDateTime = (date: Date | undefined) => {
      if (!date) return date;
      const minStart = getMinStartForDate(date);
      if (startOfDay(date).getTime() === startOfDay(minStart).getTime()) {
         return date < minStart ? minStart : date;
      }
      return date;
   };

   // Sync start/end day to selected date only for "on-date"
   useEffect(() => {
      if (recurringEnabled || dateOption !== "on-date" || !scheduledDate) {
         return;
      }

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
   }, [scheduledDate, recurringEnabled, dateOption]);

   // Ensure end time is never before or equal to start time (minimum 30 min duration)
   useEffect(() => {
      if (!scheduledTimeStart || !scheduledTimeEnd) return;

      const timeDiffMinutes = (scheduledTimeEnd.getTime() - scheduledTimeStart.getTime()) / (1000 * 60);

      // If end time is before or equal to start, or less than 30 minutes, auto-correct
      if (timeDiffMinutes < 30) {
         // Auto-correct by setting end time 1 hour after start
         const newEnd = new Date(scheduledTimeStart);
         newEnd.setHours(newEnd.getHours() + 1);
         form.setValue("scheduledTimeEnd", newEnd);
      }
   }, [scheduledTimeStart, scheduledTimeEnd]);

   // Update scheduled times based on AirTasker-style selections
   useEffect(() => {
      if (recurringEnabled) return; // Only for one-time tasks

      if (dateOption === "flexible") {
         // Flexible: start time is today at 9am, end time is 30 days from now
         const startDate = new Date();
         startDate.setHours(9, 0, 0, 0);
         form.setValue("scheduledTimeStart", startDate);

         const endDate = new Date();
         endDate.setDate(endDate.getDate() + 30);
         endDate.setHours(18, 0, 0, 0);
         form.setValue("scheduledTimeEnd", endDate);

         form.setValue("flexibility", "very_flexible");
      } else if (dateOption === "on-date" && scheduledDate) {
         // On date: use selected date with time slot
         const start = new Date(scheduledDate);
         const end = new Date(scheduledDate);

         if (needsTimeOfDay && timeSlot) {
            const timeMap: Record<string, [number, number]> = {
               morning: [6, 0],
               midday: [10, 0],
               afternoon: [14, 0],
               evening: [18, 0],
            };
            const endTimeMap: Record<string, [number, number]> = {
               morning: [12, 0],
               midday: [14, 0],
               afternoon: [18, 0],
               evening: [21, 0],
            };
            const [startHours, startMins] = timeMap[timeSlot] || [9, 0];
            const [endHours, endMins] = endTimeMap[timeSlot] || [11, 0];
            start.setHours(startHours, startMins, 0, 0);
            end.setHours(endHours, endMins, 0, 0);
            form.setValue("flexibility", "exact");
         } else {
            start.setHours(9, 0, 0, 0);
            end.setHours(11, 0, 0, 0);
            form.setValue("flexibility", "flexible");
         }

         form.setValue("scheduledTimeStart", start);
         form.setValue("scheduledTimeEnd", end);
      } else if (dateOption === "before-date" && scheduledDate) {
         // Before date: start time is today, end time is the selected date
         const start = new Date();
         start.setHours(9, 0, 0, 0);

         const end = new Date(scheduledDate);
         end.setHours(17, 0, 0, 0);

         form.setValue("scheduledTimeStart", start);
         form.setValue("scheduledTimeEnd", end);
         form.setValue("flexibility", "flexible");
      }
   }, [dateOption, scheduledDate, needsTimeOfDay, timeSlot, recurringEnabled]);

   // Calculate duration for display
   const calculateDuration = () => {
      if (!scheduledTimeStart || !scheduledTimeEnd) return null;
      const diffMs = scheduledTimeEnd.getTime() - scheduledTimeStart.getTime();
      if (diffMs <= 0) return null;
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return { hours, minutes, total: diffMs };
   };

   const duration = calculateDuration();

   useEffect(() => {
      if (!canUseRecurring && recurringEnabled) {
         form.setValue("recurringEnabled", false);
         form.setValue("recurringStartDate", null);
         form.setValue("recurringEndDate", null);
         form.setValue("recurringFrequency", "daily");
      }
   }, [canUseRecurring, recurringEnabled]);

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

         <FormField
            control={form.control}
            name="locationMode"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Tell us where</FormLabel>
                  <FormControl>
                     <div className="grid grid-cols-2 gap-3">
                        <button
                           type="button"
                           onClick={() => field.onChange("in-person")}
                           className={cn(
                              "rounded-2xl border-2 p-4 text-left transition-all",
                              field.value === "in-person"
                                 ? "border-primary-700 bg-primary-700 text-white"
                                 : "border-secondary-200 bg-white text-secondary-700 hover:border-secondary-300"
                           )}
                        >
                           <div className="flex items-center justify-center mb-2">
                              <MapPin className="w-6 h-6" />
                           </div>
                           <div className="text-center font-semibold">In-person</div>
                           <div className={cn(
                              "text-center text-xs mt-1",
                              field.value === "in-person" ? "text-white/80" : "text-secondary-600"
                           )}>
                              Select this if you need the Tasker physically there
                           </div>
                        </button>

                        <button
                           type="button"
                           onClick={() => {
                              field.onChange("online");
                              form.clearErrors("location");
                           }}
                           className={cn(
                              "rounded-2xl border-2 p-4 text-left transition-all",
                              field.value === "online"
                                 ? "border-primary-700 bg-primary-700 text-white"
                                 : "border-secondary-200 bg-white text-secondary-700 hover:border-secondary-300"
                           )}
                        >
                           <div className="flex items-center justify-center mb-2">
                              <Monitor className="w-6 h-6" />
                           </div>
                           <div className="text-center font-semibold">Online</div>
                           <div className={cn(
                              "text-center text-xs mt-1",
                              field.value === "online" ? "text-white/80" : "text-secondary-600"
                           )}>
                              Select this if the Tasker can do it from home
                           </div>
                        </button>
                     </div>
                  </FormControl>
                  <FormMessage />
               </FormItem>
            )}
         />

         {locationMode === "in-person" && (
            <>
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
            </>
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

         {/* Budget */}
         <FormField
            control={form.control}
            name="budget"
            render={({ field }) => {
               const isOutOfRange =
                  field.value !== null &&
                  field.value !== undefined &&
                  (field.value < 50 || field.value > 50000);

               return (
                  <FormItem>
                     <FormLabel className="text-xs md:text-sm">Your budget</FormLabel>
                     <FormControl>
                        <div className="relative">
                           <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 size-4 md:size-5 text-gray-400" />
                           <Input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              placeholder="Enter your budget"
                              className="h-10 pl-12 text-sm"
                              value={field.value ?? ""}
                              onChange={(e) => {
                                 const digits = e.target.value.replace(/[^0-9]/g, "");
                                 if (!digits) {
                                    field.onChange(null);
                                    form.clearErrors("budget");
                                    return;
                                 }

                                 const parsed = parseInt(digits, 10);
                                 field.onChange(parsed);

                                 if (parsed < 50 || parsed > 50000) {
                                    form.setError("budget", {
                                       type: "manual",
                                       message: `Budget must be between ₹50 and ₹50,000. Entered: ₹${parsed}`,
                                    });
                                 } else {
                                    form.clearErrors("budget");
                                 }
                              }}
                              onKeyDown={(e) => {
                                 if (e.key === "Enter") {
                                    e.preventDefault();
                                 }
                              }}
                           />
                        </div>
                     </FormControl>
                     <FormDescription className={cn(
                        "text-xs",
                        isOutOfRange && "text-red-600 font-medium"
                     )}>
                        Enter a budget between ₹50 and ₹50,000.
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               );
            }}
         />

         {recurringEnabled && (
            <div className="space-y-4">
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

         {/* AirTasker-style Scheduling - Only for one-time tasks */}
         {!recurringEnabled && (
            <div className="space-y-4 border border-secondary-100 rounded-lg p-4 bg-secondary-50">
               {/* When do you need this done? */}
               <div>
                  <FormLabel className="text-sm font-semibold text-secondary-900 mb-3 block">
                     When do you need this done?
                  </FormLabel>
                  <FormField
                     control={form.control}
                     name="dateOption"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <div className="space-y-3">
                                 <div className="relative">
                                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                       <button
                                          type="button"
                                          onClick={() => {
                                             field.onChange("on-date");
                                             setDatePopoverOpen(true);
                                             if (scheduledDate) {
                                                setCalendarMonth(new Date(scheduledDate));
                                             }
                                          }}
                                          className={cn(
                                             "h-auto py-2 px-3 sm:px-4 rounded-full border-2 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1",
                                             field.value === "on-date"
                                                ? "border-primary-600 bg-white text-primary-600"
                                                : "border-secondary-200 bg-white text-secondary-700 hover:border-secondary-300"
                                          )}
                                       >
                                          {field.value === "on-date" && scheduledDate
                                             ? `On ${format(scheduledDate, "MMM d")}`
                                             : "On date"}
                                          {field.value === "on-date" && <ChevronRight className="w-3 h-3" />}
                                       </button>

                                       <button
                                          type="button"
                                          onClick={() => {
                                             field.onChange("before-date");
                                             setDatePopoverOpen(true);
                                             if (scheduledDate) {
                                                setCalendarMonth(new Date(scheduledDate));
                                             }
                                          }}
                                          className={cn(
                                             "h-auto py-2 px-3 sm:px-4 rounded-full border-2 text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-1",
                                             field.value === "before-date"
                                                ? "border-primary-600 bg-white text-primary-600"
                                                : "border-secondary-200 bg-white text-secondary-700 hover:border-secondary-300"
                                          )}
                                       >
                                          {field.value === "before-date" && scheduledDate
                                             ? `Before ${format(scheduledDate, "MMM d")}`
                                             : "Before date"}
                                          {field.value === "before-date" && <ChevronRight className="w-3 h-3" />}
                                       </button>

                                       <button
                                          type="button"
                                          onClick={() => {
                                             field.onChange("flexible");
                                             setDatePopoverOpen(false);
                                          }}
                                          className={cn(
                                             "h-auto py-2 px-3 sm:px-4 rounded-full border-2 text-xs sm:text-sm font-semibold transition-all",
                                             field.value === "flexible"
                                                ? "border-primary-700 bg-primary-700 text-white"
                                                : "border-secondary-200 bg-white text-secondary-700 hover:border-secondary-300"
                                          )}
                                       >
                                          I'm flexible
                                       </button>
                                    </div>

                                    {(field.value === "on-date" || field.value === "before-date") && datePopoverOpen && (
                                       <div className="absolute left-0 top-full mt-2 z-20 w-auto rounded-md border border-secondary-200 bg-white shadow-md p-4 space-y-3">
                                          <div className="flex items-center justify-between mb-3">
                                             <button
                                                type="button"
                                                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}
                                                className="p-1 hover:bg-secondary-100 rounded"
                                             >
                                                <ChevronLeft className="w-4 h-4" />
                                             </button>
                                             <h3 className="font-semibold text-sm">
                                                {format(calendarMonth, "MMMM yyyy")}
                                             </h3>
                                             <button
                                                type="button"
                                                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}
                                                className="p-1 hover:bg-secondary-100 rounded"
                                             >
                                                <ChevronRight className="w-4 h-4" />
                                             </button>
                                          </div>

                                          <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-secondary-600 text-center">
                                             {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                                <div key={day} className="h-6 flex items-center justify-center">
                                                   {day}
                                                </div>
                                             ))}
                                          </div>

                                          <div className="grid grid-cols-7 gap-1">
                                             {calendarDays.map((day, idx) => {
                                                const isSelected =
                                                   scheduledDate &&
                                                   startOfDay(day.date).getTime() === startOfDay(scheduledDate).getTime();
                                                const isToday = startOfDay(day.date).getTime() === startOfDay(new Date()).getTime();
                                                const isPast = day.date < new Date() && !isToday;

                                                return (
                                                   <button
                                                      key={idx}
                                                      type="button"
                                                      disabled={isPast}
                                                      onClick={() => {
                                                         const selectedDate = new Date(day.date);
                                                         selectedDate.setHours(12, 0, 0, 0);
                                                         form.setValue("scheduledDate", selectedDate);
                                                         setDatePopoverOpen(false);
                                                      }}
                                                      className={cn(
                                                         "h-8 rounded text-xs font-medium transition-all flex items-center justify-center",
                                                         !day.isCurrentMonth && "text-secondary-300",
                                                         day.isCurrentMonth && !isSelected && !isPast && "text-secondary-900 hover:bg-secondary-200",
                                                         isSelected && "bg-primary-600 text-white",
                                                         isToday && !isSelected && "bg-secondary-200 text-secondary-900",
                                                         isPast && "cursor-not-allowed opacity-50 text-secondary-300"
                                                      )}
                                                   >
                                                      {day.date.getDate()}
                                                   </button>
                                                );
                                             })}
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               {/* Specific Time of Day Checkbox */}
               <FormField
                  control={form.control}
                  name="needsTimeOfDay"
                  render={({ field }) => (
                     <FormItem className="flex items-center gap-2">
                        <div className="flex items-center">
                           <input
                              type="checkbox"
                              id="needsTimeOfDay"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                              className="h-4 w-4 border-secondary-300 rounded cursor-pointer"
                           />
                        </div>
                        <FormLabel htmlFor="needsTimeOfDay" className="text-xs sm:text-sm text-secondary-900 cursor-pointer">
                           I need a certain time of day
                        </FormLabel>
                     </FormItem>
                  )}
               />

               {/* Time Slot Selection - Show when checkbox is checked */}
               {form.watch("needsTimeOfDay") && (
                  <FormField
                     control={form.control}
                     name="timeSlot"
                     render={({ field }) => (
                        <FormItem>
                           <FormControl>
                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                 {[
                                    { value: "morning", label: "Morning", time: "Before 10am" },
                                    { value: "midday", label: "Midday", time: "10am - 2pm" },
                                    { value: "afternoon", label: "Afternoon", time: "2pm - 6pm" },
                                    { value: "evening", label: "Evening", time: "After 6pm" },
                                 ].map(({ value, label, time }) => (
                                    <button
                                       key={value}
                                       type="button"
                                       onClick={() => field.onChange(value as any)}
                                       className={cn(
                                          "py-3 px-2 rounded-lg border-2 transition-all text-center",
                                          field.value === value
                                             ? "border-primary-700 bg-primary-700 text-white"
                                             : "border-secondary-200 bg-white text-secondary-700 hover:border-secondary-300"
                                       )}
                                    >
                                       <div className="text-xs sm:text-sm font-semibold">{label}</div>
                                       <div className="text-[10px] sm:text-xs text-secondary-600" style={{ color: field.value === value ? 'rgba(255,255,255,0.8)' : undefined }}>
                                          {time}
                                       </div>
                                    </button>
                                 ))}
                              </div>
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               )}
            </div>
         )}

         {/* Recurring Tasks - Keep old UI */}
         {recurringEnabled && (
            <>
               <FormField
                  control={form.control}
                  name="scheduledTimeStart"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-xs md:text-sm">Start date & time</FormLabel>
                        <FormControl>
                           <DateTimePicker
                              value={field.value}
                              onChange={(date) => field.onChange(clampStartDateTime(date))}
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
                           {duration && duration.total > 0 && (
                              <span className="ml-2 font-medium text-primary-600">
                                 (Duration: {duration.hours > 0 && `${duration.hours}h `}{duration.minutes > 0 && `${duration.minutes}min`})
                              </span>
                           )}
                        </FormDescription>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            </>
         )}

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
