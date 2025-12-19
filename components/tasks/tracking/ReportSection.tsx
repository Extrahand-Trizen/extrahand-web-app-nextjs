"use client";

/**
 * ReportSection - Section for reporting tasks
 * Shows report form and existing report status if user has already reported
 */

import React, { useState } from "react";
import { AlertTriangle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReportForm } from "./ReportForm";
import type { TaskReportSubmission, ReportStatus } from "@/types/tracking";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ReportSectionProps {
   taskId: string;
   currentUserId?: string;
   existingReport?: TaskReportSubmission;
   onSubmitReport: (data: {
      reason: string;
      description?: string;
   }) => Promise<void>;
}

const STATUS_CONFIG: Record<
   ReportStatus,
   { label: string; icon: React.ElementType; color: string; bgColor: string }
> = {
   pending: {
      label: "Pending Review",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 border-yellow-200",
   },
   reviewed: {
      label: "Under Review",
      icon: AlertTriangle,
      color: "text-blue-600",
      bgColor: "bg-blue-50 border-blue-200",
   },
   resolved: {
      label: "Resolved",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50 border-green-200",
   },
   dismissed: {
      label: "Dismissed",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50 border-red-200",
   },
};

export function ReportSection({
   taskId,
   currentUserId,
   existingReport,
   onSubmitReport,
}: ReportSectionProps) {
   const [showReportForm, setShowReportForm] = useState(!existingReport);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async (data: {
      reason: string;
      description?: string;
   }) => {
      setIsSubmitting(true);
      try {
         await onSubmitReport(data);
         setShowReportForm(false);
      } catch (error) {
         console.error("Failed to submit report:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   const statusConfig = existingReport?.status
      ? STATUS_CONFIG[existingReport.status]
      : null;
   const StatusIcon = statusConfig?.icon;

   return (
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4 md:p-6">
         <div className="flex items-center gap-2 mb-4 md:mb-6">
            <AlertTriangle className="w-5 h-5 text-secondary-600" />
            <h2 className="text-base md:text-lg font-semibold md:font-bold text-secondary-900">
               Report Task
            </h2>
         </div>

         {/* Existing Report Status */}
         {existingReport && !showReportForm && (
            <div
               className={cn(
                  "border rounded-lg p-4 md:p-6 mb-4 md:mb-6",
                  statusConfig?.bgColor
               )}
            >
               <div className="flex items-start gap-3">
                  {StatusIcon && (
                     <StatusIcon
                        className={cn(
                           "w-5 h-5 shrink-0 mt-0.5",
                           statusConfig.color
                        )}
                     />
                  )}
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm md:text-base font-semibold text-secondary-900">
                           Report Submitted
                        </h3>
                        {statusConfig && (
                           <span
                              className={cn(
                                 "text-xs px-2 py-0.5 rounded-full font-medium",
                                 statusConfig.color,
                                 statusConfig.bgColor.replace(
                                    "bg-",
                                    "bg-opacity-20"
                                 )
                              )}
                           >
                              {statusConfig.label}
                           </span>
                        )}
                     </div>
                     <div className="space-y-1.5 text-xs md:text-sm text-secondary-600">
                        <p>
                           <span className="font-medium">Reason:</span>{" "}
                           {existingReport.reason.replace("_", " ")}
                        </p>
                        {existingReport.description && (
                           <p>
                              <span className="font-medium">Details:</span>{" "}
                              {existingReport.description}
                           </p>
                        )}
                        {existingReport.reviewedAt && (
                           <p>
                              <span className="font-medium">Reviewed:</span>{" "}
                              {format(
                                 new Date(existingReport.reviewedAt),
                                 "MMM dd, yyyy"
                              )}
                           </p>
                        )}
                        {existingReport.resolutionNotes && (
                           <div className="mt-2 pt-2 border-t border-secondary-200">
                              <p className="font-medium mb-1">
                                 Resolution Notes:
                              </p>
                              <p>{existingReport.resolutionNotes}</p>
                           </div>
                        )}
                     </div>
                     {existingReport.status === "pending" && (
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => setShowReportForm(true)}
                           className="mt-3 text-xs md:text-sm"
                        >
                           Update Report
                        </Button>
                     )}
                  </div>
               </div>
            </div>
         )}

         {/* Report Form */}
         {showReportForm && (
            <div className="border border-secondary-200 rounded-lg p-3 md:p-4 lg:p-6 bg-secondary-50">
               {existingReport && (
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                     <h3 className="text-sm md:text-base font-semibold text-secondary-900">
                        {existingReport ? "Update Report" : "Submit Report"}
                     </h3>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReportForm(false)}
                        className="text-xs md:text-sm"
                     >
                        Cancel
                     </Button>
                  </div>
               )}
               <ReportForm
                  onSubmit={handleSubmit}
                  onCancel={
                     existingReport ? () => setShowReportForm(false) : undefined
                  }
                  isSubmitting={isSubmitting}
               />
            </div>
         )}

         {/* Info Message */}
         {!existingReport && !showReportForm && (
            <div className="bg-secondary-50 rounded-lg p-4 md:p-6 text-center">
               <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-secondary-300 mx-auto mb-3" />
               <p className="text-sm md:text-base text-secondary-600 font-medium mb-1">
                  Report inappropriate content
               </p>
               <p className="text-xs md:text-sm text-secondary-500 mb-4">
                  Help us maintain a safe and trustworthy platform
               </p>
               <Button
                  onClick={() => setShowReportForm(true)}
                  variant="outline"
                  size="sm"
                  className="text-sm"
               >
                  Report Task
               </Button>
            </div>
         )}
      </div>
   );
}
