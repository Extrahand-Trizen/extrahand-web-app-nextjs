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
import { useUserStore } from "@/lib/state/userStore";
import type { Task } from "@/types/task";
import { applicationsApi } from "@/lib/api/endpoints/applications";
import { tasksApi } from "@/lib/api/endpoints/tasks";

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
   const userProfile = useUserStore((state) => state.user); // Get profile from global state
   
   // Check if current user is the task owner
   // Compare MongoDB ObjectIds: profile._id with task.requesterId
   const isOwner = (() => {
      if (!task || !userProfile) return false;
      
      // Convert both to strings for comparison (handles ObjectId vs string)
      const taskRequesterId = String(task.requesterId || '');
      const userProfileId = String(userProfile._id || '');
      
      // Debug logging
      console.log("🔍 isOwner Check:", {
         taskRequesterId,
         userProfileId,
         match: taskRequesterId === userProfileId,
         taskStatus: task.status,
      });
      
      return taskRequesterId !== '' && userProfileId !== '' && taskRequesterId === userProfileId;
   })();

   // Fetch task data from API
   useEffect(() => {
      const fetchTask = async () => {
         setLoading(true);
         try {
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
                           <TaskOffersSection
                              taskId={taskId}
                              isOwner={isOwner}
                              userProfile={userProfile}
                              onMakeOffer={() => setShowMakeOfferModal(true)}
                              taskCategory={task?.category}
                           />
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
