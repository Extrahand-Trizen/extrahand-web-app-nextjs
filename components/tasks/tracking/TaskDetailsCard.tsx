"use client";

/**
 * TaskDetailsCard - Displays comprehensive task information
 * Shows all relevant task details in an organized card
 */

import React from "react";
import {
   MapPin,
   Calendar,
   Clock,
   IndianRupee,
   Tag,
   User,
   AlertCircle,
} from "lucide-react";
import type { Task } from "@/types/task";
import { format } from "date-fns";

interface TaskDetailsCardProps {
   task: Task;
}

const InfoRow = ({
   icon: Icon,
   label,
   value,
}: {
   icon: React.ElementType;
   label: string;
   value: string | React.ReactNode;
}) => (
   <div className="flex items-start gap-3 py-3 border-b border-secondary-100 last:border-0">
      <div className="flex-shrink-0 mt-0.5">
         <Icon className="w-5 h-5 text-secondary-400" />
      </div>
      <div className="flex-1 min-w-0">
         <p className="text-xs font-medium text-secondary-500 mb-1">{label}</p>
         <div className="text-sm font-medium md:font-semibold text-secondary-900">
            {value}
         </div>
      </div>
   </div>
);

export function TaskDetailsCard({ task }: TaskDetailsCardProps) {
   const budgetAmount =
      typeof task.budget === "object" ? task.budget.amount : task.budget;
   const budgetCurrency =
      typeof task.budget === "object" ? task.budget.currency : "INR";
   const categoryLabel = task.categoryLabel || task.subcategory || task.category;

   const formatDate = (date: Date | string | undefined) => {
      if (!date) return "Not scheduled";
      try {
         return format(new Date(date), "MMM dd, yyyy 'at' h:mm a");
      } catch {
         return "Invalid date";
      }
   };

   return (
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4 md:p-6">
         <h2 className="text-base md:text-lg font-semibold md:font-bold text-secondary-900 mb-3 md:mb-4">
            Task Details
         </h2>

         <div className="space-y-1">
            <InfoRow
               icon={Tag}
               label="Category"
               value={
                  <div className="flex items-center gap-2">
                     <span>{categoryLabel}</span>
                     {task.subcategory && task.subcategory !== categoryLabel && (
                        <span className="text-secondary-500">
                           • {task.subcategory}
                        </span>
                     )}
                  </div>
               }
            />

            <InfoRow
               icon={IndianRupee}
               label="Budget"
               value={
                  <span className="text-primary-600">
                     {budgetCurrency === "INR" ? "₹" : "$"}
                     {budgetAmount?.toLocaleString() || "0"}
                     {task.budgetType === "hourly" && " / hour"}
                  </span>
               }
            />

            <InfoRow
               icon={MapPin}
               label="Location"
               value={
                  <div>
                     <p className="font-medium md:font-semibold">
                        {task.location?.address || "No address provided"}
                     </p>
                     <p className="text-xs text-secondary-500 mt-0.5">
                        {task.location?.city || "N/A"}, {task.location?.state || "N/A"}
                        {task.location?.pinCode && ` - ${task.location.pinCode}`}
                     </p>
                  </div>
               }
            />

            {task.scheduledDate && (
               <InfoRow
                  icon={Calendar}
                  label="Scheduled Date"
                  value={formatDate(task.scheduledDate)}
               />
            )}

            {task.estimatedDuration && (
               <InfoRow
                  icon={Clock}
                  label="Estimated Duration"
                  value={`${task.estimatedDuration} hours`}
               />
            )}

            {task.assignedToName && (
               <InfoRow
                  icon={User}
                  label={
                     task.requesterId === task.assigneeUid
                        ? "Assigned To"
                        : "Tasker"
                  }
                  value={task.assignedToName}
               />
            )}

            {task.requirements && task.requirements.length > 0 && (
               <div className="py-3 border-b border-secondary-100">
                  <p className="text-xs font-medium text-secondary-500 mb-2">
                     Requirements
                  </p>
                  <ul className="space-y-1">
                     {task.requirements.map((req, index) => (
                        <li
                           key={index}
                           className="flex items-start gap-2 text-sm text-secondary-700"
                        >
                           <span className="text-primary-600 mt-1">•</span>
                           <span>{req}</span>
                        </li>
                     ))}
                  </ul>
               </div>
            )}

            {task.description && (
               <div className="pt-3">
                  <p className="text-xs font-medium text-secondary-500 mb-2">
                     Description
                  </p>
                  <p className="text-xs md:text-sm text-secondary-700 leading-relaxed whitespace-pre-wrap">
                     {task.description}
                  </p>
               </div>
            )}

            {task.tags && task.tags.length > 0 && (
               <div className="pt-3 flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                     <span
                        key={index}
                        className="px-2.5 py-1 bg-secondary-100 text-secondary-700 text-xs rounded-full font-medium"
                     >
                        {tag}
                     </span>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
