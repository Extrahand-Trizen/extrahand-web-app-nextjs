"use client";

/**
 * AcceptOfferModal - Modal for accepting an offer/application
 * Confirmation dialog with optional message
 */

import React, { useState } from "react";
import { toast } from "sonner";
import { CheckCircle, AlertCircle, MessageSquare } from "lucide-react";

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
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [message, setMessage] = useState("");

   const handleAccept = async () => {
      if (isSubmitting) return;

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

               {/* Warning */}
               <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-yellow-800">
                     Once accepted, this task will be assigned to the tasker and
                     other offers will be automatically rejected.
                  </p>
               </div>

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
                     className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                     disabled={isSubmitting}
                  >
                     {isSubmitting ? (
                        <>
                           <LoadingSpinner size="sm" className="mr-2" />
                           Accepting...
                        </>
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

