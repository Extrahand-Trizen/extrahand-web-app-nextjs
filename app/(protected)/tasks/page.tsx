"use client";

/**
 * Tasks Page
 * Displays tasks with two tabs: My Tasks and My Applications
 * Tab ordering and visibility is based on user role and counts
 */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MyTasksContent } from "@/components/tasks/MyTasksContent";
import { MyApplicationsContent } from "@/components/tasks/MyApplicationsContent";
import { ReportIssueButton } from "@/components/shared/ReportIssueButton";
import { useAuth } from "@/lib/auth/context";

export default function TasksPage() {
   const searchParams = useSearchParams();
   const { userData, loading } = useAuth();
   const [tasksCount, setTasksCount] = useState<number | null>(null);
   const [applicationsCount, setApplicationsCount] = useState<number | null>(null);
   const [selectedTab, setSelectedTab] = useState<"mytasks" | "myapplications" | null>(null);

   // Determine user role
   const userRole = useMemo<"tasker" | "poster" | null>(() => {
      const roles = userData?.roles ?? [];
      if (roles.includes("tasker") || roles.includes("both")) {
         return "tasker";
      }
      if (roles.includes("poster") || roles.includes("requester")) {
         return "poster";
      }
      if (loading) {
         return null;
      }
      return "poster";
   }, [userData?.roles, loading]);

   const isRoleReady = userRole !== null;

   // Determine which tabs to show based on role and counts
   const visibleTabs = useMemo(() => {
      const tabs: Array<"mytasks" | "myapplications"> = [];

      if (!userRole) {
         return tabs;
      }

      // Keep both tabs available so users can always switch between them,
      // even before count data has loaded.
      tabs.push("mytasks", "myapplications");

      return tabs;
   }, [userRole]);

   // Set default tab based on role and visible tabs
   const defaultTab = useMemo(() => {
      return userRole === "tasker" ? "myapplications" : "mytasks";
   }, [userRole]);

   useEffect(() => {
      const tabParam = searchParams.get("tab");
      const postTaskRouteRaw = typeof window !== "undefined"
         ? window.localStorage.getItem("extrahand_post_task_route")
         : null;

      if (postTaskRouteRaw) {
         try {
            const postTaskRoute = JSON.parse(postTaskRouteRaw) as { tab?: string; createdAt?: number };
            if (postTaskRoute.tab === "mytasks") {
               setSelectedTab("mytasks");
               window.localStorage.removeItem("extrahand_post_task_route");
               return;
            }
         } catch {
            window.localStorage.removeItem("extrahand_post_task_route");
         }
      }

      if (tabParam === "myapplications" || tabParam === "mytasks") {
         setSelectedTab(tabParam);
      }
   }, [searchParams]);

   const activeTab = useMemo(() => {
      if (!isRoleReady) {
         return "myapplications";
      }

      const tabParam = searchParams.get("tab");
      const tabFromUrl =
         tabParam === "myapplications" || tabParam === "mytasks"
            ? tabParam
            : defaultTab;
      const resolvedTab = selectedTab ?? tabFromUrl;

      // Ensure activeTab is visible; if not, use default
      if (visibleTabs.includes(resolvedTab)) {
         return resolvedTab;
      }
      return visibleTabs.length > 0 ? visibleTabs[0] : defaultTab;
   }, [isRoleReady, searchParams, visibleTabs, defaultTab, selectedTab]);


   const handleTabChange = (value: string) => {
      if (value === "mytasks" || value === "myapplications") {
         setSelectedTab(value);
      }
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
                           <ReportIssueButton
                              buttonLabel="Report Task Issue"
                              issueType="task"
                              pageContext="tasks-page"
                              buttonVariant="link"
                              buttonSize="sm"
                              className="self-start sm:self-auto"
                           />

                        </div>
                        {isRoleReady && (
                        <TabsList className="bg-transparent p-0 h-auto gap-4 sm:gap-6">
                           {visibleTabs.includes("mytasks") && (
                              <TabsTrigger
                                 value="mytasks"
                                 className="px-3 py-2 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 text-secondary-600 font-medium text-sm sm:text-base"
                              >
                                 My Tasks
                                 {tasksCount !== null && (
                                    <span className="ml-2 text-secondary-400">
                                       {tasksCount}
                                    </span>
                                 )}
                              </TabsTrigger>
                           )}

                           {visibleTabs.includes("myapplications") && (
                              <TabsTrigger
                                 value="myapplications"
                                 className="px-3 py-2 rounded-lg border-b-2 border-transparent data-[state=active]:border-primary-600 data-[state=active]:text-primary-600 text-secondary-600 font-medium text-sm sm:text-base"
                              >
                                 My Applications
                                 {applicationsCount !== null && (
                                    <span className="ml-2 text-secondary-400">
                                       {applicationsCount}
                                    </span>
                                 )}
                              </TabsTrigger>
                           )}
                        </TabsList>
                        )}
                     </div>
                  </div>
               </div>
            </header>

            {/* Content */}
            <main className="w-full">
               {!isRoleReady && (
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-secondary-500">
                     Loading your tasks...
                  </div>
               )}

               {/* Both components are always rendered to fetch counts, but only show the active one */}
               <div className={isRoleReady && activeTab === "mytasks" ? "" : "hidden"}>
                  <MyTasksContent onCountChange={setTasksCount} />
               </div>

               <div className={isRoleReady && activeTab === "myapplications" ? "" : "hidden"}>
                  <MyApplicationsContent onCountChange={setApplicationsCount} />
               </div>
            </main>
         </Tabs>
      </div>
   );
}
