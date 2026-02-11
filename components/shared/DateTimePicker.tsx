"use client";

/**
 * Reusable Date & Time Picker Component
 * 12-hour format with scrollable hour/minute/AM-PM selectors
 */

import React from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

interface DateTimePickerProps {
   value: Date | undefined;
   onChange: (date: Date | undefined) => void;
   placeholder?: string;
   disabled?: boolean;
   className?: string;
   /** Minimum selectable date (dates before this are disabled) */
   minDate?: Date;
}

export function DateTimePicker({
   value,
   onChange,
   placeholder = "Select date & time",
   disabled = false,
   className,
   minDate,
}: DateTimePickerProps) {
   const handleDateSelect = (date: Date | undefined) => {
      if (date) {
         // Preserve existing time if any
         if (value && value instanceof Date && !isNaN(value.getTime())) {
            const newDate = new Date(date);
            newDate.setHours(value.getHours());
            newDate.setMinutes(value.getMinutes());
            onChange(newDate);
         } else {
            // Set default time to 9:00 AM
            const newDate = new Date(date);
            newDate.setHours(9);
            newDate.setMinutes(0);
            onChange(newDate);
         }
      } else {
         onChange(date);
      }
   };

   const handleTimeChange = (
      type: "hour" | "minute" | "ampm",
      timeValue: string
   ) => {
      const currentDate =
         value && value instanceof Date && !isNaN(value.getTime())
            ? value
            : new Date();
      const newDate = new Date(currentDate);

      if (type === "hour") {
         const hour = parseInt(timeValue, 10);
         const currentHour = newDate.getHours();
         const isPM = currentHour >= 12;

         // Convert 12-hour to 24-hour
         if (isPM) {
            newDate.setHours(hour === 12 ? 12 : hour + 12);
         } else {
            newDate.setHours(hour === 12 ? 0 : hour);
         }
      } else if (type === "minute") {
         newDate.setMinutes(parseInt(timeValue, 10));
      } else if (type === "ampm") {
         const hours = newDate.getHours();
         if (timeValue === "AM" && hours >= 12) {
            newDate.setHours(hours - 12);
         } else if (timeValue === "PM" && hours < 12) {
            newDate.setHours(hours + 12);
         }
      }

      onChange(newDate);
   };

   // Calculate the minimum date for calendar (default to today at midnight)
   const calendarMinDate = minDate || new Date(new Date().setHours(0, 0, 0, 0));

   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               className={cn(
                  "w-full h-12 justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  className
               )}
               disabled={disabled}
            >
               <CalendarIcon className="mr-2 h-4 w-4" />
               {value && value instanceof Date && !isNaN(value.getTime()) ? (
                  format(value, "MM/dd/yyyy hh:mm aa")
               ) : (
                  <span>{placeholder}</span>
               )}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0" align="start">
            <div className="flex flex-col gap-3 p-3">
               {/* Calendar */}
               <Calendar
                  mode="single"
                  selected={value}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < calendarMinDate}
                  initialFocus
               />

               {/* Time Picker - dropdown style */}
               <div className="flex items-center gap-3 justify-start">
                  {/* Hour */}
                  <Select
                     value={
                        value && value instanceof Date && !isNaN(value.getTime())
                           ? ((value.getHours() % 12) || 12).toString()
                           : undefined
                     }
                     onValueChange={(v) => handleTimeChange("hour", v)}
                  >
                     <SelectTrigger size="sm" className="min-w-[72px]">
                        <SelectValue placeholder="HH" />
                     </SelectTrigger>
                     <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                           (hour) => (
                              <SelectItem key={hour} value={hour.toString()}>
                                 {hour.toString().padStart(2, "0")}
                              </SelectItem>
                           )
                        )}
                     </SelectContent>
                  </Select>

                  <span className="text-secondary-500 text-sm">:</span>

                  {/* Minute */}
                  <Select
                     value={
                        value && value instanceof Date && !isNaN(value.getTime())
                           ? value.getMinutes().toString()
                           : undefined
                     }
                     onValueChange={(v) => handleTimeChange("minute", v)}
                  >
                     <SelectTrigger size="sm" className="min-w-[72px]">
                        <SelectValue placeholder="MM" />
                     </SelectTrigger>
                     <SelectContent>
                        {[0, 15, 30, 45].map((minute) => (
                           <SelectItem
                              key={minute}
                              value={minute.toString()}
                           >
                              {minute.toString().padStart(2, "0")}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  {/* AM / PM */}
                  <Select
                     value={
                        value && value instanceof Date && !isNaN(value.getTime())
                           ? value.getHours() >= 12
                              ? "PM"
                              : "AM"
                           : undefined
                     }
                     onValueChange={(v) => handleTimeChange("ampm", v)}
                  >
                     <SelectTrigger size="sm" className="min-w-[72px]">
                        <SelectValue placeholder="AM/PM" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="AM">AM</SelectItem>
                        <SelectItem value="PM">PM</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
            </div>
         </PopoverContent>
      </Popover>
   );
}
