"use client";

import { Button } from "@/components/ui/button";
import { MapPin, Shield, Clock, CheckCircle, User, Star } from "lucide-react";
import type { Task } from "@/types/task";

interface TaskDetailsSidebarProps {
   task: Task;
}

export function TaskDetailsSidebar({ task }: TaskDetailsSidebarProps) {
   const budgetAmount =
      typeof task.budget === "object" ? task.budget.amount : task.budget;

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
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffDays === 1) return "Yesterday";
      return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
   };

   return (
      <div className="space-y-4">
         {/* Budget & CTA Card */}
         <div className="bg-white border border-secondary-200 rounded-lg p-5">
            <div className="mb-4">
               <div className="text-sm text-secondary-600 mb-1">Task Budget</div>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-secondary-900">
                     ₹{budgetAmount.toLocaleString()}
                  </span>
                  {task.budgetType && task.budgetType !== "fixed" && (
                     <span className="text-sm text-secondary-600">
                        {task.budgetType === "hourly" ? "/hr" : "negotiable"}
                     </span>
                  )}
               </div>
            </div>

            {task.status === "open" && (
               <>
                  <Button className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold mb-2">
                     Make an Offer
                  </Button>
                  <Button
                     variant="outline"
                     className="w-full border-secondary-300 text-secondary-700 hover:bg-secondary-50"
                  >
                     Ask a Question
                  </Button>
               </>
            )}
         </div>

         {/* Task Meta Info */}
         <div className="bg-white border border-secondary-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-secondary-900 mb-3">
               Task Information
            </h3>
            <div className="space-y-3 text-sm">
               <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Posted</span>
                  <span className="font-medium text-secondary-900">
                     {getTimeAgo(task.createdAt)}
                  </span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Category</span>
                  <span className="font-medium text-secondary-900">
                     {task.category}
                  </span>
               </div>
               <div className="flex items-center justify-between">
                  <span className="text-secondary-600">Location</span>
                  <span className="font-medium text-secondary-900 flex items-center gap-1">
                     <MapPin className="w-3.5 h-3.5" />
                     {task.location.city}
                  </span>
               </div>
               {typeof task.applications === "number" && (
                  <div className="flex items-center justify-between">
                     <span className="text-secondary-600">Offers</span>
                     <span className="font-medium text-secondary-900">
                        {task.applications}
                     </span>
                  </div>
               )}
            </div>
         </div>

         {/* Poster Profile Card */}
         <div className="bg-white border border-secondary-200 rounded-lg p-5">
            <h3 className="text-sm font-semibold text-secondary-900 mb-3">
               Posted By
            </h3>
            <div className="flex items-start gap-3">
               <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold shrink-0">
                  <User className="w-6 h-6" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="font-semibold text-secondary-900 mb-1">
                     {task.poster?.name || "Task Poster"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-secondary-600 mb-2">
                     <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">4.8</span>
                     </div>
                     <span>•</span>
                     <span>12 tasks posted</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-green-700">
                     <CheckCircle className="w-3.5 h-3.5" />
                     <span>Verified</span>
                  </div>
               </div>
            </div>
            <Button
               variant="outline"
               className="w-full mt-4 border-secondary-300 text-secondary-700 text-sm"
            >
               View Profile
            </Button>
         </div>

         {/* Trust & Safety Info */}
         <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
               <Shield className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
               <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">
                     Safe & Secure
                  </h3>
                  <p className="text-xs text-blue-800 leading-relaxed">
                     Payments are held securely until the task is completed to your satisfaction.
                  </p>
               </div>
            </div>
            <div className="space-y-2 text-xs text-blue-800">
               <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Verified taskers</span>
               </div>
               <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>Secure payments</span>
               </div>
               <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                  <span>24/7 support</span>
               </div>
            </div>
         </div>
      </div>
   );
}
