"use client";

/**
 * My Tasks Content Component
 * Displays all tasks created by the current user
 * Uses real API data from tasksApi.getMyTasks(), cached via React Query.
 */

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MyTaskCard } from "@/components/tasks/my-tasks/MyTaskCard";
import { MyTasksFilters } from "@/components/tasks/my-tasks/MyTasksFilters";
import { MyTasksEmptyState } from "@/components/tasks/my-tasks/MyTasksEmptyState";
import type { Task, TaskListResponse } from "@/types/task";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage, isAuthError } from "@/lib/utils/errorUtils";

type TaskStatus = Task["status"];

interface MyTasksContentProps {
   onCountChange?: (count: number) => void;
}

export function MyTasksContent({ onCountChange }: MyTasksContentProps) {
   const router = useRouter();

   // State
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
   const [sortBy, setSortBy] = useState("recent");
   const [page, setPage] = useState(1);
   const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

   // Fetch tasks via React Query (cached across navigations)
   const {
      data,
      isLoading,
      error,
      refetch,
      isFetching,
   } = useQuery<TaskListResponse | any>({
      queryKey: ["my-tasks"],
      queryFn: async () => {
         console.log("📤 Fetching my tasks via React Query...");
         const response = await tasksApi.getMyTasks({ limit: 100 });
         console.log("✅ My tasks response:", response);
         return response;
      },
      staleTime: 60_000, // 1 minute: reuse cached data for quick revisits
      refetchOnMount: false, // don't refetch if we already have cached data
   });

   // Normalize tasks array from API response
   const allTasks: Task[] = useMemo(() => {
      const responseData = data as any;
      let tasksData: Task[] = [];

      if (!responseData) return tasksData;

      if (Array.isArray(responseData)) {
         tasksData = responseData as Task[];
      } else if (Array.isArray(responseData?.data)) {
         tasksData = responseData.data as Task[];
      } else if (Array.isArray(responseData?.data?.tasks)) {
         tasksData = responseData.data.tasks as Task[];
      } else if (Array.isArray(responseData?.tasks)) {
         tasksData = responseData.tasks as Task[];
      }

      console.log("✅ Extracted tasks from query data:", tasksData.length);
      return tasksData;
   }, [data]);

   // Surface non-auth errors via toast (once per error instance)
   useEffect(() => {
      if (!error) return;
      if (isAuthError(error)) return;

      toast.error("Failed to load tasks", {
         description: getErrorMessage(error),
         action: {
            label: "Retry",
            onClick: () => refetch(),
         },
      });
   }, [error, refetch]);

   // Client-side filtering, searching, and sorting
   const filteredTasks = useMemo(() => {
      let result = [...allTasks];

      // Status filter
      if (statusFilter !== "all") {
         result = result.filter((task) => task.status === statusFilter);
      }

      // Search filter
      if (searchQuery.trim()) {
         const query = searchQuery.toLowerCase();
         result = result.filter(
            (task) =>
               task.title.toLowerCase().includes(query) ||
               task.description.toLowerCase().includes(query) ||
               task.category.toLowerCase().includes(query) ||
               (task.location?.city?.toLowerCase().includes(query) ?? false)
         );
      }

      // Sort
      result.sort((a, b) => {
         switch (sortBy) {
            case "oldest":
               return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case "budget-high":
               const budgetA = typeof a.budget === "number" ? a.budget : a.budget?.amount ?? 0;
               const budgetB = typeof b.budget === "number" ? b.budget : b.budget?.amount ?? 0;
               return budgetB - budgetA;
            case "budget-low":
               const budgetALow = typeof a.budget === "number" ? a.budget : a.budget?.amount ?? 0;
               const budgetBLow = typeof b.budget === "number" ? b.budget : b.budget?.amount ?? 0;
               return budgetALow - budgetBLow;
            case "applications":
               return (b.applications ?? 0) - (a.applications ?? 0);
            case "recent":
            default:
               return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
         }
      });

      return result;
   }, [allTasks, searchQuery, statusFilter, sortBy]);

   // Pagination computed from filtered tasks
   const pagination = useMemo(() => {
      const total = filteredTasks.length;
      const limit = 10;
      const pages = Math.ceil(total / limit) || 1;
      return { page, limit, total, pages };
   }, [filteredTasks.length, page]);

   // Paginated tasks for display
   const tasks = useMemo(() => {
      const start = (page - 1) * 10;
      return filteredTasks.slice(start, start + 10);
   }, [filteredTasks, page]);

   // Track previous count to avoid unnecessary parent updates
   const prevCountRef = React.useRef<number | null>(null);
   
   // Notify parent of count change (only when count actually changes)
   useEffect(() => {
      const count = filteredTasks.length;
      if (prevCountRef.current !== count) {
         prevCountRef.current = count;
         onCountChange?.(count);
      }
   }, [filteredTasks.length, onCountChange]);

   // Handle delete task
   const handleDeleteTask = async (taskId: string, taskTitle: string) => {
      if (
         !confirm(
            `Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`
         )
      ) {
         return;
      }

      setDeletingTaskId(taskId);
      try {
         // Call the real API to delete the task
         await tasksApi.deleteTask(taskId);
         
         // Remove from local state
         setAllTasks((prev) => prev.filter((task) => task._id !== taskId));
         
         toast.success("Task deleted", {
            description: `"${taskTitle}" has been deleted.`,
         });
      } catch (err) {
         const errorMessage = err instanceof Error ? err.message : "Failed to delete task";
         toast.error("Failed to delete task", {
            description: errorMessage,
         });
      } finally {
         setDeletingTaskId(null);
      }
   };

   // Handle view task
   const handleViewTask = (taskId: string) => {
      router.push(`/tasks/${taskId}`);
   };

   // Handle edit task
   const handleEditTask = (taskId: string) => {
      router.push(`/tasks/${taskId}/edit`);
   };

   // Handle view applications
   const handleViewApplications = (taskId: string) => {
      router.push(`/tasks/${taskId}`);
   };

   // Handle track progress
   const handleTrackProgress = (taskId: string) => {
      router.push(`/tasks/${taskId}/track`);
   };

   const hasFilters = searchQuery.trim() !== "" || statusFilter !== "all";

   // Loading state
   if (isLoading && tasks.length === 0) {
      return (
         <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-center">
               <LoadingSpinner size="lg" />
               <p className="mt-4 text-base text-secondary-600">
                  Loading your tasks...
               </p>
            </div>
         </div>
      );
   }

   // Error state
   if (error && tasks.length === 0) {
      return (
         <div className="flex-1 flex items-center justify-center py-20 px-4">
            <div className="text-center max-w-md">
               <p className="text-lg font-semibold text-red-600 mb-2">
                  Error loading tasks
               </p>
               <p className="text-sm text-secondary-600 mb-4">
                  {getErrorMessage(error)}
               </p>
               <Button onClick={() => refetch()}>Try Again</Button>
            </div>
         </div>
      );
   }

   return (
      <div className="flex flex-col flex-1">
         {/* Filters Section */}
         <MyTasksFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            sortBy={sortBy}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onSortChange={setSortBy}
         />

         {/* Tasks List */}
         <div className="flex-1">
            {tasks.length === 0 ? (
               <MyTasksEmptyState hasFilters={hasFilters} />
            ) : (
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <div className="space-y-4 sm:space-y-6">
                     {tasks.map((task) => (
                        <MyTaskCard
                           key={task._id}
                           task={task}
                           deletingTaskId={deletingTaskId}
                           onView={handleViewTask}
                           onEdit={handleEditTask}
                           onDelete={handleDeleteTask}
                           onViewApplications={handleViewApplications}
                           onTrackProgress={handleTrackProgress}
                        />
                     ))}
                  </div>

                  {/* Pagination */}
                  {pagination.pages > 1 && (
                     <div className="flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-8 pt-6 border-t border-secondary-200 gap-4">
                        <p className="text-sm text-secondary-600">
                           Page {pagination.page} of {pagination.pages}
                        </p>
                        <div className="flex gap-2">
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                              disabled={page === 1}
                           >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Previous
                           </Button>
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                 setPage((p) =>
                                    Math.min(pagination.pages, p + 1)
                                 )
                              }
                              disabled={page === pagination.pages}
                           >
                              Next
                              <ChevronRight className="w-4 h-4 ml-1" />
                           </Button>
                        </div>
                     </div>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}
