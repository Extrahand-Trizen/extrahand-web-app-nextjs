"use client";

import { MapPin, Calendar, Clock, Tag } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskDetailsHeaderProps {
   task: Task;
}

export function TaskDetailsHeader({ task }: TaskDetailsHeaderProps) {
   const budgetAmount =
      typeof task.budget === "object" ? task.budget.amount : task.budget;

   const getStatusBadge = () => {
      if (task.status === "open") {
         return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
               Open
            </span>
         );
      } else if (task.status === "assigned") {
         return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
               Assigned
            </span>
         );
      }
      return null;
   };

   const getUrgencyBadge = () => {
      if (task.urgency === "urgent") {
         return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
               🔥 Urgent
            </span>
         );
      } else if (task.urgency === "high") {
         return (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800 border border-orange-200">
               High Priority
            </span>
         );
      }
      return null;
   };

   const formatDate = (date: Date | string | undefined) => {
      if (!date) return null;
      const d = new Date(date);
      return d.toLocaleDateString("en-US", {
         weekday: "short",
         day: "numeric",
         month: "short",
      });
   };

   return (
      <div className="bg-white border border-secondary-200 rounded-lg p-6">
         {/* Badges */}
         <div className="flex flex-wrap items-center gap-2 mb-3">
            {getStatusBadge()}
            {getUrgencyBadge()}
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-200">
               <Tag className="w-3 h-3 mr-1" />
               {task.category}
            </span>
         </div>

         {/* Title */}
         <h1 className="text-2xl md:text-3xl font-bold text-secondary-900 mb-4">
            {task.title}
         </h1>

         {/* Meta Information */}
         <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-600">
            {/* Location */}
            <div className="flex items-center gap-1.5">
               <MapPin className="w-4 h-4" />
               <span>{task.location.city}</span>
            </div>

            {/* Date */}
            {task.scheduledDate && (
               <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(task.scheduledDate)}</span>
               </div>
            )}

            {/* Time */}
            {task.scheduledTime && (
               <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{task.scheduledTime}</span>
               </div>
            )}

            {/* Duration */}
            {task.estimatedDuration && (
               <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{task.estimatedDuration} hours</span>
               </div>
            )}
         </div>

         {/* Budget Display */}
         <div className="mt-4 pt-4 border-t border-secondary-200">
            <div className="flex items-baseline gap-2">
               <span className="text-3xl font-bold text-secondary-900">
                  ₹{budgetAmount.toLocaleString()}
               </span>
               {task.budgetType && task.budgetType !== "fixed" && (
                  <span className="text-sm text-secondary-600">
                     {task.budgetType === "hourly" ? "per hour" : "negotiable"}
                  </span>
               )}
            </div>
            {typeof task.budget === "object" && task.budget.negotiable && (
               <span className="text-xs text-secondary-500 mt-1 inline-block">
                  Budget is negotiable
               </span>
            )}
         </div>
      </div>
   );
}
