"use client";

/**
 * My Tasks Content Component
 * Displays all tasks created by the current user
 * Used within the Tasks page tabs
 */

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MyTaskCard } from "@/components/tasks/my-tasks/MyTaskCard";
import { MyTasksFilters } from "@/components/tasks/my-tasks/MyTasksFilters";
import { MyTasksEmptyState } from "@/components/tasks/my-tasks/MyTasksEmptyState";
import type { Task, TaskListResponse } from "@/types/task";
import type { TaskQueryParams } from "@/types/api";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { mockTasksData } from "@/lib/data/mockTasks";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TaskStatus = Task["status"];

interface MyTasksContentProps {
   onCountChange?: (count: number) => void;
}

export function MyTasksContent({ onCountChange }: MyTasksContentProps) {
   const router = useRouter();

   // State
   const [tasks, setTasks] = useState<Task[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
   const [sortBy, setSortBy] = useState("recent");
   const [page, setPage] = useState(1);
   const [pagination, setPagination] = useState<TaskListResponse["pagination"]>(
      {
         page: 1,
         limit: 10,
         total: 0,
         pages: 0,
      }
   );
   const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

   // Fetch tasks
   const fetchTasks = useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
         // TODO: Replace with actual API call when backend is ready
         // const params: TaskQueryParams = {
         //    page,
         //    limit: 10,
         //    status: statusFilter !== "all" ? statusFilter : undefined,
         //    sortBy,
         // };
         // const response = await tasksApi.getMyTasks(params);
         // setTasks(response.tasks);
         // setPagination(response.pagination);

         // Mock data for now
         await new Promise((resolve) => setTimeout(resolve, 500));

         // Filter mock tasks to show only tasks created by current user
         const currentUserId = "user1"; // TODO: Get from auth context
         let mockTasks = mockTasksData.filter(
            (task) => task.creatorUid === currentUserId
         );

         // If no tasks found for this user, use first few tasks as example
         if (mockTasks.length === 0) {
            mockTasks = mockTasksData.slice(0, 4).map((task) => ({
               ...task,
               creatorUid: currentUserId,
               requesterId: currentUserId,
               requesterName: "You",
            }));
         }

         // Apply filters
         let filtered = [...mockTasks];

         // Status filter
         if (statusFilter !== "all") {
            filtered = filtered.filter((task) => task.status === statusFilter);
         }

         // Search filter
         if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
               (task) =>
                  task.title.toLowerCase().includes(query) ||
                  task.description.toLowerCase().includes(query) ||
                  task.category.toLowerCase().includes(query) ||
                  task.location.city.toLowerCase().includes(query)
            );
         }

         // Sort
         filtered.sort((a, b) => {
            switch (sortBy) {
               case "oldest":
                  return (
                     new Date(a.createdAt).getTime() -
                     new Date(b.createdAt).getTime()
                  );
               case "budget-high":
                  const budgetA =
                     typeof a.budget === "number" ? a.budget : a.budget.amount;
                  const budgetB =
                     typeof b.budget === "number" ? b.budget : b.budget.amount;
                  return budgetB - budgetA;
               case "budget-low":
                  const budgetALow =
                     typeof a.budget === "number" ? a.budget : a.budget.amount;
                  const budgetBLow =
                     typeof b.budget === "number" ? b.budget : b.budget.amount;
                  return budgetALow - budgetBLow;
               case "applications":
                  return b.applications - a.applications;
               case "recent":
               default:
                  return (
                     new Date(b.createdAt).getTime() -
                     new Date(a.createdAt).getTime()
                  );
            }
         });

         // Update state with filtered tasks
         setTasks([...filtered]);
         const total = filtered.length;
         setPagination({
            page: 1,
            limit: 10,
            total,
            pages: Math.ceil(total / 10),
         });
         // Notify parent of count change
         onCountChange?.(total);
      } catch (err) {
         setError(err instanceof Error ? err.message : "Failed to load tasks");
      } finally {
         setLoading(false);
      }
   }, [searchQuery, statusFilter, sortBy, page, onCountChange]);

   // Fetch on mount and when filters change
   useEffect(() => {
      fetchTasks();
   }, [fetchTasks]);

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
         // TODO: Replace with actual API call when backend is ready
         // await tasksApi.deleteTask(taskId);
         await new Promise((resolve) => setTimeout(resolve, 1000));
         setTasks((prev) => {
            const updated = prev.filter((task) => task._id !== taskId);
            onCountChange?.(updated.length);
            return updated;
         });
      } catch (err) {
         alert(
            err instanceof Error
               ? err.message
               : "Failed to delete task. Please try again."
         );
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
      router.push(`/tasks/${taskId}/applications`);
   };

   // Handle track progress
   const handleTrackProgress = (taskId: string) => {
      router.push(`/tasks/${taskId}/track`);
   };

   const hasFilters = searchQuery.trim() !== "" || statusFilter !== "all";

   // Loading state
   if (loading && tasks.length === 0) {
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
               <p className="text-sm text-secondary-600 mb-4">{error}</p>
               <Button onClick={fetchTasks}>Try Again</Button>
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
