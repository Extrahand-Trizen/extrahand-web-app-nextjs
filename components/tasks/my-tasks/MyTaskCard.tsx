"use client";

/**
 * MyTaskCard - Task card component for My Tasks page
 * Displays task information with action buttons
 * Styled similar to TaskCard component
 */

import React from "react";
import { Button } from "@/components/ui/button";
import {
   Edit,
   Trash2,
   Eye,
   TrendingUp,
   Calendar,
   MapPin,
   MessageSquare,
   Tag,
   Clock,
} from "lucide-react";
import type { Task } from "@/types/task";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { TaskStatusBadge } from "../TaskStatusBadge";

interface MyTaskCardProps {
   task: Task;
   deletingTaskId: string | null;
   onView: (taskId: string) => void;
   onEdit: (taskId: string) => void;
   onDelete: (taskId: string, taskTitle: string) => void;
   onViewApplications: (taskId: string) => void;
   onTrackProgress: (taskId: string) => void;
}

export function MyTaskCard({
   task,
   deletingTaskId,
   onView,
   onEdit,
   onDelete,
   onViewApplications,
   onTrackProgress,
}: MyTaskCardProps) {
   const budgetAmount =
      typeof task.budget === "object" ? task.budget.amount : task.budget;
   const budgetNegotiable =
      typeof task.budget === "object" ? task.budget.negotiable : false;

   // Time ago helper
   const getTimeAgo = (date: Date | string | undefined): string => {
      if (!date) return "Recently";
      const now = new Date();
      const taskDate = typeof date === "string" ? new Date(date) : date;
      const diffMs = now.getTime() - taskDate.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} min ago`;
      if (diffHours < 24)
         return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays === 1) return "Yesterday";
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
   };

   // Urgency badge styling
   const getUrgencyBadge = () => {
      switch (task.urgency) {
         case "urgent":
            return (
               <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                  Urgent
               </span>
            );
         case "high":
            return (
               <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                  High Priority
               </span>
            );
         case "medium":
            return null; // Don't show medium
         default:
            return null;
      }
   };

   return (
      <div
         onClick={() => onView(task._id)}
         className="group bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-md p-3 md:p-4 border-secondary-200 hover:border-primary-300"
      >
         {/* Header - Status, Urgency, Category */}
         <div className="flex justify-between mb-2">
            <div className="flex flex-wrap items-center gap-2">
               <TaskStatusBadge status={task.status} size="sm" />
               {getUrgencyBadge()}
               <span className="inline-flex items-center px-1 md:px-2 py-0.5 rounded text-[10px] md:text-xs font-medium bg-secondary-100 text-secondary-700">
                  <Tag className="size-2 md:size-3 mr-1" />
                  {task.category}
               </span>
            </div>
            <div className="text-[10px] md:text-xs text-secondary-500 flex items-center gap-1">
               <Clock className="size-2 md:size-3" />
               {getTimeAgo(task.createdAt)}
            </div>
         </div>

         {/* Title */}
         <h3 className="md:text-lg font-bold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {task.title}
         </h3>

         {/* Description */}
         {task.description && (
            <p className="text-xs md:text-sm text-secondary-600 mb-3 line-clamp-2">
               {task.description}
            </p>
         )}

         {/* Location and Meta Info */}
         <div className="flex items-center mb-3 text-sm">
            <div className="flex items-center justify-between w-full text-secondary-600">
               <span className="flex items-center gap-1 text-xs md:text-sm">
                  <MapPin className="size-3 md:size-4" />
                  <span className="font-medium">{task.location.city}</span>
               </span>
               {/* Scheduled Date/Time if available */}
               {task.scheduledDate && (
                  <div className="flex text-xs text-secondary-600 bg-secondary-50 p-2 rounded">
                     <Calendar className="size-3 md:size-4 mr-2" /> Scheduled:{" "}
                     {new Date(task.scheduledDate).toLocaleDateString()}{" "}
                  </div>
               )}
            </div>
         </div>

         {/* Assigned Performer (if assigned) */}
         {task.assignedToName && (
            <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
               <p className="text-xs text-blue-600 font-medium mb-0.5">
                  Assigned To
               </p>
               <p className="text-xs md:text-sm font-semibold text-blue-900">
                  {task.assignedToName}
               </p>
               {task.assignedAt && (
                  <p className="text-[9px] md:text-xs text-blue-600 mt-0.5">
                     Assigned {getTimeAgo(task.assignedAt)}
                  </p>
               )}
            </div>
         )}

         {/* Budget and Type */}
         <div className="flex items-center justify-between pt-3 border-t border-secondary-200 mb-3">
            <div>
               <div className="text-xl md:text-2xl font-bold text-secondary-900">
                  ₹{budgetAmount.toLocaleString()}
               </div>
               <div className="text-[9px] md:text-xs text-secondary-500">
                  {task.budgetType === "fixed" && "Fixed price"}
                  {task.budgetType === "hourly" && "Per hour"}
                  {task.budgetType === "negotiable" && "Negotiable"}
                  {budgetNegotiable && " • Negotiable"}
               </div>
            </div>
            {task.estimatedDuration && (
               <div className="text-right">
                  <div className="text-sm font-semibold text-secondary-700">
                     {task.estimatedDuration}h
                  </div>
                  <div className="text-[9px] md:text-xs text-secondary-500">
                     Est. duration
                  </div>
               </div>
            )}
         </div>

         {/* Tags */}
         {task.tags && task.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1">
               {task.tags.slice(0, 3).map((tag, index) => (
                  <span
                     key={index}
                     className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded"
                  >
                     {tag}
                  </span>
               ))}
            </div>
         )}

         {/* Action Buttons */}
         <div
            className="flex flex-wrap gap-2 pt-3 border-t border-secondary-200"
            onClick={(e) => e.stopPropagation()}
         >
            <Button
               variant="outline"
               size="sm"
               onClick={() => onView(task._id)}
               className="flex-1 sm:flex-initial text-xs md:text-sm"
            >
               <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
               <span className="hidden sm:inline">View</span>
            </Button>
            <Button
               variant="outline"
               size="sm"
               onClick={() => onEdit(task._id)}
               className="flex-1 sm:flex-initial text-xs md:text-sm"
            >
               <Edit className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
               <span className="hidden sm:inline">Edit</span>
            </Button>
            {task.status === "open" ? (
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewApplications(task._id)}
                  className="flex-1 sm:flex-initial text-purple-600 border-purple-200 hover:bg-purple-50 text-xs md:text-sm"
               >
                  <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">
                     Applications ({task.applications})
                  </span>
               </Button>
            ) : task.status !== "completed" && task.status !== "cancelled" ? (
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onTrackProgress(task._id)}
                  className="flex-1 sm:flex-initial text-green-600 border-green-200 hover:bg-green-50 text-xs md:text-sm"
               >
                  <TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Track</span>
                  <span className="sm:hidden">Track</span>
               </Button>
            ) : null}
            <Button
               variant="outline"
               size="sm"
               onClick={() => onDelete(task._id, task.title)}
               disabled={deletingTaskId === task._id}
               className="flex-1 sm:flex-initial text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50 text-xs md:text-sm"
            >
               {deletingTaskId === task._id ? (
                  <LoadingSpinner size="sm" />
               ) : (
                  <>
                     <Trash2 className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                     <span className="hidden sm:inline">Delete</span>
                  </>
               )}
            </Button>
         </div>
      </div>
   );
}
