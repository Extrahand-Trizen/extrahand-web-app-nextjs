"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft } from "lucide-react";
import { mockTasksData } from "@/lib/data/mockTasks";
import { TaskDetailsHeader } from "@/components/tasks/TaskDetailsHeader";
import { TaskDetailsMain } from "@/components/tasks/TaskDetailsMain";
import { TaskDetailsSidebar } from "@/components/tasks/TaskDetailsSidebar";
import { TaskQuestionsSection } from "@/components/tasks/TaskQuestionsSection";
import { TaskOffersSection } from "@/components/tasks/TaskOffersSection";

export default function TaskDetailsPage() {
   const params = useParams();
   const router = useRouter();
   const taskId = params.id as string;
   const [activeTab, setActiveTab] = useState<"offers" | "questions">("offers");

   const task = mockTasksData.find((t) => t._id === taskId);

   if (!task) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <AlertCircle className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
               <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                  Task not found
               </h1>
               <p className="text-secondary-600 mb-6">
                  The task you're looking for doesn't exist or has been removed.
               </p>
               <Button onClick={() => router.push("/tasks")}>
                  Browse all tasks
               </Button>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-linear-to-b from-secondary-50 to-white">
         {/* Back Button & Header */}
         <div className="bg-white/80 backdrop-blur-sm border-b border-secondary-100">
            <div className="max-w-7xl mx-auto px-4 py-6">
               <button
                  onClick={() => router.push("/tasks")}
                  className="flex items-center text-secondary-500 hover:text-secondary-900 mb-4 transition-colors"
               >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  Back to tasks
               </button>
               <TaskDetailsHeader task={task} />
            </div>
         </div>

         {/* Main Content */}
         <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left Column - Main Content */}
               <div className="lg:col-span-2 space-y-8">
                  <TaskDetailsMain task={task} />

                  {/* Tabs */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-secondary-100/50">
                     <div className="flex gap-2 p-2">
                        <button
                           onClick={() => setActiveTab("offers")}
                           className={`flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
                              activeTab === "offers"
                                 ? "bg-blue-600 text-white shadow-md"
                                 : "text-secondary-600 hover:bg-secondary-50"
                           }`}
                        >
                           Offers
                        </button>
                        <button
                           onClick={() => setActiveTab("questions")}
                           className={`flex-1 px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
                              activeTab === "questions"
                                 ? "bg-blue-600 text-white shadow-md"
                                 : "text-secondary-600 hover:bg-secondary-50"
                           }`}
                        >
                           Questions
                        </button>
                     </div>

                     {/* Tab Content */}
                     <div>
                        {activeTab === "offers" ? (
                           <TaskOffersSection taskId={taskId} />
                        ) : (
                           <TaskQuestionsSection taskId={taskId} />
                        )}
                     </div>
                  </div>
               </div>

               {/* Right Sidebar */}
               <TaskDetailsSidebar task={task} />
            </div>
         </div>
      </div>
   );
}
