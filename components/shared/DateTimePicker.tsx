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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface DateTimePickerProps {
   value: Date | undefined;
   onChange: (date: Date | undefined) => void;
   placeholder?: string;
   disabled?: boolean;
   className?: string;
}

export function DateTimePicker({
   value,
   onChange,
   placeholder = "Select date & time",
   disabled = false,
   className,
}: DateTimePickerProps) {
   const handleDateSelect = (date: Date | undefined) => {
      if (date) {
         // Preserve existing time if any
         if (value) {
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
      const currentDate = value || new Date();
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
               {value ? (
                  format(value, "MM/dd/yyyy hh:mm aa")
               ) : (
                  <span>{placeholder}</span>
               )}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0" align="start">
            <div className="sm:flex">
               {/* Calendar */}
               <Calendar
                  mode="single"
                  selected={value}
                  onSelect={handleDateSelect}
                  initialFocus
               />

               {/* Time Picker */}
               <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                  {/* Hours */}
                  <ScrollArea className="w-64 sm:w-auto">
                     <div className="flex sm:flex-col p-2">
                        {Array.from({ length: 12 }, (_, i) => i + 1)
                           .reverse()
                           .map((hour) => (
                              <Button
                                 key={hour}
                                 size="icon"
                                 variant={
                                    value && value.getHours() % 12 === hour % 12
                                       ? "default"
                                       : "ghost"
                                 }
                                 className="sm:w-full shrink-0 aspect-square"
                                 onClick={() =>
                                    handleTimeChange("hour", hour.toString())
                                 }
                                 type="button"
                              >
                                 {hour}
                              </Button>
                           ))}
                     </div>
                     <ScrollBar
                        orientation="horizontal"
                        className="sm:hidden"
                     />
                  </ScrollArea>

                  {/* Minutes */}
                  <ScrollArea className="w-64 sm:w-auto">
                     <div className="flex sm:flex-col p-2">
                        {Array.from({ length: 12 }, (_, i) => i * 5).map(
                           (minute) => (
                              <Button
                                 key={minute}
                                 size="icon"
                                 variant={
                                    value && value.getMinutes() === minute
                                       ? "default"
                                       : "ghost"
                                 }
                                 className="sm:w-full shrink-0 aspect-square"
                                 onClick={() =>
                                    handleTimeChange(
                                       "minute",
                                       minute.toString()
                                    )
                                 }
                                 type="button"
                              >
                                 {minute.toString().padStart(2, "0")}
                              </Button>
                           )
                        )}
                     </div>
                     <ScrollBar
                        orientation="horizontal"
                        className="sm:hidden"
                     />
                  </ScrollArea>

                  {/* AM/PM */}
                  <ScrollArea className="">
                     <div className="flex sm:flex-col p-2">
                        {["AM", "PM"].map((ampm) => (
                           <Button
                              key={ampm}
                              size="icon"
                              variant={
                                 value &&
                                 ((ampm === "AM" && value.getHours() < 12) ||
                                    (ampm === "PM" && value.getHours() >= 12))
                                    ? "default"
                                    : "ghost"
                              }
                              className="sm:w-full shrink-0 aspect-square"
                              onClick={() => handleTimeChange("ampm", ampm)}
                              type="button"
                           >
                              {ampm}
                           </Button>
                        ))}
                     </div>
                  </ScrollArea>
               </div>
            </div>
         </PopoverContent>
      </Popover>
   );
}
