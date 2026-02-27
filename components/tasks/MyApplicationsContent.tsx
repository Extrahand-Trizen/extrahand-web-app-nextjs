"use client";

/**
 * My Applications Content Component
 * Displays all applications/offers made by the current user
 * Used within the Tasks page tabs
 */

import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MyApplicationCard } from "@/components/tasks/my-applications/MyApplicationCard";
import { MyApplicationsFilters } from "@/components/tasks/my-applications/MyApplicationsFilters";
import { MyApplicationsEmptyState } from "@/components/tasks/my-applications/MyApplicationsEmptyState";
import type { TaskApplication } from "@/types/application";
import type { Task } from "@/types/task";
import { applicationsApi } from "@/lib/api/endpoints/applications";
import { getErrorMessage } from "@/lib/utils/errorUtils";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ApplicationStatus = TaskApplication["status"];

interface MyApplicationsContentProps {
   onCountChange?: (count: number) => void;
}

export function MyApplicationsContent({
   onCountChange,
}: MyApplicationsContentProps) {
   const router = useRouter();

   // State
   const [allApplications, setAllApplications] = useState<TaskApplication[]>([]);
   const [tasks, setTasks] = useState<Map<string, Task>>(new Map());
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
      "all"
   );
   const [sortBy, setSortBy] = useState("recent");
   const [page, setPage] = useState(1);
   const [withdrawingApplicationId, setWithdrawingApplicationId] = useState<
      string | null
   >(null);

   // Fetch applications via React Query (cached across navigations)
   const {
      data,
      isLoading,
      error,
      refetch,
   } = useQuery<any>({
      queryKey: ["my-applications"],
      queryFn: async () => {
         const response = await applicationsApi.getMyApplications();
         console.log("✅ My applications response:", response);
         return response;
      },
      staleTime: 60_000,
      refetchOnMount: true, // Always fetch fresh data when component mounts
   });

   // Normalize applications + tasks from API response
   useEffect(() => {
      const responseData = data as any;
      if (!responseData) return;

      let apps: TaskApplication[] = [];

      if (Array.isArray(responseData?.data)) {
         apps = responseData.data as TaskApplication[];
      } else if (Array.isArray(responseData?.data?.applications)) {
         apps = responseData.data.applications as TaskApplication[];
      } else if (Array.isArray(responseData?.applications)) {
         apps = responseData.applications as TaskApplication[];
      }

      console.log("✅ Parsed applications from query:", apps.length);

      // Build tasks map from populated taskId
      const taskMap = new Map<string, Task>();
      apps.forEach((app: any) => {
         if (typeof app.taskId === "object" && app.taskId) {
            const task = app.taskId as Task;
            taskMap.set(task._id, task);
         }
      });

      setTasks(taskMap);
      setAllApplications(apps);
   }, [data]);

   // Client-side filtering and sorting
   const filteredApplications = useMemo(() => {
      let result = [...allApplications];

      // Status filter
      if (statusFilter !== "all") {
         result = result.filter((app) => app.status === statusFilter);
      }

      // Search filter
      if (searchQuery.trim()) {
         const query = searchQuery.toLowerCase();
         result = result.filter((app: any) => {
            const task = typeof app.taskId === "object" ? app.taskId : null;
            return (
               (app.coverLetter && app.coverLetter.toLowerCase().includes(query)) ||
               (app.relevantExperience && app.relevantExperience.some((exp: string) =>
                  exp.toLowerCase().includes(query)
               )) ||
               (task &&
                  ((task.title && task.title.toLowerCase().includes(query)) ||
                     (task.description && task.description.toLowerCase().includes(query)) ||
                     (task.category && task.category.toLowerCase().includes(query))))
            );
         });
      }

      // Sort
      result.sort((a: any, b: any) => {
         switch (sortBy) {
            case "recent":
               return (
                  new Date(b.createdAt).getTime() -
                  new Date(a.createdAt).getTime()
               );
            case "oldest":
               return (
                  new Date(a.createdAt).getTime() -
                  new Date(b.createdAt).getTime()
               );
            case "budget-high":
               return (b.proposedBudget?.amount || 0) - (a.proposedBudget?.amount || 0);
            case "budget-low":
               return (a.proposedBudget?.amount || 0) - (b.proposedBudget?.amount || 0);
            case "status":
               const statusOrder: Record<ApplicationStatus, number> = {
                  pending: 1,
                  accepted: 2,
                  rejected: 3,
                  withdrawn: 4,
               };
               return statusOrder[a.status as ApplicationStatus] - statusOrder[b.status as ApplicationStatus];
            default:
               return 0;
         }
      });

      return result;
   }, [allApplications, searchQuery, statusFilter, sortBy]);

   // Calculate displayable applications (excluding those with null taskId)
   const displayableApplications = useMemo(() => {
      return filteredApplications.filter((app) => app.taskId !== null && app.taskId !== undefined);
   }, [filteredApplications]);

   // Calculate total count for tab badge (all applications with valid taskId, regardless of filters)
   const totalApplicationsCount = useMemo(() => {
      return allApplications.filter((app) => app.taskId !== null && app.taskId !== undefined).length;
   }, [allApplications]);

   // Notify parent of count change when total count changes
   useEffect(() => {
      onCountChange?.(totalApplicationsCount);
   }, [totalApplicationsCount, onCountChange]);

   // Handlers
   const handleViewTask = (taskId: string) => {
      router.push(`/tasks/${taskId}`);
   };

   const handleWithdraw = async (applicationId: string) => {
      if (withdrawingApplicationId) return;

      setWithdrawingApplicationId(applicationId);

      try {
         // Call real API to withdraw
         await applicationsApi.updateApplicationStatus(applicationId, {
            status: "withdrawn" as any,
         });

         // Update local state
         setAllApplications((prev) =>
            prev.map((app) =>
               app._id === applicationId
                  ? { ...app, status: "withdrawn" as const }
                  : app
            )
         );

         toast.success("Application withdrawn successfully");
      } catch (err) {
         console.error("Error withdrawing application:", err);
         toast.error("Failed to withdraw application", {
            description: getErrorMessage(err),
         });
      } finally {
         setWithdrawingApplicationId(null);
      }
   };

   const hasFilters = searchQuery.trim() !== "" || statusFilter !== "all";

   return (
      <div className="flex flex-col flex-1">
         {/* Filters */}
         <MyApplicationsFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            sortBy={sortBy}
            onSearchChange={setSearchQuery}
            onStatusChange={setStatusFilter}
            onSortChange={setSortBy}
         />

         {/* Applications List */}
         <div className="flex-1">
           {isLoading ? (
               <div className="flex items-center justify-center py-16">
                  <LoadingSpinner size="lg" />
               </div>
            ) : error ? (
               <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                     <p className="text-red-600 mb-4">
                        {getErrorMessage(error)}
                     </p>
                     <Button onClick={() => refetch()} variant="outline">
                        Try Again
                     </Button>
                  </div>
               </div>
            ) : filteredApplications.length === 0 ? (
               <MyApplicationsEmptyState hasFilters={hasFilters} />
            ) : (
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <div className="space-y-4 sm:space-y-6">
                     {filteredApplications.map((application) => {
                        // Handle case where taskId might be null or not populated
                        if (!application.taskId) {
                           console.warn("Application missing taskId:", application._id);
                           return null;
                        }
                        
                        const taskId =
                           typeof application.taskId === "string"
                              ? application.taskId
                              : application.taskId._id;
                        const task = tasks.get(taskId);

                        return (
                           <MyApplicationCard
                              key={application._id}
                              application={application}
                              task={task}
                              onViewTask={handleViewTask}
                              onWithdraw={handleWithdraw}
                              withdrawingApplicationId={
                                 withdrawingApplicationId
                              }
                           />
                        );
                     }).filter(Boolean)}
                  </div>

                  {/* Pagination (for future use) */}
                  {displayableApplications.length > 10 && (
                     <div className="flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-8 pt-6 border-t border-secondary-200 gap-4">
                        <p className="text-sm text-secondary-600">
                           Showing {displayableApplications.length} applications
                        </p>
                        <div className="flex gap-2">
                           <Button
                              variant="outline"
                              size="sm"
                              disabled={page === 1}
                              onClick={() => setPage((p) => Math.max(1, p - 1))}
                           >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Previous
                           </Button>
                           <Button
                              variant="outline"
                              size="sm"
                              disabled={displayableApplications.length < 10}
                              onClick={() => setPage((p) => p + 1)}
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
