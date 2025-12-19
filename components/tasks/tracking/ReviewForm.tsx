"use client";

/**
 * ReviewForm - Form for creating/editing a review
 * Includes overall rating, detailed ratings, title, and comment
 */

import React, { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { ReviewRatings } from "@/types/tracking";
import { cn } from "@/lib/utils";

interface ReviewFormProps {
   onSubmit: (data: {
      rating: number;
      title?: string;
      comment?: string;
      ratings?: ReviewRatings;
   }) => Promise<void>;
   onCancel?: () => void;
   initialData?: {
      rating?: number;
      title?: string;
      comment?: string;
      ratings?: ReviewRatings;
   };
   reviewedUserName?: string;
}

export function ReviewForm({
   onSubmit,
   onCancel,
   initialData,
   reviewedUserName,
}: ReviewFormProps) {
   const [rating, setRating] = useState(initialData?.rating || 0);
   const [hoveredOverallRating, setHoveredOverallRating] = useState(0);
   const [hoveredDetailedRating, setHoveredDetailedRating] = useState<
      string | null
   >(null);
   const [hoveredDetailedValue, setHoveredDetailedValue] = useState(0);
   const [title, setTitle] = useState(initialData?.title || "");
   const [comment, setComment] = useState(initialData?.comment || "");
   const [detailedRatings, setDetailedRatings] = useState<ReviewRatings>(
      initialData?.ratings || {}
   );
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (rating === 0) return;

      setIsSubmitting(true);
      try {
         await onSubmit({
            rating,
            title: title.trim() || undefined,
            comment: comment.trim() || undefined,
            ratings:
               Object.keys(detailedRatings).length > 0
                  ? detailedRatings
                  : undefined,
         });
      } catch (error) {
         console.error("Review submission error:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   const renderStarRating = (
      value: number,
      onChange: (value: number) => void,
      label: string,
      ratingKey: keyof ReviewRatings
   ) => {
      const isHovered = hoveredDetailedRating === ratingKey;
      const hoverValue = isHovered ? hoveredDetailedValue : 0;

      return (
         <div className="flex items-center gap-1.5 md:gap-2">
            <span className="text-[10px] md:text-xs lg:text-sm text-secondary-600 min-w-[80px] md:min-w-[100px]">
               {label}
            </span>
            <div className="flex items-center gap-0.5 md:gap-1">
               {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  return (
                     <button
                        key={i}
                        type="button"
                        onClick={() => onChange(starValue)}
                        onMouseEnter={() => {
                           setHoveredDetailedRating(ratingKey);
                           setHoveredDetailedValue(starValue);
                        }}
                        onMouseLeave={() => {
                           setHoveredDetailedRating(null);
                           setHoveredDetailedValue(0);
                        }}
                        className="focus:outline-none"
                     >
                        <Star
                           className={cn(
                              "w-3.5 h-3.5 md:w-4 md:h-4 lg:w-5 lg:h-5 transition-colors",
                              starValue <= (hoverValue || value)
                                 ? "fill-primary-600 text-primary-600"
                                 : "fill-secondary-200 text-secondary-200"
                           )}
                        />
                     </button>
                  );
               })}
            </div>
         </div>
      );
   };

   return (
      <form
         onSubmit={handleSubmit}
         className="space-y-3 md:space-y-4 lg:space-y-6"
      >
         {reviewedUserName && (
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-2.5 md:p-3 lg:p-4">
               <p className="text-xs md:text-sm lg:text-base text-primary-900">
                  Reviewing:{" "}
                  <span className="font-semibold">{reviewedUserName}</span>
               </p>
            </div>
         )}

         {/* Overall Rating */}
         <div>
            <Label className="mb-1.5 md:mb-2 block text-xs md:text-sm font-semibold">
               Overall Rating <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-1.5 md:gap-2">
               {Array.from({ length: 5 }).map((_, i) => {
                  const starValue = i + 1;
                  return (
                     <button
                        key={i}
                        type="button"
                        onClick={() => setRating(starValue)}
                        onMouseEnter={() => setHoveredOverallRating(starValue)}
                        onMouseLeave={() => setHoveredOverallRating(0)}
                        className="focus:outline-none"
                     >
                        <Star
                           className={cn(
                              "w-6 h-6 md:w-8 md:h-8 transition-colors",
                              starValue <= (hoveredOverallRating || rating)
                                 ? "fill-primary-600 text-primary-600"
                                 : "fill-secondary-200 text-secondary-200"
                           )}
                        />
                     </button>
                  );
               })}
               {rating > 0 && (
                  <span className="text-xs md:text-sm lg:text-base font-semibold text-secondary-900 ml-1.5 md:ml-2">
                     {rating} / 5
                  </span>
               )}
            </div>
         </div>

         {/* Title */}
         <div>
            <Label
               htmlFor="review-title"
               className="mb-1.5 md:mb-2 block text-xs md:text-sm"
            >
               Title (Optional)
            </Label>
            <Input
               id="review-title"
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               placeholder="Summarize your experience..."
               maxLength={100}
               className="text-xs md:text-sm"
            />
            <p className="text-[10px] md:text-xs text-secondary-500 mt-1">
               {title.length}/100 characters
            </p>
         </div>

         {/* Comment */}
         <div>
            <Label
               htmlFor="review-comment"
               className="mb-1.5 md:mb-2 block text-xs md:text-sm"
            >
               Comment (Optional)
            </Label>
            <Textarea
               id="review-comment"
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               placeholder="Share your detailed experience..."
               rows={4}
               maxLength={1000}
               className="text-xs md:text-sm"
            />
            <p className="text-[10px] md:text-xs text-secondary-500 mt-1">
               {comment.length}/1000 characters
            </p>
         </div>

         {/* Detailed Ratings */}
         <div>
            <Label className="mb-1.5 md:mb-2 block text-xs md:text-sm font-semibold">
               Detailed Ratings (Optional)
            </Label>
            <div className="bg-secondary-50 rounded-lg p-2.5 md:p-3 lg:p-4 space-y-2 md:space-y-3">
               {renderStarRating(
                  detailedRatings.communication || 0,
                  (value) =>
                     setDetailedRatings({
                        ...detailedRatings,
                        communication: value,
                     }),
                  "Communication",
                  "communication"
               )}
               {renderStarRating(
                  detailedRatings.quality || 0,
                  (value) =>
                     setDetailedRatings({
                        ...detailedRatings,
                        quality: value,
                     }),
                  "Quality",
                  "quality"
               )}
               {renderStarRating(
                  detailedRatings.timeliness || 0,
                  (value) =>
                     setDetailedRatings({
                        ...detailedRatings,
                        timeliness: value,
                     }),
                  "Timeliness",
                  "timeliness"
               )}
               {renderStarRating(
                  detailedRatings.professionalism || 0,
                  (value) =>
                     setDetailedRatings({
                        ...detailedRatings,
                        professionalism: value,
                     }),
                  "Professionalism",
                  "professionalism"
               )}
               {renderStarRating(
                  detailedRatings.value || 0,
                  (value) =>
                     setDetailedRatings({
                        ...detailedRatings,
                        value: value,
                     }),
                  "Value",
                  "value"
               )}
            </div>
         </div>

         {/* Actions */}
         <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-1.5 md:pt-2">
            {onCancel && (
               <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 text-xs md:text-sm"
                  disabled={isSubmitting}
               >
                  Cancel
               </Button>
            )}
            <Button
               type="submit"
               className="flex-1 text-xs md:text-sm"
               disabled={isSubmitting || rating === 0}
            >
               {isSubmitting ? "Submitting..." : "Submit Review"}
            </Button>
         </div>
      </form>
   );
}
