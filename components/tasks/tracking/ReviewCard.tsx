"use client";

/**
 * ReviewCard - Displays an individual review
 * Shows rating, comment, detailed ratings, and response
 */

import React from "react";
import {
   Star,
   ThumbsUp,
   ThumbsDown,
   MessageSquare,
   CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import type { Review } from "@/types/tracking";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
   review: Review;
   currentUserId?: string;
   onHelpful?: (reviewId: string, helpful: boolean) => void;
}

export function ReviewCard({
   review,
   currentUserId,
   onHelpful,
}: ReviewCardProps) {
   const renderStars = (rating: number) => {
      return Array.from({ length: 5 }).map((_, i) => (
         <Star
            key={i}
            className={cn(
               "w-4 h-4",
               i < rating
                  ? "fill-primary-600 text-primary-600"
                  : "fill-secondary-200 text-secondary-200"
            )}
         />
      ));
   };

   const renderRatingBar = (label: string, value?: number) => {
      if (!value) return null;
      return (
         <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-secondary-600 min-w-[100px]">{label}</span>
            <div className="flex items-center gap-1 flex-1">
               {renderStars(value)}
            </div>
         </div>
      );
   };

   return (
      <div className="bg-white rounded-xl shadow-sm border border-secondary-200 p-4 md:p-6">
         {/* Header */}
         <div className="flex items-start justify-between mb-3 md:mb-4">
            <div className="flex items-center gap-2 md:gap-3">
               {review.reviewerAvatar ? (
                  <img
                     src={review.reviewerAvatar}
                     alt={review.reviewerName || "Reviewer"}
                     className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
                  />
               ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary-100 flex items-center justify-center">
                     <span className="text-primary-600 font-semibold text-sm md:text-base">
                        {(review.reviewerName || "R")[0].toUpperCase()}
                     </span>
                  </div>
               )}
               <div>
                  <div className="flex items-center gap-2">
                     <p className="text-sm md:text-base font-medium md:font-semibold text-secondary-900">
                        {review.reviewerName || "Anonymous"}
                     </p>
                     {review.isVerified && (
                        <CheckCircle2 className="w-4 h-4 text-primary-600" />
                     )}
                  </div>
                  <p className="text-[10px] md:text-xs text-secondary-500">
                     {format(new Date(review.createdAt), "MMM dd, yyyy")}
                  </p>
               </div>
            </div>
            {/* Overall Rating */}
            <div className="flex items-center gap-1">
               {renderStars(review.rating)}
            </div>
         </div>

         {/* Title */}
         {review.title && (
            <h4 className="text-sm md:text-base font-semibold text-secondary-900 mb-2">
               {review.title}
            </h4>
         )}

         {/* Comment */}
         {review.comment && (
            <p className="text-xs md:text-sm text-secondary-700 mb-3 md:mb-4 leading-relaxed">
               {review.comment}
            </p>
         )}

         {/* Detailed Ratings */}
         {review.ratings && (
            <div className="bg-secondary-50 rounded-lg p-3 md:p-4 mb-3 md:mb-4 space-y-2">
               {renderRatingBar("Communication", review.ratings.communication)}
               {renderRatingBar("Quality", review.ratings.quality)}
               {renderRatingBar("Timeliness", review.ratings.timeliness)}
               {renderRatingBar(
                  "Professionalism",
                  review.ratings.professionalism
               )}
               {renderRatingBar("Value", review.ratings.value)}
            </div>
         )}

         {/* Response */}
         {review.response && (
            <div className="bg-primary-50 border-l-4 border-primary-600 rounded p-3 md:p-4 mb-3 md:mb-4">
               <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-primary-600" />
                  <p className="text-xs md:text-sm font-semibold text-primary-900">
                     Response
                  </p>
               </div>
               <p className="text-xs md:text-sm text-secondary-700 leading-relaxed">
                  {review.response.comment}
               </p>
               <p className="text-[10px] md:text-xs text-secondary-500 mt-2">
                  {review.response.timestamp && !isNaN(new Date(review.response.timestamp).getTime())
                     ? format(new Date(review.response.timestamp), "MMM dd, yyyy")
                     : "Recent"}
               </p>
            </div>
         )}

         {/* Helpful Actions */}
         <div className="flex items-center gap-4 pt-3 border-t border-secondary-100">
            <button
               onClick={() => onHelpful?.(review._id, true)}
               className="flex items-center gap-1.5 text-xs md:text-sm text-secondary-600 hover:text-primary-600 transition-colors"
            >
               <ThumbsUp className="w-4 h-4" />
               <span>Helpful ({review.helpful})</span>
            </button>
            <button
               onClick={() => onHelpful?.(review._id, false)}
               className="flex items-center gap-1.5 text-xs md:text-sm text-secondary-600 hover:text-secondary-900 transition-colors"
            >
               <ThumbsDown className="w-4 h-4" />
               <span>{review.notHelpful}</span>
            </button>
         </div>
      </div>
   );
}
