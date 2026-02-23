"use client";

import { MapPin, Calendar, Clock, Tag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task } from "@/types/task";

interface TaskDetailsHeaderProps {
   task: Task;
   showMobileCTA?: boolean;
   onMakeOffer?: () => void;
}

export function TaskDetailsHeader({
   task,
   showMobileCTA = false,
   onMakeOffer,
}: TaskDetailsHeaderProps) {
   const budgetAmount =
      typeof task.budget === "object" ? task.budget.amount : task.budget;

   const getStatusBadge = () => {
      if (task.status === "open") {
         return (
            <span className="inline-flex items-center px-1 md:px-2 py-0.5 rounded text-[9px] md:text-xs font-medium bg-green-100 text-green-800">
               Open
            </span>
         );
      } else if (task.status === "assigned") {
         return (
            <span className="inline-flex items-center px-1 md:px-2 py-0.5 rounded text-[9px] md:text-xs font-medium bg-blue-100 text-blue-800">
               Assigned
            </span>
         );
      }
      return null;
   };

   const getUrgencyBadge = () => {
      if (task.urgency === "urgent") {
         return (
            <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
               Urgent
            </span>
         );
      } else if (task.urgency === "high") {
         return (
            <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-semibold bg-red-100 text-orange-800 border border-orange-200">
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

   const formatRange = (start?: Date | string, end?: Date | string) => {
      if (!start || !end) return null;
      return `${formatDate(start)} - ${formatDate(end)}`;
   };

   const getTimeAgo = (date: Date | string | undefined) => {
      if (!date) return "Recently";
      const now = new Date();
      const taskDate = new Date(date);
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

   return (
      <div className="bg-white/70 backdrop-blur-sm border border-secondary-100/50 rounded-xl lg:rounded-2xl p-4 md:p-7 shadow-sm">
         {/* Badges & Category */}
         <div className="flex flex-wrap items-center gap-2 mb-3 lg:mb-4">
            {getStatusBadge()}
            {getUrgencyBadge()}
            <span className="inline-flex items-center px-1 md:px-2 py-0.5 rounded text-[10px] md:text-xs font-medium bg-secondary-100 text-secondary-700">
               <Tag className="size-2 md:size-3 mr-1" />
               {task.category}
            </span>
         </div>

         {/* Title & Budget */}
         <div className="flex items-start justify-between gap-4 mb-4 lg:mb-6">
            <h3 className="md:text-lg font-bold text-secondary-900 line-clamp-2 transition-colors">
               {task.title}
            </h3>

            <div className="text-right hidden lg:block shrink-0">
               <div className="text-sm text-secondary-600 mb-1">Budget</div>
               <div className="text-2xl lg:text-3xl font-bold text-primary-600">
                  ₹{budgetAmount.toLocaleString()}
               </div>
               {task.budgetType && task.budgetType !== "fixed" && (
                  <div className="text-xs text-secondary-500 mt-1">
                     {task.budgetType === "hourly" ? "per hour" : "negotiable"}
                  </div>
               )}
            </div>
         </div>

         {/* Meta Information Grid */}
         <div className="grid grid-cols-2 md:flex items-center gap-5 md:gap-8 py-2 md:py-4 border-t border-secondary-100">
            {/* Posted By */}
            <div>
               <div className="flex items-center gap-1.5 text-secondary-600 text-[10px] md:text-xs mb-1">
                  <User className="w-3.5 h-3.5" />
                  <span className="font-medium">Posted by</span>
               </div>
               <p className="text-xs md:text-sm font-semibold text-secondary-900 truncate">
                  {task.requesterName || "User"}
               </p>
            </div>

            {/* Posted Date */}
            <div>
               <div className="flex items-center gap-1.5 text-secondary-600 text-[10px] md:text-xs mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="font-medium">Posted</span>
               </div>
               <p className="text-xs md:text-sm font-semibold text-secondary-900 truncate">
                  {getTimeAgo(task.createdAt)}
               </p>
            </div>

            {/* Location */}
            <div>
               <div className="flex items-center gap-1.5 text-secondary-600 text-[10px] md:text-xs mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="font-medium">Location</span>
               </div>
               <p className="text-xs md:text-sm font-semibold text-secondary-900 truncate">
                  {task.location.city}
               </p>
            </div>

            {/* Schedule */}
            <div>
               <div className="flex items-center gap-1.5 text-secondary-600 text-[10px] md:text-xs mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="font-medium">When</span>
               </div>
               <p className="text-xs md:text-sm font-semibold text-secondary-900 truncate">
                  {task.recurring?.enabled
                     ? formatRange(task.recurring.startDate, task.recurring.endDate) || "Flexible"
                     : task.scheduledDate
                     ? formatDate(task.scheduledDate)
                     : "Flexible"}
               </p>
            </div>
         </div>

         {/* Mobile Budget & CTA */}
         {showMobileCTA && (
            <div className="md:hidden flex justify-between gap-2 space-y-2 pt-4 border-t border-secondary-100 mt-4">
               <div>
                  <p className="text-[9px] md:text-xs text-secondary-600 mb-1 font-medium">
                     Task Budget
                  </p>
                  <div className="flex items-baseline gap-2">
                     <p className="text-xl md:text-2xl font-bold text-primary-600">
                        ₹{budgetAmount.toLocaleString()}
                     </p>
                     {task.budgetType && task.budgetType !== "fixed" && (
                        <p className="text-xs text-secondary-500">
                           {task.budgetType === "hourly"
                              ? "per hour"
                              : "negotiable"}
                        </p>
                     )}
                  </div>
               </div>
               {task.status === "open" && onMakeOffer && (
                  <Button 
                     onClick={onMakeOffer}
                     className="bg-primary-600 hover:bg-primary-700 text-white h-10 font-semibold rounded-xl shadow-sm" 
                     size="lg"
                  >
                     Make an Offer
                  </Button>
               )}
            </div>
         )}
      </div>
   );
}
