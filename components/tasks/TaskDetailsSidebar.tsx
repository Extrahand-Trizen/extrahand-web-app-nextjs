"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, Star } from "lucide-react";
import type { Task } from "@/types/task";
import type { UserProfile } from "@/types/user";
import { MakeOfferModal } from "./offers/MakeOfferModal";
import Link from "next/link";
import { profilesApi } from "@/lib/api/endpoints/profiles";

interface TaskDetailsSidebarProps {
   task: Task;
}

export function TaskDetailsSidebar({ task }: TaskDetailsSidebarProps) {
   const [showMakeOfferModal, setShowMakeOfferModal] = useState(false);
   const [requesterProfile, setRequesterProfile] = useState<UserProfile | null>(null);
   const [loadingProfile, setLoadingProfile] = useState(false);
   const budgetAmount =
      typeof task.budget === "object" ? task.budget.amount : task.budget;

   // Fetch requester profile data
   useEffect(() => {
      const fetchRequesterProfile = async () => {
         if (!task.requesterId) return;
         
         setLoadingProfile(true);
         try {
            const profile = await profilesApi.getProfile(task.requesterId);
            setRequesterProfile(profile);
         } catch (error) {
            console.error("Failed to fetch requester profile:", error);
            // Silently fail - component will show defaults
         } finally {
            setLoadingProfile(false);
         }
      };

      fetchRequesterProfile();
   }, [task.requesterId]);

   return (
      <div className="space-y-4 sticky top-24">
         {/* Budget & CTA Card */}
         <div className="bg-white/70 backdrop-blur-sm border border-secondary-100/50 rounded-2xl p-6 shadow-sm">
            <div className="mb-4">
               <div className="text-xs text-secondary-600 mb-1 font-medium uppercase tracking-wide">
                  Task Budget
               </div>
               <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary-600">
                     ₹{budgetAmount.toLocaleString()}
                  </span>
                  {task.budgetType && task.budgetType !== "fixed" && (
                     <span className="text-xs text-secondary-500">
                        {task.budgetType === "hourly" ? "/hr" : "negotiable"}
                     </span>
                  )}
               </div>
            </div>

            {task.status === "open" && (
               <div className="space-y-2">
                  <Button
                     onClick={() => setShowMakeOfferModal(true)}
                     className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold h-12 rounded-xl shadow-sm hover:shadow-md transition-all"
                  >
                     Make an Offer
                  </Button>
                  <Button
                     variant="outline"
                     className="w-full border-secondary-300 text-secondary-700 hover:bg-secondary-50 h-11 font-medium rounded-xl"
                  >
                     Ask a Question
                  </Button>
               </div>
            )}

            {/* Quick Details */}
            <div className="space-y-2.5 pt-4 mt-4 border-t border-secondary-100 text-sm">
               <div className="flex justify-between items-center">
                  <span className="text-secondary-600">Category</span>
                  <span className="font-semibold text-secondary-900">
                     {task.category}
                  </span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-secondary-600">Duration</span>
                  <span className="font-semibold text-secondary-900">
                     {task.estimatedDuration
                        ? `${task.estimatedDuration}h`
                        : "Flexible"}
                  </span>
               </div>
               {typeof task.applications === "number" && (
                  <div className="flex justify-between items-center">
                     <span className="text-secondary-600">Total Offers</span>
                     <span className="font-semibold text-primary-600">
                        {task.applications}
                     </span>
                  </div>
               )}
            </div>
         </div>

         {/* Poster Profile Card */}
         <div className="bg-white/70 backdrop-blur-sm border border-secondary-100/50 rounded-2xl p-6 shadow-sm">
            <h3 className="text-xs font-semibold text-secondary-700 mb-4 uppercase tracking-wide">
               Posted By
            </h3>
            <div className="flex items-start gap-3">
               <div className="w-14 h-14 rounded-full bg-primary-500 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-md">
                  {(task.requesterName || "U")[0].toUpperCase()}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="font-semibold text-secondary-900 mb-1.5 text-base">
                     {task.requesterName || "Task Poster"}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-secondary-600 mb-2">
                     {loadingProfile ? (
                        <span className="text-secondary-500">Loading...</span>
                     ) : (
                        <>
                           <div className="flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="font-medium text-secondary-900">
                                 {requesterProfile?.rating && requesterProfile.rating > 0
                                    ? requesterProfile.rating.toFixed(1)
                                    : "New"}
                              </span>
                           </div>
                           <span>•</span>
                           <span>
                              {requesterProfile?.totalTasks || 0} tasks
                           </span>
                        </>
                     )}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-50 px-2 py-1 rounded-full w-fit">
                     <CheckCircle className="w-3.5 h-3.5" />
                     <span className="font-medium">Verified</span>
                  </div>
               </div>
            </div>
            <Link href={`/profile/${task.requesterId}`}>
               <Button
                  variant="outline"
                  className="w-full mt-4 border-secondary-300 text-secondary-700 hover:bg-secondary-50 text-sm font-medium rounded-xl h-10"
               >
                  View Profile
               </Button>
            </Link>
         </div>

         {/* Trust & Safety Info */}
         <div className="bg-linear-to-br from-primary-50 to-yellow-50 border border-primary-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
               <div className="p-2 bg-primary-100 rounded-lg shrink-0">
                  <Shield className="w-5 h-5 text-primary-600" />
               </div>
               <div>
                  <h3 className="text-sm font-bold text-primary-900 mb-1">
                     Safe & Secure
                  </h3>
                  <p className="text-xs text-primary-800 leading-relaxed">
                     Payments held securely until task completion
                  </p>
               </div>
            </div>
            <div className="space-y-2 text-xs text-primary-800">
               <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                  <span>Verified taskers only</span>
               </div>
               <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                  <span>Secure payment processing</span>
               </div>
               <div className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-primary-600 shrink-0" />
                  <span>24/7 customer support</span>
               </div>
            </div>
         </div>

         {/* Make Offer Modal */}
         <MakeOfferModal
            task={task}
            open={showMakeOfferModal}
            onOpenChange={setShowMakeOfferModal}
         />
      </div>
   );
}
