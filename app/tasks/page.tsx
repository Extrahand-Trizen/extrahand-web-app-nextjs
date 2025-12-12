"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { TaskMap } from "@/components/tasks/TaskMap";
import { TaskCard } from "@/components/tasks/TaskCard";
import {
   CompactFilterBar,
   CompactFilterState,
} from "@/components/tasks/CompactFilterBar";
import { TaskListSkeleton } from "@/components/tasks/TaskSkeleton";
import { mockTasksData } from "@/lib/data/mockTasks";
import type { Task } from "@/types/task";
import { MapIcon, List, Plus } from "lucide-react";

const HYDERABAD_CENTER = { lat: 17.385, lng: 78.4867 };

// tweak these to match your header/filter/footer sizes
const HEADER_HEIGHT_PX = 110;
const FILTER_BAR_HEIGHT_PX = 64;
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

export default function TasksPage() {
   const router = useRouter();

   // State
   const [searchQuery, setSearchQuery] = useState("");
   const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [showMobileMap, setShowMobileMap] = useState(false);
   const [isMobile, setIsMobile] = useState(false);

   const [filters, setFilters] = useState<CompactFilterState>({
      categories: [],
      suburb: "",
      remotely: false,
      minBudget: 0,
      maxBudget: 100000,
      sortBy: "recent",
   });

   // Check screen size
   useEffect(() => {
      const checkMobile = () => setIsMobile(window.innerWidth < 1024);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
   }, []);

   // Simulate initial loading
   useEffect(() => {
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
   }, []);

   // Filter and sort tasks
   const getFilteredTasks = useCallback((): Task[] => {
      let filtered = [...mockTasksData];

      // Search filter
      if (searchQuery.trim()) {
         const query = searchQuery.toLowerCase();
         filtered = filtered.filter(
            (task) =>
               task.title.toLowerCase().includes(query) ||
               task.category.toLowerCase().includes(query) ||
               task.description?.toLowerCase().includes(query) ||
               task.location.city.toLowerCase().includes(query)
         );
      }

      // Category filter (multi-select)
      if (filters.categories.length > 0) {
         filtered = filtered.filter((task) =>
            filters.categories.includes(task.category)
         );
      }

      // Budget filter
      const budgetValue = (task: Task) =>
         typeof task.budget === "object" ? task.budget.amount : task.budget;

      filtered = filtered.filter((task) => {
         const price = budgetValue(task);
         return price >= filters.minBudget && price <= filters.maxBudget;
      });

      // Sorting
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
      } else if (filters.sortBy === "price-low") {
         filtered.sort((a, b) => budgetValue(a) - budgetValue(b));
      } else if (filters.sortBy === "price-high") {
         filtered.sort((a, b) => budgetValue(b) - budgetValue(a));
      } else {
         // Recent (default)
         filtered.sort(
            (a, b) =>
               new Date(b.createdAt!).getTime() -
               new Date(a.createdAt!).getTime()
         );
      }

      return filtered;
   }, [searchQuery, filters]);

   const filteredTasks = getFilteredTasks();

   // Empty state
   const EmptyState = () => (
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
            <div className="flex gap-6">
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
                     className="overflow-y-auto pb-8"
                  >
                     {isLoading ? (
                        <div className="p-4">
                           <TaskListSkeleton count={8} />
                        </div>
                     ) : filteredTasks.length === 0 ? (
                        <EmptyState />
                     ) : (
                        <div className="space-y-0">
                           {filteredTasks.map((task) => (
                              <TaskCard
                                 key={task._id}
                                 task={task}
                                 isSelected={selectedTaskId === task._id}
                                 onClick={() => setSelectedTaskId(task._id)}
                              />
                           ))}
                        </div>
                     )}

                     {/* Load more button */}
                     {!isLoading && filteredTasks.length > 20 && (
                        <div className="p-4 text-center border-t border-secondary-200">
                           <Button
                              variant="outline"
                              className="border-secondary-300"
                           >
                              Load more tasks
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
                           style={{
                              height: `calc(100vh - ${TOP_OFFSET_PX}px)`,
                           }}
                        >
                           <TaskMap
                              tasks={filteredTasks}
                              selectedTaskId={selectedTaskId}
                              onTaskSelect={setSelectedTaskId}
                              centerCoordinates={HYDERABAD_CENTER}
                           />
                        </div>
                     </div>
                  </div>
               ) : (
                  showMobileMap && (
                     <div className="fixed inset-0 top-[110px] z-30 bg-white">
                        <TaskMap
                           tasks={filteredTasks}
                           selectedTaskId={selectedTaskId}
                           onTaskSelect={setSelectedTaskId}
                           centerCoordinates={HYDERABAD_CENTER}
                        />
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
