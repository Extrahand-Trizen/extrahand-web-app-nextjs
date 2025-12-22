"use client";

/**
 * TaskSnapshot Component
 * Clearly separates tasks the user posted vs tasks they're working on
 * Enhanced with app theme colors
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
   ChevronRight,
   Clock,
   ClipboardList,
   Plus,
   Search,
   ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TaskSnapshotItem } from "@/types/dashboard";
import type { Task } from "@/types/task";

interface TaskSnapshotProps {
   tasks: TaskSnapshotItem[];
   loading?: boolean;
}

const statusStyles: Record<
   Task["status"],
   { bg: string; text: string; label: string }
> = {
   open: { bg: "bg-green-100", text: "text-green-700", label: "Open" },
   assigned: {
      bg: "bg-blue-100",
      text: "text-blue-700",
      label: "Assigned",
   },
   started: {
      bg: "bg-primary-100",
      text: "text-primary-700",
      label: "Started",
   },
   in_progress: {
      bg: "bg-primary-100",
      text: "text-primary-700",
      label: "In Progress",
   },
   review: {
      bg: "bg-purple-100",
      text: "text-purple-700",
      label: "In Review",
   },
   completed: {
      bg: "bg-green-100",
      text: "text-green-700",
      label: "Completed",
   },
   cancelled: {
      bg: "bg-red-100",
      text: "text-red-700",
      label: "Cancelled",
   },
};

export function TaskSnapshot({ tasks, loading }: TaskSnapshotProps) {
   const router = useRouter();
   const [expandedSection, setExpandedSection] = useState<
      "posted" | "working" | null
   >(null);

   if (loading) {
      return <TaskSnapshotSkeleton />;
   }

   // Separate tasks by role
   const postedTasks = tasks.filter((t) => t.role === "poster");
   const workingTasks = tasks.filter((t) => t.role === "tasker");

   if (tasks.length === 0) {
      return <TaskSnapshotEmpty />;
   }

   return (
      <section className="space-y-6">
         {/* Tasks I Posted */}
         {postedTasks.length > 0 && (
            <div>
               <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-secondary-900">
                     Tasks I Posted ({postedTasks.length})
                  </h2>
                  {postedTasks.length > 2 && (
                     <button
                        onClick={() =>
                           setExpandedSection(
                              expandedSection === "posted" ? null : "posted"
                           )
                        }
                        className="text-xs text-secondary-500 hover:text-primary-600 flex items-center gap-1 font-medium transition-colors"
                     >
                        {expandedSection === "posted"
                           ? "Show less"
                           : "Show all"}
                        <ChevronDown
                           className={`w-3 h-3 transition-transform ${
                              expandedSection === "posted" ? "rotate-180" : ""
                           }`}
                        />
                     </button>
                  )}
               </div>
               <div className="bg-white rounded-lg border border-secondary-200 divide-y divide-secondary-100 shadow-sm">
                  {(expandedSection === "posted"
                     ? postedTasks
                     : postedTasks.slice(0, 2)
                  ).map((task) => (
                     <TaskRow
                        key={task.id}
                        task={task}
                        onClick={() => router.push(task.nextStepRoute)}
                     />
                  ))}
               </div>
            </div>
         )}

         {/* Tasks I'm Working On */}
         {workingTasks.length > 0 && (
            <div>
               <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-bold text-secondary-900">
                     Tasks I'm Working On ({workingTasks.length})
                  </h2>
                  {workingTasks.length > 2 && (
                     <button
                        onClick={() =>
                           setExpandedSection(
                              expandedSection === "working" ? null : "working"
                           )
                        }
                        className="text-xs text-secondary-500 hover:text-primary-600 flex items-center gap-1 font-medium transition-colors"
                     >
                        {expandedSection === "working"
                           ? "Show less"
                           : "Show all"}
                        <ChevronDown
                           className={`w-3 h-3 transition-transform ${
                              expandedSection === "working" ? "rotate-180" : ""
                           }`}
                        />
                     </button>
                  )}
               </div>
               <div className="bg-white rounded-lg border border-secondary-200 divide-y divide-secondary-100 shadow-sm">
                  {(expandedSection === "working"
                     ? workingTasks
                     : workingTasks.slice(0, 2)
                  ).map((task) => (
                     <TaskRow
                        key={task.id}
                        task={task}
                        onClick={() => router.push(task.nextStepRoute)}
                     />
                  ))}
               </div>
            </div>
         )}

         {/* View All Link */}
         <div className="pt-2">
            <button
               onClick={() => router.push("/tasks")}
               className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 w-full justify-center py-2 transition-colors"
            >
               View all tasks
               <ChevronRight className="w-4 h-4" />
            </button>
         </div>
      </section>
   );
}

function TaskRow({
   task,
   onClick,
}: {
   task: TaskSnapshotItem;
   onClick: () => void;
}) {
   const status = statusStyles[task.status];
   const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

   return (
      <button
         onClick={onClick}
         className="w-full text-left flex items-center justify-between gap-4 p-4 hover:bg-primary-50 transition-colors group"
      >
         <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
               <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${status.bg} ${status.text}`}
               >
                  {status.label}
               </span>
               {task.dueDate && (
                  <span
                     className={`text-xs flex items-center gap-1 ${
                        isOverdue
                           ? "text-red-600 font-medium"
                           : "text-secondary-500"
                     }`}
                  >
                     <Clock className="w-3 h-3" />
                     {isOverdue ? "Overdue" : formatDate(task.dueDate)}
                  </span>
               )}
            </div>
            <h3 className="font-semibold text-secondary-900 group-hover:text-primary-600 transition-colors truncate text-sm mb-1">
               {task.title}
            </h3>
            {task.progress !== undefined &&
               task.progress > 0 &&
               task.progress < 100 && (
                  <div className="flex items-center gap-2 mt-2">
                     <div className="flex-1 h-1.5 bg-secondary-100 rounded-full overflow-hidden">
                        <div
                           className="h-full bg-primary-500 rounded-full transition-all"
                           style={{ width: `${task.progress}%` }}
                        />
                     </div>
                     <span className="text-xs font-medium text-primary-600">
                        {task.progress}%
                     </span>
                  </div>
               )}
         </div>
         <div className="text-right shrink-0">
            <p className="text-lg font-bold text-secondary-900">
               ₹{task.budget}
            </p>
         </div>
      </button>
   );
}

function TaskSnapshotEmpty() {
   const router = useRouter();

   return (
      <section>
         <h2 className="text-base font-bold text-secondary-900 mb-4">
            Your Tasks
         </h2>
         <div className="bg-gradient-to-br from-primary-50 to-white rounded-lg border border-primary-200 p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mx-auto mb-4">
               <ClipboardList className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="font-bold text-secondary-900 mb-2 text-lg">
               No tasks yet
            </h3>
            <p className="text-sm text-secondary-600 mb-6 max-w-md mx-auto">
               Post a task to get help, or browse tasks to start earning.
            </p>
            <div className="flex justify-center gap-3">
               <Button
                  onClick={() => router.push("/tasks/new")}
                  className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold"
               >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Task
               </Button>
               <Button
                  variant="outline"
                  onClick={() => router.push("/discover")}
                  className="border-secondary-300 hover:border-primary-300"
               >
                  <Search className="w-4 h-4 mr-2" />
                  Browse
               </Button>
            </div>
         </div>
      </section>
   );
}

function TaskSnapshotSkeleton() {
   return (
      <section>
         <div className="h-5 w-32 bg-secondary-200 rounded animate-pulse mb-4" />
         <div className="bg-white rounded-lg border border-secondary-200 divide-y divide-secondary-100">
            {[1, 2].map((i) => (
               <div
                  key={i}
                  className="p-4 flex items-center justify-between gap-4"
               >
                  <div className="flex-1 space-y-2">
                     <div className="h-3 w-16 bg-secondary-200 rounded animate-pulse" />
                     <div className="h-4 w-40 bg-secondary-200 rounded animate-pulse" />
                  </div>
                  <div className="h-5 w-12 bg-secondary-200 rounded animate-pulse" />
               </div>
            ))}
         </div>
      </section>
   );
}

function formatDate(date: Date): string {
   const now = new Date();
   const target = new Date(date);
   const diff = target.getTime() - now.getTime();
   const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

   if (days === 0) return "Today";
   if (days === 1) return "Tomorrow";
   if (days > 0 && days <= 7) return `In ${days} days`;

   return target.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
   });
}
