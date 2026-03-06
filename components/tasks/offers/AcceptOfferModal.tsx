"use client";

/**
 * AcceptOfferModal - Modal for accepting an offer/application
 * Confirmation dialog with optional message
 * Includes Step 3: Aadhaar verification check for tasker
 */

import React, { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, MessageSquare, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { LoadingSpinner } from "@/components/LoadingSpinner";

import { applicationsApi } from "@/lib/api/endpoints/applications";
import type { TaskApplication } from "@/types/application";
import { getTaskStartVerificationStatus } from "@/lib/utils/verificationGate";

interface AcceptOfferModalProps {
   application: TaskApplication;
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onSuccess?: () => void;
}

export function AcceptOfferModal({
   application,
   open,
   onOpenChange,
   onSuccess,
}: AcceptOfferModalProps) {
   const router = useRouter();
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [message, setMessage] = useState("");
   
   // Check if tasker has Aadhaar verification (Step 3 requirement)
   const taskerProfile = application.applicantProfile;
   const verificationStatus = getTaskStartVerificationStatus(taskerProfile || null);

   const handleAccept = async () => {
      if (isSubmitting) return;

      // STEP 3: Check Aadhaar verification before accepting
      if (!verificationStatus.allowed) {
         toast.error("Tasker verification required", {
            description: "This tasker needs to complete Aadhaar verification before they can start the task.",
            action: {
               label: "Learn More",
               onClick: () => {
                  router.push("/trust-safety");
               },
            },
            duration: 8000,
         });
         return;
      }

      setIsSubmitting(true);

      try {
         // Call real API to accept the offer
         await applicationsApi.updateApplicationStatus(application._id, {
            status: "accepted" as any,
            message: message.trim() || undefined,
         });

         toast.success("Offer accepted!", {
            description: "The tasker has been notified of your acceptance.",
         });

         setMessage("");
         onOpenChange(false);
         onSuccess?.();
      } catch (error) {
         console.error("Error accepting offer:", error);
         
         // Import and use getErrorMessage if available
         const errorMessage = error instanceof Error 
            ? error.message.replace(/^API call failed:\s*/i, "")
            : "Please try again later.";
            
         toast.error("Failed to accept offer", {
            description: errorMessage,
         });
      } finally {
         setIsSubmitting(false);
      }
   };

   const proposedBudget = application.proposedBudget;
   const hasAadhaarWarning = !verificationStatus.allowed;

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-lg">
            <DialogHeader>
               <DialogTitle className="text-xl font-bold text-secondary-900 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Accept Offer
               </DialogTitle>
               <DialogDescription className="text-sm text-secondary-600">
                  Confirm that you want to accept this offer
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
               {/* Aadhaar Verification Warning (Step 3) */}
               {hasAadhaarWarning && (
                  <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                     <ShieldCheck className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                     <div className="flex-1">
                        <p className="text-sm font-semibold text-red-900 mb-1">
                           Verification Required
                        </p>
                        <p className="text-xs text-red-800">
                           This tasker needs to complete <strong>Aadhaar verification</strong> before they can start the task. 
                           They will be notified to complete verification before task start.
                        </p>
                     </div>
                  </div>
               )}

               {/* Offer Summary */}
               <div className="bg-secondary-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-secondary-600">
                        Proposed Budget
                     </span>
                     <span className="text-lg font-bold text-secondary-900">
                        ₹{proposedBudget.amount.toLocaleString()}
                     </span>
                  </div>
                  {proposedBudget.isNegotiable && (
                     <div className="text-xs text-secondary-500">
                        Budget is negotiable
                     </div>
                  )}
                  {application.proposedTime?.estimatedDuration && (
                     <div className="flex justify-between items-center">
                        <span className="text-sm text-secondary-600">
                           Estimated Duration
                        </span>
                        <span className="text-sm font-semibold text-secondary-900">
                           {application.proposedTime.estimatedDuration}h
                        </span>
                     </div>
                  )}
                  {application.coverLetter && (
                     <div className="pt-2 border-t border-secondary-200">
                        <p className="text-xs text-secondary-600 mb-1">
                           Cover Letter:
                        </p>
                        <p className="text-sm text-secondary-700 leading-relaxed">
                           {application.coverLetter}
                        </p>
                     </div>
                  )}
               </div>

               {/* Optional Message */}
               <div className="space-y-2">
                  <Label
                     htmlFor="accept-message"
                     className="flex items-center gap-2 text-sm font-semibold text-secondary-900"
                  >
                     <MessageSquare className="w-4 h-4" />
                     Message (Optional)
                  </Label>
                  <Textarea
                     id="accept-message"
                     placeholder="Add a message to the tasker..."
                     rows={3}
                     value={message}
                     onChange={(e) => setMessage(e.target.value)}
                     maxLength={500}
                     className="resize-none"
                  />
                  <div className="flex justify-end">
                     <span className="text-xs text-secondary-500">
                        {message.length}/500
                     </span>
                  </div>
               </div>

               {/* General Warning */}
               {!hasAadhaarWarning && (
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                     <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                     <p className="text-xs text-yellow-800">
                        Once accepted, this task will be assigned to the tasker and
                        other offers will be automatically rejected.
                     </p>
                  </div>
               )}

               {/* Actions */}
               <div className="flex gap-3 pt-4 border-t border-secondary-200">
                  <Button
                     type="button"
                     variant="outline"
                     onClick={() => onOpenChange(false)}
                     className="flex-1"
                     disabled={isSubmitting}
                  >
                     Cancel
                  </Button>
                  <Button
                     type="button"
                     onClick={handleAccept}
                     className="flex-1 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? (
                        <>
                           <LoadingSpinner size="sm" className="mr-2" />
                           Accepting...
                        </>
                     ) : hasAadhaarWarning ? (
                        "Accept (Verification Pending)"
                     ) : (
                        "Accept Offer"
                     )}
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
