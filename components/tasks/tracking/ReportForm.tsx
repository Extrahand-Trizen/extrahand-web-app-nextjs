"use client";

/**
 * ReportForm - Form for reporting a task
 * Includes reason selection and description
 */

import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import type { ReportReason } from "@/types/tracking";

interface ReportFormProps {
   onSubmit: (data: {
      reason: ReportReason;
      description?: string;
   }) => Promise<void>;
   onCancel?: () => void;
   isSubmitting?: boolean;
}

const REPORT_REASONS: Array<{
   value: ReportReason;
   label: string;
   description: string;
}> = [
   {
      value: "spam",
      label: "Spam",
      description: "This task appears to be spam or fraudulent",
   },
   {
      value: "inappropriate_content",
      label: "Inappropriate Content",
      description: "Contains offensive, illegal, or inappropriate material",
   },
   {
      value: "fraudulent",
      label: "Fraudulent",
      description: "Suspected scam or fraudulent activity",
   },
   {
      value: "duplicate",
      label: "Duplicate",
      description: "This task is a duplicate of another listing",
   },
   {
      value: "wrong_category",
      label: "Wrong Category",
      description: "Task is posted in the wrong category",
   },
   {
      value: "other",
      label: "Other",
      description: "Other reason not listed above",
   },
];

export function ReportForm({
   onSubmit,
   onCancel,
   isSubmitting = false,
}: ReportFormProps) {
   const [reason, setReason] = useState<ReportReason | "">("");
   const [description, setDescription] = useState("");

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!reason) return;

      if (reason) {
         await onSubmit({
            reason: reason as ReportReason,
            description: description.trim() || undefined,
         });
      }
   };

   const selectedReason = REPORT_REASONS.find((r) => r.value === reason);

   return (
      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 md:p-4">
            <div className="flex items-start gap-2">
               <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
               <div>
                  <p className="text-sm font-semibold text-yellow-900 mb-1">
                     Report this task
                  </p>
                  <p className="text-xs md:text-sm text-yellow-700">
                     Please provide accurate information. False reports may
                     result in account restrictions.
                  </p>
               </div>
            </div>
         </div>

         {/* Reason Selection */}
         <div>
            <Label
               htmlFor="report-reason"
               className="mb-1.5 md:mb-2 block text-sm font-semibold"
            >
               Reason for Reporting <span className="text-red-500">*</span>
            </Label>
            <Select
               value={reason}
               onValueChange={(value) => setReason(value as ReportReason)}
            >
               <SelectTrigger id="report-reason" className="text-sm">
                  <SelectValue placeholder="Select a reason..." />
               </SelectTrigger>
               <SelectContent>
                  {REPORT_REASONS.map((r) => (
                     <SelectItem key={r.value} value={r.value}>
                        <div>
                           <div className="font-medium">{r.label}</div>
                           <div className="text-xs text-secondary-500">
                              {r.description}
                           </div>
                        </div>
                     </SelectItem>
                  ))}
               </SelectContent>
            </Select>
            {selectedReason && (
               <p className="text-xs text-secondary-500 mt-1.5">
                  {selectedReason.description}
               </p>
            )}
         </div>

         {/* Description */}
         <div>
            <Label
               htmlFor="report-description"
               className="mb-1.5 md:mb-2 block text-sm"
            >
               Additional Details (Optional)
            </Label>
            <Textarea
               id="report-description"
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               placeholder="Provide any additional information that might help us review this report..."
               rows={4}
               maxLength={1000}
               className="text-sm"
            />
            <p className="text-[10px] md:text-xs text-secondary-500 mt-1">
               {description.length}/1000 characters
            </p>
         </div>

         {/* Actions */}
         <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-2">
            {onCancel && (
               <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 text-sm"
                  disabled={isSubmitting}
               >
                  Cancel
               </Button>
            )}
            <Button
               type="submit"
               variant="destructive"
               className="flex-1 text-sm"
               disabled={isSubmitting || !reason}
            >
               {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
         </div>
      </form>
   );
}
