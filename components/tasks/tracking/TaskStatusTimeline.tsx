"use client";

/**
 * TaskStatusTimeline - Visual progress timeline component
 * Shows task status progression with interactive timeline
 */

import React from "react";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import type { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskStatusTimelineProps {
   task: Task;
}

const STATUS_FLOW: Array<{
   key: Task["status"];
   label: string;
   icon?: React.ReactNode;
}> = [
   { key: "open", label: "Open" },
   { key: "assigned", label: "Assigned" },
   { key: "started", label: "Started" },
   { key: "in_progress", label: "In Progress" },
   { key: "review", label: "Under Review" },
   { key: "completed", label: "Completed" },
];

export function TaskStatusTimeline({ task }: TaskStatusTimelineProps) {
   // Don't show timeline for cancelled tasks
   if (task.status === "cancelled") {
      return null;
   }

   const currentStatusIndex = STATUS_FLOW.findIndex(
      (s) => s.key === task.status
   );
   const completedStatuses =
      currentStatusIndex >= 0 ? currentStatusIndex + 1 : 0;
   const totalStatuses = STATUS_FLOW.length;

   return (
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4 md:p-6">
         <div className="mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold text-secondary-900 mb-1">
               Task Progress
            </h2>
            <p className="text-xs md:text-sm text-secondary-600">
               {completedStatuses} of {totalStatuses} stages completed
            </p>
         </div>

         {/* Horizontal Timeline - Responsive for all screens */}
         <div className="relative overflow-x-auto -mx-4 md:mx-0 px-4 md:px-0">
            <div className="min-w-[600px] md:min-w-0 relative">
               {/* Progress line */}
               <div className="absolute top-4 md:top-5 left-0 right-0 h-0.5 bg-secondary-200">
                  <div
                     className="h-full bg-primary-600 transition-all duration-500"
                     style={{
                        width: `${(completedStatuses / totalStatuses) * 100}%`,
                     }}
                  />
               </div>

               {/* Status items */}
               <div className="relative flex justify-between gap-1 md:gap-0">
                  {STATUS_FLOW.map((statusItem, index) => {
                     const isCompleted = index <= currentStatusIndex;
                     const isCurrent = index === currentStatusIndex;

                     return (
                        <div
                           key={statusItem.key}
                           className="flex flex-col items-center flex-1 relative z-10 min-w-0"
                        >
                           {/* Status icon */}
                           <div
                              className={cn(
                                 "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-1.5 md:mb-2 flex-shrink-0",
                                 isCompleted
                                    ? isCurrent
                                       ? "bg-primary-600 border-primary-600 shadow-lg shadow-primary-600/30"
                                       : "bg-primary-600 border-primary-600"
                                    : "bg-white border-secondary-300"
                              )}
                           >
                              {isCompleted ? (
                                 <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
                              ) : (
                                 <Circle className="w-4 h-4 md:w-5 md:h-5 text-secondary-300" />
                              )}
                           </div>

                           {/* Status label */}
                           <div className="text-center w-full px-0.5">
                              <p
                                 className={cn(
                                    "text-[10px] md:text-xs font-semibold mb-0.5 md:mb-1 leading-tight break-words",
                                    isCompleted
                                       ? isCurrent
                                          ? "text-primary-600"
                                          : "text-primary-700"
                                       : "text-secondary-400"
                                 )}
                              >
                                 {statusItem.label}
                              </p>
                              {isCurrent && (
                                 <div className="flex items-center justify-center gap-0.5 md:gap-1 text-[9px] md:text-xs text-secondary-500">
                                    <Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                    <span className="hidden sm:inline">
                                       Current
                                    </span>
                                 </div>
                              )}
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      </div>
   );
}
