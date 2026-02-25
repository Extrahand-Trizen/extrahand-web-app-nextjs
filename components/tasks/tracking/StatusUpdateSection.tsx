"use client";

/**
 * StatusUpdateSection - Role-based status update controls
 * Shows available actions based on user role and current task status
 */

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
   Loader2,
   CheckCircle2,
   XCircle,
   RotateCcw,
   AlertTriangle,
   MessageCircle,
} from "lucide-react";
import type { Task } from "@/types/task";
import type { UserRole } from "@/types/tracking";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface StatusUpdateSectionProps {
   task: Task;
   userRole: UserRole;
   chatId?: string | null;
   onStatusUpdate: (
      newStatus: Task["status"],
      reason?: string
   ) => Promise<void>;
}

export function StatusUpdateSection({
   task,
   userRole,
   chatId,
   onStatusUpdate,
}: StatusUpdateSectionProps) {
   const router = useRouter();
   const [isUpdating, setIsUpdating] = useState(false);
   const [cancelReason, setCancelReason] = useState("");

   const getAvailableActions = () => {
      const actions: Array<{
         status: Task["status"];
         label: string;
         description: string;
         icon: React.ReactNode;
         variant: "default" | "destructive" | "outline";
         requiresConfirmation: boolean;
         requiresReason?: boolean;
         isMessageAction?: boolean;
      }> = [];

      if (userRole === "viewer") return actions;

      // Add Message button for both poster and tasker (not viewers)
      if (chatId && (userRole === "poster" || userRole === "tasker")) {
         actions.push({
            status: task.status, // Keep current status (this action doesn't change status)
            label: "Message",
            description: "Open chat to communicate with the other participant",
            icon: <MessageCircle className="w-4 h-4" />,
            variant: "outline",
            requiresConfirmation: false,
            isMessageAction: true,
         });
      }

      // Tasker actions
      if (userRole === "tasker") {
         switch (task.status) {
            case "assigned":
               actions.push({
                  status: "started",
                  label: "Start Task",
                  description: "Mark that you've begun working on this task",
                  icon: <CheckCircle2 className="w-4 h-4" />,
                  variant: "default",
                  requiresConfirmation: true,
               });
               break;
            case "started":
               actions.push({
                  status: "in_progress",
                  label: "Mark In Progress",
                  description: "Continue working on the task",
                  icon: <RotateCcw className="w-4 h-4" />,
                  variant: "default",
                  requiresConfirmation: false,
               });
               break;
            case "in_progress":
               actions.push({
                  status: "review",
                  label: "Submit for Review",
                  description: "Mark task as complete and request approval",
                  icon: <CheckCircle2 className="w-4 h-4" />,
                  variant: "default",
                  requiresConfirmation: true,
               });
               break;
            case "review":
               actions.push({
                  status: "in_progress",
                  label: "Make Changes",
                  description: "Continue working based on feedback",
                  icon: <RotateCcw className="w-4 h-4" />,
                  variant: "outline",
                  requiresConfirmation: false,
               });
               break;
         }
      }

      // Poster actions
      if (userRole === "poster") {
         switch (task.status) {
            case "assigned":
            case "started":
            case "in_progress":
               actions.push({
                  status: "cancelled",
                  label: "Cancel Task",
                  description: "Cancel this task (may require reason)",
                  icon: <XCircle className="w-4 h-4" />,
                  variant: "destructive",
                  requiresConfirmation: true,
                  requiresReason: true,
               });
               break;
            case "review":
               actions.push(
                  {
                     status: "completed",
                     label: "Approve & Complete",
                     description: "Approve the work and mark task as completed",
                     icon: <CheckCircle2 className="w-4 h-4" />,
                     variant: "default",
                     requiresConfirmation: true,
                  },
                  {
                     status: "in_progress",
                     label: "Request Changes",
                     description: "Send task back for revisions",
                     icon: <AlertTriangle className="w-4 h-4" />,
                     variant: "outline",
                     requiresConfirmation: true,
                  }
               );
               break;
         }
      }

      return actions;
   };

   const availableActions = getAvailableActions();

   if (availableActions.length === 0) {
      return null;
   }

   const handleStatusUpdate = async (
      newStatus: Task["status"],
      reason?: string
   ) => {
      setIsUpdating(true);
      try {
         await onStatusUpdate(newStatus, reason);
         toast.success(`Task status updated to ${newStatus?.replace("_", " ") || "unknown"}`);
         setCancelReason("");
      } catch (error) {
         toast.error("Failed to update task status");
         console.error(error);
      } finally {
         setIsUpdating(false);
      }
   };

   return (
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4 md:p-6">
         <h2 className="text-base md:text-lg font-semibold md:font-bold text-secondary-900 mb-3 md:mb-4">
            Available Actions
         </h2>
         <div className="space-y-2 md:space-y-3">
            {availableActions.map((action) => {
               if (action.requiresConfirmation) {
                  return (
                     <AlertDialog key={action.status}>
                        <AlertDialogTrigger asChild>
                           <Button
                              variant={
                                 action.variant === "default"
                                    ? "outline"
                                    : action.variant
                              }
                              className="w-full justify-start gap-2 text-sm md:text-base font-medium md:font-semibold"
                              disabled={isUpdating}
                           >
                              {action.icon}
                              {action.label}
                           </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                           <AlertDialogHeader>
                              <AlertDialogTitle>
                                 {action.label}
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                 {action.description}
                            </AlertDialogDescription>
                         </AlertDialogHeader>
                         {action.requiresReason && (
                            <div className="space-y-2">
                               <Label htmlFor="cancel-reason">
                                  Reason for cancellation
                               </Label>
                               <Textarea
                                  id="cancel-reason"
                                  placeholder="Please provide a reason..."
                                  value={cancelReason}
                                  onChange={(e) =>
                                     setCancelReason(e.target.value)
                                  }
                                  rows={3}
                               />
                            </div>
                         )}
                           <AlertDialogFooter>
                              <AlertDialogCancel
                                 onClick={() => setCancelReason("")}
                              >
                                 Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                 onClick={() =>
                                    handleStatusUpdate(
                                       action.status,
                                       action.requiresReason
                                          ? cancelReason
                                          : undefined
                                    )
                                 }
                                 disabled={
                                    action.requiresReason &&
                                    !cancelReason.trim()
                                 }
                              >
                                 {isUpdating ? (
                                    <>
                                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                       Updating...
                                    </>
                                 ) : (
                                    "Confirm"
                                 )}
                              </AlertDialogAction>
                           </AlertDialogFooter>
                        </AlertDialogContent>
                     </AlertDialog>
                  );
               }

               return (
                  <Button
                     key={action.status}
                     variant={
                        action.variant === "default"
                           ? "outline"
                           : action.variant
                     }
                     className="w-full justify-start gap-2 text-sm md:text-base font-medium md:font-semibold"
                     onClick={() => {
                        if (action.isMessageAction) {
                           // Navigate to chat page
                           router.push(`/chat?chatId=${chatId}&taskId=${task._id}`);
                        } else {
                           handleStatusUpdate(action.status);
                        }
                     }}
                     disabled={isUpdating}
                  >
                     {isUpdating && !action.isMessageAction ? (
                        <>
                           <Loader2 className="w-4 h-4 animate-spin" />
                           Updating...
                        </>
                     ) : (
                        <>
                           {action.icon}
                           {action.label}
                        </>
                     )}
                  </Button>
               );
            })}
         </div>
      </div>
   );
}
