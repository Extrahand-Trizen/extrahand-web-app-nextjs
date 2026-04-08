"use client";

/**
 * My Tasks Content Component
 * Displays all tasks created by the current user
 * Uses real API data from tasksApi.getMyTasks(), cached via React Query.
 */

import React, {
   useState,
   useEffect,
   useMemo,
   useDeferredValue,
   useRef,
   useCallback,
   useLayoutEffect,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MyTaskCard } from "@/components/tasks/my-tasks/MyTaskCard";
import { MyTasksFilters } from "@/components/tasks/my-tasks/MyTasksFilters";
import { MyTasksEmptyState } from "@/components/tasks/my-tasks/MyTasksEmptyState";
import { TaskListSkeleton } from "@/components/tasks/TaskSkeleton";
import type { Task, TaskListResponse } from "@/types/task";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage, isAuthError } from "@/lib/utils/errorUtils";
import { buildPublicTaskPath } from "@/lib/utils/taskHandle";

type TaskStatus = Task["status"];

const PAGE_SIZE = 10;

function extractTaskPage(response: any): Task[] {
   if (!response) return [];

   if (Array.isArray(response)) return response as Task[];
   if (Array.isArray(response?.tasks)) return response.tasks as Task[];
   if (Array.isArray(response?.data?.tasks)) return response.data.tasks as Task[];
   if (Array.isArray(response?.data)) return response.data as Task[];

   return [];
}

function extractPagination(response: any) {
   const pagination = response?.pagination ?? response?.data?.pagination ?? {};

   return {
      page: pagination.page ?? 1,
      limit: pagination.limit ?? PAGE_SIZE,
      total: pagination.total ?? 0,
      pages: pagination.pages ?? pagination.totalPages ?? 1,
   };
}

interface MyTasksContentProps {
   onCountChange?: (count: number) => void;
}

export function MyTasksContent({ onCountChange }: MyTasksContentProps) {
   const router = useRouter();
   const pageTopRef = useRef<HTMLDivElement | null>(null);

   // State
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
   const [sortBy, setSortBy] = useState("recent");
   const [page, setPage] = useState(1);
   const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
   const deferredSearchQuery = useDeferredValue(searchQuery);

   useEffect(() => {
      setPage(1);
   }, [deferredSearchQuery, statusFilter, sortBy]);

   const scrollToPageTop = useCallback(() => {
      // Blur footer pagination button so browser doesn't keep viewport near footer.
      if (document.activeElement instanceof HTMLElement) {
         document.activeElement.blur();
      }

      pageTopRef.current?.scrollIntoView({ block: "start", behavior: "auto" });
      window.scrollTo({ top: 0, behavior: "auto" });
   }, []);

   useLayoutEffect(() => {
      scrollToPageTop();
   }, [page, scrollToPageTop]);

   const handlePageChange = useCallback(
      (nextPage: number) => {
         setPage(nextPage);
         requestAnimationFrame(scrollToPageTop);
      },
      [scrollToPageTop]
   );

   const queryParams = useMemo(
      () => ({
         page,
         limit: PAGE_SIZE,
         ...(statusFilter !== "all" ? { status: statusFilter } : {}),
         ...(deferredSearchQuery.trim() ? { search: deferredSearchQuery.trim() } : {}),
         sortBy,
      }),
      [page, statusFilter, deferredSearchQuery, sortBy]
   );

   // Fetch total count once so the tab badge stays stable across local filters.
   const { data: totalCountData } = useQuery<TaskListResponse | any>({
      queryKey: ["my-tasks-total"],
      queryFn: async () => {
         const response = await tasksApi.getMyTasks({ page: 1, limit: 1 });
         return response;
      },
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
   });

   // Fetch the page the user is actually looking at.
   const {
      data,
      isLoading,
      error,
      refetch,
      isFetching,
   } = useQuery<TaskListResponse | any>({
      queryKey: [
         "my-tasks",
         queryParams.page,
         queryParams.limit,
         queryParams.status ?? "all",
         queryParams.search ?? "",
         queryParams.sortBy,
      ],
      queryFn: async () => {
         console.log("📤 Fetching my tasks via React Query...");
         const response = await tasksApi.getMyTasks(queryParams);
         console.log("✅ My tasks response:", response);
         return response;
      },
      staleTime: Infinity, // Never mark as stale - keep cached data indefinitely
      refetchOnMount: false, // Never refetch on mount - show cached data immediately
      refetchOnWindowFocus: false, // Don't refetch on window focus
   });

   const tasks = useMemo(() => extractTaskPage(data), [data]);
   const pagination = useMemo(() => extractPagination(data), [data]);
   const totalTaskCount = useMemo(
      () => extractPagination(totalCountData).total,
      [totalCountData]
   );

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

   // Notify parent of total count change (use total tasks, not filtered)
   // Only call after data has loaded (not during initial loading)
   useEffect(() => {
      if (isLoading) return; // Don't report count while still loading
      onCountChange?.(totalTaskCount);
   }, [totalTaskCount, onCountChange, isLoading]);

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

         // Refetch tasks so the list updates from the server
         await refetch();

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

   const handleViewTask = (task: Task) => {
      router.push(buildPublicTaskPath(task.title, task._id));
   };

   // Handle edit task
   const handleEditTask = (taskId: string) => {
      router.push(`/tasks/${taskId}/edit`);
   };

   const handleViewApplications = (task: Task) => {
      router.push(buildPublicTaskPath(task.title, task._id));
   };

   // Handle track progress
   const handleTrackProgress = (taskId: string) => {
      router.push(`/tasks/${taskId}/track`);
   };

   const handleMessageTasker = (taskId: string) => {
      router.push(`/chat?taskId=${taskId}`);
   };

   const hasFilters = deferredSearchQuery.trim() !== "" || statusFilter !== "all" || sortBy !== "recent";

   // Initial loading state - render subtle list skeleton without explicit text
   if (isLoading && tasks.length === 0) {
      return (
         <div className="flex flex-col flex-1">
            <MyTasksFilters
               searchQuery={searchQuery}
               statusFilter={statusFilter}
               sortBy={sortBy}
               onSearchChange={setSearchQuery}
               onStatusChange={setStatusFilter}
               onSortChange={setSortBy}
            />

            <div className="flex-1">
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <TaskListSkeleton count={8} />
               </div>
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
         <div ref={pageTopRef} />
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
                           onViewTask={handleViewTask}
                           onEdit={handleEditTask}
                           onDelete={handleDeleteTask}
                           onViewApplications={handleViewApplications}
                           onTrackProgress={handleTrackProgress}
                           onMessageTasker={handleMessageTasker}
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
                              onClick={() =>
                                 handlePageChange(Math.max(1, pagination.page - 1))
                              }
                              disabled={page === 1}
                           >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Previous
                           </Button>
                           <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                 handlePageChange(
                                    Math.min(pagination.pages, pagination.page + 1)
                                 )
                              }
                                disabled={pagination.page === pagination.pages}
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
