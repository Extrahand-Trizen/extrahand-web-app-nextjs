"use client";

/**
 * Tasks Page
 * Displays tasks with two tabs: My Tasks and My Applications
 */

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MyTasksContent } from "@/components/tasks/MyTasksContent";
import { MyApplicationsContent } from "@/components/tasks/MyApplicationsContent";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { applicationsApi } from "@/lib/api/endpoints/applications";
import { useDashboardStore } from "@/lib/state/dashboardStore";

export default function TasksPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const queryClient = useQueryClient();
   const { stats } = useDashboardStore();
   const [tasksCount, setTasksCount] = useState<number>(
      stats?.totalTasks ?? 0
   );
   const [applicationsCount, setApplicationsCount] = useState<number>(
      stats?.totalApplications ?? 0
   );

   const activeTab = useMemo(() => {
      const tabParam = searchParams.get("tab");
      return tabParam === "myapplications" ? "myapplications" : "mytasks";
   }, [searchParams]);

   // Prefetch both tabs' data on page load so they're immediately available
   useEffect(() => {
      const prefetchBothTabs = async () => {
         try {
            // Prefetch tasks
            const tasksData = await tasksApi.getMyTasks({ limit: 100 });
            queryClient.setQueryData(["my-tasks"], tasksData);

            // Extract tasks count immediately after setting
            const tasksPayload = tasksData;
            const tasksCountFromResponse = Array.isArray(tasksPayload?.data?.tasks)
               ? tasksPayload.data.tasks.length
               : Array.isArray(tasksPayload?.tasks)
               ? tasksPayload.tasks.length
               : Array.isArray(tasksPayload?.data)
               ? tasksPayload.data.length
               : Array.isArray(tasksPayload)
               ? tasksPayload.length
               : 0;
            setTasksCount(tasksCountFromResponse);

            // Prefetch applications
            const applicationsData = await applicationsApi.getMyApplications();
            queryClient.setQueryData(["my-applications"], applicationsData);

            // Extract applications count immediately after setting
            const applicationsPayload = applicationsData;
            const applicationsFromResponse = Array.isArray(applicationsPayload?.data)
               ? applicationsPayload.data
               : Array.isArray(applicationsPayload?.data?.applications)
               ? applicationsPayload.data.applications
               : Array.isArray(applicationsPayload?.applications)
               ? applicationsPayload.applications
               : Array.isArray(applicationsPayload)
               ? applicationsPayload
               : [];
            const applicationsCountFromResponse = applicationsFromResponse.filter(
               (app: any) => app?.taskId !== null && app?.taskId !== undefined
            ).length;
            setApplicationsCount(applicationsCountFromResponse);
         } catch (error) {
            console.error("Failed to prefetch tab data:", error);
         }
      };

      prefetchBothTabs();
   }, [queryClient]);

   // If dashboard stats are already available (from /home or a previous fetch),
   // use them as fast initial values for the tab counts. This avoids a visible
   // "pop in" while the dedicated /tasks APIs are still loading.
   useEffect(() => {
      if (!stats) return;

      if (!tasksCount) {
         setTasksCount(stats.totalTasks ?? 0);
      }
      if (!applicationsCount) {
         setApplicationsCount(stats.totalApplications ?? 0);
      }
   }, [stats, tasksCount, applicationsCount]);


   const handleTabChange = (value: string) => {
      router.push(`/tasks?tab=${value}`);
   };

   return (
      <div className="min-h-screen bg-secondary-50">
         <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="h-full gap-0!"
         >
            {/* Combined Header with Tabs */}
            <header className="bg-white border-b border-secondary-200 sticky top-0 z-10">
               <div className="w-full">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="flex flex-col gap-4 py-4 sm:py-5">
                        {/* Top Row: Title, Tabs, and Action Button */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                           <div className="flex items-start sm:items-center gap-4 sm:gap-6 flex-1">
                              <div>
                                 <h1 className="text-2xl font-semibold text-secondary-900">
                                    Tasks
                                 </h1>
                                 <p className="text-sm text-secondary-500 mt-1">
                                    Manage tasks you&#39;ve posted and
                                    applications you&#39;ve sent
                                 </p>
                              </div>
                           </div>

                           <Button
                              onClick={() => router.push("/tasks/new")}
                              className="bg-primary-600 hover:bg-primary-700 shrink-0"
                           >
                              <Plus className="w-4 h-4 mr-2" />
                              Post task
                           </Button>
                        </div>
                        <TabsList className="bg-transparent p-0 h-auto gap-4 sm:gap-6">
                           <TabsTrigger
                              value="mytasks"
                              className="px-3 py-2 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 text-secondary-600 font-medium text-sm sm:text-base"
                           >
                              My Tasks
                              {tasksCount > 0 && (
                                 <span className="ml-2 text-secondary-400">
                                    {tasksCount}
                                 </span>
                              )}
                           </TabsTrigger>

                           <TabsTrigger
                              value="myapplications"
                              className="px-3 py-2 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 text-secondary-600 font-medium text-sm sm:text-base"
                           >
                              My Applications
                              {applicationsCount > 0 && (
                                 <span className="ml-2 text-secondary-400">
                                    {applicationsCount}
                                 </span>
                              )}
                           </TabsTrigger>
                        </TabsList>
                     </div>
                  </div>
               </div>
            </header>

            {/* Content */}
            <main className="w-full">
               <TabsContent value="mytasks" className="mt-0">
                  <MyTasksContent onCountChange={setTasksCount} />
               </TabsContent>

               <TabsContent value="myapplications" className="mt-0">
                  <MyApplicationsContent onCountChange={setApplicationsCount} />
               </TabsContent>
            </main>
         </Tabs>
      </div>
   );
}
