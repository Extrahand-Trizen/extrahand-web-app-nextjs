"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TaskMap } from "@/components/tasks/TaskMap";
import { TaskCard } from "@/components/tasks/TaskCard";
import { TaskDetailCard } from "@/components/tasks/TaskDetailCard";
import { CompactFilterBar } from "@/components/tasks/CompactFilterBar";
import { TaskListSkeleton } from "@/components/tasks/TaskSkeleton";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import type { Task, TaskListResponse } from "@/types/task";
import { MapIcon, List, Plus, AlertCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const HYDERABAD_CENTER = { lat: 17.385, lng: 78.4867 };
const TASKS_PER_PAGE = 20;

type CompactFilterState = {
   categories: string[];
   suburb: string;
   remotely: boolean;
   minBudget: number;
   maxBudget: number;
   sortBy: "recent" | "nearest" | "price-low" | "price-high";
};

// tweak these to match your header/filter/footer sizes
const HEADER_HEIGHT_PX = 110;
const FILTER_BAR_HEIGHT_PX = 0;
const TOP_OFFSET_PX = HEADER_HEIGHT_PX + FILTER_BAR_HEIGHT_PX;

const calculateDistance = (
   lat1: number,
   lon1: number,
   lat2: number,
   lon2: number
) => {
   const R = 6371;
   const dLat = ((lat2 - lat1) * Math.PI) / 180;
   const dLon = ((lon2 - lon1) * Math.PI) / 180;
   const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
         Math.cos((lat2 * Math.PI) / 180) *
         Math.sin(dLon / 2) *
         Math.sin(dLon / 2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   return R * c;
};

// Empty state
const EmptyState = ({ searchQuery }: { searchQuery: string }) => {
   const router = useRouter();
   return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
         <div className="w-16 h-16 rounded-full bg-secondary-100 flex items-center justify-center mb-4">
            <List className="w-8 h-8 text-secondary-400" />
         </div>
         <h3 className="text-lg font-semibold text-secondary-900 mb-2">
            No tasks found
         </h3>
         <p className="text-sm text-secondary-600 mb-4 max-w-md">
            {searchQuery
               ? `No results for "${searchQuery}". Try different keywords or adjust your filters.`
               : "Try adjusting your filters or post your own task to get started."}
         </p>
         <Button
            onClick={() => router.push("/tasks/new")}
            className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold"
         >
            <Plus className="w-4 h-4 mr-2" />
            Post a task
         </Button>
      </div>
   );
};

export default function TasksPage() {
   const router = useRouter();

   // State
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
   const [showTaskDetail, setShowTaskDetail] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [showMobileMap, setShowMobileMap] = useState(false);
   const [tasks, setTasks] = useState<Task[]>([]);
   const [error, setError] = useState<string | null>(null);
   const [pagination, setPagination] = useState({
      page: 1,
      limit: 20,
      total: 0,
      pages: 0,
   });
   const [isLoadingMore, setIsLoadingMore] = useState(false);

   const [filters, setFilters] = useState<CompactFilterState>({
      categories: [],
      suburb: "",
      remotely: false,
      minBudget: 0,
      maxBudget: 100000,
      sortBy: "recent",
   });

   const isMobile = useIsMobile();

   // Fetch tasks from API
   useEffect(() => {
      const fetchTasks = async () => {
         try {
            setIsLoading(true);
            setError(null);

            // Map filters to API query params
            const params: any = {
               page: 1, // Reset to page 1 on filter change
               limit: TASKS_PER_PAGE,
               status: "open", // Only show open tasks on discover page
            };

            // Add backend-supported filters
            if (filters.categories.length > 0) {
               // For now, send first category (backend may need update for multiple)
               params.category = filters.categories[0];
            }

            if (searchQuery.trim()) {
               params.search = searchQuery;
            }

            if (filters.minBudget > 0) {
               params.minBudget = filters.minBudget;
            }

            if (filters.maxBudget < 100000) {
               params.maxBudget = filters.maxBudget;
            }

            // Map sortBy to backend format
            if (filters.sortBy && filters.sortBy !== "nearest") {
               params.sortBy = filters.sortBy;
            }

            const response: TaskListResponse = await tasksApi.getPublicTasks(params);

            // Handle both wrapped and unwrapped responses
            setTasks(response.tasks || []);
            setPagination(response.pagination || {
               page: 1,
               limit: TASKS_PER_PAGE,
               total: 0,
               pages: 0,
            });
         } catch (err: any) {
            console.error("Error fetching tasks:", err);
            setError(err.message || "Failed to load tasks. Please try again.");
            setTasks([]);
         } finally {
            setIsLoading(false);
         }
      };

      fetchTasks();
   }, [searchQuery, filters]);

   // Filter and sort tasks (client-side for unsupported backend filters)
   const getFilteredTasks = useCallback((): Task[] => {
      let filtered = [...tasks];

      // Client-side filters for unsupported backend options
      
      // Suburb filter (backend only supports city)
      if (filters.suburb) {
         filtered = filtered.filter((task) =>
            task.location.address.toLowerCase().includes(filters.suburb.toLowerCase())
         );
      }

      // Remotely filter (not supported by backend)
      if (filters.remotely) {
         // For now, we don't have a "remote" flag in the task model
         // This could be added later or we could filter by some other criteria
      }

      // Sort by nearest (client-side distance calculation)
      if (filters.sortBy === "nearest") {
         filtered.sort((a, b) => {
            const [lngA, latA] = a.location?.coordinates || [0, 0];
            const [lngB, latB] = b.location?.coordinates || [0, 0];
            const distA = calculateDistance(
               HYDERABAD_CENTER.lat,
               HYDERABAD_CENTER.lng,
               latA,
               lngA
            );
            const distB = calculateDistance(
               HYDERABAD_CENTER.lat,
               HYDERABAD_CENTER.lng,
               latB,
               lngB
            );
            return distA - distB;
         });
      }

      return filtered;
   }, [tasks, filters]);

   const filteredTasks = getFilteredTasks();
   const selectedTask = filteredTasks.find((t) => t._id === selectedTaskId);

   // Handle task selection - show detail card instead of redirecting
   const handleTaskSelect = (taskId: string) => {
      setSelectedTaskId(taskId);
      setShowTaskDetail(true);
      // On mobile, switch to map view when a task is selected
      if (isMobile) {
         setShowMobileMap(true);
      }
   };

   // Handle closing detail card
   const handleCloseDetail = () => {
      setShowTaskDetail(false);
      setSelectedTaskId(null);
   };

   return (
      <div className="flex flex-col bg-secondary-50">
         {/* Filter bar (sticky) */}
         <CompactFilterBar
            filters={filters}
            onFilterChange={setFilters}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            resultCount={filteredTasks.length}
         />

         {/* Main content */}
         <div className="w-full max-w-7xl mx-auto px-4">
            <div className="flex gap-4">
               {/* Left column: list */}
               <div
                  className={`w-full lg:w-1/2 ${
                     isMobile ? (showMobileMap ? "hidden" : "block") : "block"
                  }`}
               >
                  <div
                     style={{
                        maxHeight: `calc(100vh - ${TOP_OFFSET_PX}px)`,
                     }}
                     className="overflow-y-auto py-8 md:px-3"
                  >
                     {error ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                           <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
                              <AlertCircle className="w-8 h-8 text-red-500" />
                           </div>
                           <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                              Error Loading Tasks
                           </h3>
                           <p className="text-sm text-secondary-600 mb-4 max-w-md">
                              {error}
                           </p>
                           <Button
                              onClick={() => window.location.reload()}
                              className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold"
                           >
                              Retry
                           </Button>
                        </div>
                     ) : isLoading ? (
                        <div className="p-4">
                           <TaskListSkeleton count={8} />
                        </div>
                     ) : filteredTasks.length === 0 ? (
                        <EmptyState searchQuery={searchQuery} />
                     ) : (
                        <div className="space-y-5">
                           {filteredTasks.map((task) => (
                              <TaskCard
                                 key={task._id}
                                 task={task}
                                 isSelected={selectedTaskId === task._id}
                                 onClick={() => handleTaskSelect(task._id)}
                              />
                           ))}
                        </div>
                     )}

                     {/* Load more button */}
                     {!isLoading && !error && pagination.page < pagination.pages && (
                        <div className="p-4 text-center border-t border-secondary-200">
                           <Button
                              onClick={async () => {
                                 try {
                                    setIsLoadingMore(true);
                                    const params: any = {
                                       page: pagination.page + 1,
                                       limit: TASKS_PER_PAGE,
                                       status: "open",
                                    };
                                    if (filters.categories.length > 0) params.category = filters.categories[0];
                                    if (searchQuery.trim()) params.search = searchQuery;
                                    if (filters.minBudget > 0) params.minBudget = filters.minBudget;
                                    if (filters.maxBudget < 100000) params.maxBudget = filters.maxBudget;
                                    if (filters.sortBy && filters.sortBy !== "nearest") params.sortBy = filters.sortBy;
                                    const response: TaskListResponse = await tasksApi.getPublicTasks(params);
                                    setTasks(prev => [...prev, ...(response.tasks || [])]);
                                    setPagination(response.pagination || pagination);
                                 } catch (err: any) {
                                    console.error("Error loading more tasks:", err);
                                 } finally {
                                    setIsLoadingMore(false);
                                 }
                              }}
                              variant="outline"
                              className="border-secondary-300"
                              disabled={isLoadingMore}
                           >
                              {isLoadingMore ? "Loading..." : `Load more tasks`}
                           </Button>
                        </div>
                     )}
                  </div>
               </div>

               {/* Right column: map */}
               {!isMobile ? (
                  <div className="hidden lg:block lg:w-1/2">
                     <div
                        className="sticky"
                        style={{ top: `${TOP_OFFSET_PX}px` }}
                     >
                        <div
                           className="relative"
                           style={{
                              height: `calc(100vh - ${TOP_OFFSET_PX}px)`,
                           }}
                        >
                           <TaskMap
                              tasks={filteredTasks}
                              selectedTaskId={selectedTaskId}
                              onTaskSelect={handleTaskSelect}
                              centerCoordinates={HYDERABAD_CENTER}
                           />
                           {/* Desktop Task Detail Card Overlay */}
                           {showTaskDetail && selectedTask && (
                              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-full px-4">
                                 <TaskDetailCard
                                    task={selectedTask}
                                    onClose={handleCloseDetail}
                                 />
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               ) : (
                  showMobileMap && (
                     <div className="fixed inset-0 top-[120px] z-30 bg-white">
                        <TaskMap
                           tasks={filteredTasks}
                           selectedTaskId={selectedTaskId}
                           onTaskSelect={handleTaskSelect}
                           centerCoordinates={HYDERABAD_CENTER}
                        />{" "}
                        {/* Mobile Task Detail Card Overlay */}
                        {showTaskDetail && selectedTask && (
                           <div className="absolute bottom-4 left-4 right-4 z-50">
                              <TaskDetailCard
                                 task={selectedTask}
                                 onClose={handleCloseDetail}
                              />
                           </div>
                        )}{" "}
                     </div>
                  )
               )}
            </div>
         </div>

         {/* Mobile map toggle */}
         {isMobile && (
            <div className="fixed bottom-4 right-4 z-40">
               <Button
                  onClick={() => setShowMobileMap(!showMobileMap)}
                  className="bg-white border-2 border-secondary-300 text-secondary-900 hover:bg-secondary-50 shadow-lg rounded-full w-14 h-14 p-0"
               >
                  {showMobileMap ? (
                     <List className="w-6 h-6" />
                  ) : (
                     <MapIcon className="w-6 h-6" />
                  )}
               </Button>
            </div>
         )}

         {/* Mobile floating post button */}
         {isMobile && !showMobileMap && (
            <div className="fixed bottom-4 left-4 z-40">
               <Button
                  onClick={() => router.push("/tasks/new")}
                  className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold shadow-lg rounded-full px-6"
               >
                  <Plus className="w-5 h-5 mr-2" />
                  Post Task
               </Button>
            </div>
         )}
      </div>
   );
}
