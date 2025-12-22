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
import { mockMyApplicationsData } from "@/lib/data/mockApplications";
import { mockTasksData } from "@/lib/data/mockTasks";
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
         // TODO: Replace with actual API call when backend is ready
         // const response = await applicationsApi.getMyApplications({
         //    page,
         //    limit: 10,
         //    status: statusFilter !== "all" ? statusFilter : undefined,
         //    sortBy,
         // });
         // setApplications(response.applications);

         // Mock data for now
         await new Promise((resolve) => setTimeout(resolve, 500));

         // Filter mock applications to show only current user's applications
         const currentUserId = "currentUser"; // TODO: Get from auth context
         let mockApplications = mockMyApplicationsData.filter(
            (app) => app.applicantUid === currentUserId
         );

         // Load associated tasks
         const taskMap = new Map<string, Task>();
         mockApplications.forEach((app) => {
            const taskId =
               typeof app.taskId === "string" ? app.taskId : app.taskId._id;
            const task = mockTasksData.find((t) => t._id === taskId);
            if (task) {
               taskMap.set(taskId, task);
            }
         });
         setTasks(taskMap);

         // Apply filters
         let filtered = [...mockApplications];

         // Status filter
         if (statusFilter !== "all") {
            filtered = filtered.filter((app) => app.status === statusFilter);
         }

         // Search filter
         if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((app) => {
               const taskId =
                  typeof app.taskId === "string" ? app.taskId : app.taskId._id;
               const task = taskMap.get(taskId);
               return (
                  app.coverLetter.toLowerCase().includes(query) ||
                  app.relevantExperience.some((exp) =>
                     exp.toLowerCase().includes(query)
                  ) ||
                  (task &&
                     (task.title.toLowerCase().includes(query) ||
                        task.description.toLowerCase().includes(query) ||
                        task.category.toLowerCase().includes(query)))
               );
            });
         }

         // Sort
         filtered.sort((a, b) => {
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
                  return b.proposedBudget.amount - a.proposedBudget.amount;
               case "budget-low":
                  return a.proposedBudget.amount - b.proposedBudget.amount;
               case "status":
                  const statusOrder: Record<ApplicationStatus, number> = {
                     pending: 1,
                     accepted: 2,
                     rejected: 3,
                     withdrawn: 4,
                  };
                  return statusOrder[a.status] - statusOrder[b.status];
               default:
                  return 0;
            }
         });

         setApplications(filtered);
         // Notify parent of count change
         onCountChange?.(filtered.length);
      } catch (err) {
         console.error("Error fetching applications:", err);
         setError("Failed to load applications. Please try again.");
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
         // TODO: Replace with actual API call
         // await applicationsApi.withdrawApplication(applicationId);

         // Mock withdrawal
         await new Promise((resolve) => setTimeout(resolve, 1000));

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
         toast.error("Failed to withdraw application. Please try again.");
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
