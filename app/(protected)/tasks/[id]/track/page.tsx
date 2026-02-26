"use client";

/**
 * Task Tracking Page - Single source of truth for task tracking
 * Shows task progress, status updates, proof of work, and related features
 * Role-based views for poster and tasker
 */

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/context";
import {
   TaskTrackingHeader,
   TaskStatusTimeline,
   TaskDetailsCard,
   StatusUpdateSection,
   ReviewSection,
   FloatingChatWidget,
   ReportForm,
   ProofUploadSection
} from "@/components/tasks/tracking";
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
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { reviewsApi } from "@/lib/api/endpoints/reviews";
import { chatsApi } from "@/lib/api/endpoints/chats";
import { toast } from "sonner";
import { reportsApi } from "@/lib/api/endpoints/reports";
import { completionApi } from "@/lib/api/endpoints/completion";
import { useChatSocket } from "@/lib/socket/hooks/useChatSocket";
import { useTaskSocket } from "@/lib/socket/hooks/useTaskSocket";
import { useUserStore } from "@/lib/state/userStore";

export default function TaskTrackingPage() {
   const router = useRouter();
   const params = useParams();
   const { currentUser, loading: authLoading } = useAuth();
   const taskId = params.id as string;

   const [task, setTask] = useState<Task | null>(null);
   const [reviews, setReviews] = useState<Review[]>([]);
   const [existingReport, setExistingReport] = useState<
      TaskReportSubmission | undefined
   >();
   const [showReportModal, setShowReportModal] = useState(false);
   const [isLoading, setIsLoading] = useState(true);
   const [activeTab, setActiveTab] = useState("overview");
   const [chatMessages, setChatMessages] = useState<Message[]>([]);
   const [isLoadingChat, setIsLoadingChat] = useState(false);
   const [chatId, setChatId] = useState<string | null>(null);
   const [chatError, setChatError] = useState<string | null>(null);
   
   // Get user profile from store (contains MongoDB _id)
   const userProfile = useUserStore((state) => state.user);

   // Determine user role automatically based on task relationship
   // Uses profile _id (MongoDB ObjectId) for comparison since backend uses ObjectIds
   const userRole: UserRole = useMemo(() => {
      if (!task || !userProfile?._id) return "viewer";
      
      const userProfileId = userProfile._id;
      
      // Debug logging
      console.log("🔍 Role Detection Debug:");
      console.log("  User Profile _id:", userProfileId);
      console.log("  Task requesterId:", task.requesterId);
      console.log("  Task assigneeId:", (task as any).assigneeId);
      
      // Check if user is the poster (task creator) - compare MongoDB ObjectIds
      if (task.requesterId === userProfileId) {
         console.log("✅ Role: POSTER");
         return "poster";
      }
      
      // Check if user is the tasker (task assignee) - compare MongoDB ObjectIds
      const taskAssigneeId = (task as any).assigneeId;
      if (taskAssigneeId && taskAssigneeId === userProfileId) {
         console.log("✅ Role: TASKER");
         return "tasker";
      }
      
      console.log("ℹ️ Role: VIEWER");
      return "viewer";
   }, [task, userProfile]);

   // Fetch task data from API
   useEffect(() => {
      const fetchTask = async () => {
         setIsLoading(true);
         try {
            // Import the tasks API dynamically to avoid circular dependencies
            
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

   // Fetch reviews for the task - only when user is involved (poster or tasker)
   useEffect(() => {
      const fetchReviews = async () => {
         if (!taskId || !task) return;
         
         // Only fetch reviews if user is involved in the task
         // Viewers shouldn't call this API as they'll get a 403
         if (userRole === "viewer") {
            console.log("⏭️ Skipping review fetch - user is a viewer");
            setReviews([]);
            return;
         }
         
         try {
            const review = await reviewsApi.getTaskReview(taskId);
            
            console.log("📋 Reviews API response:", review);
            
            // Backend returns a single review or null
            // Only add to state if it's a valid review object with an _id
            if (review && typeof review === 'object' && '_id' in review) {
               setReviews([review as unknown as Review]);
            } else {
               // No reviews or invalid response - keep empty array
               setReviews([]);
            }
         } catch (error) {
            console.error("Failed to fetch reviews:", error);
            // Silently fail - reviews will be empty
            setReviews([]);
         }
      };

      fetchReviews();
   }, [taskId, task, userRole]);

   // Handle status update
   const handleStatusUpdate = async (
      newStatus: Task["status"],
      reason?: string
   ) => {
      if (!task) return;

      try {
         
         // Update task status via API
         const updatedTask = await tasksApi.updateTaskStatus(task._id, newStatus, reason);
         
         console.log("✅ Task status updated successfully:", updatedTask);
         
         // Update local state with response from server
         setTask(updatedTask);
      } catch (error) {
         console.error("❌ Failed to update task status:", error);
         // TODO: Show error toast to user
         throw error; // Re-throw so StatusUpdateSection can handle the error
      }
   };

   // Handle submit completion proof
   const handleSubmitProof = async (proofUrls: string[], notes?: string) => {
      if (!task) return;

      try {
         
         const updatedTask = await completionApi.submitCompletionProof(task._id, {
            proofUrls,
            notes,
         });
         
         console.log("✅ Completion proof submitted:", updatedTask);
         console.log("📸 completionProof in response:", updatedTask?.completionProof);
         setTask(updatedTask);
         toast.success("Completion proof submitted for review!");
         
         // Refetch task to ensure we have latest data
         const refreshedTask = await tasksApi.getTask(task._id);
         const taskData = (refreshedTask as any)?.data || refreshedTask;
         console.log("🔄 Refreshed task:", taskData);
         console.log("📸 completionProof in refreshed task:", taskData?.completionProof);
         if (taskData) {
            setTask(taskData as Task);
         }
      } catch (error) {
         console.error("❌ Failed to submit proof:", error);
         toast.error("Failed to submit completion proof");
         throw error;
      }
   };

   // Handle approve completion (poster only)
   const handleApproveCompletion = async () => {
      if (!task) return;

      try {
         
         const updatedTask = await completionApi.approveCompletion(task._id);
         
         console.log("✅ Completion approved:", updatedTask);
         setTask(updatedTask);
         toast.success("Work approved! Task completed.");
      } catch (error) {
         console.error("❌ Failed to approve completion:", error);
         toast.error("Failed to approve completion");
         throw error;
      }
   };

   // Handle reject completion (poster only)
   const handleRejectCompletion = async (reason: string) => {
      if (!task) return;

      try {
         
         const updatedTask = await completionApi.rejectCompletion(task._id, reason);
         
         console.log("✅ Completion rejected:", updatedTask);
         setTask(updatedTask);
         toast.success("Work sent back for revisions");
      } catch (error) {
         console.error("❌ Failed to reject completion:", error);
         toast.error("Failed to reject completion");
         throw error;
      }
   };

   // Load chat - Start or get existing chat for this task
   useEffect(() => {
      if (!task || userRole === "viewer") return;

      // Prevent duplicate requests during React strict mode or rapid re-renders
      let isActive = true;

      const loadChat = async () => {
         // Skip if already loading or a previous request is still active
         if (!isActive) return;

         setIsLoadingChat(true);
         setChatError(null);
         
         try {
            // Start or get existing chat for this task
            const response = await chatsApi.startChatForTask(task._id);
            
            // Check if component is still mounted and this request is still active
            if (!isActive) return;
            
            const chat = response.chat;
            
            if (chat) {
               setChatId(chat.chatId);
               
               // Fetch messages for this chat
               const messagesResponse = await chatsApi.getChatMessages(chat.chatId);
               
               // Check again if still active
               if (!isActive) return;
               
               const messages = messagesResponse.messages || [];
               
               // Map messages to the expected format with safe date parsing
               const formattedMessages: Message[] = messages.map((msg: any) => {
                  // Safe date parsing - fallback to current date if invalid
                  let parsedDate = new Date();
                  if (msg.createdAt) {
                     const tempDate = new Date(msg.createdAt);
                     if (!isNaN(tempDate.getTime())) {
                        parsedDate = tempDate;
                     }
                  }
                  
                  return {
                     _id: msg._id,
                     chatId: msg.chatId,
                     taskId: task._id,
                     text: msg.text || "",
                     senderId: msg.senderId,
                     senderName: msg.sender?.name || "User",
                     type: msg.type || "text",
                     status: msg.status || "read",
                     createdAt: parsedDate,
                     readBy: msg.readBy || [],
                  };
               });
               
               setChatMessages(formattedMessages);
            }
         } catch (error: any) {
            console.error("Failed to load chat:", error);
            if (isActive) {
               const errorMessage = error?.message || "Failed to load chat";
               setChatError(errorMessage);
            }
         } finally {
            if (isActive) {
               setIsLoadingChat(false);
            }
         }
      };

      loadChat();

      // Cleanup function to prevent state updates after unmount
      return () => {
         isActive = false;
      };
   }, [task, userRole]);

   // Real-time chat: Listen for new messages via Socket.IO
   const handleNewSocketMessage = useCallback((message: Message) => {
      // Only add if it's from the other user (our own messages are added optimistically)
      if (message.senderId !== userProfile?._id) {
         setChatMessages((prev) => {
            // Check if message already exists to avoid duplicates
            if (prev.some((m) => m._id === message._id)) {
               return prev;
            }
            return [...prev, message];
         });
      }
   }, [userProfile]);

   // Initialize Socket.IO for real-time chat
   useChatSocket({
      chatId,
      onNewMessage: handleNewSocketMessage,
   });

   // Real-time task updates: Listen for task status changes via Socket.IO
   const handleTaskStatusChanged = useCallback((updatedTask: any) => {
      console.log("📨 Real-time task status update:", updatedTask);
      setTask(updatedTask as Task);
      toast.success(`Task status updated to ${updatedTask.status}`);
   }, []);

   const handleProofSubmitted = useCallback((updatedTask: any) => {
      console.log("📸 Real-time proof submission:", updatedTask);
      setTask(updatedTask as Task);
      toast.info("Completion proof has been submitted for review");
   }, []);

   const handleProofApproved = useCallback((updatedTask: any) => {
      console.log("✅ Real-time proof approval:", updatedTask);
      setTask(updatedTask as Task);
      toast.success("Completion proof has been approved!");
   }, []);

   const handleProofRejected = useCallback((data: any) => {
      console.log("❌ Real-time proof rejection:", data);
      if (data.task) {
         setTask(data.task as Task);
      }
      toast.error(`Proof rejected: ${data.reason || "Please revise and resubmit"}`);
   }, []);

   // Initialize Socket.IO for real-time task updates
   useTaskSocket({
      taskId: task?._id || null,
      onStatusChanged: handleTaskStatusChanged,
      onProofSubmitted: handleProofSubmitted,
      onProofApproved: handleProofApproved,
      onProofRejected: handleProofRejected,
   });

   // Handle send message
   const handleSendMessage = async (text: string) => {
      if (!task || !chatId) return;

      try {
         // Send message via API
         const newMessage = await chatsApi.sendMessage(chatId, text);
         
         // Add message to local state immediately (optimistic update)
         const formattedMessage: Message = {
            _id: newMessage._id,
            chatId: newMessage.chatId,
            taskId: task._id,
            text: newMessage.text,
            senderId: newMessage.senderId,
            senderName: "You",
            type: newMessage.type || "text",
            status: newMessage.status || "sent",
            createdAt: new Date(newMessage.createdAt),
            readBy: [],
         };

         setChatMessages([...chatMessages, formattedMessage]);
      } catch (error) {
         console.error("Failed to send message:", error);
         toast.error("Failed to send message");
      }
   };

   // Handle create review
   const handleCreateReview = async (data: {
      rating: number;
      title?: string;
      comment?: string;
      ratings?: ReviewRatings;
   }) => {
      if (!task || !reviewedUserId) return;

      try {
         
         const newReview = await reviewsApi.createReview({
            taskId: task._id,
            rating: data.rating,
            title: data.title,
            comment: data.comment,
            ratings: data.ratings,
         });

         console.log("✅ Review created successfully:", newReview);
         
         // Add review to local state
         setReviews([...reviews, newReview as unknown as Review]);
      } catch (error) {
         console.error("❌ Failed to create review:", error);
         // TODO: Show error toast to user
         throw error; // Re-throw so ReviewSection can handle the error
      }
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

      try {
         
         const newReport = await reportsApi.submitReport(task._id, {
            reason: data.reason as ReportReason,
            description: data.description,
         });

         console.log("✅ Report submitted successfully:", newReport);
         
         // Update local state
         setExistingReport(newReport as unknown as TaskReportSubmission);
         setShowReportModal(false);
      } catch (error) {
         console.error("❌ Failed to submit report:", error);
         // TODO: Show error toast to user
         throw error; // Re-throw so ReportForm can handle the error
      }
   };

   // Determine if user can review (production-ready)
   // Only poster can review tasker - tasker cannot review themselves
   const canReview = useMemo(() => {
      if (!task || userRole !== "poster") return false; // Only poster can review

      // Get the assignee ID from the task (use assigneeId which is MongoDB ObjectId)
      const assigneeId = (task as any).assigneeId;

      // Must have a tasker to review
      if (!assigneeId) return false;

      // Check if poster has already reviewed (using assigneeId for comparison)
      const hasReviewed = reviews.some(
         (r) => r.reviewedUid === assigneeId
      );

      if (hasReviewed) return false; // Already reviewed

      // Production: Only allow reviews when task is completed or in review status
      return task.status === "completed" || task.status === "review";
   }, [task, userRole, reviews]);

   // Get reviewed user info (only for poster reviewing tasker)
   // Use assigneeId and assigneeName which are populated by API Gateway
   const reviewedUserId =
      task && userRole === "poster"
         ? (task as any).assigneeId
         : undefined;

   const reviewedUserName =
      task && userRole === "poster"
         ? (task as any).assigneeName || "Tasker"
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
                        {/* Completion Proof Upload */}
                        <ProofUploadSection
                           task={task}
                           onSubmitProof={handleSubmitProof}
                           userRole={userRole}
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
                              {task.status?.replace("_", " ").toUpperCase()}
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
         {userRole !== "viewer" && !chatError && (
            <FloatingChatWidget
               taskId={task._id}
               otherUserId={
                  userRole === "poster"
                     ? (task as any).assigneeId || ""
                     : task.requesterId || ""
               }
               otherUserName={
                  userRole === "poster"
                     ? (task as any).assigneeName || "Tasker"
                     : task.requesterName || "Task Owner"
               }
               currentUserId={userProfile?._id || ""}
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
                                 {existingReport.reason?.replace("_", " ") || "N/A"}
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