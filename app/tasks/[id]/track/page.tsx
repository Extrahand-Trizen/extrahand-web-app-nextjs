"use client";

/**
 * Task Tracking Page
 * Shows task progress, status timeline, and allows status updates
 * Matches: web-apps/extrahand-web-app/src/screens/TaskTrackingScreen.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Mock task data
const mockTask = {
   _id: "1",
   title: "Home Deep Cleaning",
   description:
      "Complete deep cleaning for 3BHK apartment including kitchen and bathrooms. Need professional service with eco-friendly products.",
   budget: { amount: 1500, currency: "INR" },
   category: "Cleaning",
   location: { address: "Hitech City, Hyderabad", city: "Hyderabad" },
   status: "in_progress",
   requesterId: "owner1",
   assigneeUid: "performer1",
   requesterName: "John Doe",
   assignedToName: "Jane Smith",
   createdAt: new Date().toISOString(),
};

const getStatusInfo = (status: string) => {
   switch (status) {
      case "assigned":
         return {
            color: "#2196F3",
            text: "ASSIGNED",
            description: "Performer has been assigned to this task",
         };
      case "started":
         return {
            color: "#FF9800",
            text: "STARTED",
            description: "Work has begun on this task",
         };
      case "in_progress":
         return {
            color: "#FF5722",
            text: "IN PROGRESS",
            description: "Task is actively being worked on",
         };
      case "review":
         return {
            color: "#9C27B0",
            text: "UNDER REVIEW",
            description: "Work completed, awaiting approval",
         };
      case "completed":
         return {
            color: "#4CAF50",
            text: "COMPLETED",
            description: "Task successfully completed",
         };
      case "cancelled":
         return {
            color: "#F44336",
            text: "CANCELLED",
            description: "Task was cancelled",
         };
      default:
         return {
            color: "#9E9E9E",
            text: status.toUpperCase(),
            description: "Status unknown",
         };
   }
};

export default function TaskTrackingPage() {
   const router = useRouter();
   const params = useParams();
   const taskId = params.id as string;

   const [task] = useState(mockTask);
   const [updatingStatus, setUpdatingStatus] = useState(false);
   const [startingChat, setStartingChat] = useState(false);
   const [isTaskOwner] = useState(true); // Mock: Would check against current user
   const [isAssignedPerformer] = useState(false); // Mock: Would check against current user

   const statusInfo = getStatusInfo(task.status);

   const statuses = [
      { key: "assigned", label: "Assigned" },
      { key: "started", label: "Started" },
      { key: "in_progress", label: "In Progress" },
      { key: "review", label: "Review" },
      { key: "completed", label: "Completed" },
   ];

   const currentStatusIndex = statuses.findIndex((s) => s.key === task.status);

   const getAvailableActions = () => {
      const actions: Array<{ status: string; label: string; color: string }> =
         [];
      const isOwner = isTaskOwner;
      const isPerformer = isAssignedPerformer;

      switch (task.status) {
         case "assigned":
            if (isPerformer) {
               actions.push({
                  status: "started",
                  label: "Mark as Started",
                  color: "#FF9800",
               });
            }
            if (isOwner) {
               actions.push({
                  status: "cancelled",
                  label: "Cancel Task",
                  color: "#F44336",
               });
            }
            break;
         case "started":
            if (isPerformer) {
               actions.push({
                  status: "in_progress",
                  label: "Mark In Progress",
                  color: "#FF5722",
               });
            }
            if (isOwner) {
               actions.push({
                  status: "cancelled",
                  label: "Cancel Task",
                  color: "#F44336",
               });
            }
            break;
         case "in_progress":
            if (isPerformer) {
               actions.push({
                  status: "review",
                  label: "Submit for Review",
                  color: "#9C27B0",
               });
            }
            if (isOwner) {
               actions.push({
                  status: "cancelled",
                  label: "Cancel Task",
                  color: "#F44336",
               });
            }
            break;
         case "review":
            if (isOwner) {
               actions.push({
                  status: "completed",
                  label: "Approve & Complete",
                  color: "#4CAF50",
               });
               actions.push({
                  status: "in_progress",
                  label: "Request Changes",
                  color: "#FF5722",
               });
            }
            if (isPerformer) {
               actions.push({
                  status: "in_progress",
                  label: "Make Changes",
                  color: "#FF5722",
               });
            }
            break;
      }
      return actions;
   };

   const updateTaskStatus = async (newStatus: string) => {
      setUpdatingStatus(true);
      // Mock: Simulate API call
      setTimeout(() => {
         alert(`Task status updated to ${newStatus.replace("_", " ")} (Mock)`);
         setUpdatingStatus(false);
      }, 1000);
   };

   const handleStartChat = async () => {
      setStartingChat(true);
      // Mock: Simulate API call
      setTimeout(() => {
         const otherUserId = isTaskOwner ? task.assigneeUid : task.requesterId;
         router.push(
            `/chat?taskId=${task._id}&taskTitle=${encodeURIComponent(
               task.title
            )}&otherUserId=${otherUserId}`
         );
         setStartingChat(false);
      }, 500);
   };

   const getUserRole = () => {
      if (isTaskOwner) return "Task Owner";
      if (isAssignedPerformer) return "Assigned Performer";
      return "Viewer";
   };

   const availableActions = getAvailableActions();
   const userRole = getUserRole();

   return (
      <div className="flex flex-col min-h-screen bg-gray-50">
         {/* Header */}
         <div className="flex items-center px-4 py-4 bg-white border-b border-gray-200">
            <button onClick={() => router.back()} className="mr-4">
               <span className="text-base text-blue-500 font-semibold">
                  ← Back
               </span>
            </button>
            <div className="flex-1">
               <h1 className="text-xl font-bold text-gray-900 mb-1">
                  Task Tracking
               </h1>
               <p className="text-sm text-gray-600 line-clamp-2">
                  {task.title}
               </p>
               <p className="text-xs text-blue-500 font-semibold mt-1">
                  You are: {userRole}
               </p>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto">
            {/* Current Status */}
            <div className="bg-white px-5 py-5 mb-4 text-center">
               <div
                  className="inline-block px-5 py-2.5 rounded-full mb-3"
                  style={{ backgroundColor: statusInfo.color }}
               >
                  <span className="text-white text-base font-bold">
                     {statusInfo.text}
                  </span>
               </div>
               <p className="text-sm text-gray-600">{statusInfo.description}</p>
            </div>

            {/* Timeline */}
            {task.status !== "cancelled" && (
               <div className="bg-white px-5 py-5 mb-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">
                     Task Progress
                  </h2>
                  <div className="flex items-center justify-between relative">
                     {statuses.map((statusItem, index) => {
                        const isActive = index <= currentStatusIndex;
                        const isCurrent = statusItem.key === task.status;

                        return (
                           <div
                              key={statusItem.key}
                              className="flex flex-col items-center flex-1 relative"
                           >
                              <div
                                 className={`w-5 h-5 rounded-full mb-2 flex items-center justify-center ${
                                    isActive
                                       ? isCurrent
                                          ? "bg-green-500"
                                          : "bg-blue-500"
                                       : "bg-gray-300"
                                 }`}
                              >
                                 {isCurrent && (
                                    <div className="w-2 h-2 rounded-full bg-white" />
                                 )}
                              </div>
                              <span
                                 className={`text-xs text-center font-medium ${
                                    isActive
                                       ? isCurrent
                                          ? "text-green-500 font-bold"
                                          : "text-blue-500 font-semibold"
                                       : "text-gray-400"
                                 }`}
                              >
                                 {statusItem.label}
                              </span>
                              {index < statuses.length - 1 && (
                                 <div
                                    className={`absolute top-2.5 left-1/2 w-full h-0.5 ${
                                       isActive ? "bg-blue-500" : "bg-gray-300"
                                    }`}
                                    style={{ zIndex: -1 }}
                                 />
                              )}
                           </div>
                        );
                     })}
                  </div>
               </div>
            )}

            {/* Task Details */}
            <div className="mb-4">
               <h2 className="text-lg font-bold text-gray-900 mb-3 px-5">
                  Task Details
               </h2>
               <div className="bg-white mx-4 rounded-xl p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                     {task.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-5 mb-4">
                     {task.description}
                  </p>

                  <div className="border-t border-gray-100 pt-4 space-y-2">
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">
                           Budget:
                        </span>
                        <span className="text-gray-900 font-semibold">
                           ₹
                           {typeof task.budget === "object"
                              ? task.budget.amount
                              : task.budget}
                        </span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">
                           Category:
                        </span>
                        <span className="text-gray-900 font-semibold">
                           {task.category}
                        </span>
                     </div>
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">
                           Location:
                        </span>
                        <span className="text-gray-900 font-semibold">
                           {task.location?.address || "Not specified"}
                        </span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Available Actions */}
            {availableActions.length > 0 && (
               <div className="mb-4">
                  <h2 className="text-lg font-bold text-gray-900 mb-3 px-5">
                     Available Actions
                  </h2>
                  <div className="px-4 space-y-3">
                     {availableActions.map((action) => (
                        <button
                           key={action.status}
                           onClick={() => updateTaskStatus(action.status)}
                           disabled={updatingStatus}
                           className={`w-full py-3.5 px-5 rounded-lg text-base font-semibold text-white ${
                              updatingStatus
                                 ? "opacity-50 cursor-not-allowed"
                                 : ""
                           }`}
                           style={{ backgroundColor: action.color }}
                        >
                           {updatingStatus ? (
                              <LoadingSpinner size="sm" />
                           ) : (
                              action.label
                           )}
                        </button>
                     ))}
                  </div>
               </div>
            )}

            {/* Communication Section */}
            {task.status !== "open" &&
               task.status !== "cancelled" &&
               (isTaskOwner || isAssignedPerformer) && (
                  <div className="mb-5">
                     <h2 className="text-lg font-bold text-gray-900 mb-3 px-5">
                        Communication
                     </h2>
                     <div className="bg-white mx-4 rounded-xl p-5 shadow-sm text-center">
                        <p className="text-xs text-gray-600 mb-1">
                           {isTaskOwner ? "Assigned Performer" : "Task Owner"}
                        </p>
                        <p className="text-base font-bold text-gray-900 mb-1">
                           {isTaskOwner
                              ? task.assignedToName || "Performer"
                              : task.requesterName || "Task Owner"}
                        </p>
                        <p className="text-xs text-gray-600 mb-4 leading-4">
                           Coordinate task details, ask questions, and share
                           updates
                        </p>
                        <button
                           onClick={handleStartChat}
                           disabled={startingChat}
                           className={`w-full py-3 px-6 rounded-lg text-sm font-semibold text-white mb-2 ${
                              startingChat
                                 ? "opacity-50 cursor-not-allowed"
                                 : ""
                           }`}
                           style={{ backgroundColor: "#4CAF50" }}
                        >
                           {startingChat ? (
                              <LoadingSpinner size="sm" />
                           ) : (
                              "💬 Send Message"
                           )}
                        </button>
                        <p className="text-xs text-gray-500 italic">
                           {isTaskOwner
                              ? "Chat with your assigned performer"
                              : "Chat with the task owner"}
                        </p>
                     </div>
                  </div>
               )}
         </div>
      </div>
   );
}
