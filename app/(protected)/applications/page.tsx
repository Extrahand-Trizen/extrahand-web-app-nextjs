"use client";

/**
 * My Applications Page
 * Shows all applications submitted by the current user
 * Matches: web-apps/extrahand-web-app/src/screens/MyApplicationsScreen.tsx
 * NO API CALLS - Just UI with mock data
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/layout/NavBar";
import { Footer } from "@/components/layout/Footer";
import { LoadingSpinner } from "@/components/LoadingSpinner";

// Mock applications data
const mockApplications = [
   {
      _id: "1",
      taskId: {
         _id: "task1",
         title: "Home Deep Cleaning",
         budget: { amount: 1500, currency: "INR" },
         requesterId: "owner1",
      },
      proposedBudget: { amount: 1400, currency: "INR" },
      status: "pending",
      coverLetter:
         "I have 5 years of experience in deep cleaning. I use eco-friendly products and can complete the task within 4 hours.",
      createdAt: new Date().toISOString(),
      messages: [],
   },
   {
      _id: "2",
      taskId: {
         _id: "task2",
         title: "Plumbing Repair",
         budget: { amount: 800, currency: "INR" },
         requesterId: "owner2",
      },
      proposedBudget: { amount: 750, currency: "INR" },
      status: "accepted",
      coverLetter:
         "Can fix this today itself. I have all the necessary tools and 10 years of experience.",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      respondedAt: new Date(Date.now() - 43200000).toISOString(),
      messages: [{ text: "Great! When can you start?", fromOwner: true }],
   },
   {
      _id: "3",
      taskId: {
         _id: "task3",
         title: "Garden Maintenance",
         budget: { amount: 2000, currency: "INR" },
         requesterId: "owner3",
      },
      proposedBudget: { amount: 1800, currency: "INR" },
      status: "rejected",
      coverLetter:
         "Available for weekly maintenance. I specialize in organic gardening.",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      respondedAt: new Date(Date.now() - 129600000).toISOString(),
      messages: [],
   },
];

const getStatusColor = (status: string) => {
   switch (status) {
      case "pending":
         return "#FF9800";
      case "accepted":
         return "#4CAF50";
      case "rejected":
         return "#F44336";
      case "withdrawn":
         return "#9E9E9E";
      default:
         return "#9E9E9E";
   }
};

const getStatusText = (status: string) => {
   switch (status) {
      case "pending":
         return "PENDING";
      case "accepted":
         return "ACCEPTED";
      case "rejected":
         return "REJECTED";
      case "withdrawn":
         return "WITHDRAWN";
      default:
         return status.toUpperCase();
   }
};

export default function ApplicationsPage() {
   const router = useRouter();
   const [loading] = useState(false);
   const [refreshing] = useState(false);

   const handleViewTask = (taskId: string) => {
      router.push(`/tasks/${taskId}`);
   };

   const handleStartChat = (
      taskId: string,
      taskTitle: string,
      otherUserId: string
   ) => {
      router.push(
         `/chat?taskId=${taskId}&taskTitle=${encodeURIComponent(
            taskTitle
         )}&otherUserId=${otherUserId}`
      );
   };

   const handleTrackProgress = (taskId: string) => {
      router.push(`/tasks/${taskId}/track`);
   };

   const handleWithdraw = (applicationId: string) => {
      if (confirm("Are you sure you want to withdraw this application?")) {
         alert(
            "Application withdrawal functionality will be available soon. (Mock)"
         );
      }
   };

   if (loading) {
      return (
         <div className="flex flex-col min-h-screen bg-gray-50">
            <NavBar title="My Applications" />
            <div className="flex-1 flex items-center justify-center">
               <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-base text-gray-600">
                     Loading your applications...
                  </p>
               </div>
            </div>
            <Footer />
         </div>
      );
   }

   if (mockApplications.length === 0) {
      return (
         <div className="flex flex-col min-h-screen bg-gray-50">
            <NavBar title="My Applications" />
            <div className="flex-1 flex flex-col items-center justify-center py-20 px-4">
               <p className="text-2xl font-bold text-gray-900 mb-4">
                  No Applications Yet
               </p>
               <p className="text-base text-gray-600 text-center leading-6 mb-6">
                  You haven't applied to any tasks yet. Browse available tasks
                  and apply to get started!
               </p>
               <button
                  onClick={() => router.push("/performer")}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold text-base"
               >
                  Browse Tasks
               </button>
            </div>
            <Footer />
         </div>
      );
   }

   return (
      <div className="flex flex-col min-h-screen bg-gray-50">
         <NavBar title="My Applications" />

         {/* Header */}
         <div className="bg-white px-4 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
               My Applications
            </h2>
            <p className="text-sm text-gray-600">
               {mockApplications.length} application
               {mockApplications.length !== 1 ? "s" : ""}
            </p>
         </div>

         {/* Applications List */}
         <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
               {mockApplications.map((application) => {
                  const task = application.taskId;
                  const taskTitle = task?.title || "Task Details";
                  const taskBudget = task?.budget?.amount || 0;
                  const proposedBudget =
                     application.proposedBudget?.amount || 0;

                  return (
                     <div
                        key={application._id}
                        className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                     >
                        {/* Application Header */}
                        <div
                           onClick={() => handleViewTask(task._id)}
                           className="cursor-pointer mb-3"
                        >
                           <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-bold text-gray-900 flex-1 mr-3 line-clamp-2">
                                 {taskTitle}
                              </h3>
                              <div
                                 className="px-2 py-1 rounded-xl min-w-[80px] text-center"
                                 style={{
                                    backgroundColor: getStatusColor(
                                       application.status
                                    ),
                                 }}
                              >
                                 <span className="text-white text-xs font-bold">
                                    {getStatusText(application.status)}
                                 </span>
                              </div>
                           </div>

                           {/* Application Details */}
                           <div className="space-y-2 mb-3">
                              <div className="flex items-center justify-between text-sm">
                                 <span className="text-gray-600 font-medium">
                                    Your Proposal:
                                 </span>
                                 <span className="text-gray-900 font-semibold">
                                    ₹{proposedBudget}
                                 </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                 <span className="text-gray-600 font-medium">
                                    Task Budget:
                                 </span>
                                 <span className="text-gray-900 font-semibold">
                                    ₹{taskBudget}
                                 </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                 <span className="text-gray-600 font-medium">
                                    Applied:
                                 </span>
                                 <span className="text-gray-900 font-semibold">
                                    {new Date(
                                       application.createdAt
                                    ).toLocaleDateString()}
                                 </span>
                              </div>
                              {application.respondedAt && (
                                 <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 font-medium">
                                       Response:
                                    </span>
                                    <span className="text-gray-900 font-semibold">
                                       {new Date(
                                          application.respondedAt
                                       ).toLocaleDateString()}
                                    </span>
                                 </div>
                              )}
                           </div>

                           {/* Cover Letter */}
                           {application.coverLetter && (
                              <div className="mb-3 p-3 bg-gray-50 rounded-lg">
                                 <p className="text-xs text-gray-600 font-semibold mb-1">
                                    Your Message:
                                 </p>
                                 <p className="text-sm text-gray-700 line-clamp-3 leading-5">
                                    {application.coverLetter}
                                 </p>
                              </div>
                           )}

                           {/* Messages Section */}
                           {application.messages &&
                              application.messages.length > 0 && (
                                 <div className="mb-3 p-2 bg-blue-50 rounded">
                                    <p className="text-xs text-blue-700 font-semibold">
                                       💬 {application.messages.length}{" "}
                                       message(s) from task owner
                                    </p>
                                 </div>
                              )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                           <button
                              onClick={() => handleViewTask(task._id)}
                              className="flex-1 py-2.5 px-4 bg-blue-500 text-white rounded-lg text-sm font-semibold"
                           >
                              View Task
                           </button>

                           {application.status === "accepted" && (
                              <>
                                 <button
                                    onClick={() =>
                                       handleTrackProgress(task._id)
                                    }
                                    className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white"
                                    style={{ backgroundColor: "#4CAF50" }}
                                 >
                                    Track Progress
                                 </button>
                                 <button
                                    onClick={() =>
                                       handleStartChat(
                                          task._id,
                                          taskTitle,
                                          task.requesterId
                                       )
                                    }
                                    className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white"
                                    style={{ backgroundColor: "#FF9800" }}
                                 >
                                    💬 Chat
                                 </button>
                              </>
                           )}

                           {application.status === "pending" && (
                              <button
                                 onClick={() => handleWithdraw(application._id)}
                                 className="flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold text-white"
                                 style={{ backgroundColor: "#F44336" }}
                              >
                                 Withdraw
                              </button>
                           )}
                        </div>
                     </div>
                  );
               })}
            </div>
         </div>

         <Footer />
      </div>
   );
}
