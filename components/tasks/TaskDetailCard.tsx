"use client";

import {
   X,
   MapPin,
   Clock,
   MessageSquare,
   Tag,
   Calendar,
   ExternalLink,
   User,
   ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types/task";
import { useRouter } from "next/navigation";

interface TaskDetailCardProps {
   task: Task;
   onClose: () => void;
}

/**
 * TaskDetailCard - Beautiful overlay card showing task summary on map
 * Inspired by modern mobile app design patterns
 */
export function TaskDetailCard({ task, onClose }: TaskDetailCardProps) {
   const router = useRouter();

   const budgetAmount =
      typeof task.budget === "object" ? task.budget.amount : task.budget;
   const budgetNegotiable =
      typeof task.budget === "object" ? task.budget.negotiable : false;

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

   const getUrgencyBadge = () => {
      switch (task.urgency) {
         case "urgent":
            return (
               <Badge className="bg-red-50 text-red-700 border-red-200 text-xs font-medium">
                  Urgent
               </Badge>
            );
         case "high":
            return (
               <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs font-medium">
                  High Priority
               </Badge>
            );
         case "medium":
            return (
               <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 text-xs font-medium">
                  Medium
               </Badge>
            );
         default:
            return null;
      }
   };

   const getStatusBadge = () => {
      switch (task.status) {
         case "open":
            return (
               <Badge className="bg-green-50 text-green-700 border-green-200 text-xs font-medium">
                  Open
               </Badge>
            );
         case "assigned":
            return (
               <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium">
                  Assigned
               </Badge>
            );
         case "in_progress":
            return (
               <Badge className="bg-purple-50 text-purple-700 border-purple-200 text-xs font-medium">
                  In Progress
               </Badge>
            );
         default:
            return null;
      }
   };

   return (
      <Card className="w-full max-w-md bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-bottom-4 duration-300 py-0">
         {/* Close Button - Floating */}
         <button
            onClick={onClose}
            className="relative top-3 -right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
         >
            <X className="w-4 h-4 text-gray-600" />
         </button>

         {/* Content - Scrollable */}
         <div className="max-h-[70vh] overflow-y-auto">
            {/* Header Section */}
            <div className="p-5 pb-4">
               {/* Badges Row */}
               <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {getStatusBadge()}
                  {getUrgencyBadge()}
                  <Badge
                     variant="outline"
                     className="text-xs font-medium border-gray-200"
                  >
                     <Tag className="w-3 h-3 mr-1" />
                     {task.category}
                  </Badge>
               </div>

               {/* Title */}
               <h2 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                  {task.title}
               </h2>

               {/* Description */}
               {task.description && (
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-2 mb-3">
                     {task.description}
                  </p>
               )}

               {/* Meta Info */}
               <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                     <Clock className="w-3.5 h-3.5" />
                     <span>{getTimeAgo(task.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                     <MapPin className="w-3.5 h-3.5" />
                     <span>{task.location.city}</span>
                  </div>
               </div>
            </div>

            {/* Budget Section - Highlighted */}
            <div className="mx-5 mb-4 bg-linear-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border border-yellow-200/50">
               <div className="flex items-center justify-between">
                  <div>
                     <div className="text-3xl font-bold text-gray-900 mb-1">
                        ₹{budgetAmount.toLocaleString()}
                     </div>
                     <div className="text-xs text-gray-600 font-medium">
                        {task.budgetType === "fixed" && "Fixed price"}
                        {task.budgetType === "hourly" && "Per hour"}
                        {task.budgetType === "negotiable" && "Negotiable"}
                        {budgetNegotiable && " • Open to offers"}
                     </div>
                  </div>
                  {task.estimatedDuration && (
                     <div className="text-right bg-white/80 rounded-lg px-3 py-2">
                        <div className="text-lg font-bold text-gray-900">
                           {task.estimatedDuration}h
                        </div>
                        <div className="text-xs text-gray-600">Duration</div>
                     </div>
                  )}
               </div>
            </div>

            {/* Scheduled Date */}
            {task.scheduledDate && (
               <div className="mx-5 mb-4 flex items-center gap-3 bg-blue-50 p-3.5 rounded-xl border border-blue-200/50">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                     <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                     <div className="font-semibold text-gray-900 text-sm">
                        {new Date(task.scheduledDate).toLocaleDateString(
                           "en-US",
                           {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                           }
                        )}
                        {task.scheduledTime && ` at ${task.scheduledTime}`}
                     </div>
                     <div className="text-xs text-gray-600">Scheduled time</div>
                  </div>
               </div>
            )}

            {/* Applications Badge */}
            {task.applications > 0 && (
               <div className="mx-5 mb-4 flex items-center gap-2 bg-orange-50 p-3 rounded-xl border border-orange-200/50">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-semibold text-orange-700">
                     {task.applications}{" "}
                     {task.applications === 1 ? "offer" : "offers"} received
                  </span>
               </div>
            )}

            {/* Tags */}
            {task.tags && task.tags.length > 0 && (
               <div className="mx-5 mb-4 flex flex-wrap gap-2">
                  {task.tags.slice(0, 4).map((tag, index) => (
                     <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                     >
                        {tag}
                     </span>
                  ))}
                  {task.tags.length > 4 && (
                     <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                        +{task.tags.length - 4} more
                     </span>
                  )}
               </div>
            )}
         </div>

         {/* Footer Actions - Sticky */}
         <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 flex gap-3">
            <Button
               onClick={onClose}
               variant="outline"
               className="flex-1 border-gray-300 hover:bg-gray-50 font-medium"
            >
               Close
            </Button>
            <Button
               onClick={() => router.push(`/tasks/${task._id}`)}
               className="flex-1 bg-primary-500 hover:bg-primary-600 text-gray-900 font-semibold shadow-sm"
            >
               View Details
               <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
         </div>
      </Card>
   );
}
