"use client";

/**
 * Tasks Page
 * Displays tasks with two tabs: My Tasks and My Applications
 */

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { MyTasksContent } from "@/components/tasks/MyTasksContent";
import { MyApplicationsContent } from "@/components/tasks/MyApplicationsContent";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { applicationsApi } from "@/lib/api/endpoints/applications";

export default function TasksPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const [tasksCount, setTasksCount] = useState<number>(0);
   const [applicationsCount, setApplicationsCount] = useState<number>(0);

   const activeTab = useMemo(() => {
      const tabParam = searchParams.get("tab");
      return tabParam === "myapplications" ? "myapplications" : "mytasks";
   }, [searchParams]);

   useEffect(() => {
      let isMounted = true;

      const fetchCounts = async () => {
         try {
            const [tasksResponse, applicationsResponse] = await Promise.all([
               tasksApi.getMyTasks({ limit: 1 }),
               applicationsApi.getApplications({ mine: "true", limit: 1 }),
            ]);

            if (!isMounted) return;

            const tasksPayload: any = tasksResponse;
            const tasksCountFromResponse =
               typeof tasksPayload?.pagination?.total === "number"
                  ? tasksPayload.pagination.total
                  : typeof tasksPayload?.data?.total === "number"
                  ? tasksPayload.data.total
                  : Array.isArray(tasksPayload?.data?.tasks)
                  ? tasksPayload.data.tasks.length
                  : Array.isArray(tasksPayload?.tasks)
                  ? tasksPayload.tasks.length
                  : Array.isArray(tasksPayload)
                  ? tasksPayload.length
                  : 0;

            const applicationsPayload: any = applicationsResponse;
            const applicationsCountFromResponse =
               typeof applicationsPayload?.pagination?.total === "number"
                  ? applicationsPayload.pagination.total
                  : typeof applicationsPayload?.data?.total === "number"
                  ? applicationsPayload.data.total
                  : Array.isArray(applicationsPayload?.data?.applications)
                  ? applicationsPayload.data.applications.length
                  : Array.isArray(applicationsPayload?.applications)
                  ? applicationsPayload.applications.length
                  : Array.isArray(applicationsPayload?.data)
                  ? applicationsPayload.data.length
                  : Array.isArray(applicationsPayload)
                  ? applicationsPayload.length
                  : 0;

            setTasksCount(tasksCountFromResponse);
            setApplicationsCount(applicationsCountFromResponse);
         } catch (error) {
            if (!isMounted) return;
            setTasksCount(0);
            setApplicationsCount(0);
         }
      };

      fetchCounts();
      return () => {
         isMounted = false;
      };
   }, []);


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
