"use client";

/**
 * My Applications Content Component
 * Displays all applications/offers made by the current user
 * Used within the Tasks page tabs
 */

import React, { useState, useEffect, useCallback } from "react";
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
   const [applications, setApplications] = useState<TaskApplication[]>([]);
   const [tasks, setTasks] = useState<Map<string, Task>>(new Map());
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [searchQuery, setSearchQuery] = useState("");
   const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
      "all"
   );
   const [sortBy, setSortBy] = useState("recent");
   const [page, setPage] = useState(1);
   const [withdrawingApplicationId, setWithdrawingApplicationId] = useState<
      string | null
   >(null);

   // Fetch applications
   const fetchApplications = useCallback(async () => {
      setLoading(true);
      setError(null);

      try {
         // Fetch from real API
         const response = await applicationsApi.getMyApplications(
            statusFilter !== "all" ? statusFilter : undefined
         );
         
         console.log("✅ My applications response:", response);
         
         // Handle response structure: { success, data: [...], meta: {...} }
         const responseData = response as any;
         let apps: any[] = [];
         
         if (Array.isArray(responseData?.data)) {
            apps = responseData.data;
         } else if (responseData?.data?.applications) {
            apps = responseData.data.applications;
         } else if (responseData?.applications) {
            apps = responseData.applications;
         }
         
         console.log("✅ Parsed applications:", apps.length);

         // Build tasks map from populated taskId
         const taskMap = new Map<string, Task>();
         apps.forEach((app: any) => {
            if (typeof app.taskId === "object" && app.taskId) {
               const task = app.taskId as Task;
               taskMap.set(task._id, task);
            }
         });
         setTasks(taskMap);

         // Apply client-side filters since API already filtered by status
         let filtered = [...apps];

         // Search filter (client-side)
         if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((app: any) => {
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

         // Sort (client-side)
         filtered.sort((a: any, b: any) => {
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

         setApplications(filtered);
         // Notify parent of count change
         onCountChange?.(filtered.length);
      } catch (err) {
         console.error("Error fetching applications:", err);
         setError(getErrorMessage(err));
      } finally {
         setLoading(false);
      }
   }, [searchQuery, statusFilter, sortBy, page, onCountChange]);

   useEffect(() => {
      fetchApplications();
   }, [fetchApplications]);

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
         setApplications((prev) => {
            const updated = prev.map((app) =>
               app._id === applicationId
                  ? { ...app, status: "withdrawn" as const }
                  : app
            );
            onCountChange?.(updated.length);
            return updated;
         });

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
            {loading ? (
               <div className="flex items-center justify-center py-16">
                  <LoadingSpinner size="lg" />
               </div>
            ) : error ? (
               <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                     <p className="text-red-600 mb-4">{error}</p>
                     <Button onClick={fetchApplications} variant="outline">
                        Try Again
                     </Button>
                  </div>
               </div>
            ) : applications.length === 0 ? (
               <MyApplicationsEmptyState hasFilters={hasFilters} />
            ) : (
               <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                  <div className="space-y-4 sm:space-y-6">
                     {applications.map((application) => {
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
                     })}
                  </div>

                  {/* Pagination (for future use) */}
                  {applications.length > 10 && (
                     <div className="flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-8 pt-6 border-t border-secondary-200 gap-4">
                        <p className="text-sm text-secondary-600">
                           Showing {applications.length} applications
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
                              disabled={applications.length < 10}
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
