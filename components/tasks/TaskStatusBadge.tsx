"use client";

/**
 * TaskStatusBadge - Reusable status badge component
 * Consistent styling across the app
 */

import type { Task } from "@/types/task";

interface TaskStatusBadgeProps {
   status: Task["status"];
   size?: "sm" | "md" | "lg";
}

export function TaskStatusBadge({ status, size = "md" }: TaskStatusBadgeProps) {
   const sizeClasses = {
      sm: "px-1 md:px-2 py-0.5 text-[9px] md:text-xs",
      md: "px-3 py-1 text-xs sm:text-sm",
      lg: "px-4 py-1.5 text-sm",
   };

   const getStatusStyles = () => {
      switch (status) {
         case "open":
            return "bg-green-100 text-green-800 border-green-200";
         case "assigned":
            return "bg-blue-100 text-blue-800 border-blue-200";
         case "started":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
         case "in_progress":
            return "bg-orange-100 text-orange-800 border-orange-200";
         case "review":
            return "bg-purple-100 text-purple-800 border-purple-200";
         case "completed":
            return "bg-green-100 text-green-800 border-green-200";
         case "cancelled":
            return "bg-red-100 text-red-800 border-red-200";
         default:
            return "bg-secondary-100 text-secondary-800 border-secondary-200";
      }
   };

   const getStatusLabel = () => {
      return status.replace("_", " ").toUpperCase();
   };

   // Use rounded for sm (to match TaskCard), rounded-full for larger sizes
   const roundedClass = size === "sm" ? "rounded" : "rounded-full";
   const fontWeightClass = size === "sm" ? "font-medium" : "font-semibold";

   return (
      <span
         className={`inline-flex items-center ${roundedClass} border ${fontWeightClass} ${
            sizeClasses[size]
         } ${getStatusStyles()}`}
      >
         {getStatusLabel()}
      </span>
   );
}
