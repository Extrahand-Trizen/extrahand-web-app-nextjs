"use client";

import { MapPin, Clock, Calendar, User } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskCardProps {
   task: Task;
   isSelected?: boolean;
   onClick?: () => void;
}

/**
 * TaskCard - Beautiful, clean design following task schema
 * Click-only interaction (no hover map movement)
 * Shows all relevant task information from schema
 */
export function TaskCard({ task, isSelected = false, onClick }: TaskCardProps) {
   const budgetAmount =
      typeof task.budget === "object" ? task.budget.amount : task.budget;

   // Status badge styling
   const getStatusBadge = () => {
      switch (task.status) {
         case "open":
            return (
               <span className="inline-flex items-center px-1 md:px-2 py-0.5 rounded text-[9px] md:text-xs font-medium bg-green-100 text-green-800">
                  Open
               </span>
            );
         case "assigned":
            return (
               <span className="inline-flex items-center px-1 md:px-2 py-0.5 rounded text-[9px] md:text-xs font-medium bg-green-100 text-green-800">
                  Assigned
               </span>
            );
         default:
            return null;
      }
   };

   return (
      <div
         onClick={onClick}
         className={`group bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-lg p-5 md:p-6 flex flex-col gap-3.5 ${
            isSelected
               ? "border-primary-500 shadow-lg"
               : "border-secondary-200 hover:border-primary-300"
         }`}
      >
         {/* Top Row - Title and Amount */}
         <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
               <h3 className="text-lg md:text-xl font-bold text-secondary-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                  {task.title}
               </h3>
            </div>
            <div className="flex flex-col items-center shrink-0">
               <div className="text-lg md:text-xl font-bold text-secondary-900">
                  ₹{budgetAmount}
               </div>
               <div className="text-[10px] md:text-xs text-secondary-500 text-center whitespace-nowrap">
                  {task.budgetType === "fixed" && "Fixed"}
                  {task.budgetType === "hourly" && "Hourly"}
                  {task.budgetType === "negotiable" && "Negotiable"}
               </div>
            </div>
         </div>

         {/* Middle Row - Location and Schedule */}
         <div className="space-y-2">
            <div className="flex items-center gap-2 text-secondary-600">
               <MapPin className="size-4 shrink-0" />
               <span className="text-sm md:text-base font-medium truncate">{task.location.city}</span>
            </div>
            <div className="flex items-center gap-2 text-secondary-700">
               <Calendar className="size-4 shrink-0" />
               <span className="text-sm md:text-base font-medium">
                  {task.scheduledDate 
                     ? new Date(task.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                     : "Flexible"
                  }
               </span>
               {task.scheduledTime && (
                  <>
                     <Clock className="size-4 shrink-0" />
                     <span className="text-sm md:text-base font-medium">{task.scheduledTime}</span>
                  </>
               )}
            </div>
         </div>

         {/* Bottom Row - Status, Offers and User Profile */}
         <div className="flex items-center justify-between pt-3 border-t border-secondary-100">
            <div className="flex items-center gap-3">
               {getStatusBadge()}
               {task.applications > 0 && (
                  <span className="text-xs md:text-sm font-medium text-secondary-600">
                     {task.applications} offer{task.applications > 1 ? "s" : ""}
                  </span>
               )}
            </div>

            {/* User Profile Avatar */}
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-200 shrink-0 shadow-sm">
               <User className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
            </div>
         </div>
      </div>
   );
}
