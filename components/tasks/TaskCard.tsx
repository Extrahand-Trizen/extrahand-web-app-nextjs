"use client";

import Link from "next/link";
import { MapPin, Clock, MessageSquare, Tag, Calendar } from "lucide-react";
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
   const budgetNegotiable =
      typeof task.budget === "object" ? task.budget.negotiable : false;

   // Time ago helper
   const getTimeAgo = (date: Date) => {
      const now = new Date();
      const diffMs = now.getTime() - new Date(date).getTime();
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
         className={`group bg-white rounded-lg border-2 transition-all cursor-pointer hover:shadow-md p-3 md:p-4 ${
            isSelected
               ? "border-primary-500 shadow-md"
               : "border-secondary-200 hover:border-primary-300"
         }`}
      >
         {/* Header - Status, Urgency, Category */}
         <div className="flex justify-between mb-2">
            <div className="flex flex-wrap items-center gap-2">
               {getStatusBadge()}
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
         <div className="flex items-center justify-between mb-3 text-sm">
            <div className="flex items-center gap-3 text-secondary-600">
               <span className="flex items-center gap-1 text-xs md:text-sm">
                  <MapPin className="size-3 md:size-4" />
                  <span className="font-medium">{task.location.city}</span>
               </span>
               {task.applications > 0 && (
                  <span className="flex items-center gap-1 text-primary-600 text-xs md:text-sm font-semibold">
                     <MessageSquare className="size-3 md:size-4" />
                     {task.applications} offer
                     {task.applications > 1 ? "s" : ""}
                  </span>
               )}
            </div>
         </div>

         {/* Budget and Type */}
         <div className="flex items-center justify-between pt-3 border-t border-secondary-200">
            <div>
               <div className="text-xl md:text-2xl font-bold text-secondary-900">
                  ₹{budgetAmount}
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

         {/* Scheduled Date/Time if available */}
         {task.scheduledDate && (
            <div className="flex mt-2 text-xs text-secondary-600 bg-secondary-50 p-2 rounded">
               <Calendar className="size-3 md:size-4 mr-2" /> Scheduled:{" "}
               {new Date(task.scheduledDate).toLocaleDateString()}{" "}
               {task.scheduledTime && `at ${task.scheduledTime}`}
            </div>
         )}

         {/* Tags */}
         {task.tags && task.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
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
      </div>
   );
}
