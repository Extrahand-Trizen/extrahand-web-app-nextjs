"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Star, CheckCircle, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { buildPublicProfilePath } from "@/lib/utils/profileHandle";
import Image from "next/image";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import type { TaskApplication } from "@/types/application";
import { applicationsApi } from "@/lib/api/endpoints/applications";
import { taskDetailsQueryKeys } from "@/lib/queryKeys";
import { PaymentConfirmationModal } from "@/components/payments/PaymentConfirmationModal";
import { useAuth } from "@/lib/auth/context";
import { getUserBadge } from "@/lib/api/badge";
import { UserBadge, type BadgeType } from "@/components/ui/user-badge";

interface TaskOffersSectionProps {
   taskId: string;
   isOwner?: boolean;
   onApplicationsCountChange?: (count: number) => void;
   userProfile?: Record<string, unknown> | null;
   onMakeOffer?: () => void;
   taskCategory?: string;
   hasApplied?: boolean;
   checkingApplication?: boolean;
   onHasAppliedChange?: (hasApplied: boolean) => void;
}


const getTimeAgo = (date: Date | string | undefined): string => {
   if (!date) return "Recently";
   const now = new Date();
   const taskDate = typeof date === "string" ? new Date(date) : date;
   const diffMs = now.getTime() - taskDate.getTime();
   const diffMins = Math.floor(diffMs / 60000);
   const diffHours = Math.floor(diffMs / 3600000);
   const diffDays = Math.floor(diffMs / 86400000);

   if (diffMins < 1) return "Just now";
   if (diffMins < 60) return `${diffMins} min ago`;
   if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
   if (diffDays === 1) return "Yesterday";
   return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const formatSelectedDates = (dates?: Array<Date | string>) => {
   if (!dates || dates.length === 0) return null;
   const formatted = dates
      .map((value) => new Date(value))
      .filter((d) => !Number.isNaN(d.getTime()))
      .map((d) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
   if (formatted.length <= 3) return formatted.join(", ");
   return `${formatted.slice(0, 3).join(", ")} +${formatted.length - 3}`;
};

const getApplicationAmount = (application?: TaskApplication | null) => {
   return application?.proposedBudget?.amount ?? 0;
};

export function TaskOffersSection({
   taskId,
   isOwner = false,
   onApplicationsCountChange,
   userProfile = null,
   onMakeOffer,
   taskCategory,
   hasApplied = false,
   checkingApplication = false,
   onHasAppliedChange,
}: TaskOffersSectionProps) {
   const applicationsQuery = useQuery({
      queryKey: taskDetailsQueryKeys.applications(taskId),
      queryFn: () => applicationsApi.getTaskApplications(taskId),
      enabled: !!taskId,
      staleTime: 30 * 1000, // 30 seconds - refresh more frequently
      refetchOnMount: true, // Always refetch when component mounts
   });

   const applications = useMemo(
      () => applicationsQuery.data?.applications ?? [],
      [applicationsQuery.data?.applications]
   );
   const loading = applicationsQuery.isLoading;
   const userProfileId = (userProfile as { _id?: string } | null)?._id;

   const [sortBy, setSortBy] = useState<"newest" | "price-low" | "rating">(
      "newest"
   );
   const [selectedApplication, setSelectedApplication] =
      useState<TaskApplication | null>(null);
   const [showPaymentModal, setShowPaymentModal] = useState(false);
   const [counterApplication, setCounterApplication] = useState<TaskApplication | null>(null);
   const [counterAmountInput, setCounterAmountInput] = useState("");
   const [isCounterSubmitting, setIsCounterSubmitting] = useState(false);
   const [applicantBadges, setApplicantBadges] = useState<Record<string, BadgeType>>({});
   const { currentUser, userData } = useAuth();
   const currentUid = currentUser?.uid;
   const router = useRouter();
   const onApplicationsCountChangeRef = useRef(onApplicationsCountChange);

   const toBadgeType = (value: string): BadgeType => {
      const normalized = value.toLowerCase();
      if (normalized === "basic" || normalized === "verified" || normalized === "trusted" || normalized === "elite") {
         return normalized;
      }
      return "none";
   };

   const matchesCurrentUserApplication = useCallback((app: { applicantId?: unknown; applicantUid?: string }) => {
      const applicantProfileId = String(app.applicantId ?? "");
      const normalizedUserProfileId = String(
         (userProfile as { _id?: string; id?: string; profileId?: string } | null)?._id ||
            (userProfile as { _id?: string; id?: string; profileId?: string } | null)?.id ||
            (userProfile as { _id?: string; id?: string; profileId?: string } | null)?.profileId ||
            ""
      );
      const applicantUid = String(app.applicantUid ?? "");
      const normalizedCurrentUid = String(currentUid ?? "");

      return (
         (normalizedUserProfileId !== "" && applicantProfileId === normalizedUserProfileId) ||
         (normalizedCurrentUid !== "" && applicantUid === normalizedCurrentUid)
      );
   }, [userProfile, currentUid]);

   useEffect(() => {
      onApplicationsCountChangeRef.current = onApplicationsCountChange;
   }, [onApplicationsCountChange]);

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         onApplicationsCountChangeRef.current?.(applications.length);
      }, 0);
      return () => clearTimeout(timeoutId);
   }, [applications.length]);

   useEffect(() => {
      let isCancelled = false;

      async function fetchApplicantBadges() {
         const applicantLookup = new Map<string, string>();

         applications.forEach((app) => {
            const applicantId = String(app.applicantId || "");
            const lookupId = String(app.applicantUid || app.applicantId || "");
            if (applicantId && lookupId && !applicantLookup.has(applicantId)) {
               applicantLookup.set(applicantId, lookupId);
            }
         });

         if (applicantLookup.size === 0) {
            return;
         }

         const resolvedBadges = await Promise.all(
            Array.from(applicantLookup.entries()).map(async ([applicantId, lookupId]) => {
               try {
                  const badgeData = await getUserBadge(lookupId);
                  return [applicantId, toBadgeType(String(badgeData.currentBadge || "none"))] as const;
               } catch {
                  return [applicantId, "none" as BadgeType] as const;
               }
            })
         );

         if (!isCancelled) {
            setApplicantBadges((prev) => ({
               ...prev,
               ...Object.fromEntries(resolvedBadges),
            }));
         }
      }

      fetchApplicantBadges();

      return () => {
         isCancelled = true;
      };
   }, [applications]);

   // Notify parent when applications load (for hasApplied) – page also derives from same query; keep for any other consumers
   useEffect(() => {
      if (!onHasAppliedChange || !userProfile || !applicationsQuery.data) return;
      const userApplication = applications.find((app) => matchesCurrentUserApplication(app));
      onHasAppliedChange(!!userApplication);
   }, [applicationsQuery.data, applications, userProfile, userProfileId, currentUid, onHasAppliedChange, matchesCurrentUserApplication]);

   const handleAcceptOffer = (application: TaskApplication) => {
      setSelectedApplication(application);
      setShowPaymentModal(true);
   };

   const handleRejectOffer = async (application: TaskApplication) => {
      if (!window.confirm("Are you sure you want to reject this offer?")) {
         return;
      }

      try {
         await applicationsApi.updateApplicationStatus(application._id, {
            status: "rejected",
         });

         toast.success("Offer rejected", {
            description: "The applicant has been notified.",
         });

         // Refetch applications to update the UI
         await applicationsQuery.refetch();
      } catch (error) {
         console.error("Error rejecting application:", error);
         toast.error("Failed to reject offer", {
            description: "Please try again.",
         });
      }
   };

   const openCounterDialog = (application: TaskApplication) => {
      const currentAmount = application.negotiation?.currentAmount ?? getApplicationAmount(application);
      setCounterApplication(application);
      setCounterAmountInput(String(currentAmount));
   };

   const handleCounterAmountChange = (rawValue: string) => {
      const digitsOnly = rawValue.replace(/\D/g, "");
      setCounterAmountInput(digitsOnly);
   };

   const handleSubmitCounterOffer = async () => {
      if (!counterApplication) return;

      const amount = Number(counterAmountInput);
      if (!Number.isInteger(amount) || amount <= 0) {
         toast.error("Enter a valid amount", {
            description: "Amount must be numbers only.",
         });
         return;
      }
      if (amount > 50000) {
         toast.error("Amount too high", {
            description: "Amount must be 50000 or less.",
         });
         return;
      }

      try {
         setIsCounterSubmitting(true);
         await applicationsApi.negotiateApplication(counterApplication._id, {
            action: "counter",
            amount,
         });
         toast.success("Counter offer sent");
         setCounterApplication(null);
         setCounterAmountInput("");
         await applicationsQuery.refetch();
      } catch (error) {
         console.error("Error sending counter offer:", error);
         toast.error("Failed to send counter offer", {
            description: "Please try again.",
         });
      } finally {
         setIsCounterSubmitting(false);
      }
   };

   const handleNegotiationAction = async (
      application: TaskApplication,
      action: "accept" | "reject"
   ) => {
      try {
         await applicationsApi.negotiateApplication(application._id, { action });
         toast.success(action === "accept" ? "Counter accepted" : "Offer rejected");
         await applicationsQuery.refetch();
      } catch (error) {
         console.error(`Error applying ${action} action:`, error);
         toast.error("Action failed", {
            description: "Please try again.",
         });
      }
   };

   const handlePaymentSuccess = async () => {
      const application = selectedApplication;
      setSelectedApplication(null);
      setShowPaymentModal(false);

      toast.success("Payment successful!", {
         description: "Task assigned to tasker.",
      });

      try {
         if (application) {
            // Update application status to accepted after payment
            await applicationsApi.updateApplicationStatus(application._id, {
               status: "accepted",
            });
         }
      } catch (error) {
         // Payment succeeded even if status update fails – silently log
         console.error("Error updating application status after payment:", error);
      } finally {
         // Always redirect to the task tracking page after payment
         router.push(`/tasks/${taskId}/track`);
      }
   };

   const handlePaymentError = (error: Error) => {
      toast.error("Payment failed", {
         description: error.message || "Please try again.",
      });
   };

   const sortedApplications = [...applications].sort((a, b) => {
      if (sortBy === "price-low")
         return getApplicationAmount(a) - getApplicationAmount(b);
      if (sortBy === "rating") {
         const ratingA = a.applicantProfile?.rating || 0;
         const ratingB = b.applicantProfile?.rating || 0;
         return ratingB - ratingA;
      }
      // newest (default order)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
   });

   // Find accepted applications to show prominently for task owners
   const acceptedApplications = isOwner
      ? applications.filter((app) => app.status === "accepted")
      : [];

   // Filter out accepted applications from sorted list if they exist (shown separately)
   const otherApplications = isOwner
      ? sortedApplications.filter((app) => app.status !== "accepted")
      : sortedApplications;

   // Find user's own application by comparing applicantId with userProfile._id
   const myApplication = useMemo(() => {
      if (isOwner || !userProfile) return null;
      const found = applications.find((app) => matchesCurrentUserApplication(app));
      if (found) {
         console.log("✅ Found user's application:", { 
            applicantId: found.applicantId, 
            userProfileId,
            applicantUid: found.applicantUid,
            currentUid,
            status: found.status 
         });
      } else if ((userProfileId || currentUid) && applications.length > 0) {
         console.log("❌ No application found for user:", {
            userProfileId,
            currentUid,
            totalApplications: applications.length,
            applicantIds: applications.map(app => app.applicantId),
            applicantUids: applications.map((app) => app.applicantUid),
         });
      }
      return found || null;
   }, [isOwner, userProfile, userProfileId, currentUid, applications, matchesCurrentUserApplication]);

   // Inform parent whether current user has an application
   useEffect(() => {
      if (!onHasAppliedChange) return;
      onHasAppliedChange(!!myApplication);
   }, [myApplication, onHasAppliedChange]);

   if (loading) {
      return (
         <div className="p-4 md:p-8 flex items-center justify-center py-16">
            <div className="text-center">
               <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
               <p className="text-sm text-secondary-600">Loading offers...</p>
            </div>
         </div>
      );
   }

   // Show offers list for everyone, but with different views

   return (
      <>
         <div className="p-4 md:p-8" data-offers-section>
            {/* Header */}
            <div className="flex items-center justify-between mb-5 md:mb-8">
               <h2 className="md:text-lg font-bold text-secondary-900">
                  Offers ({applications.length})
               </h2>

               {/* Sort Dropdown */}
               {applications.length > 0 && (
                  <Select
                     value={sortBy}
                     onValueChange={(value) =>
                        setSortBy(value as "newest" | "price-low" | "rating")
                     }
                  >
                     <SelectTrigger className="w-[180px] h-10">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="newest">Newest first</SelectItem>
                        <SelectItem value="price-low">
                           Price: Low to High
                        </SelectItem>
                        <SelectItem value="rating">Highest rated</SelectItem>
                     </SelectContent>
                  </Select>
               )}
            </div>

            {/* User's Application Highlight (if exists and not owner) */}
            {!isOwner && myApplication && (
               <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                     <User className="w-5 h-5 text-primary-600" />
                     <h3 className="font-bold text-primary-700">Your Offer</h3>
                  </div>
                  <div className="bg-primary-50 border-2 border-primary-300 rounded-xl p-5 shadow-sm">
                     <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-md">
                              {((userProfile as { name?: string })?.name || "You").charAt(0).toUpperCase()}
                           </div>
                           <div>
                              <h4 className="font-bold text-secondary-900 text-base">
                                 {(userProfile as { name?: string })?.name || "You"}
                              </h4>
                              <p className="text-xs text-secondary-600">Your application</p>
                           </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 ${
                           myApplication.status === "pending" 
                              ? "bg-yellow-100 text-yellow-800 border border-yellow-200" 
                              : myApplication.status === "accepted"
                              ? "bg-green-100 text-green-800 border border-green-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                        }`}>
                           {myApplication.status.toUpperCase()}
                        </span>
                     </div>
                     <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                           <span className="text-secondary-600">Proposed Budget:</span>
                           <span className="font-semibold text-secondary-900">
                              ₹{(
                                 (myApplication.proposedBudget?.amount || 0) *
                                 (myApplication.selectedDates?.length || 1)
                              ).toLocaleString()}
                           </span>
                        </div>
                        {myApplication.selectedDates && myApplication.selectedDates.length > 0 && (
                           <div className="flex justify-between text-xs text-secondary-500">
                              <span>Calculation:</span>
                              <span>
                                 ₹{myApplication.proposedBudget?.amount || 0} × {myApplication.selectedDates.length} days
                              </span>
                           </div>
                        )}
                        {myApplication.proposedTime?.estimatedDuration && (
                           <div className="flex justify-between text-sm">
                              <span className="text-secondary-600">Estimated Time:</span>
                              <span className="font-semibold text-secondary-900">
                                 {Math.floor(myApplication.proposedTime.estimatedDuration / 24)}d{" "}
                                 {(myApplication.proposedTime.estimatedDuration % 24).toFixed(0)}h
                              </span>
                           </div>
                        )}
                        {myApplication.selectedDates && myApplication.selectedDates.length > 0 && (
                           <div className="flex justify-between text-sm">
                              <span className="text-secondary-600">Selected Dates:</span>
                              <span className="font-semibold text-secondary-900">
                                 {formatSelectedDates(myApplication.selectedDates)}
                              </span>
                           </div>
                        )}
                        {myApplication.coverLetter && (
                           <div className="mt-3 pt-3 border-t border-primary-200">
                              <p className="text-xs text-secondary-600 mb-1">Your Message:</p>
                              <p className="text-sm text-secondary-700">{myApplication.coverLetter}</p>
                           </div>
                        )}
                        <div className="flex justify-between text-xs text-secondary-500 pt-2">
                           <span>Submitted: {new Date(myApplication.createdAt).toLocaleDateString()}</span>
                        </div>

                        {myApplication.status === "pending" && myApplication.negotiation?.status === "countered_by_poster" && (
                           <div className="mt-3 pt-3 border-t border-primary-200">
                              <p className="text-sm font-semibold text-secondary-900 mb-2">
                                 Client countered with ₹{(myApplication.negotiation.currentAmount ?? getApplicationAmount(myApplication)).toLocaleString()}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                 <Button
                                    size="sm"
                                    onClick={() => handleNegotiationAction(myApplication, "accept")}
                                    className="bg-primary-600 hover:bg-primary-700 text-white"
                                 >
                                    Accept
                                 </Button>
                              </div>
                           </div>
                        )}

                        {myApplication.status === "pending" && myApplication.negotiation?.status === "accepted" && (
                           <div className="mt-3 pt-3 border-t border-primary-200">
                              <p className="text-sm font-semibold text-green-700">
                                 Final price agreed: ₹{(myApplication.negotiation.currentAmount ?? getApplicationAmount(myApplication)).toLocaleString()}
                              </p>
                              <p className="text-xs text-secondary-500 mt-1">
                                 Waiting for client to assign and pay.
                              </p>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            )}

            {/* Call to action for non-applied users */}
            {!isOwner && !myApplication && (
               <div className="p-6 text-center bg-primary-50 rounded-xl mb-6">
                  <p className="text-secondary-700 mb-4">
                     {checkingApplication ? (
                        <span className="flex items-center justify-center gap-2">
                           <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                           Checking your application status...
                        </span>
                     ) : (
                        "Interested in this task? Submit your offer!"
                     )}
                  </p>
                  <Button
                     onClick={onMakeOffer}
                     disabled={checkingApplication || hasApplied || myApplication !== null}
                     className="bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                     {checkingApplication ? (
                        <span className="flex items-center gap-2">
                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                           Checking...
                        </span>
                     ) : hasApplied || myApplication ? (
                        "Already Applied"
                     ) : (
                        "Make an Offer"
                     )}
                  </Button>
               </div>
            )}

            {/* Applications List */}
            {applications.length === 0 ? (
               <div className="text-center py-16">
                  <div className="w-32 h-32 mx-auto mb-6">
                     <svg
                        viewBox="0 0 200 200"
                        fill="none"
                        className="w-full h-full"
                     >
                        <circle cx="100" cy="100" r="90" fill="#F3F4F6" />
                        <path
                           d="M100 60c-22 0-40 18-40 40s18 40 40 40 40-18 40-40-18-40-40-40zm0 60c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z"
                           fill="#9CA3AF"
                        />
                        <circle cx="100" cy="100" r="12" fill="#6B7280" />
                        <path
                           d="M60 50l80 80M140 50l-80 80"
                           stroke="#9CA3AF"
                           strokeWidth="3"
                           strokeLinecap="round"
                        />
                     </svg>
                  </div>
                  <h3 className="text-lg font-bold text-secondary-900 mb-2">
                     No offers yet
                  </h3>
                  <p className="text-sm text-secondary-500 max-w-xs mx-auto">
                     {isOwner ? "No offers received yet. Share your task to get more offers!" : "Be the first to make an offer!"}
                  </p>
               </div>
            ) : (
               <div className="space-y-3">
                  {/* Accepted Offer Section - Show prominently at the top */}
                  {acceptedApplications.length > 0 && (
                     <div className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                           <CheckCircle className="w-5 h-5 text-green-600" />
                           <h3 className="font-bold text-green-800">Accepted Offers</h3>
                        </div>
                        <div className="space-y-3">
                           {acceptedApplications.map((acceptedApplication) => (
                              <div
                                 key={acceptedApplication._id}
                                 className="p-4 md:p-6 rounded-xl bg-green-50 border-2 border-green-200"
                              >
                                 <div className="flex flex-col gap-4">
                                    {/* Header: Avatar + Name + Budget */}
                                    <div className="flex items-center justify-between gap-3">
                                       <Link
                                          href={buildPublicProfilePath(
                                             acceptedApplication.applicantProfile?.name,
                                             String(acceptedApplication.applicantId)
                                          )}
                                          className="flex gap-3 min-w-0 group"
                                          aria-label={`View ${acceptedApplication.applicantProfile?.name || "user"}'s profile`}
                                       >
                                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-lg md:text-xl font-bold shrink-0 shadow-md transition-transform duration-200 group-hover:scale-[1.03]">
                                             {((acceptedApplication.applicantProfile?.name) || "U").charAt(0)}
                                          </div>
                                          <div className="min-w-0">
                                             <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-secondary-900 text-sm sm:text-base truncate group-hover:text-green-700 transition-colors">
                                                   {acceptedApplication.applicantProfile?.name || "Unknown User"}
                                                </h3>
                                                {applicantBadges[String(acceptedApplication.applicantId)] &&
                                                   applicantBadges[String(acceptedApplication.applicantId)] !== "none" && (
                                                      <UserBadge
                                                         badge={applicantBadges[String(acceptedApplication.applicantId)]}
                                                         size="sm"
                                                         showLabel
                                                      />
                                                   )}
                                                <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-semibold">
                                                   Assigned
                                                </span>
                                             </div>
                                             <div className="flex items-center gap-2 text-xs text-secondary-500 mt-1">
                                                <div className="flex items-center gap-1">
                                                   <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                   <span className="font-semibold text-secondary-900">
                                                      {acceptedApplication.applicantProfile?.rating > 0
                                                         ? acceptedApplication.applicantProfile.rating.toFixed(1)
                                                         : "New"}
                                                   </span>
                                                </div>
                                                <span className="text-secondary-300">•</span>
                                                <span>
                                                   {acceptedApplication.applicantProfile?.totalReviews || 0} reviews
                                                </span>
                                             </div>
                                          </div>
                                       </Link>
                                       <div className="text-right">
                                          {/* Only show budget to task owner */}
                                          {isOwner && (
                                             <>
                                                <div className="text-xl font-bold text-green-700 mb-1">
                                                   ₹{(getApplicationAmount(acceptedApplication) * (acceptedApplication.selectedDates?.length || 1)).toLocaleString()}
                                                </div>
                                                {acceptedApplication.selectedDates && acceptedApplication.selectedDates.length > 0 && (
                                                   <div className="text-xs text-secondary-500">
                                                      ₹{getApplicationAmount(acceptedApplication)} × {acceptedApplication.selectedDates.length} days
                                                   </div>
                                                )}
                                                {acceptedApplication.proposedTime?.estimatedDuration && !acceptedApplication.selectedDates?.length && (
                                                   <div className="text-xs text-secondary-500">
                                                      Est. {acceptedApplication.proposedTime.estimatedDuration}h
                                                   </div>
                                                )}
                                             </>
                                          )}
                                       </div>
                                    </div>

                                    {/* Selected Dates */}
                                    {acceptedApplication.selectedDates && acceptedApplication.selectedDates.length > 0 && (
                                       <p className="text-xs text-green-900">
                                          Dates: {formatSelectedDates(acceptedApplication.selectedDates)}
                                       </p>
                                    )}

                                    {/* Cover Letter */}
                                    {acceptedApplication.coverLetter && (
                                       <p className="text-sm text-secondary-700 leading-relaxed">
                                          {acceptedApplication.coverLetter}
                                       </p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 flex-wrap">
                                       <Link
                                          href={buildPublicProfilePath(
                                             acceptedApplication.applicantProfile?.name,
                                             acceptedApplication.applicantId
                                          )}
                                       >
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             className="border-green-300 text-green-700 hover:bg-green-50 rounded-lg text-xs font-medium"
                                          >
                                             View Profile
                                          </Button>
                                       </Link>
                                       <Link
                                          href={`/chat?taskId=${taskId}&otherUserId=${acceptedApplication.applicantId}`}
                                       >
                                          <Button
                                             size="sm"
                                             className="bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold"
                                          >
                                             <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                                             Message Tasker
                                          </Button>
                                       </Link>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Other Applications - Show below the accepted one */}
                  {otherApplications.length > 0 && (
                     <>
                        {acceptedApplications.length > 0 && (
                           <h3 className="font-semibold text-secondary-700 text-sm mb-2">Other Offers</h3>
                        )}
                        {otherApplications.map((application) => {
                     const user = {
                        name: application.applicantProfile?.name || (application.applicantId ? `User ${String(application.applicantId).slice(-4)}` : "Unknown User"),
                        photoURL: application.applicantProfile?.photoURL || null,
                        rating: application.applicantProfile?.rating || 0,
                        totalReviews: application.applicantProfile?.totalReviews || 0,
                        skills: application.applicantProfile?.skills,
                     };

                     return (
                        <div
                           key={application._id}
                           className="p-3 sm:p-4 md:p-6 rounded-xl bg-secondary-50/50 hover:bg-white hover:shadow-lg transition-all duration-200 border border-transparent hover:border-primary-100"
                        >
                           <div className="flex flex-col gap-4">
                              {/* Header: Avatar + Name + Time */}
                              <div className="flex items-center justify-between gap-3">
                                 <Link
                                    href={buildPublicProfilePath(
                                       application.applicantProfile?.name,
                                       String(application.applicantId)
                                    )}
                                    className="flex gap-3 min-w-0 group"
                                    aria-label={`View ${user.name}'s profile`}
                                 >
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-lg md:text-xl font-bold shrink-0 shadow-md overflow-hidden transition-transform duration-200 group-hover:scale-[1.03]">
                                       {user.photoURL ? (
                                          <Image
                                             src={user.photoURL}
                                             alt={user.name || "User"}
                                             width={64}
                                             height={64}
                                             className="w-full h-full object-cover"
                                          />
                                       ) : (
                                          <span>{(user.name || "U").charAt(0)}</span>
                                       )}
                                    </div>

                                    <div className="min-w-0">
                                       <div className="flex items-center gap-2">
                                          <h3 className="font-bold text-secondary-900 text-sm sm:text-base truncate group-hover:text-primary-600 transition-colors">
                                             {user.name}
                                          </h3>
                                          {applicantBadges[String(application.applicantId)] &&
                                             applicantBadges[String(application.applicantId)] !== "none" && (
                                                <UserBadge
                                                   badge={applicantBadges[String(application.applicantId)]}
                                                   size="sm"
                                                   showLabel
                                                />
                                             )}
                                       </div>

                                       <div className="flex items-center gap-2 text-xs text-secondary-500 mt-1">
                                          <div className="flex items-center gap-1">
                                             <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                             <span className="font-semibold text-secondary-900">
                                                {user.rating > 0 ? user.rating.toFixed(1) : "New"}
                                             </span>
                                          </div>
                                          <span className="text-secondary-300">
                                             •
                                          </span>
                                          <span>
                                             {user.totalReviews} {user.totalReviews === 1 ? "review" : "reviews"}
                                          </span>
                                       </div>
                                    </div>
                                 </Link>

                                 <div className="text-right">
                                    {/* Only show budget to task owner */}
                                    {isOwner && (
                                       <>
                                          <div className="text-lg font-bold text-primary-600 mb-1">
                                             ₹
                                             {(getApplicationAmount(application) * (application.selectedDates?.length || 1)).toLocaleString()}
                                          </div>
                                          {application.selectedDates && application.selectedDates.length > 0 && (
                                             <div className="text-xs text-secondary-400 font-medium mb-1">
                                                ₹{getApplicationAmount(application)} × {application.selectedDates.length} days
                                             </div>
                                          )}
                                       </>
                                    )}
                                    <div className="flex items-center gap-2 justify-end">
                                       <span className="text-xs text-secondary-400 font-medium">
                                          {getTimeAgo(application.createdAt)}
                                       </span>
                                       <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                          application.status === "pending" 
                                             ? "bg-yellow-100 text-yellow-800" 
                                             : application.status === "accepted"
                                             ? "bg-green-100 text-green-800"
                                             : "bg-red-100 text-red-800"
                                       }`}>
                                          {application.status.toUpperCase()}
                                       </span>
                                    </div>
                                 </div>
                              </div>

                              {/* Cover Letter */}
                              {application.coverLetter && (
                                 <p className="text-xs md:text-sm text-secondary-700 leading-relaxed">
                                    {application.coverLetter}
                                 </p>
                              )}

                              {/* Budget and Time Info */}
                              <div className="flex items-center gap-4 text-xs text-secondary-600">
                                 {application.proposedTime
                                    ?.estimatedDuration && (
                                    <span>
                                       Est.{" "}
                                       {
                                          application.proposedTime
                                             .estimatedDuration
                                       }
                                       h
                                    </span>
                                 )}
                                 {application.selectedDates && application.selectedDates.length > 0 && (
                                    <span>
                                       Dates: {formatSelectedDates(application.selectedDates)}
                                    </span>
                                 )}
                                 {/* Only show negotiable status to task owner */}
                                 {isOwner && application.proposedBudget?.isNegotiable && (
                                    <span className="text-primary-600">
                                       Negotiable
                                    </span>
                                 )}
                              </div>

                              {/* Relevant Experience */}
                              {application.relevantExperience &&
                                 application.relevantExperience.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                       {application.relevantExperience.map(
                                          (exp, index) => (
                                             <span
                                                key={index}
                                                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded"
                                             >
                                                {exp}
                                             </span>
                                          )
                                       )}
                                    </div>
                                 )}

                              {isOwner && application.status === "pending" && application.negotiation?.status === "countered_by_tasker" && (
                                 <>
                                    <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 mb-3">
                                       <p className="text-xs text-amber-800 font-bold">
                                                               Tasker countered with ₹{(application.negotiation?.currentAmount ?? getApplicationAmount(application)).toLocaleString()}
                                       </p>
                                    </div>
                                    <div className="flex gap-2 w-full flex-wrap">
                                       <Button
                                          size="sm"
                                          onClick={() => handleAcceptOffer(application)}
                                          className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-[10px] md:text-xs font-semibold px-5"
                                       >
                                          Accept & Pay
                                       </Button>
                                       {application.proposedBudget?.isNegotiable && (
                                          <Button
                                             size="sm"
                                             variant="outline"
                                             onClick={() => openCounterDialog(application)}
                                             className="rounded-lg text-[10px] md:text-xs font-semibold px-5"
                                          >
                                             Counter again
                                          </Button>
                                       )}
                                       <Button
                                          size="sm"
                                          variant="outline"
                                          className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg text-[10px] md:text-xs font-semibold px-5"
                                          onClick={() => handleNegotiationAction(application, "reject")}
                                       >
                                          Reject
                                       </Button>
                                    </div>
                                 </>
                              )}

                              {isOwner && application.status === "pending" && application.negotiation?.status === "accepted" && (
                                 <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-3 flex items-start justify-between gap-2">
                                    <div>
                                       <p className="text-xs text-green-800 font-bold">✓ Tasker accepted</p>
                                       <p className="text-[11px] text-green-700 mt-1">
                                          Agreed price: ₹{(application.negotiation?.currentAmount ?? application.proposedBudget?.amount ?? 0).toLocaleString()}
                                       </p>
                                    </div>
                                 </div>
                              )}

                              {isOwner && application.status === "pending" && application.negotiation?.status !== "countered_by_tasker" && (
                                 <div className="flex gap-2 w-full flex-wrap">
                                    <Link
                                       href={buildPublicProfilePath(
                                          application.applicantProfile?.name,
                                          application.applicantId
                                       )}
                                    >
                                       <Button
                                          size="sm"
                                          variant="ghost"
                                          className="text-secondary-600 hover:bg-secondary-50 rounded-lg text-[10px] md:text-xs font-medium"
                                       >
                                          View Profile
                                       </Button>
                                    </Link>

                                    <Button
                                       size="sm"
                                       onClick={() => handleAcceptOffer(application)}
                                       className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-[10px] md:text-xs font-semibold px-5"
                                    >
                                       {application.negotiation?.status === "accepted" ? "Assign & Pay" : "Accept Offer"}
                                    </Button>

                                    {application.proposedBudget?.isNegotiable && (
                                       <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => openCounterDialog(application)}
                                          className="rounded-lg text-[10px] md:text-xs font-semibold px-5"
                                       >
                                          Negotiate
                                       </Button>
                                    )}

                                    <Button
                                       size="sm"
                                       onClick={() => handleRejectOffer(application)}
                                       variant="outline"
                                       className="text-secondary-600 hover:text-red-600 hover:bg-red-50 border-secondary-300 rounded-lg text-[10px] md:text-xs font-semibold px-5"
                                    >
                                       Reject
                                    </Button>
                                 </div>
                              )}
                           </div>
                        </div>
                     );
                  })}
                     </>
                  )}
               </div>
            )}
         </div>

         <Dialog
            open={!!counterApplication}
            onOpenChange={(open) => {
               if (!open) {
                  setCounterApplication(null);
                  setCounterAmountInput("");
               }
            }}
         >
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle>Counter offer</DialogTitle>
               </DialogHeader>
               <div className="space-y-3">
                  <div className="text-sm text-secondary-600">
                     <p className="mb-2 font-medium">Original offer: ₹{getApplicationAmount(counterApplication).toLocaleString()}</p>
                     {counterApplication?.negotiation && counterApplication.negotiation.history && counterApplication.negotiation.history.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-secondary-200">
                           <p className="text-xs font-semibold text-secondary-700 mb-1">Negotiation history:</p>
                           <div className="space-y-1">
                              {counterApplication.negotiation.history.map((entry, idx) => (
                                 <p key={idx} className="text-xs text-secondary-500">
                                    • {entry.action === 'counter' ? 'Counter' : 'Accepted'} by {entry.by === 'poster' ? 'Client' : 'Tasker'}: {entry.action === 'counter' ? `₹${entry.amount?.toLocaleString() || 'N/A'}` : 'N/A'}
                                 </p>
                              ))}
                           </div>
                        </div>
                     )}
                  </div>
                  <div className="space-y-1">
                     {(() => {
                        const inputAmount = Number(counterAmountInput) || 0;
                        const isExceeded = inputAmount > 50000;
                        return (
                           <div className="relative">
                              <span className={`absolute left-3 top-1/2 -translate-y-1/2 ${isExceeded ? 'text-red-500' : 'text-secondary-500'}`}>₹</span>
                              <input
                                 value={counterAmountInput}
                                 onChange={(e) => handleCounterAmountChange(e.target.value)}
                                 inputMode="numeric"
                                 pattern="[0-9]*"
                                 placeholder="Enter amount"
                                 className={`w-full h-11 rounded-md border pl-8 pr-3 text-base focus:outline-none focus:ring-2 ${
                                    isExceeded
                                       ? 'border-red-300 text-red-700 focus:ring-red-500'
                                       : 'border-secondary-300 focus:ring-primary-500'
                                 }`}
                              />
                           </div>
                        );
                     })()}
                     {Number(counterAmountInput) > 50000 && (
                        <p className="text-xs text-red-600 font-medium">Amount exceeds maximum of ₹50,000</p>
                     )}
                  </div>
               </div>
               <DialogFooter>
                  <Button
                     variant="outline"
                     onClick={() => {
                        setCounterApplication(null);
                        setCounterAmountInput("");
                     }}
                  >
                     Cancel
                  </Button>
                  <Button
                     onClick={handleSubmitCounterOffer}
                     disabled={isCounterSubmitting}
                     className="bg-primary-600 hover:bg-primary-700 text-white"
                  >
                     {isCounterSubmitting ? "Sending..." : "Send counter offer"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* Payment Confirmation Modal - render when offer selected so modal opens; posterUid can be empty if auth still loading */}
         {selectedApplication && (
            <PaymentConfirmationModal
               open={showPaymentModal}
               onOpenChange={(open) => {
                  if (!open) setSelectedApplication(null);
                  setShowPaymentModal(open);
               }}
               task={{
                  id: taskId,
                  title:
                     typeof selectedApplication.taskId === "object" &&
                     selectedApplication.taskId !== null &&
                     "title" in selectedApplication.taskId
                        ? String((selectedApplication.taskId as { title?: string }).title || "Task")
                        : "Task",
                  category: taskCategory,
               }}
               application={{
                  id: selectedApplication._id,
                  applicantId: selectedApplication.applicantId as string,
                  proposedBudget: selectedApplication.proposedBudget,
                  selectedDates: selectedApplication.selectedDates,
               }}
               posterUid={currentUser?.uid ?? ""}
               posterPhone={userData?.phone}
               onSuccess={handlePaymentSuccess}
               onError={handlePaymentError}
            />
         )}
      </>
   );
}
