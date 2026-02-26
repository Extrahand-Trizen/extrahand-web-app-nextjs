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
   const [tasksCount, setTasksCount] = useState<number | null>(null);
   const [applicationsCount, setApplicationsCount] = useState<number | null>(null);

   const activeTab = useMemo(() => {
      const tabParam = searchParams.get("tab");
      return tabParam === "myapplications" ? "myapplications" : "mytasks";
   }, [searchParams]);

   // Fetch both counts on mount to ensure they're always available
   useEffect(() => {
      const fetchCounts = async () => {
         try {
            // Fetch both in parallel for faster loading
            const [tasksResponse, appsResponse] = await Promise.all([
               tasksApi.getMyTasks(),
               applicationsApi.getMyApplications()
            ]);

            const getTasksCount = (response: any) => {
               if (typeof response?.pagination?.total === "number") return response.pagination.total;
               if (typeof response?.meta?.pagination?.total === "number") return response.meta.pagination.total;
               if (typeof response?.meta?.total === "number") return response.meta.total;
               if (Array.isArray(response?.tasks)) return response.tasks.length;
               if (Array.isArray(response?.data?.tasks)) return response.data.tasks.length;
               if (Array.isArray(response?.data)) return response.data.length;
               if (Array.isArray(response)) return response.length;
               return 0;
            };

            const getApplicationsCount = (response: any) => {
               if (typeof response?.pagination?.total === "number") return response.pagination.total;
               if (typeof response?.meta?.pagination?.total === "number") return response.meta.pagination.total;
               if (typeof response?.meta?.total === "number") return response.meta.total;
               if (Array.isArray(response?.applications)) return response.applications.length;
               if (Array.isArray(response?.data?.applications)) return response.data.applications.length;
               if (Array.isArray(response?.data)) return response.data.length;
               if (Array.isArray(response)) return response.length;
               return 0;
            };

            // Extract tasks count
            setTasksCount(getTasksCount(tasksResponse));

            // Extract applications count
            setApplicationsCount(getApplicationsCount(appsResponse));
         } catch (error) {
            console.error("Error fetching counts:", error);
         }
      };

      fetchCounts();
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

                           {activeTab === "mytasks" && (
                              <Button
                                 onClick={() => router.push("/tasks/new")}
                                 className="bg-primary-600 hover:bg-primary-700 shrink-0"
                              >
                                 <Plus className="w-4 h-4 mr-2" />
                                 Post task
                              </Button>
                           )}
                        </div>
                        <TabsList className="bg-transparent p-0 h-auto gap-4 sm:gap-6">
                           <TabsTrigger
                              value="mytasks"
                              className="px-3 py-2 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 text-secondary-600 font-medium text-sm sm:text-base"
                           >
                              My Tasks
                              {tasksCount !== null && tasksCount > 0 && (
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
                              {applicationsCount !== null && applicationsCount > 0 && (
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
