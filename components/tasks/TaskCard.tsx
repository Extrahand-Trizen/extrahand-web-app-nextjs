"use client";

import { MapPin, Clock, Calendar, User, Tag } from "lucide-react";
import Image from "next/image";
import type { Task } from "@/types/task";
import { getTaskCategoryLabel } from "@/lib/utils/taskCategory";

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

   // Determine if task is remote
   const isRemote = !task.location?.coordinates || !task.location?.address;
   const locationDisplay = isRemote ? "Remote" : task.location?.city || "Remote";

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
         className={`group bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-md p-3 md:p-4 flex flex-col gap-2 ${isSelected
               ? "border-primary-500 shadow-md"
               : "border-secondary-200 hover:border-primary-300"
            }`}
      >
         {/* Top Row - Title and Amount */}
         <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {task.applications > 0 && (
                     <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded text-[9px] md:text-xs font-medium bg-purple-100 text-purple-700">
                        {task.applications} {task.applications === 1 ? "offer" : "offers"}
                     </span>
                  )}
               </div>
               <h3 className="text-base md:text-lg font-bold text-secondary-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                  {task.title}
               </h3>
            </div>
            <div className="flex flex-col items-center shrink-0">
               <div className="text-base md:text-lg font-bold text-secondary-900">
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
         <div className="space-y-1">
            <div className="flex items-center justify-between gap-2 text-secondary-600">
               <div className="flex items-center gap-2 min-w-0">
                  <MapPin className="size-3.5 shrink-0" />
                  <span className="text-xs md:text-sm font-medium truncate">{locationDisplay}</span>
               </div>
                  {/* Distance hidden as per requirement */}
            </div>
            <div className="flex items-center gap-2 text-secondary-700 text-xs md:text-sm font-medium">
               <Calendar className="size-3.5 shrink-0" />
               <span>
                  {task.dateOption === "flexible" || !task.dateOption || !task.scheduledDate
                     ? "Flexible"
                     : task.dateOption === "on-date" && task.scheduledDate
                        ? `On ${new Date(task.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : task.dateOption === "before-date" && task.scheduledDate
                           ? `Before ${new Date(task.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                           : task.scheduledDate
                              ? new Date(task.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                              : "Flexible"}
               </span>
            </div>
            <div className="flex items-center gap-2 text-secondary-700 text-xs md:text-sm font-medium">
               <Clock className="size-3.5 shrink-0" />
               <span>
                  {task.timeSlot
                     ? task.timeSlot.charAt(0).toUpperCase() + task.timeSlot.slice(1)
                     : "Anytime"}
               </span>
            </div>
         </div>

         {/* Bottom Row - Status and User Profile */}
         <div className="flex items-center justify-between pt-2 border-t border-secondary-100">
            <div className="flex items-center gap-3">
               {getStatusBadge()}
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] md:text-xs font-medium bg-secondary-100 text-secondary-700">
                     <Tag className="size-2 md:size-3 mr-1" />
                     {getTaskCategoryLabel(task)}
                  </span>
            </div>

            {/* User Profile Avatar */}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-100 flex items-center justify-center border-2 border-primary-200 shrink-0 shadow-sm overflow-hidden">
               {task.requesterPhotoURL ? (
                  <Image
                     src={task.requesterPhotoURL}
                     alt={task.requesterName || "Poster"}
                     width={40}
                     height={40}
                     className="w-full h-full object-cover"
                  />
               ) : (
                  <User className="w-4 h-4 md:w-5 md:h-5 text-primary-600" />
               )}
            </div>
         </div>
      </div>
   );
}
