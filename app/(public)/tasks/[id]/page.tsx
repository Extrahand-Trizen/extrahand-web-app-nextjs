"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
   AlertCircle,
   ChevronLeft,
   MapPin,
   Calendar,
   Clock,
   User,
   Star,
   DollarSign,
   ArrowRight,
   CheckCircle,
   Shield,
} from "lucide-react";
import { TaskDetailsHeader } from "@/components/tasks/TaskDetailsHeader";
import { TaskDetailsMain } from "@/components/tasks/TaskDetailsMain";
import { TaskDetailsSidebar } from "@/components/tasks/TaskDetailsSidebar";
import { TaskQuestionsSection } from "@/components/tasks/TaskQuestionsSection";
import { TaskOffersSection } from "@/components/tasks/TaskOffersSection";
import { MakeOfferModal } from "@/components/tasks/offers/MakeOfferModal";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/lib/auth/context";
import type { Task } from "@/types/task";

const formatDate = (date: Date | string | undefined) => {
   if (!date) return "Flexible";
   const d = new Date(date);
   return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
   });
};

export default function TaskDetailsPage() {
   const params = useParams();
   const router = useRouter();
   const taskId = params.id as string;
   const [task, setTask] = useState<Task | null>(null);
   const [loading, setLoading] = useState(true);
   const [activeTab, setActiveTab] = useState<"offers" | "questions">("offers");
   const [showFixedCTA, setShowFixedCTA] = useState(false);
   const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
   
   const [scrollY, setScrollY] = useState(0);
   const isMobile = useIsMobile();
   const { currentUser } = useAuth();
   
   // Check if current user is the task owner
   const isOwner = Boolean(task && currentUser && task.requesterId === currentUser.uid);
   
   // State for user's own application on this task
   const [myApplication, setMyApplication] = useState<any | null>(null);
   const [loadingMyApplication, setLoadingMyApplication] = useState(false);

   // Fetch user's own application for this task (if not owner)
   useEffect(() => {
      const fetchMyApplication = async () => {
         if (!currentUser || isOwner || !taskId) return;
         
         setLoadingMyApplication(true);
         try {
            const { applicationsApi } = await import("@/lib/api/endpoints/applications");
            const response = await applicationsApi.getMyApplications();
            
            // Find application for this specific task
            const responseData = response as any;
            const apps = Array.isArray(responseData?.data) ? responseData.data : [];
            
            const myApp = apps.find((app: any) => {
               const appTaskId = typeof app.taskId === "object" ? app.taskId._id : app.taskId;
               return appTaskId === taskId;
            });
            
            if (myApp) {
               console.log("✅ Found user's application for this task:", myApp);
               setMyApplication(myApp);
            }
         } catch (error) {
            console.error("Error fetching my application:", error);
         } finally {
            setLoadingMyApplication(false);
         }
      };

      fetchMyApplication();
   }, [currentUser, isOwner, taskId]);

   // Fetch task data from API
   useEffect(() => {
      const fetchTask = async () => {
         setLoading(true);
         try {
            const { tasksApi } = await import("@/lib/api/endpoints/tasks");
            const response = await tasksApi.getTask(taskId);
            
            console.log("✅ Task details response:", response);
            
            // Handle different response structures
            const taskData = (response as any)?.data || response;
            
            if (taskData) {
               setTask(taskData as Task);
            }
         } catch (error) {
            console.error("❌ Failed to fetch task:", error);
         } finally {
            setLoading(false);
         }
      };

      if (taskId) {
         fetchTask();
      }
   }, [taskId]);

   useEffect(() => {
      const handleScroll = () => {
         const currentScroll = window.scrollY;
         setScrollY(currentScroll);
         // Show fixed CTA when user scrolls past 400px
         setShowFixedCTA(currentScroll > 400);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <LoadingSpinner size="lg" />
               <p className="mt-4 text-secondary-600">Loading task details...</p>
            </div>
         </div>
      );
   }

   if (!task) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <AlertCircle className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
               <h1 className="text-2xl font-bold text-secondary-900 mb-2">
                  Task not found
               </h1>
               <p className="text-secondary-600 mb-6">
                  The task you&apos;re looking for doesn&apos;t exist or has
                  been removed.
               </p>
               <Button onClick={() => router.push("/tasks")}>
                  Browse all tasks
               </Button>
            </div>
         </div>
      );
   }

   const budgetAmount =
      typeof task.budget === "object" ? task.budget.amount : task.budget;

   return (
      <div className="min-h-screen bg-linear-to-b from-secondary-50 to-white pb-24 md:pb-0">
         {/* Back Button */}
         <div className="bg-white/80 backdrop-blur-sm border-b border-secondary-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
               <button
                  onClick={() => router.back()}
                  className="flex items-center text-secondary-500 hover:text-secondary-900 transition-colors"
               >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Back</span>
               </button>
            </div>
         </div>

         {/* Header Component */}
         <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 lg:py-6">
            <TaskDetailsHeader task={task} showMobileCTA={isMobile} />
         </div>

         {/* Main Content */}
         <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 lg:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
               {/* Left Column - Main Content */}
               <div className="lg:col-span-2 space-y-6">
                  <TaskDetailsMain task={task} />

                  {/* Tabs */}
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm overflow-hidden border border-secondary-100/50">
                     <div className="flex gap-2 p-2 border-b border-secondary-100">
                        <button
                           onClick={() => setActiveTab("offers")}
                           className={`flex-1 px-4 md:px-6 py-2 md:py-3 text-sm font-semibold rounded-xl transition-all ${
                              activeTab === "offers"
                                 ? "bg-primary-600 text-white shadow-md"
                                 : "text-secondary-600 hover:bg-secondary-50"
                           }`}
                        >
                           Offers ({task.applications || 0})
                        </button>
                        <button
                           onClick={() => setActiveTab("questions")}
                           className={`flex-1 px-4 md:px-6 py-2 md:py-3 text-sm font-semibold rounded-xl transition-all ${
                              activeTab === "questions"
                                 ? "bg-primary-600 text-white shadow-md"
                                 : "text-secondary-600 hover:bg-secondary-50"
                           }`}
                        >
                           Questions
                        </button>
                     </div>

                     {/* Tab Content */}
                     <div>
                        {activeTab === "offers" ? (
                           isOwner ? (
                              <TaskOffersSection
                                 taskId={taskId}
                                 isOwner={isOwner}
                              />
                           ) : loadingMyApplication ? (
                              <div className="p-8 flex justify-center">
                                 <LoadingSpinner size="md" />
                              </div>
                           ) : myApplication ? (
                              // Show user's own application
                              <div className="p-6">
                                 <div className="bg-primary-50 border border-primary-200 rounded-xl p-5">
                                    <div className="flex items-center justify-between mb-4">
                                       <h3 className="font-bold text-secondary-900">Your Offer</h3>
                                       <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                          myApplication.status === "pending" 
                                             ? "bg-yellow-100 text-yellow-800" 
                                             : myApplication.status === "accepted"
                                             ? "bg-green-100 text-green-800"
                                             : "bg-red-100 text-red-800"
                                       }`}>
                                          {myApplication.status.toUpperCase()}
                                       </span>
                                    </div>
                                    <div className="space-y-3">
                                       <div className="flex justify-between text-sm">
                                          <span className="text-secondary-600">Proposed Budget:</span>
                                          <span className="font-semibold text-secondary-900">
                                             ₹{myApplication.proposedBudget?.amount?.toLocaleString() || 0}
                                          </span>
                                       </div>
                                       {myApplication.proposedTime?.estimatedDuration && (
                                          <div className="flex justify-between text-sm">
                                             <span className="text-secondary-600">Estimated Time:</span>
                                             <span className="font-semibold text-secondary-900">
                                                {myApplication.proposedTime.estimatedDuration} hours
                                             </span>
                                          </div>
                                       )}
                                       {myApplication.coverLetter && (
                                          <div className="mt-3 pt-3 border-t border-primary-200">
                                             <p className="text-xs text-secondary-600 mb-1">Your Message:</p>
                                             <p className="text-sm text-secondary-700">{myApplication.coverLetter}</p>
                                          </div>
                                       )}
                                       <div className="flex justify-between text-xs text-secondary-500 pt-2">
                                          <span>Submitted: {new Date(myApplication.createdAt).toLocaleDateString()}</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ) : (
                              // Show make offer button
                              <div className="p-8 text-center">
                                 <p className="text-secondary-600 mb-4">
                                    Interested in this task? Submit your offer!
                                 </p>
                                 <Button
                                    onClick={() => setShowMakeOfferModal(true)}
                                    className="bg-primary-600 hover:bg-primary-700"
                                 >
                                    Make an Offer
                                 </Button>
                              </div>
                           )
                        ) : (
                           <TaskQuestionsSection taskId={taskId} isOwner={isOwner} />
                        )}
                     </div>
                  </div>
               </div>

               {/* Right Sidebar - Desktop Only */}
               <div className="hidden lg:block">
                  <TaskDetailsSidebar task={task} />
               </div>
            </div>
         </div>

         {/* Fixed Bottom CTA - Mobile */}
         {showFixedCTA && task && task.status === "open" && (
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-secondary-200 shadow-xl animate-in slide-in-from-bottom-0 duration-300">
               <div className="max-w-7xl mx-auto px-4 py-3">
                  <Button
                     onClick={() => setShowMakeOfferModal(true)}
                     className="w-full bg-primary-600 hover:bg-primary-700 text-white h-10 font-semibold rounded-xl flex items-center justify-center gap-2"
                  >
                     Make an Offer
                     <ArrowRight className="w-4 h-4" />
                  </Button>
               </div>
            </div>
         )}

         {/* Make Offer Modal */}
         {task && (
            <MakeOfferModal
               task={task}
               open={showMakeOfferModal}
               onOpenChange={setShowMakeOfferModal}
            />
         )}
      </div>
   );
}
