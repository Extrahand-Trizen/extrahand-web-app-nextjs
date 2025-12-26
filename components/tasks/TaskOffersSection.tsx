"use client";

import { useState, useEffect, useRef } from "react";
import { Star, CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

import type { TaskApplication } from "@/types/application";
import { applicationsApi } from "@/lib/api/endpoints/applications";
import { AcceptOfferModal } from "./offers/AcceptOfferModal";

interface TaskOffersSectionProps {
   taskId: string;
   isOwner?: boolean;
   onApplicationsCountChange?: (count: number) => void;
}

// Mock user data (would come from API)
const mockUserData: Record<
   string,
   { name: string; rating: number; completedTasks: number; verified: boolean }
> = {
   performer1: {
      name: "Arun Singh",
      rating: 4.9,
      completedTasks: 47,
      verified: true,
   },
   performer2: {
      name: "Sunita Devi",
      rating: 4.8,
      completedTasks: 32,
      verified: true,
   },
   performer3: {
      name: "Ramesh Kumar",
      rating: 4.7,
      completedTasks: 28,
      verified: false,
   },
};

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

export function TaskOffersSection({
   taskId,
   isOwner = false,
   onApplicationsCountChange,
}: TaskOffersSectionProps) {
   const [applications, setApplications] = useState<TaskApplication[]>([]);
   const [loading, setLoading] = useState(true);
   const [sortBy, setSortBy] = useState<"newest" | "price-low" | "rating">(
      "newest"
   );
   const [selectedApplication, setSelectedApplication] =
      useState<TaskApplication | null>(null);
   const [showAcceptModal, setShowAcceptModal] = useState(false);
   const onApplicationsCountChangeRef = useRef(onApplicationsCountChange);

   // Keep ref updated with latest callback
   useEffect(() => {
      onApplicationsCountChangeRef.current = onApplicationsCountChange;
   }, [onApplicationsCountChange]);

   useEffect(() => {
      const loadApplications = async () => {
         // Only load if user is the owner
         if (!isOwner) {
            console.log("ℹ️ Not the task owner, skipping applications fetch");
            setLoading(false);
            return;
         }

         try {
            setLoading(true);
            
            // Fetch real applications for this task
            const response = await applicationsApi.getTaskApplications(taskId);
            
            console.log("✅ Task applications raw response:", response);
            console.log("✅ Response type:", typeof response);
            console.log("✅ Response keys:", response ? Object.keys(response) : "null");
            
            // Handle different response structures from API
            const responseData = response as any;
            let apps: any[] = [];
            
            // Try different paths to find the applications array
            if (responseData?.data?.data?.applications) {
               apps = responseData.data.data.applications;
               console.log("✅ Found apps at data.data.applications");
            } else if (responseData?.data?.applications) {
               apps = responseData.data.applications;
               console.log("✅ Found apps at data.applications");
            } else if (responseData?.applications) {
               apps = responseData.applications;
               console.log("✅ Found apps at applications");
            } else if (Array.isArray(responseData?.data)) {
               apps = responseData.data;
               console.log("✅ Found apps at data (array)");
            } else if (Array.isArray(responseData)) {
               apps = responseData;
               console.log("✅ Found apps as direct array");
            }
            
            console.log("✅ Extracted applications:", apps);
            console.log("✅ Applications count:", apps.length);
            
            // Filter to only show pending applications
            const pendingApps = apps.filter((app: any) => app.status === "pending");
            console.log("✅ Pending applications:", pendingApps.length);
            setApplications(pendingApps);
         } catch (error: any) {
            console.error("Error loading applications:", error);
            
            // Check if it's a 403 authorization error - user is not task owner
            const status = error?.status || error?.data?.status;
            if (status === 403) {
               console.log("ℹ️ User is not the task owner, cannot view applications");
               setApplications([]);
            }
         } finally {
            setLoading(false);
         }
      };

      if (taskId) {
         loadApplications();
      }
   }, [taskId, isOwner]);

   // Notify parent of count changes in a separate effect to avoid render issues
   useEffect(() => {
      onApplicationsCountChangeRef.current?.(applications.length);
   }, [applications.length]);

   const handleAcceptOffer = (application: TaskApplication) => {
      setSelectedApplication(application);
      setShowAcceptModal(true);
   };

   const handleAcceptSuccess = () => {
      // Remove accepted application from list
      if (selectedApplication) {
         setApplications((prev) => {
            const updated = prev.filter(
               (app) => app._id !== selectedApplication._id
            );
            // Notify parent of updated count
            onApplicationsCountChangeRef.current?.(updated.length);
            return updated;
         });
      }
      setSelectedApplication(null);
   };

   const sortedApplications = [...applications].sort((a, b) => {
      if (sortBy === "price-low")
         return a.proposedBudget.amount - b.proposedBudget.amount;
      if (sortBy === "rating") {
         const userA = mockUserData[a.applicantUid];
         const userB = mockUserData[b.applicantUid];
         return (userB?.rating || 0) - (userA?.rating || 0);
      }
      // newest (default order)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
   });

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
                  {sortedApplications.map((application) => {
                     const user = application.applicantProfile

                     return (
                        <div
                           key={application._id}
                           className="p-3 sm:p-4 md:p-6 rounded-xl bg-secondary-50/50 hover:bg-white hover:shadow-lg transition-all duration-200 border border-transparent hover:border-primary-100"
                        >
                           <div className="flex flex-col gap-4">
                              {/* Header: Avatar + Name + Time */}
                              <div className="flex items-center justify-between gap-3">
                                 <div className="flex gap-3">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-primary-500 flex items-center justify-center text-white text-lg md:text-xl font-bold shrink-0 shadow-md">
                                       {user.name.charAt(0)}
                                    </div>

                                    <div className="min-w-0">
                                       <div className="flex items-center gap-2">
                                          <h3 className="font-bold text-secondary-900 text-sm sm:text-base truncate">
                                             {user.name}
                                          </h3>
                                          {user.verified && (
                                             <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
                                          )}
                                       </div>

                                       <div className="flex items-center gap-2 text-xs text-secondary-500 mt-1">
                                          <div className="flex items-center gap-1">
                                             <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                             <span className="font-semibold text-secondary-900">
                                                {user.rating}
                                             </span>
                                          </div>
                                          <span className="text-secondary-300">
                                             •
                                          </span>
                                          <span>
                                             {user.completedTasks} tasks
                                          </span>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="text-right">
                                    <div className="text-lg font-bold text-primary-600 mb-1">
                                       ₹
                                       {application.proposedBudget.amount.toLocaleString()}
                                    </div>
                                    <span className="text-xs text-secondary-400 font-medium">
                                       {getTimeAgo(application.createdAt)}
                                    </span>
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
                                 <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-secondary-600 hover:bg-secondary-50 rounded-lg text-[10px] md:text-xs font-medium"
                                 >
                                    <Link
                                       href={`/profile/${application.applicantUid}`}
                                    >
                                       View Profile
                                    </Link>
                                 </Button>

                                 <Link href="/chat">
                                    <Button
                                       size="sm"
                                       variant="outline"
                                       className="border-secondary-200 text-secondary-700 hover:bg-secondary-50 rounded-lg text-[10px] md:text-xs font-medium"
                                    >
                                       Message
                                    </Button>
                                 </Link>

                                 <Button
                                    size="sm"
                                    onClick={() =>
                                       handleAcceptOffer(application)
                                    }
                                    className="bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-[10px] md:text-xs font-semibold px-5"
                                 >
                                    Accept Offer
                                 </Button>
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            )}
         </div>

         {/* Accept Offer Modal */}
         {selectedApplication && (
            <AcceptOfferModal
               application={selectedApplication}
               open={showAcceptModal}
               onOpenChange={setShowAcceptModal}
               onSuccess={handleAcceptSuccess}
            />
         )}
      </>
   );
}
