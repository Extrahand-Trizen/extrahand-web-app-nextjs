"use client";

/**
 * TaskTrackingHeader - Minimal, streamlined header for task tracking page
 * Clean design without card appearance - follows app's minimal header style
 */

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, User } from "lucide-react";
import { TaskStatusBadge } from "@/components/tasks/TaskStatusBadge";
import type { Task } from "@/types/task";

interface TaskTrackingHeaderProps {
   task: Task;
   userRole: "poster" | "tasker" | "viewer";
}

export function TaskTrackingHeader({
   task,
   userRole,
}: TaskTrackingHeaderProps) {
   const router = useRouter();

   const getRoleLabel = () => {
      switch (userRole) {
         case "poster":
            return "Task Owner";
         case "tasker":
            return "Assigned Tasker";
         default:
            return "Viewer";
      }
   };

   return (
      <div className="bg-white/95 backdrop-blur-sm border-b border-secondary-100 sticky top-0 z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Back Button Row */}
            <div className="flex items-center h-12 md:h-14">
               <button
                  onClick={() => router.back()}
                  className="flex items-center gap-1.5 text-secondary-500 hover:text-secondary-900 transition-colors -ml-2 px-2 py-1.5 rounded-md hover:bg-secondary-50"
                  aria-label="Go back"
               >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-sm font-medium hidden sm:inline">
                     Back
                  </span>
               </button>
            </div>

            {/* Title & Meta Row */}
            <div className="pb-3 md:pb-4">
               <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-lg md:text-xl lg:text-2xl font-bold text-secondary-900 line-clamp-2 leading-tight flex-1 min-w-0">
                     {task.title}
                  </h1>
                  <div className="flex-shrink-0 pt-0.5">
                     <TaskStatusBadge status={task.status} size="sm" />
                  </div>
               </div>

               {/* Role Indicator - Minimal */}
               <div className="flex items-center gap-2 text-xs md:text-sm text-secondary-600">
                  <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary-400" />
                  <span className="font-medium">{getRoleLabel()}</span>
                  {task.category && (
                     <>
                        <span className="text-secondary-300">•</span>
                        <span className="text-secondary-500">
                           {task.category}
                        </span>
                     </>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
