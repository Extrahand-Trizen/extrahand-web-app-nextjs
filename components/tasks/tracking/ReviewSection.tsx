"use client";

/**
 * ReviewSection - Main section for reviews management
 * Shows existing reviews and allows creating new reviews
 */

import React, { useState } from "react";
import { Star, Plus, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "./ReviewCard";
import { ReviewForm } from "./ReviewForm";
import type { Review, UserRole } from "@/types/tracking";
import type { ReviewRatings } from "@/types/tracking";

interface ReviewSectionProps {
   taskId: string;
   reviews: Review[];
   userRole: UserRole;
   currentUserId?: string;
   reviewedUserId?: string;
   reviewedUserName?: string;
   canReview: boolean; // Whether user can create a review
   onCreateReview: (data: {
      rating: number;
      title?: string;
      comment?: string;
      ratings?: ReviewRatings;
   }) => Promise<void>;
   onHelpful?: (reviewId: string, helpful: boolean) => Promise<void>;
}

export function ReviewSection({
   reviews,
   currentUserId,
   reviewedUserId,
   reviewedUserName,
   canReview,
   onCreateReview,
   onHelpful,
}: ReviewSectionProps) {
   const [showReviewForm, setShowReviewForm] = useState(false);

   // Check if user has already reviewed
   // For mock data: allow reviews even if currentUserId is undefined
   const userReview = currentUserId
      ? reviews.find(
           (r) =>
              r.reviewerUid === currentUserId &&
              reviewedUserId &&
              r.reviewedUid === reviewedUserId
        )
      : null;

   const handleCreateReview = async (data: {
      rating: number;
      title?: string;
      comment?: string;
      ratings?: ReviewRatings;
   }) => {
      try {
         await onCreateReview(data);
         setShowReviewForm(false);
      } catch (error) {
         console.error("Failed to create review:", error);
      }
   };

   // Calculate average rating
   const averageRating =
      reviews.length > 0
         ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
         : 0;

   return (
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4 md:p-6">
         {/* Header */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 md:mb-6">
            <div>
               <h2 className="text-base md:text-lg font-semibold md:font-bold text-secondary-900">
                  Reviews
               </h2>
               <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                     <Star className="w-4 h-4 fill-primary-600 text-primary-600" />
                     <span className="text-sm md:text-base font-semibold text-secondary-900">
                        {averageRating.toFixed(1)}
                     </span>
                  </div>
                  <span className="text-xs md:text-sm text-secondary-500">
                     ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                  </span>
               </div>
            </div>
            {canReview &&
            !userReview &&
            !showReviewForm &&
            reviewedUserId &&
            reviewedUserName ? (
               <Button
                  onClick={() => setShowReviewForm(true)}
                  size="sm"
                  className="w-full sm:w-auto text-sm"
               >
                  <Plus className="w-4 h-4 mr-2" />
                  Write Review
               </Button>
            ) : null}
         </div>

         {/* Review Form */}
         {showReviewForm &&
            canReview &&
            !userReview &&
            reviewedUserId &&
            reviewedUserName && (
               <div className="border border-secondary-200 rounded-lg p-3 md:p-4 lg:p-6 bg-secondary-50 mb-4 md:mb-6">
                  <div className="flex items-center justify-between mb-3 md:mb-4">
                     <h3 className="text-sm md:text-base font-semibold text-secondary-900">
                        Write a Review
                     </h3>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowReviewForm(false)}
                        className="text-xs md:text-sm"
                     >
                        Cancel
                     </Button>
                  </div>
                  <ReviewForm
                     onSubmit={handleCreateReview}
                     onCancel={() => setShowReviewForm(false)}
                     reviewedUserName={reviewedUserName}
                  />
               </div>
            )}

         {/* User's Existing Review */}
         {userReview && (
            <div className="mb-4 md:mb-6">
               <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-primary-600" />
                  <h3 className="text-sm md:text-base font-semibold text-secondary-900">
                     Your Review
                  </h3>
               </div>
               <ReviewCard
                  review={userReview}
                  currentUserId={currentUserId}
                  onHelpful={onHelpful}
               />
            </div>
         )}

         {/* Reviews List */}
         {reviews.length === 0 && !userReview ? (
            <div className="bg-secondary-50 rounded-lg p-6 md:p-8 text-center">
               <Star className="w-10 h-10 md:w-12 md:h-12 text-secondary-300 mx-auto mb-3" />
               <p className="text-sm md:text-base text-secondary-600 font-medium mb-1">
                  No reviews yet
               </p>
               <p className="text-xs md:text-sm text-secondary-500">
                  {canReview && reviewedUserId && reviewedUserName
                     ? "Be the first to leave a review!"
                     : !reviewedUserId || !reviewedUserName
                     ? "Unable to review: Missing user information."
                     : "Reviews will appear here once submitted."}
               </p>
            </div>
         ) : (
            <div className="space-y-3 md:space-y-4">
               {reviews
                  .filter((r) => r._id !== userReview?._id) // Don't show user's review twice
                  .map((review) => (
                     <ReviewCard
                        key={review._id}
                        review={review}
                        currentUserId={currentUserId}
                        onHelpful={onHelpful}
                     />
                  ))}
            </div>
         )}
      </div>
   );
}
