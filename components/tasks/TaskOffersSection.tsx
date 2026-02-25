"use client";

import { useState, useEffect, useRef } from "react";
import { Star, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
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
import { PaymentConfirmationModal } from "@/components/payments/PaymentConfirmationModal";
import { useAuth } from "@/lib/auth/context";

interface TaskOffersSectionProps {
   taskId: string;
   isOwner?: boolean;
   onApplicationsCountChange?: (count: number) => void;
   userProfile?: Record<string, unknown> | null;
   onMakeOffer?: () => void;
   taskCategory?: string;
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

export function TaskOffersSection({
   taskId,
   isOwner = false,
   onApplicationsCountChange,
   userProfile = null,
   onMakeOffer,
   taskCategory,
}: TaskOffersSectionProps) {
   const [applications, setApplications] = useState<TaskApplication[]>([]);
   const [loading, setLoading] = useState(true);
   const [sortBy, setSortBy] = useState<"newest" | "price-low" | "rating">(
      "newest"
   );
   const [selectedApplication, setSelectedApplication] =
      useState<TaskApplication | null>(null);
   const [showPaymentModal, setShowPaymentModal] = useState(false);
   const { currentUser } = useAuth();
   const onApplicationsCountChangeRef = useRef(onApplicationsCountChange);

   // Keep ref updated with latest callback
   useEffect(() => {
      onApplicationsCountChangeRef.current = onApplicationsCountChange;
   }, [onApplicationsCountChange]);

   useEffect(() => {
      const loadApplications = async () => {
         try {
            setLoading(true);
            
            // Fetch applications for this task
            // Backend handles authorization: owners get all, taskers get only their own
            const response = await applicationsApi.getTaskApplications(taskId);
            
            // Standardized response format: { applications: [...], pagination: {...} }
            const apps = response.applications || [];
            
            // Show applications
            setApplications(apps);
         } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Unknown error";
            console.error("Error loading applications:", message);
            setApplications([]);
         } finally {
            setLoading(false);
         }
      };

      if (taskId) {
         loadApplications();
      }
   }, [taskId]);

   // Notify parent of count changes in a separate effect to avoid render issues
   useEffect(() => {
      // Defer the callback to avoid setState during render
      const timeoutId = setTimeout(() => {
         onApplicationsCountChangeRef.current?.(applications.length);
      }, 0);
      return () => clearTimeout(timeoutId);
   }, [applications.length]);

   const handleAcceptOffer = (application: TaskApplication) => {
      setSelectedApplication(application);
      setShowPaymentModal(true);
   };

   const handlePaymentSuccess = async () => {
      try {
         if (!selectedApplication) return;

         // Update application status to accepted after payment
         await applicationsApi.updateApplicationStatus(selectedApplication._id, {
            status: "accepted",
         });

         toast.success("Payment successful!", {
            description: "Task assigned to tasker. Money held in escrow.",
         });

         // Update local state
         setApplications((prev) =>
            prev.map((app) =>
               app._id === selectedApplication._id
                  ? { ...app, status: "accepted" as const }
                  : app.status === "pending"
                  ? { ...app, status: "rejected" as const }
                  : app
            )
         );

         setSelectedApplication(null);
      } catch (error) {
         console.error("Error updating application:", error);
         toast.error("Payment successful but failed to update task", {
            description: "Please contact support if task doesn't update.",
         });
      }
   };

   const handlePaymentError = (error: Error) => {
      toast.error("Payment failed", {
         description: error.message || "Please try again.",
      });
   };

   const sortedApplications = [...applications].sort((a, b) => {
      if (sortBy === "price-low")
         return a.proposedBudget.amount - b.proposedBudget.amount;
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

   // Find user's own application by comparing applicantId with userProfile._id
   const myApplication = !isOwner && userProfile 
      ? applications.find(app => app.applicantId === userProfile._id)
      : null;

   // If not owner and has application, show their own application
   if (!isOwner && myApplication) {
      return (
         <div className="p-6">
            <div className="bg-primary-50 border border-primary-200 rounded-xl p-5">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-secondary-900">Your Offer</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                     myApplication.status === "pending" 
                        ? "bg-yellow-100 text-yellow-800" 
                        : myApplication.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
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
               </div>
            </div>
         </div>
      );
   }

   // If not owner and no application, show make offer button
   if (!isOwner && !myApplication) {
      return (
         <div className="p-8 text-center">
            <p className="text-secondary-600 mb-4">
               Interested in this task? Submit your offer!
            </p>
            <Button
               onClick={onMakeOffer}
               className="bg-primary-600 hover:bg-primary-700"
            >
               Make an Offer
            </Button>
         </div>
      );
   }

   return (
      <>
         <div className="p-4 md:p-8">
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
                     Make the first offer and get ahead of the competition!
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
                                       <div className="flex gap-3">
                                          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-green-600 flex items-center justify-center text-white text-lg md:text-xl font-bold shrink-0 shadow-md">
                                             {((acceptedApplication.applicantProfile?.name) || "U").charAt(0)}
                                          </div>
                                          <div className="min-w-0">
                                             <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-secondary-900 text-sm sm:text-base truncate">
                                                   {acceptedApplication.applicantProfile?.name || "Unknown User"}
                                                </h3>
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
                                       </div>
                                       <div className="text-right">
                                          <div className="text-xl font-bold text-green-700 mb-1">
                                             ₹{(acceptedApplication.proposedBudget.amount * (acceptedApplication.selectedDates?.length || 1)).toLocaleString()}
                                          </div>
                                          {acceptedApplication.selectedDates && acceptedApplication.selectedDates.length > 0 && (
                                             <div className="text-xs text-secondary-500">
                                                ₹{acceptedApplication.proposedBudget.amount} × {acceptedApplication.selectedDates.length} days
                                             </div>
                                          )}
                                          {acceptedApplication.proposedTime?.estimatedDuration && !acceptedApplication.selectedDates?.length && (
                                             <div className="text-xs text-secondary-500">
                                                Est. {acceptedApplication.proposedTime.estimatedDuration}h
                                             </div>
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
                                       <Link href={`/profile/${acceptedApplication.applicantId}`}>
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
                        ...application.applicantProfile,
                        name: application.applicantProfile?.name || 
                              (application.applicantId ? `User ${application.applicantId.slice(-4)}` : "Unknown User"),
                        rating: application.applicantProfile?.rating || 0,
                        totalReviews: application.applicantProfile?.totalReviews || 0,
                        photoURL: application.applicantProfile?.photoURL || null,
                     };

                     return (
                        <div
                           key={application._id}
                           className="p-3 sm:p-4 md:p-6 rounded-xl bg-secondary-50/50 hover:bg-white hover:shadow-lg transition-all duration-200 border border-transparent hover:border-primary-100"
                        >
                           <div className="flex flex-col gap-4">
                              {/* Header: Avatar + Name + Time */}
                              <div className="flex items-center justify-between gap-3">
                                 <div className="flex gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-lg md:text-xl font-bold shrink-0 shadow-md overflow-hidden">
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
                                          <h3 className="font-bold text-secondary-900 text-sm sm:text-base truncate">
                                             {user.name}
                                          </h3>
                                          {/* Verified badge - can add later based on backend flag */}
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
                                 </div>

                                 <div className="text-right">
                                    <div className="text-lg font-bold text-primary-600 mb-1">
                                       ₹
                                       {(application.proposedBudget.amount * (application.selectedDates?.length || 1)).toLocaleString()}
                                    </div>
                                    {application.selectedDates && application.selectedDates.length > 0 && (
                                       <div className="text-xs text-secondary-400 font-medium mb-1">
                                          ₹{application.proposedBudget.amount} × {application.selectedDates.length} days
                                       </div>
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
                                 {application.proposedBudget.isNegotiable && (
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

                              {/* Actions */}
                              <div className="flex gap-2 w-full flex-wrap">
                                 <Link href={`/profile/${application.applicantId}`}>
                                    <Button
                                       size="sm"
                                       variant="ghost"
                                       className="text-secondary-600 hover:bg-secondary-50 rounded-lg text-[10px] md:text-xs font-medium"
                                    >
                                       View Profile
                                    </Button>
                                 </Link>

                                 <Link
                                    href={`/chat?taskId=${taskId}&otherUserId=${application.applicantId}`}
                                 >
                                    <Button
                                       size="sm"
                                       variant="outline"
                                       className="border-secondary-200 text-secondary-700 hover:bg-secondary-50 rounded-lg text-[10px] md:text-xs font-medium"
                                    >
                                       Message
                                    </Button>
                                 </Link>

                                 {application.status === "pending" && (
                                    <Button
                                       size="sm"
                                       onClick={() =>
                                          handleAcceptOffer(application)
                                       }
                                       className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-[10px] md:text-xs font-semibold px-5"
                                    >
                                       Accept Offer
                                    </Button>
                                 )}
                              </div>
                           </div>
                        </div>
                     );
                  })}
                     </>
                  )}
               </div>
            )}
         </div>

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
               onSuccess={handlePaymentSuccess}
               onError={handlePaymentError}
            />
         )}
      </>
   );
}
