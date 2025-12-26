"use client";

/**
 * Task Tracking Page - Single source of truth for task tracking
 * Shows task progress, status updates, proof of work, and related features
 * Role-based views for poster and tasker
 */

import React, { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context";
import {
   TaskTrackingHeader,
   TaskStatusTimeline,
   TaskDetailsCard,
   StatusUpdateSection,
   ProofOfWorkSection,
   ReviewSection,
   ReportForm,
} from "@/components/tasks/tracking";
import { FloatingChatWidget } from "@/components/tasks/tracking/FloatingChatWidget";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import type { Task } from "@/types/task";
import type {
   UserRole,
   ProofOfWork,
   Review,
   TaskReportSubmission,
   ReviewRatings,
   ReportReason,
} from "@/types/tracking";
import type { Message } from "@/types/chat";
import { mockTasksData } from "@/lib/data/mockTasks";

// Mock proof of work data
const mockProofs: ProofOfWork[] = [
   {
      _id: "proof1",
      taskId: "1",
      uploadedBy: "performer1",
      uploadedByName: "Rajesh Kumar",
      files: [
         {
            url: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
            filename: "work-progress-1.jpg",
            type: "image/jpeg",
            size: 245000,
         },
         {
            url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
            filename: "work-progress-2.jpg",
            type: "image/jpeg",
            size: 312000,
         },
      ],
      caption:
         "Initial cleaning started. Applied eco-friendly cleaning solution.",
      uploadedAt: new Date(Date.now() - 3600000),
   },
];

export default function TaskTrackingPage() {
   const router = useRouter();
   const params = useParams();
   const { currentUser, loading: authLoading } = useAuth();
   const taskId = params.id as string;

   const [task, setTask] = useState<Task | null>(null);
   const [proofs, setProofs] = useState<ProofOfWork[]>(mockProofs);
   const [reviews, setReviews] = useState<Review[]>([]);
   const [existingReport, setExistingReport] = useState<
      TaskReportSubmission | undefined
   >();
   const [showReportModal, setShowReportModal] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [activeTab, setActiveTab] = useState("overview");
   const [overrideRole, setOverrideRole] = useState<UserRole | null>(null);
   const [chatMessages, setChatMessages] = useState<Message[]>([]);
   const [isLoadingChat, setIsLoadingChat] = useState(false);

   // Determine user role (with override for testing)
   const computedRole: UserRole = useMemo(() => {
      if (!task || !currentUser) return "viewer";
      if (task.creatorUid === currentUser.uid) return "poster";
      if (task.assigneeUid === currentUser.uid) return "tasker";
      return "viewer";
   }, [task, currentUser]);

   // Use override role if set, otherwise use computed role
   const userRole: UserRole = overrideRole || computedRole;

   // Fetch task data from API
   useEffect(() => {
      const fetchTask = async () => {
         setIsLoading(true);
         try {
            // Import the tasks API dynamically to avoid circular dependencies
            const { tasksApi } = await import("@/lib/api/endpoints/tasks");
            
            // Fetch real task data
            const response = await tasksApi.getTask(taskId);
            
            console.log("✅ Task details response:", response);
            
            // Handle different response structures
            const taskData = (response as any)?.data || response;
            
            if (taskData) {
               setTask(taskData as Task);
            }
         } catch (error) {
            console.error("❌ Failed to fetch task:", error);
            // Task not found or error - will show "Task not found" UI
         } finally {
            setIsLoading(false);
         }
      };

      if (taskId) {
         fetchTask();
      }
   }, [taskId]);

   // Handle status update
   const handleStatusUpdate = async (
      newStatus: Task["status"],
      reason?: string
   ) => {
      if (!task) return;

      // TODO: Replace with actual API call
      // await api.updateTaskStatus(task._id, { status: newStatus, reason });

      // Mock: Update local state
      setTask({
         ...task,
         status: newStatus,
         ...(reason && { cancellationReason: reason }),
         updatedAt: new Date(),
      });
   };

   // Handle proof upload
   const handleProofUpload = async (
      proofData: Omit<ProofOfWork, "_id" | "uploadedAt">
   ) => {
      // TODO: Replace with actual API call
      // const newProof = await api.uploadProofOfWork(proofData);

      // Mock: Add to local state
      const newProof: ProofOfWork = {
         ...proofData,
         _id: `proof-${Date.now()}`,
         uploadedAt: new Date(),
      };

      setProofs([...proofs, newProof]);
   };

   // Load chat messages - Same conversation, but perspective flips based on role
   useEffect(() => {
      if (!task) return;

      const loadChat = async () => {
         setIsLoadingChat(true);
         // TODO: Replace with actual API call
         // const chat = await api.getChatByTaskId(task._id);
         // const messages = await api.getChatMessages(chat.chatId);

         // Fixed conversation - same messages, but sender flips based on role
         const taskerUserId = task.assigneeUid || "mock_tasker_123";
         const taskerUserName = task.assignedToName || "Tasker";
         const posterUserId = task.creatorUid || "mock_poster_123";
         const posterUserName = task.requesterName || "Task Owner";
         const currentUserId = currentUser?.uid || "current_user";

         // Base conversation structure - same messages regardless of role
         const baseConversation: Array<{
            _id: string;
            text: string;
            fromTasker: boolean; // true = originally from tasker, false = from poster
            createdAt: number;
         }> = [
            {
               _id: "msg1",
               text: "Hello! I'm ready to start working on this task.",
               fromTasker: true, // Tasker says this
               createdAt: Date.now() - 3600000,
            },
            {
               _id: "msg2",
               text: "Great! Let me know if you have any questions.",
               fromTasker: false, // Poster says this
               createdAt: Date.now() - 3300000,
            },
            {
               _id: "msg3",
               text: "I'll keep you updated on the progress.",
               fromTasker: true, // Tasker says this
               createdAt: Date.now() - 1800000,
            },
            {
               _id: "msg4",
               text: "Perfect! Looking forward to seeing the results.",
               fromTasker: false, // Poster says this
               createdAt: Date.now() - 900000,
            },
         ];

         // Map messages - flip perspective based on current role
         const mockMessages: Message[] = baseConversation.map((baseMsg) => {
            // Determine if this message is from current user based on role
            // If viewing as poster: poster messages = "You", tasker messages = "other"
            // If viewing as tasker: tasker messages = "You", poster messages = "other"
            const isFromCurrentUser =
               (userRole === "poster" && !baseMsg.fromTasker) ||
               (userRole === "tasker" && baseMsg.fromTasker);

            return {
               _id: baseMsg._id,
               chatId: `task_${task._id}_chat`,
               taskId: task._id,
               text: baseMsg.text,
               senderId: isFromCurrentUser
                  ? currentUserId
                  : baseMsg.fromTasker
                  ? taskerUserId
                  : posterUserId,
               senderName: isFromCurrentUser
                  ? "You"
                  : baseMsg.fromTasker
                  ? taskerUserName
                  : posterUserName,
               type: "text",
               status: "read",
               createdAt: new Date(baseMsg.createdAt),
               readBy: [],
            };
         });

         setChatMessages(mockMessages);
         setIsLoadingChat(false);
      };

      loadChat();
   }, [task, userRole, currentUser]);

   // Handle send message
   const handleSendMessage = async (text: string) => {
      if (!task) return;

      // TODO: Replace with actual API call
      // await api.sendMessage(chatId, text);

      // Mock: Add message to local state
      const newMessage: Message = {
         _id: `msg_${Date.now()}`,
         chatId: `task_${task._id}_chat`,
         taskId: task._id,
         text,
         senderId: currentUser?.uid || "current_user",
         senderName: "You",
         type: "text",
         status: "sent",
         createdAt: new Date(),
         readBy: [],
      };

      setChatMessages([...chatMessages, newMessage]);
   };

   // Handle create review
   const handleCreateReview = async (data: {
      rating: number;
      title?: string;
      comment?: string;
      ratings?: ReviewRatings;
   }) => {
      if (!task || !reviewedUserId) return;

      // For mock data: use currentUser if available, otherwise use mock ID
      const reviewerUid =
         currentUser?.uid ||
         (userRole === "poster" ? task.creatorUid : task.assigneeUid) ||
         "mock_user";

      // TODO: Replace with actual API call
      // await api.createReview({
      //    taskId: task._id,
      //    reviewedUid: reviewedUserId,
      //    ...data
      // });

      // Mock: Add review to local state
      const now = new Date();
      const timestamp = now.getTime();
      const reviewId = `review_${task._id}_${reviewerUid}_${timestamp}`;
      const newReview: Review = {
         _id: reviewId,
         taskId: task._id,
         reviewerUid,
         reviewedUid: reviewedUserId,
         reviewerName: "You",
         rating: data.rating,
         title: data.title,
         comment: data.comment,
         ratings: data.ratings,
         isPublic: true,
         isVerified: false,
         helpful: 0,
         notHelpful: 0,
         createdAt: now,
         updatedAt: now,
      };

      setReviews([...reviews, newReview]);
   };

   // Handle helpful vote
   const handleHelpful = async (reviewId: string, helpful: boolean) => {
      // TODO: Replace with actual API call
      // await api.voteHelpful(reviewId, helpful);

      // Mock: Update review in local state
      setReviews(
         reviews.map((r) =>
            r._id === reviewId
               ? {
                    ...r,
                    helpful: helpful ? r.helpful + 1 : r.helpful,
                    notHelpful: !helpful ? r.notHelpful + 1 : r.notHelpful,
                 }
               : r
         )
      );
   };

   // Handle submit report
   const handleSubmitReport = async (data: {
      reason: string;
      description?: string;
   }) => {
      if (!task || !currentUser) return;

      // TODO: Replace with actual API call
      // await api.submitReport({ taskId: task._id, userId: currentUser.uid, ...data });

      // Mock: Add report to local state
      const newReport: TaskReportSubmission = {
         _id: `report_${Date.now()}`,
         userId: currentUser.uid,
         taskId: task._id,
         reason: data.reason as ReportReason,
         description: data.description,
         status: "pending",
         createdAt: new Date(),
         updatedAt: new Date(),
      };

      setExistingReport(newReport);
      setShowReportModal(false);
   };

   // Determine if user can review (production-ready)
   // Only poster can review tasker - tasker cannot review themselves
   const canReview = useMemo(() => {
      if (!task || userRole !== "poster") return false; // Only poster can review

      // For mock data testing: allow reviews even without currentUser
      // In production, this should require: if (!currentUser) return false;
      const mockUserId = currentUser?.uid || task.creatorUid || "mock_user";

      // Poster reviews the tasker
      const reviewedUid = task.assigneeUid;

      // Must have a tasker to review
      if (!reviewedUid) return false;

      // Check if poster has already reviewed
      const hasReviewed = reviews.some(
         (r) => r.reviewerUid === mockUserId && r.reviewedUid === reviewedUid
      );

      if (hasReviewed) return false; // Already reviewed

      // Production: Only allow reviews when task is completed or in review status
      return task.status === "completed" || task.status === "review";
   }, [task, currentUser, userRole, reviews]);

   // Get reviewed user info (only for poster reviewing tasker)
   const reviewedUserId =
      task && userRole === "poster"
         ? task.assigneeUid || "mock_tasker_123"
         : undefined;

   const reviewedUserName =
      task && userRole === "poster"
         ? task.assignedToName || "Tasker"
         : undefined;

   if (isLoading || authLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-secondary-50">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
               <p className="text-secondary-600">Loading task details...</p>
            </div>
         </div>
      );
   }

   if (!task) {
      return (
         <div className="min-h-screen flex items-center justify-center bg-secondary-50">
            <div className="text-center max-w-md px-4">
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

   return (
      <div className="min-h-screen bg-secondary-50">
         {/* Temporary Role Switcher - For Testing */}
         <div className="bg-yellow-50 border-b border-yellow-200 px-4 md:px-6 py-2">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
               <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-yellow-800">
                     🧪 Testing Mode:
                  </span>
                  <Select
                     value={overrideRole || "auto"}
                     onValueChange={(value) =>
                        setOverrideRole(
                           value === "auto" ? null : (value as UserRole)
                        )
                     }
                  >
                     <SelectTrigger className="h-7 w-[140px] text-xs border-yellow-300 bg-white">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="auto">
                           Auto ({computedRole})
                        </SelectItem>
                        <SelectItem value="poster">Poster</SelectItem>
                        <SelectItem value="tasker">Tasker</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                     </SelectContent>
                  </Select>
               </div>
               <span className="text-xs text-yellow-700">
                  Current: <strong>{userRole}</strong>
               </span>
            </div>
         </div>

         {/* Header */}
         <TaskTrackingHeader
            task={task}
            userRole={userRole}
            onReportClick={() => setShowReportModal(true)}
         />

         {/* Main Content */}
         <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
               {/* Left Column - Main Content */}
               <div className="lg:col-span-2 space-y-6">
                  {/* Status Timeline */}
                  <TaskStatusTimeline task={task} />

                  {/* Quick Actions - Mobile Only (at top) */}
                  {userRole !== "viewer" && (
                     <div className="lg:hidden space-y-4">
                        <StatusUpdateSection
                           task={task}
                           userRole={userRole}
                           onStatusUpdate={handleStatusUpdate}
                        />
                     </div>
                  )}

                  {/* Tabs */}
                  <Tabs
                     value={activeTab}
                     onValueChange={setActiveTab}
                     className="w-full"
                  >
                     <TabsList className="grid w-full grid-cols-4 mb-6 overflow-x-auto">
                        <TabsTrigger
                           value="overview"
                           className="text-xs md:text-sm"
                        >
                           Overview
                        </TabsTrigger>
                        <TabsTrigger
                           value="proof"
                           className="text-xs md:text-sm"
                        >
                           Proof
                        </TabsTrigger>
                        <TabsTrigger
                           value="reviews"
                           className="text-xs md:text-sm"
                        >
                           Reviews
                        </TabsTrigger>
                        <TabsTrigger
                           value="details"
                           className="text-xs md:text-sm"
                        >
                           Details
                        </TabsTrigger>
                     </TabsList>

                     <TabsContent value="overview" className="space-y-6">
                        {/* Task Details Card */}
                        <TaskDetailsCard task={task} />
                     </TabsContent>

                     <TabsContent value="proof" className="space-y-6">
                        <ProofOfWorkSection
                           taskId={task._id}
                           proofs={proofs}
                           userRole={userRole}
                           onProofUpload={handleProofUpload}
                           currentUserId={currentUser?.uid}
                        />
                     </TabsContent>

                     <TabsContent value="reviews" className="space-y-6">
                        <ReviewSection
                           taskId={task._id}
                           reviews={reviews}
                           userRole={userRole}
                           currentUserId={currentUser?.uid}
                           reviewedUserId={reviewedUserId}
                           reviewedUserName={reviewedUserName}
                           canReview={canReview}
                           onCreateReview={handleCreateReview}
                           onHelpful={handleHelpful}
                        />
                     </TabsContent>

                     <TabsContent value="details" className="space-y-6">
                        <TaskDetailsCard task={task} />
                     </TabsContent>
                  </Tabs>
               </div>

               {/* Right Sidebar - Desktop Only */}
               <div className="hidden lg:block space-y-6">
                  {/* Status Update Section */}
                  {userRole !== "viewer" && (
                     <StatusUpdateSection
                        task={task}
                        userRole={userRole}
                        onStatusUpdate={handleStatusUpdate}
                     />
                  )}

                  {/* Task Summary Card */}
                  <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-6">
                     <h3 className="text-base font-bold text-secondary-900 mb-4">
                        Task Summary
                     </h3>
                     <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                           <span className="text-secondary-600">Status:</span>
                           <span className="font-semibold text-secondary-900">
                              {task.status.replace("_", " ").toUpperCase()}
                           </span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-secondary-600">Created:</span>
                           <span className="font-semibold text-secondary-900">
                              {new Date(task.createdAt).toLocaleDateString()}
                           </span>
                        </div>
                        {task.assignedAt && (
                           <div className="flex justify-between">
                              <span className="text-secondary-600">
                                 Assigned:
                              </span>
                              <span className="font-semibold text-secondary-900">
                                 {new Date(
                                    task.assignedAt
                                 ).toLocaleDateString()}
                              </span>
                           </div>
                        )}
                        {task.completedAt && (
                           <div className="flex justify-between">
                              <span className="text-secondary-600">
                                 Completed:
                              </span>
                              <span className="font-semibold text-secondary-900">
                                 {new Date(
                                    task.completedAt
                                 ).toLocaleDateString()}
                              </span>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            </div>
         </div>

         {/* Floating Chat Widget - Available for poster and tasker */}
         {userRole !== "viewer" && (
            <FloatingChatWidget
               taskId={task._id}
               otherUserId={
                  userRole === "poster"
                     ? task.assigneeUid || "mock_tasker_123"
                     : task.creatorUid || "mock_poster_123"
               }
               otherUserName={
                  userRole === "poster"
                     ? task.assignedToName || "Tasker"
                     : task.requesterName || "Task Owner"
               }
               currentUserId={currentUser?.uid || "current_user"}
               messages={chatMessages}
               onSendMessage={handleSendMessage}
               isLoading={isLoadingChat}
            />
         )}

         {/* Report Modal */}
         <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
            <DialogContent className="max-w-[95vw] md:max-w-2xl max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                  <DialogTitle className="text-base md:text-lg">
                     Report Task
                  </DialogTitle>
               </DialogHeader>
               <div className="mt-4">
                  {existingReport ? (
                     <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                           <p className="text-sm font-semibold text-blue-900 mb-2">
                              Report Already Submitted
                           </p>
                           <div className="space-y-1.5 text-xs md:text-sm text-blue-700">
                              <p>
                                 <span className="font-medium">Status:</span>{" "}
                                 {existingReport.status}
                              </p>
                              <p>
                                 <span className="font-medium">Reason:</span>{" "}
                                 {existingReport.reason.replace("_", " ")}
                              </p>
                              {existingReport.description && (
                                 <p>
                                    <span className="font-medium">
                                       Details:
                                    </span>{" "}
                                    {existingReport.description}
                                 </p>
                              )}
                              {existingReport.reviewedAt && (
                                 <p>
                                    <span className="font-medium">
                                       Reviewed:
                                    </span>{" "}
                                    {new Date(
                                       existingReport.reviewedAt
                                    ).toLocaleDateString()}
                                 </p>
                              )}
                              {existingReport.resolutionNotes && (
                                 <div className="mt-2 pt-2 border-t border-blue-200">
                                    <p className="font-medium mb-1">
                                       Resolution Notes:
                                    </p>
                                    <p>{existingReport.resolutionNotes}</p>
                                 </div>
                              )}
                           </div>
                        </div>
                        {existingReport.status === "pending" && (
                           <ReportForm
                              onSubmit={handleSubmitReport}
                              onCancel={() => setShowReportModal(false)}
                              isSubmitting={false}
                           />
                        )}
                     </div>
                  ) : (
                     <ReportForm
                        onSubmit={handleSubmitReport}
                        onCancel={() => setShowReportModal(false)}
                        isSubmitting={false}
                     />
                  )}
               </div>
            </DialogContent>
         </Dialog>
      </div>
   );
}
