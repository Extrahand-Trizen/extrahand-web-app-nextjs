"use client";

/**
 * Available Tasks Screen
 * Shows all available tasks that the user can apply to
 * Matches: web-apps/extrahand-web-app/src/screens/AvailableTasksScreen.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Mock tasks data
const mockTasks = [
   {
      _id: "1",
      title: "Home Cleaning Service",
      description:
         "Need deep cleaning for 3BHK apartment. All rooms including kitchen and bathrooms.",
      budget: { amount: 1500, currency: "INR" },
      location: { address: "Hitech City, Hyderabad", city: "Hyderabad" },
      category: "Cleaning",
      status: "open",
      requesterName: "John Doe",
      requesterId: "user123",
      createdAt: new Date().toISOString(),
   },
   {
      _id: "2",
      title: "Plumbing Repair",
      description: "Fix leaking tap in kitchen. Need immediate attention.",
      budget: { amount: 800, currency: "INR" },
      location: { address: "Gachibowli, Hyderabad", city: "Hyderabad" },
      category: "Plumbing",
      status: "open",
      requesterName: "Jane Smith",
      requesterId: "user456",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
   },
   {
      _id: "3",
      title: "Electrician Needed",
      description:
         "Install new ceiling fan in living room. Need certified electrician.",
      budget: { amount: 1200, currency: "INR" },
      location: { address: "Kondapur, Hyderabad", city: "Hyderabad" },
      category: "Electricians",
      status: "assigned",
      requesterName: "Mike Johnson",
      requesterId: "user789",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
   },
];

export default function AvailableTasksScreen() {
   const router = useRouter();
   const [loading] = useState(false);
   const [refreshing, setRefreshing] = useState(false);
   const [applyingTaskId, setApplyingTaskId] = useState<string | null>(null);
   const [appliedTaskIds] = useState<Set<string>>(new Set(["2"])); // Mock: User has applied to task 2

   const handleApply = async (taskId: string) => {
      setApplyingTaskId(taskId);
      // Mock: Simulate API call
      setTimeout(() => {
         alert("Application submitted successfully! (Mock)");
         setApplyingTaskId(null);
      }, 1000);
   };

   const handleTaskClick = (taskId: string) => {
      router.push(`/tasks/${taskId}`);
   };

   const formatBudget = (budget: { amount: number; currency: string }) => {
      return `₹${budget.amount}`;
   };

   if (loading) {
      return (
         <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-base text-gray-600">
               Loading available tasks...
            </p>
         </div>
      );
   }

   if (mockTasks.length === 0) {
      return (
         <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 py-20 px-10">
            <p className="text-2xl font-bold text-gray-900 mb-4">
               No Available Tasks
            </p>
            <p className="text-base text-gray-600 text-center leading-6">
               There are currently no tasks available. Check back later!
            </p>
         </div>
      );
   }

   return (
      <div className="flex-1 bg-gray-50">
         {/* Header */}
         <div className="bg-white px-4 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
               Available Tasks
            </h2>
            <p className="text-sm text-gray-600">
               {mockTasks.length} tasks available
            </p>
         </div>

         {/* Task List */}
         <div className="p-4 space-y-3">
            {mockTasks.map((task) => {
               const hasApplied = appliedTaskIds.has(task._id);
               const isMyTask = false; // Mock: Would check against current user ID

               return (
                  <div
                     key={task._id}
                     className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
                  >
                     <div
                        onClick={() => handleTaskClick(task._id)}
                        className="cursor-pointer mb-3"
                     >
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-2">
                           <h3 className="text-lg font-bold text-gray-900 flex-1 mr-2">
                              {task.title}
                           </h3>
                           <span
                              className="text-base font-bold"
                              style={{ color: "#2196F3" }}
                           >
                              {formatBudget(task.budget)}
                           </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-5">
                           {task.description}
                        </p>

                        {/* Category and Location */}
                        <div className="flex items-center justify-between mb-2">
                           <span
                              className="text-xs px-2 py-1 rounded"
                              style={{
                                 color: "#2196F3",
                                 backgroundColor: "#E3F2FD",
                              }}
                           >
                              {task.category}
                           </span>
                           <span className="text-xs text-gray-600 flex-1 text-right">
                              {task.location.address ||
                                 "Location not specified"}
                           </span>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                           <span className="text-xs text-gray-600">
                              Posted by: {task.requesterName || "Anonymous"}
                           </span>
                           <span className="text-xs text-gray-400">
                              {task.createdAt
                                 ? new Date(task.createdAt).toLocaleDateString()
                                 : "Date not available"}
                           </span>
                        </div>
                     </div>

                     {/* Action Buttons / Status Badges */}
                     {!isMyTask && task.status === "open" && (
                        <>
                           {hasApplied ? (
                              <div
                                 className="py-2 px-4 rounded-lg text-center mt-3"
                                 style={{ backgroundColor: "#9C27B0" }}
                              >
                                 <span className="text-white text-xs font-bold">
                                    APPLIED
                                 </span>
                              </div>
                           ) : (
                              <button
                                 onClick={() => handleApply(task._id)}
                                 disabled={applyingTaskId === task._id}
                                 className={`w-full py-3 px-6 rounded-lg text-center font-semibold text-base mt-3 ${
                                    applyingTaskId === task._id
                                       ? "bg-gray-300 cursor-not-allowed"
                                       : "bg-green-500 hover:bg-green-600"
                                 } text-white`}
                              >
                                 {applyingTaskId === task._id ? (
                                    <LoadingSpinner size="sm" />
                                 ) : (
                                    "Apply"
                                 )}
                              </button>
                           )}
                        </>
                     )}

                     {/* Status Badge for non-open tasks */}
                     {task.status !== "open" && (
                        <div
                           className="py-2 px-4 rounded-lg text-center mt-3"
                           style={{ backgroundColor: "#FF9800" }}
                        >
                           <span className="text-white text-xs font-bold">
                              {task.status.toUpperCase()}
                           </span>
                        </div>
                     )}

                     {/* Your Task Badge */}
                     {isMyTask && (
                        <div
                           className="py-2 px-4 rounded-lg text-center mt-3"
                           style={{ backgroundColor: "#2196F3" }}
                        >
                           <span className="text-white text-xs font-bold">
                              YOUR TASK
                           </span>
                        </div>
                     )}
                  </div>
               );
            })}
         </div>
      </div>
   );
}
