"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
   AlertCircle,
   ChevronLeft,
   Share2,
   ArrowRight,
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
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { applicationsApi } from "@/lib/api/endpoints/applications";
import { taskDetailsQueryKeys } from "@/lib/queryKeys";
import { ShareModal } from "@/components/shared/ShareModal";
import { toast } from "sonner";

interface TaskDetailsClientProps {
   initialTask: Task | null;
   taskId: string;
}

const TASK_STALE_MS = 60 * 1000;

export function TaskDetailsClient({ initialTask, taskId }: TaskDetailsClientProps) {
   const router = useRouter();
   const queryClient = useQueryClient();
   const initialForId =
      initialTask && String((initialTask as Task & { _id?: string })._id) === taskId ? initialTask : null;

   const taskQuery = useQuery({
      queryKey: taskDetailsQueryKeys.task(taskId),
      queryFn: async () => {
         const r = await tasksApi.getTask(taskId);
         return ((r as { data?: Task })?.data ?? r) as Task;
      },
      initialData: initialForId ?? undefined,
      enabled: !!taskId,
      staleTime: TASK_STALE_MS,
   });

   const applicationsQuery = useQuery({
      queryKey: taskDetailsQueryKeys.applications(taskId),
      queryFn: () => applicationsApi.getTaskApplications(taskId),
      enabled: !!taskId,
      staleTime: TASK_STALE_MS,
   });

   const isMobile = useIsMobile();
   const { currentUser } = useAuth();
   const userProfile = useUserStore((state) => state.user);

   const task = taskQuery.data ?? null;
   const loading = taskQuery.isLoading && !taskQuery.data;
   const applications = applicationsQuery.data?.applications ?? [];
   const userId = (userProfile as { _id?: string } | null)?._id;
   const hasApplied = applications.some((app) => app.applicantId === userId);
   const applicationCount = applications.length;
   const checkingApplication = applicationsQuery.isLoading;

   const [activeTab, setActiveTab] = useState<"offers" | "questions">("offers");
   const [showFixedCTA, setShowFixedCTA] = useState(false);
   const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
   const [shareOpen, setShareOpen] = useState(false);
   const [isSubmittingOffer, setIsSubmittingOffer] = useState(false);

   const isOwner = (() => {
      if (!task || !userProfile) return false;
      const taskRequesterId = String(task.requesterId || "");
      const userProfileId = String(userProfile._id || "");
      return taskRequesterId !== "" && userProfileId !== "" && taskRequesterId === userProfileId;
   })();

   useEffect(() => {
      const handleScroll = () => {
         const currentScroll = window.scrollY;
         setShowFixedCTA(currentScroll > 400);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   if (loading && !task) {
      return (
         <div className="min-h-screen bg-secondary-50">
            <div className="border-b bg-white">
               <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary-200 animate-pulse" />
                  <div className="flex-1 space-y-2">
                     <div className="h-4 w-1/3 bg-secondary-200 rounded animate-pulse" />
                     <div className="h-3 w-1/2 bg-secondary-200 rounded animate-pulse" />
                  </div>
               </div>
            </div>
            <div className="max-w-5xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[2fr,minmax(0,1fr)] gap-6">
               <div className="space-y-4">
                  <div className="h-40 bg-white border border-secondary-200 rounded-xl animate-pulse" />
                  <div className="h-32 bg-white border border-secondary-200 rounded-xl animate-pulse" />
               </div>
               <div className="space-y-4">
                  <div className="h-40 bg-white border border-secondary-200 rounded-xl animate-pulse" />
                  <div className="h-32 bg-white border border-secondary-200 rounded-xl animate-pulse" />
               </div>
            </div>
         </div>
      );
   }

   if (!task) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <AlertCircle className="w-16 h-16 text-secondary-400 mx-auto mb-4" />
               <h1 className="text-2xl font-bold text-secondary-900 mb-2">Task not found</h1>
               <p className="text-secondary-600 mb-6">
                  The task you&apos;re looking for doesn&apos;t exist or has been removed.
               </p>
               <Button onClick={() => router.push("/tasks")}>Browse all tasks</Button>
            </div>
         </div>
      );
   }

   const handleShare = async () => {
      const url = window.location.href;
      if (navigator.share) {
         try {
            await navigator.share({
               title: task?.title || "Task on ExtraHand",
               text: `Check out this task on ExtraHand: ${task?.title}`,
               url,
            });
         } catch {
            // User cancelled
         }
      } else {
         setShareOpen(true);
      }
   };

   const handleMakeOffer = () => {
      if (!currentUser) {
         router.push(`/login?next=${encodeURIComponent(`/tasks/${taskId}`)}`);
         return;
      }
      if (isOwner) {
         toast.info("This is your task", {
            description: "You can't make an offer on your own task.",
         });
         return;
      }
      if (hasApplied) {
         toast.info("Already applied", {
            description: "You have already submitted an offer for this task.",
         });
         // Scroll to offers section
         setActiveTab("offers");
         setTimeout(() => {
            document.querySelector('[data-offers-section]')?.scrollIntoView({ 
               behavior: 'smooth', 
               block: 'start' 
            });
         }, 100);
         return;
      }
      setShowMakeOfferModal(true);
   };

   return (
      <div className="min-h-screen bg-linear-to-b from-secondary-50 to-white pb-24 md:pb-0">
         <div className="bg-white/80 backdrop-blur-sm border-b border-secondary-100">
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
               <button
                  onClick={() => router.back()}
                  className="flex items-center text-secondary-500 hover:text-secondary-900 transition-colors"
               >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  <span className="text-sm font-medium">Back</span>
               </button>
               <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-3 py-1.5 text-secondary-500 hover:text-secondary-900 hover:bg-secondary-100 rounded-lg transition-colors"
               >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium hidden md:inline">Share</span>
               </button>
            </div>
         </div>

         <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 lg:py-6">
            <TaskDetailsHeader
               task={task}
               showMobileCTA={isMobile}
               onMakeOffer={handleMakeOffer}
               hasApplied={hasApplied}
               checkingApplication={checkingApplication}
               isSubmittingOffer={isSubmittingOffer}
               isOwner={isOwner}
            />
         </div>

         <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 lg:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
               <div className="lg:col-span-2 space-y-6">
                  <TaskDetailsMain task={task} />

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
                           Offers ({applicationCount})
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
                     <div>
                        {activeTab === "offers" ? (
                           <TaskOffersSection
                              taskId={taskId}
                              isOwner={isOwner}
                              userProfile={userProfile}
                              onMakeOffer={handleMakeOffer}
                              taskCategory={task?.category}
                              hasApplied={hasApplied}
                              checkingApplication={checkingApplication}
                              onHasAppliedChange={() => {}}
                              onApplicationsCountChange={() => {}}
                           />
                        ) : (
                           <TaskQuestionsSection taskId={taskId} isOwner={isOwner} />
                        )}
                     </div>
                  </div>
               </div>
               <div className="hidden lg:block">
                  <TaskDetailsSidebar
                     task={task}
                     isOwner={isOwner}
                     onMakeOffer={handleMakeOffer}
                     hasApplied={hasApplied}
                     isSubmittingOffer={isSubmittingOffer}
                  />
               </div>
            </div>
         </div>

         {showFixedCTA && task && task.status === "open" && !isOwner && (
            <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-white border-t border-secondary-200 shadow-xl animate-in slide-in-from-bottom-0 duration-300">
               <div className="max-w-7xl mx-auto px-4 py-3">
                  <Button
                     onClick={handleMakeOffer}
                     disabled={hasApplied || isSubmittingOffer}
                     className="w-full bg-primary-600 hover:bg-primary-700 text-white h-10 font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {isSubmittingOffer ? (
                        <>
                           <LoadingSpinner className="w-4 h-4" />
                           <span>Submitting...</span>
                        </>
                     ) : hasApplied ? (
                        "Already Applied"
                     ) : (
                        <>
                           Make an Offer
                           <ArrowRight className="w-4 h-4" />
                        </>
                     )}
                  </Button>
               </div>
            </div>
         )}

         {task && (
            <MakeOfferModal
               task={task}
               open={showMakeOfferModal}
               onOpenChange={setShowMakeOfferModal}
               onSubmittingChange={setIsSubmittingOffer}
               onSuccess={async () => {
                  // Refetch applications immediately to show the new offer
                  await queryClient.invalidateQueries({ 
                     queryKey: taskDetailsQueryKeys.applications(taskId) 
                  });
                  // Wait a brief moment for the UI to update
                  await new Promise(resolve => setTimeout(resolve, 300));
                  setIsSubmittingOffer(false);
                  setShowMakeOfferModal(false);
               }}
            />
         )}

         {task && (
            <ShareModal
               isOpen={shareOpen}
               onClose={() => setShareOpen(false)}
               title="Task"
               description={task.title}
               url={typeof window !== "undefined" ? window.location.href : ""}
               shareText={`Check out this task: "${task.title}" on ExtraHand!`}
            />
         )}
      </div>
   );
}
