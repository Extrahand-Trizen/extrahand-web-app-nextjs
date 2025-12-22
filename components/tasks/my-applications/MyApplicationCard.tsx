"use client";

/**
 * MyApplicationCard - Application card component for My Applications page
 * Displays application information with task details and status
 * Styled similar to MyTaskCard component
 */

import React from "react";
import { Button } from "@/components/ui/button";
import {
   Eye,
   MessageSquare,
   Calendar,
   MapPin,
   Clock,
   IndianRupee,
   X,
   CheckCircle,
   XCircle,
} from "lucide-react";
import type { TaskApplication } from "@/types/application";
import type { Task } from "@/types/task";
import Link from "next/link";

interface MyApplicationCardProps {
   application: TaskApplication;
   task?: Task;
   onViewTask: (taskId: string) => void;
   onWithdraw?: (applicationId: string) => void;
   withdrawingApplicationId?: string | null;
}

export function MyApplicationCard({
   application,
   task,
   onViewTask,
   onWithdraw,
   withdrawingApplicationId,
}: MyApplicationCardProps) {
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

   // Status badge styling
   const getStatusBadge = () => {
      switch (application.status) {
         case "pending":
            return (
               <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-semibold bg-yellow-100 text-yellow-800 border border-yellow-200">
                  Pending
               </span>
            );
         case "accepted":
            return (
               <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Accepted
               </span>
            );
         case "rejected":
            return (
               <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                  <XCircle className="w-3 h-3 mr-1" />
                  Rejected
               </span>
            );
         case "withdrawn":
            return (
               <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-semibold bg-secondary-100 text-secondary-800 border border-secondary-200">
                  Withdrawn
               </span>
            );
         default:
            return null;
      }
   };

   const taskId =
      typeof application.taskId === "string"
         ? application.taskId
         : application.taskId._id;

   return (
      <div className="group bg-white rounded-lg border-2 transition-all hover:shadow-md p-3 md:p-4 border-secondary-200 hover:border-primary-300">
         {/* Header - Status and Time */}
         <div className="flex justify-between mb-2">
            <div className="flex flex-wrap items-center gap-2">
               {getStatusBadge()}
               {application.priority === "high" && (
                  <span className="inline-flex items-center px-2 md:px-2.5 py-0.5 rounded-full text-[9px] md:text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
                     High Priority
                  </span>
               )}
            </div>
            <div className="text-[10px] md:text-xs text-secondary-500 flex items-center gap-1">
               <Clock className="size-2 md:size-3" />
               {getTimeAgo(application.createdAt)}
            </div>
         </div>

         {/* Task Title */}
         {task ? (
            <h3
               onClick={() => onViewTask(taskId)}
               className="md:text-lg font-bold text-secondary-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors cursor-pointer"
            >
               {task.title}
            </h3>
         ) : (
            <h3 className="md:text-lg font-bold text-secondary-900 mb-2 line-clamp-2">
               Task #{taskId}
            </h3>
         )}

         {/* Task Description */}
         {task?.description && (
            <p className="text-xs md:text-sm text-secondary-600 mb-3 line-clamp-1">
               {task.description}
            </p>
         )}

         {/* Location */}
         {task?.location && (
            <div className="flex items-center mb-3 text-sm">
               <span className="flex items-center gap-1 text-xs md:text-sm text-secondary-600">
                  <MapPin className="size-3 md:size-4" />
                  <span className="font-medium">{task.location.city}</span>
               </span>
            </div>
         )}

         {/* Proposed Budget and Time */}
         <div className="flex items-center justify-between pt-3 border-t border-secondary-200 mb-3">
            <div>
               <div className="text-xl md:text-2xl font-bold text-secondary-900 flex items-center gap-1">
                  <IndianRupee className="w-4 h-4 md:w-5 md:h-5" />
                  {application.proposedBudget.amount.toLocaleString()}
               </div>
               <div className="text-[9px] md:text-xs text-secondary-500">
                  Proposed Budget
                  {application.proposedBudget.isNegotiable && " • Negotiable"}
               </div>
            </div>
            {application.proposedTime?.estimatedDuration && (
               <div className="text-right">
                  <div className="text-sm font-semibold text-secondary-700">
                     {application.proposedTime.estimatedDuration}h
                  </div>
                  <div className="text-[9px] md:text-xs text-secondary-500">
                     Est. duration
                  </div>
               </div>
            )}
         </div>

         {/* Cover Letter Preview */}
         {application.coverLetter && (
            <div className="mb-3 p-2 bg-secondary-50 rounded border border-secondary-200">
               <p className="text-xs text-secondary-600 line-clamp-2">
                  {application.coverLetter}
               </p>
            </div>
         )}

         {/* Relevant Experience */}
         {application.relevantExperience &&
            application.relevantExperience.length > 0 && (
               <div className="mb-3 flex flex-wrap gap-1">
                  {application.relevantExperience
                     .slice(0, 3)
                     .map((exp, index) => (
                        <span
                           key={index}
                           className="inline-block px-2 py-0.5 bg-primary-50 text-primary-700 text-xs rounded"
                        >
                           {exp}
                        </span>
                     ))}
               </div>
            )}

         {/* Response Time (if responded) */}
         {application.respondedAt && (
            <div className="mb-3 p-2 bg-blue-50 rounded border border-blue-200">
               <p className="text-xs text-blue-600 font-medium mb-0.5">
                  {application.status === "accepted"
                     ? "Accepted"
                     : application.status === "rejected"
                     ? "Rejected"
                     : "Responded"}{" "}
                  {getTimeAgo(application.respondedAt)}
               </p>
            </div>
         )}

         {/* Action Buttons */}
         <div className="flex flex-wrap gap-2 pt-3 border-t border-secondary-200">
            <Button
               variant="outline"
               size="sm"
               onClick={() => onViewTask(taskId)}
               className="flex-1 sm:flex-initial text-xs md:text-sm"
            >
               <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
               <span className="hidden sm:inline">View Task</span>
               <span className="sm:hidden">View</span>
            </Button>
            {application.status === "pending" && onWithdraw && (
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onWithdraw(application._id)}
                  disabled={withdrawingApplicationId === application._id}
                  className="flex-1 sm:flex-initial text-red-600 border-red-200 hover:bg-red-50 disabled:opacity-50 text-xs md:text-sm"
               >
                  <X className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Withdraw</span>
                  <span className="sm:hidden">Withdraw</span>
               </Button>
            )}
            {application.status === "accepted" && (
               <Link href="/chat">
                  <Button
                     variant="outline"
                     size="sm"
                     className="flex-1 sm:flex-initial text-green-600 border-green-200 hover:bg-green-50 text-xs md:text-sm"
                  >
                     <MessageSquare className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                     <span className="hidden sm:inline">Message</span>
                     <span className="sm:hidden">Chat</span>
                  </Button>
               </Link>
            )}
         </div>
      </div>
   );
}



