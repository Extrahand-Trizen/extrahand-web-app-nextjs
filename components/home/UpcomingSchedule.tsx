"use client";

/**
 * Upcoming Schedule Component
 * Compact summary of tasks scheduled in next 7 days
 * Collapsible, shown only when relevant
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, ChevronDown, Clock } from "lucide-react";
import type { TaskSnapshotItem } from "@/types/dashboard";

interface UpcomingScheduleProps {
   tasks: TaskSnapshotItem[];
}

export function UpcomingSchedule({ tasks }: UpcomingScheduleProps) {
   const router = useRouter();
   const [isExpanded, setIsExpanded] = useState(false);

   // Get tasks with scheduled dates in next 7 days
   const upcomingTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      const today = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(today.getDate() + 7);
      return taskDate >= today && taskDate <= sevenDaysFromNow;
   });

   if (upcomingTasks.length === 0) {
      return null;
   }

   // Group by date
   const groupedByDate = upcomingTasks.reduce((acc, task) => {
      if (!task.dueDate) return acc;
      const dateKey = new Date(task.dueDate).toLocaleDateString("en-IN", {
         day: "numeric",
         month: "short",
      });
      if (!acc[dateKey]) {
         acc[dateKey] = [];
      }
      acc[dateKey].push(task);
      return acc;
   }, {} as Record<string, TaskSnapshotItem[]>);

   const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
      return (
         new Date(groupedByDate[a][0].dueDate!).getTime() -
         new Date(groupedByDate[b][0].dueDate!).getTime()
      );
   });

   const summaryText = sortedDates
      .slice(0, 2)
      .map(
         (date) =>
            `${date}: ${groupedByDate[date].length} task${
               groupedByDate[date].length > 1 ? "s" : ""
            }`
      )
      .join(", ");

   return (
      <div className="bg-white rounded-lg border border-secondary-200 p-3">
         <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between gap-2 group"
         >
            <div className="flex items-center gap-2 flex-1 min-w-0">
               <Calendar className="w-4 h-4 text-secondary-500 shrink-0" />
               <span className="text-sm font-medium text-secondary-700 truncate">
                  {summaryText}
                  {sortedDates.length > 2 && ` +${sortedDates.length - 2} more`}
               </span>
            </div>
            <ChevronDown
               className={`w-4 h-4 text-secondary-400 transition-transform shrink-0 ${
                  isExpanded ? "rotate-180" : ""
               }`}
            />
         </button>

         {isExpanded && (
            <div className="mt-3 pt-3 border-t border-secondary-100 space-y-2">
               {sortedDates.map((date) => (
                  <div key={date}>
                     <div className="text-xs font-semibold text-secondary-500 mb-1.5">
                        {date}
                     </div>
                     <div className="space-y-1">
                        {groupedByDate[date].map((task) => (
                           <button
                              key={task.id}
                              onClick={() => router.push(task.nextStepRoute)}
                              className="w-full text-left flex items-center justify-between gap-2 p-2 rounded hover:bg-secondary-50 transition-colors group"
                           >
                              <span className="text-xs text-secondary-700 truncate flex-1">
                                 {task.title}
                              </span>
                              <span className="text-xs font-medium text-secondary-900 shrink-0">
                                 ₹{task.budget}
                              </span>
                           </button>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </div>
   );
}
