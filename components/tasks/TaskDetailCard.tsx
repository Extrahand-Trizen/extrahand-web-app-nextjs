"use client";

import {
   X,
   MapPin,
   MessageSquare,
   Tag,
   Calendar,
   User,
   ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buildPublicProfilePath } from "@/lib/utils/profileHandle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Task } from "@/types/task";
import { useRouter } from "next/navigation";
import { usePrefetchTaskDetails } from "@/hooks/usePrefetchTaskDetails";
import { useQuery } from "@tanstack/react-query";
import { taskDetailsQueryKeys } from "@/lib/queryKeys";
import { tasksApi } from "@/lib/api/endpoints/tasks";

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
   const { onMouseEnter: prefetchTask } = usePrefetchTaskDetails(task._id);
   const { data: fetchedTask } = useQuery<Task>({
      queryKey: taskDetailsQueryKeys.task(task._id),
      queryFn: () => tasksApi.getTask(task._id),
      initialData: task,
      staleTime: 60 * 1000,
   });

   const displayTask = fetchedTask || task;

   const budgetAmount =
      typeof displayTask.budget === "object"
         ? displayTask.budget.amount
         : displayTask.budget;
   const budgetNegotiable =
      typeof displayTask.budget === "object"
         ? displayTask.budget.negotiable
         : false;
   const categoryLabel =
      displayTask.categoryLabel ||
      displayTask.subcategory ||
      displayTask.category;
   
   // Smart date display
   const scheduledDateLabel = displayTask.dateOption === "flexible" || !displayTask.dateOption || !displayTask.scheduledDate
      ? "Flexible"
      : displayTask.dateOption === "on-date" && displayTask.scheduledDate
      ? `On ${new Date(displayTask.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : displayTask.dateOption === "before-date" && displayTask.scheduledDate
      ? `Before ${new Date(displayTask.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
      : displayTask.scheduledDate
      ? new Date(displayTask.scheduledDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
      : "Flexible";
   
   // Smart time display
   const scheduledSubLabel = displayTask.timeSlot
      ? displayTask.timeSlot.charAt(0).toUpperCase() + displayTask.timeSlot.slice(1)
      : displayTask.scheduledTime
      ? displayTask.scheduledTime
      : "Anytime";
   
   // Determine if task is remote
   const isRemote = !displayTask.location?.coordinates || !displayTask.location?.address;
   const locationLabel = isRemote ? "Remote" : displayTask.location?.city?.trim() || "Remote";

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
      switch (displayTask.urgency) {
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
      switch (displayTask.status) {
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
               {/* Top Row - Content and Budget Side by Side */}
               <div className="flex gap-4 mb-2">
                  {/* Left Column - Badges and Title */}
                  <div className="flex-1">
                     {/* Badges Row */}
                     <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {getStatusBadge()}
                        {getUrgencyBadge()}
                        <Badge
                           variant="outline"
                           className="text-xs font-medium border-gray-200"
                        >
                           <Tag className="w-3 h-3 mr-1" />
                           {categoryLabel}
                        </Badge>
                     </div>

                     {/* Title */}
                     <h2 className="text-3xl font-bold text-gray-900 leading-tight">
                        {displayTask.title}
                     </h2>
                  </div>

                  {/* Right Column - Budget Section */}
                  <div className="shrink-0 rounded-lg bg-gray-50 px-5 py-4 text-center w-40 h-fit">
                     <h3 className="text-[11px] uppercase tracking-wide text-gray-500 font-normal mb-2">
                        Task Budget
                     </h3>
                     <div className="text-3xl font-bold text-secondary-900 mb-1">
                        ₹{budgetAmount.toLocaleString()}
                     </div>
                     <div className="text-xs text-secondary-600 font-normal">
                        {displayTask.budgetType === "fixed" && "Fixed price"}
                        {displayTask.budgetType === "hourly" && "Per hour"}
                        {displayTask.budgetType === "negotiable" && "Negotiable"}
                        {budgetNegotiable && " • Open to offers"}
                     </div>
                  </div>
               </div>

               {/* Task Meta - Requested format */}
               <div className="space-y-2 mb-4">
                  <div className="flex items-start justify-between gap-3">
                     <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-secondary-100 border border-secondary-200 flex items-center justify-center shrink-0 overflow-hidden">
                           {displayTask.requesterPhotoURL ? (
                              <Image
                                 src={displayTask.requesterPhotoURL}
                                 alt={displayTask.requesterName || "Poster"}
                                 width={40}
                                 height={40}
                                 className="w-full h-full object-cover"
                              />
                           ) : (
                              <User className="w-5 h-5 text-secondary-600" />
                           )}
                        </div>
                        <div className="min-w-0">
                           <div className="text-[11px] uppercase tracking-wide text-secondary-500 font-normal">
                              Posted by
                           </div>
                           <Link
                              href={buildPublicProfilePath(displayTask.requesterName, displayTask.requesterId)}
                              className="text-base font-normal text-secondary-900 truncate hover:text-primary-600 hover:underline transition-colors"
                              onClick={(e) => e.stopPropagation()}
                           >
                              {displayTask.requesterName || "Task poster"}
                           </Link>
                        </div>
                     </div>
                     <div className="text-xs text-secondary-400 whitespace-nowrap pt-1 font-normal">
                        {getTimeAgo(displayTask.createdAt)}
                     </div>
                  </div>

                  <div className="flex items-start gap-3">
                     <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-secondary-800" />
                     </div>
                     <div>
                        <div className="text-[11px] uppercase tracking-wide text-secondary-500 font-normal">
                           Location
                        </div>
                        <div className="text-base font-normal text-secondary-900">
                           {locationLabel}
                        </div>
                     </div>
                  </div>

                  <div className="flex items-start gap-3">
                     <div className="w-10 h-10 shrink-0 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-secondary-800" />
                     </div>
                     <div>
                        <div className="text-[11px] uppercase tracking-wide text-secondary-500 font-normal">
                           To be done on
                        </div>
                        <div className="text-base font-normal text-secondary-900">
                           {scheduledDateLabel}
                        </div>
                        {scheduledSubLabel && (
                           <div className="text-sm text-secondary-700 font-normal">
                              {scheduledSubLabel}
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>

            {/* Details Section */}
            <div className="mx-5 mb-5 pl-2">
             <h3 className="text-lg font-bold text-secondary-900 mb-2">
  Details
</h3>
               <p className="text-sm text-secondary-700 font-normal leading-relaxed whitespace-pre-wrap wrap-break-word">
                  {displayTask.description || "No description provided."}
               </p>
            </div>

            {/* Applications Badge */}
            {displayTask.applications > 0 && (
               <div className="mx-5 mb-4 flex items-center gap-2 bg-orange-50 p-3 rounded-xl border border-orange-200/50">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-normal text-orange-700">
                     {displayTask.applications}{" "}
                     {displayTask.applications === 1 ? "offer" : "offers"} received
                  </span>
               </div>
            )}

            {/* Tags */}
            {displayTask.tags && displayTask.tags.length > 0 && (
               <div className="mx-5 mb-4 flex flex-wrap gap-2">
                  {displayTask.tags.slice(0, 4).map((tag, index) => (
                     <span
                        key={index}
                        className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                     >
                        {tag}
                     </span>
                  ))}
                  {displayTask.tags.length > 4 && (
                     <span className="inline-flex items-center px-3 py-1.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
                        +{displayTask.tags.length - 4} more
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
               onMouseEnter={prefetchTask}
               className="flex-1 bg-primary-500 hover:bg-primary-600 text-gray-900 font-semibold shadow-sm"
            >
               View Details
               <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
         </div>
      </Card>
   );
}
