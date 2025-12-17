"use client";

/**
 * Public Profile View
 * What others see when viewing a user's profile
 */

import React from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
   Star,
   Shield,
   MapPin,
   Calendar,
   CheckCircle2,
   Briefcase,
   ThumbsUp,
} from "lucide-react";
import { UserProfile } from "@/types/user";
import { Review, WorkHistoryItem } from "@/types/profile";

interface PublicProfileProps {
   user: UserProfile;
   reviews?: Review[];
   workHistory?: WorkHistoryItem[];
   isOwnProfile?: boolean;
}

export function PublicProfile({
   user,
   reviews = [],
   workHistory = [],
   isOwnProfile = false,
}: PublicProfileProps) {
   return (
      <div className="max-w-4xl mx-auto space-y-6">
         {/* Preview Banner (only for own profile) */}
         {isOwnProfile && (
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-2 md:p-3">
               <p className="text-xs md:text-sm text-primary-700">
                  This is how your profile appears to others on ExtraHand
               </p>
            </div>
         )}

         {/* Profile Header */}
         <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start gap-5">
               <Avatar className="md:w-20 md:h-20 w-16 h-16 shrink-0">
                  <AvatarImage
                     src={user.photoURL || undefined}
                     alt={user.name}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-2xl font-medium">
                     {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
               </Avatar>

               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                     <h1 className="md:text-lg font-semibold text-gray-900">
                        {user.name}
                     </h1>
                     {user.verificationBadge &&
                        user.verificationBadge !== "none" && (
                           <Badge
                              variant="secondary"
                              className={cn(
                                 "capitalize text-[9px] md:text-xs",
                                 user.verificationBadge === "verified" &&
                                    "bg-green-100 text-green-700",
                                 user.verificationBadge === "trusted" &&
                                    "bg-blue-100 text-blue-700",
                                 user.verificationBadge === "basic" &&
                                    "bg-gray-100 text-gray-700"
                              )}
                           >
                              <Shield className="size-2.5 md:size-3 mr-1" />
                              {user.verificationBadge}
                           </Badge>
                        )}
                  </div>

                  {/* Rating and Reviews */}
                  <div className="flex items-center gap-3 md:gap-4 mt-2">
                     <div className="flex items-center gap-1">
                        <Star className="size-3.5 md:size-5 text-amber-400 fill-amber-400" />
                        <span className="text-xs md:text-sm font-semibold text-gray-900">
                           {user.rating?.toFixed(1) || "0.0"}
                        </span>
                     </div>
                     <span className="text-gray-500 text-xs md:text-sm">
                        ({user.totalReviews || 0} reviews)
                     </span>
                     <span className="text-xs md:text-sm text-gray-500">
                        {user.completedTasks || 0} tasks completed
                     </span>
                  </div>

                  {/* Location */}
                  {user.location?.city && (
                     <div className="flex items-center gap-1.5 mt-2 text-xs md:text-sm text-gray-500">
                        <MapPin className="size-3.5 md:size-4" />
                        <span>
                           {user.location.city}
                           {user.location.state
                              ? `, ${user.location.state}`
                              : ""}
                        </span>
                     </div>
                  )}

                  {/* Member Since */}
                  <div className="flex items-center gap-1.5 mt-1 text-xs md:text-sm text-gray-500">
                     <Calendar className="size-3.5 md:size-4" />
                     <span>Member since {formatDate(user.createdAt)}</span>
                  </div>
               </div>
            </div>
         </div>

         {/* About Section */}
         {user.business?.description && (
            <div className="bg-white rounded-lg border border-gray-200 p-5">
               <h2 className="text-sm font-medium text-gray-900 mb-3">About</h2>
               <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {user.business.description}
               </p>
            </div>
         )}

         {/* Skills */}
         {user.skills?.list && user.skills.list.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-5">
               <h2 className="text-sm font-medium text-gray-900 mb-3">
                  Skills & Services
               </h2>
               <div className="flex flex-wrap gap-2">
                  {user.skills.list.map((skill, index) => (
                     <Badge
                        key={index}
                        variant="secondary"
                        className="bg-gray-100 text-xs md:text-sm text-gray-700 hover:bg-gray-100"
                     >
                        {skill.name}
                        {skill.verified && (
                           <CheckCircle2 className="w-3 h-3 ml-1 text-green-500" />
                        )}
                     </Badge>
                  ))}
               </div>
            </div>
         )}

         {/* Stats */}
         <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 text-center">
               <p className="text-xl md:text-2xl font-semibold text-gray-900">
                  {user.completedTasks || 0}
               </p>
               <p className="text-xs text-gray-500 mt-1">Tasks Completed</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
               <p className="text-xl md:text-2xl font-semibold text-gray-900">
                  {user.rating?.toFixed(1) || "0.0"}
               </p>
               <p className="text-xs text-gray-500 mt-1">Average Rating</p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
               <p className="text-xl md:text-2xl font-semibold text-gray-900">
                  {calculateResponseRate(user)}%
               </p>
               <p className="text-xs text-gray-500 mt-1">Response Rate</p>
            </div>
         </div>

         {/* Verification Badges */}
         <div className="bg-white rounded-lg border border-gray-200 p-5">
            <h2 className="text-sm font-medium text-gray-900 mb-4">
               Verifications
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
               <VerificationBadge label="Phone" verified={!!user.phone} />
               <VerificationBadge label="Email" verified={!!user.email} />
               <VerificationBadge
                  label="Identity"
                  verified={user.isAadhaarVerified}
               />
               {user.userType === "business" && (
                  <VerificationBadge label="PAN" verified={user.isPanVerified} />
               )}
            </div>
         </div>

         {/* Reviews Section */}
         <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-5 py-4 border-b border-gray-100">
               <h2 className="text-sm font-medium text-gray-900">
                  Reviews ({reviews.length || user.totalReviews || 0})
               </h2>
            </div>

            {reviews.length > 0 ? (
               <div className="divide-y divide-gray-100">
                  {reviews.map((review) => (
                     <ReviewItem key={review.id} review={review} />
                  ))}
               </div>
            ) : (
               <div className="px-5 py-8 text-center">
                  <ThumbsUp className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No reviews yet</p>
               </div>
            )}
         </div>

         {/* Work History */}
         {workHistory.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200">
               <div className="px-5 py-4 border-b border-gray-100">
                  <h2 className="text-sm font-medium text-gray-900">
                     Recent Work ({workHistory.length})
                  </h2>
               </div>
               <div className="divide-y divide-gray-100">
                  {workHistory.slice(0, 5).map((item) => (
                     <WorkHistoryItemRow key={item.id} item={item} />
                  ))}
               </div>
            </div>
         )}
      </div>
   );
}

// Helper Components
interface VerificationBadgeProps {
   label: string;
   verified: boolean;
}

function VerificationBadge({ label, verified }: VerificationBadgeProps) {
   return (
      <div
         className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg",
            verified ? "bg-green-50" : "bg-gray-50"
         )}
      >
         {verified ? (
            <CheckCircle2 className="size-3.5 md:size-4 text-green-500" />
         ) : (
            <div className="size-3.5 md:size-4 rounded-full border-2 border-gray-300" />
         )}
         <span
            className={cn(
               "text-xs md:text-sm",
               verified ? "text-green-700" : "text-gray-500"
            )}
         >
            {label}
         </span>
      </div>
   );
}

interface ReviewItemProps {
   review: Review;
}

function ReviewItem({ review }: ReviewItemProps) {
   return (
      <div className="px-5 py-4">
         <div className="flex items-start gap-3">
            <Avatar className="size-8 md:size-10">
               <AvatarImage src={review.reviewerPhoto} />
               <AvatarFallback className="bg-gray-100 text-gray-600 text-xs md:text-sm">
                  {review.reviewerName.charAt(0).toUpperCase()}
               </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs md:text-sm font-medium text-gray-900">
                     {review.reviewerName}
                  </span>
                  <div className="flex items-center gap-0.5">
                     {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                           key={i}
                           className={cn(
                              "size-3 md:size-3.5",
                              i < review.rating
                                 ? "text-amber-400 fill-amber-400"
                                 : "text-gray-200"
                           )}
                        />
                     ))}
                  </div>
               </div>
               <p className="text-[10px] md:text-xs text-gray-500 mt-0.5">
                  {review.taskTitle} • {formatDate(review.createdAt)}
               </p>
               <p className="text-xs md:text-sm text-gray-600 mt-2">{review.comment}</p>
            </div>
         </div>
      </div>
   );
}

interface WorkHistoryItemRowProps {
   item: WorkHistoryItem;
}

function WorkHistoryItemRow({ item }: WorkHistoryItemRowProps) {
   return (
      <div className="px-5 py-3 flex items-center gap-3">
         <Briefcase className="size-4 md:size-5 text-gray-400 shrink-0" />
         <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
               {item.title}
            </p>
            <p className="text-[10px] md:text-xs text-gray-500">
               {item.category} • {formatDate(item.completedAt)}
            </p>
         </div>
         {item.rating && (
            <div className="flex items-center gap-1">
               <Star className="size-3 md:size-4 text-amber-400 fill-amber-400" />
               <span className="text-xs md:text-sm text-gray-600">
                  {item.rating.toFixed(1)}
               </span>
            </div>
         )}
      </div>
   );
}

// Helper functions
function formatDate(date?: Date | string): string {
   if (!date) return "";
   const d = new Date(date);
   return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
   });
}

function calculateResponseRate(user: UserProfile): number {
   // Mock calculation - would be based on actual response data
   return user.completedTasks && user.totalTasks
      ? Math.round((user.completedTasks / user.totalTasks) * 100)
      : 100;
}

export default PublicProfile;
