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
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
   Loader2,
   CheckCircle2,
   XCircle,
   RotateCcw,
   AlertTriangle,
} from "lucide-react";
import type { Task } from "@/types/task";
import type { UserRole } from "@/types/tracking";
import { tasksApi } from "@/lib/api/endpoints/tasks";
import { toast } from "sonner";

interface StatusUpdateSectionProps {
   task: Task;
   userRole: UserRole;
   onStatusUpdate: (
      newStatus: Task["status"],
      reason?: string
   ) => Promise<void>;
   onTaskUpdated?: (updatedTask: Task) => void;
}

export function StatusUpdateSection({
   task,
   userRole,
   onStatusUpdate,
   onTaskUpdated,
}: StatusUpdateSectionProps) {
   const [isUpdating, setIsUpdating] = useState(false);
   const [cancelReason, setCancelReason] = useState("");
   const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
   const [otpValue, setOtpValue] = useState("");
   const [otpExpiresAt, setOtpExpiresAt] = useState<string | null>(null);
   const [isSendingOtp, setIsSendingOtp] = useState(false);
   const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
   const [isResendingOtp, setIsResendingOtp] = useState(false);

   const getAvailableActions = () => {
      const actions: Array<{
         status: Task["status"];
         label: string;
         description: string;
         icon: React.ReactNode;
         variant: "default" | "destructive" | "outline";
         requiresConfirmation: boolean;
         requiresReason?: boolean;
         isSpecialAction?: boolean;
         requiresOtp?: boolean;
      }> = [];

      if (userRole === "viewer") return actions;

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
                  requiresOtp: true,
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
                     status: "review",
                     label: "Request Changes",
                     description: "Send task back for revisions",
                     icon: <AlertTriangle className="w-4 h-4" />,
                     variant: "outline",
                     requiresConfirmation: true,
                     requiresReason: true,
                     isSpecialAction: true,
                  }
               );
               break;
         }
      }

      return actions;
   };

   const handleStatusUpdate = async (
      newStatus: Task["status"],
      reason?: string,
      isSpecialAction?: boolean
   ) => {
      setIsUpdating(true);
      try {
         if (isSpecialAction && newStatus === "review") {
            const response = await tasksApi.requestChanges(task._id, reason || "");
            // Update parent with the response which includes reverted status and feedback
            if (response.data && onTaskUpdated) {
               onTaskUpdated(response.data);
            }
            toast.success("Changes requested! Task reverted to Assigned. Tasker has been notified.");
         } else {
            await onStatusUpdate(newStatus, reason);
            toast.success(`Task status updated to ${newStatus?.replace("_", " ") || "unknown"}`);
         }
         setCancelReason("");
      } catch (error) {
         toast.error("Failed to update task status");
         console.error(error);
      } finally {
         setIsUpdating(false);
      }
   };

   const handleStartTaskWithOtp = async () => {
      setIsSendingOtp(true);
      try {
         const result = await tasksApi.sendStartOtp(task._id);
         setOtpExpiresAt(result.expiresAt);
         setOtpValue("");
         setIsOtpDialogOpen(true);
         toast.success(`OTP sent to ${result.sentTo}. Ask poster and enter OTP to start task.`);
      } catch (error: any) {
         toast.error(error?.message || "Failed to send OTP");
      } finally {
         setIsSendingOtp(false);
      }
   };

   const handleResendOtp = async () => {
      setIsResendingOtp(true);
      try {
         const result = await tasksApi.resendStartOtp(task._id);
         setOtpExpiresAt(result.expiresAt);
         toast.success(`OTP resent to ${result.sentTo}`);
      } catch (error: any) {
         toast.error(error?.message || "Failed to resend OTP");
      } finally {
         setIsResendingOtp(false);
      }
   };

   const handleVerifyOtp = async () => {
      const normalizedOtp = otpValue.trim();
      if (!/^\d{6}$/.test(normalizedOtp)) {
         toast.error("Enter a valid 6-digit OTP");
         return;
      }

      setIsVerifyingOtp(true);
      try {
         const updatedTask = await tasksApi.verifyStartOtp(task._id, normalizedOtp);
         onTaskUpdated?.(updatedTask);
         setIsOtpDialogOpen(false);
         setOtpValue("");
         toast.success("OTP verified. Task started successfully.");
      } catch (error: any) {
         toast.error(error?.message || "OTP mismatch");
      } finally {
         setIsVerifyingOtp(false);
      }
   };

   const availableActions = getAvailableActions();

   if (availableActions.length === 0) {
      return null;
   }

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
                                    {action.status === "review"
                                       ? "What changes are needed?"
                                       : "Reason for cancellation"}
                                 </Label>
                                 <Textarea
                                    id="cancel-reason"
                                    placeholder={action.status === "review"
                                       ? "Please specify what needs to be changed..."
                                       : "Please provide a reason..."}
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
                                 onClick={() => {
                                    if (action.requiresOtp) {
                                       handleStartTaskWithOtp();
                                       return;
                                    }

                                    handleStatusUpdate(
                                       action.status,
                                       action.requiresReason
                                          ? cancelReason
                                          : undefined,
                                       action.isSpecialAction
                                    );
                                 }}
                                 disabled={
                                    isSendingOtp ||
                                    (action.requiresReason &&
                                    !cancelReason.trim())
                                 }
                              >
                                 {isUpdating || isSendingOtp ? (
                                    <>
                                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                       {action.requiresOtp ? "Sending OTP..." : "Updating..."}
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
                     key={`${action.status}-${action.label}`}
                     variant={
                        action.variant === "default"
                           ? "outline"
                           : action.variant
                     }
                     className="w-full justify-start gap-2 text-sm md:text-base font-medium md:font-semibold"
                     onClick={() => handleStatusUpdate(action.status)}
                     disabled={isUpdating}
                  >
                     {isUpdating ? (
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

         <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Enter Poster OTP</DialogTitle>
                  <DialogDescription>
                     Ask the poster for the OTP sent to them and enter it to start this task.
                  </DialogDescription>
               </DialogHeader>

               <div className="space-y-2">
                  <Label htmlFor="start-task-otp">6-digit OTP</Label>
                  <Input
                     id="start-task-otp"
                     inputMode="numeric"
                     maxLength={6}
                     value={otpValue}
                     onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                     placeholder="Enter OTP"
                     disabled={isVerifyingOtp}
                  />
                  {otpExpiresAt && (
                     <p className="text-xs text-secondary-600">
                        Expires at {new Date(otpExpiresAt).toLocaleTimeString()}
                     </p>
                  )}
               </div>

               <DialogFooter className="flex gap-2 sm:justify-between">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={handleResendOtp}
                     disabled={isResendingOtp || isVerifyingOtp}
                  >
                     {isResendingOtp ? (
                        <>
                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                           Resending...
                        </>
                     ) : (
                        "Resend OTP"
                     )}
                  </Button>
                  <Button
                     type="button"
                     onClick={handleVerifyOtp}
                     disabled={isVerifyingOtp || otpValue.length !== 6}
                  >
                     {isVerifyingOtp ? (
                        <>
                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                           Verifying...
                        </>
                     ) : (
                        "Verify & Start"
                     )}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
}
