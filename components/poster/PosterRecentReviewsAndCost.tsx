"use client";

import React from "react";
import type { PosterCategoryDetail, PosterReview } from "@/types/category";

interface PosterRecentReviewsAndCostProps {
   serviceLabel: string;
   reviews: PosterReview[];
   category: PosterCategoryDetail | null;
   showCostBlock: boolean;
}

export default function PosterRecentReviewsAndCost({ serviceLabel, reviews, category, showCostBlock }: PosterRecentReviewsAndCostProps) {
   return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">Recent {serviceLabel} reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {reviews.slice(0, 6).map((review, index) => (
                  <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                     <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                           <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                           </svg>
                        </div>
                        <div>
                           <p className="font-semibold text-gray-900">{review.reviewerName}</p>
                           {review.reviewerLocation && <p className="text-sm text-gray-600">{review.reviewerLocation}</p>}
                        </div>
                     </div>
                     {review.jobType && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">{review.jobType}</span>
                     )}
                     <p className="text-sm text-gray-700 mb-3 leading-relaxed">{review.text}</p>
                     {review.price && <p className="text-lg font-bold text-gray-900">{review.price}</p>}
                  </div>
               ))}
            </div>
         </div>
         {showCostBlock && (
            <div className="lg:col-span-1">
               <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                     {category?.posterCostTitle || `What's the average cost of a ${serviceLabel.toLowerCase()}?`}
                  </h3>
                  <div className="mb-6">
                     <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">low</span>
                        <span className="font-bold text-blue-600">{category?.posterCostLow || "₹80"}</span>
                     </div>
                     <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">median</span>
                        <span className="text-xl font-bold text-blue-600">{category?.posterCostMedian || "₹125"}</span>
                     </div>
                     <div className="flex justify-between mb-2">
                        <span className="text-sm text-gray-600">high</span>
                        <span className="font-bold text-blue-600">{category?.posterCostHigh || "₹200"}</span>
                     </div>
                     <div className="relative h-28 flex items-end justify-around gap-1 mt-4">
                        {[20, 40, 60, 100, 80, 50, 30, 15].map((h, idx) => (
                           <div key={idx} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${h}%` }}></div>
                        ))}
                     </div>
                     <p className="text-xs text-gray-600 text-center mt-2">
                        {category?.posterCostTasksCount ? `based on ${category.posterCostTasksCount} tasks` : "based on sample tasks"}
                     </p>
                  </div>
                  <div className="border-t border-gray-200 pt-6">
                     <h4 className="text-lg font-bold text-gray-900 mb-4">Average reviews for {serviceLabel}</h4>
                     <div className="flex items-center justify-center mb-4">
                        <div className="text-center">
                           <svg className="w-14 h-14 text-amber-400 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                           </svg>
                           <p className="text-2xl font-bold text-gray-900">{category?.posterAvgRating || "4.9"}</p>
                           <p className="text-sm text-gray-600">
                              {category?.posterAvgReviewsCount ? `based on ${category.posterAvgReviewsCount} reviews` : "based on 500+ reviews"}
                           </p>
                        </div>
                     </div>
                     {category?.posterRatingBreakdown &&
                     (category.posterRatingBreakdown.fiveStar || category.posterRatingBreakdown.fourStar) ? (
                        <div className="space-y-2">
                           {[
                              { stars: 5, count: category.posterRatingBreakdown.fiveStar },
                              { stars: 4, count: category.posterRatingBreakdown.fourStar },
                              { stars: 3, count: category.posterRatingBreakdown.threeStar },
                              { stars: 2, count: category.posterRatingBreakdown.twoStar },
                              { stars: 1, count: category.posterRatingBreakdown.oneStar },
                           ]
                              .filter((item) => item.count)
                              .map((item) => (
                                 <div key={item.stars} className="flex items-center gap-2">
                                    <div className="flex">
                                       {[1, 2, 3, 4, 5].map((i) => (
                                          <svg
                                             key={i}
                                             className={`w-4 h-4 ${i <= item.stars ? "text-amber-400" : "text-gray-300"}`}
                                             fill="currentColor"
                                             viewBox="0 0 20 20"
                                          >
                                             <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                       ))}
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{item.count}</span>
                                 </div>
                              ))}
                        </div>
                     ) : (
                        <div className="space-y-2">
                           {[5, 4, 3, 2, 1].map((stars) => (
                              <div key={stars} className="flex items-center gap-2">
                                 <div className="flex">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                       <svg
                                          key={i}
                                          className={`w-4 h-4 ${i <= stars ? "text-amber-400" : "text-gray-300"}`}
                                          fill="currentColor"
                                          viewBox="0 0 20 20"
                                       >
                                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                       </svg>
                                    ))}
                                 </div>
                                 <span className="text-sm font-medium text-gray-900">
                                    {stars === 5 ? "350" : stars === 4 ? "80" : stars === 3 ? "30" : stars === 2 ? "15" : "25"} reviews
                                 </span>
                              </div>
                           ))}
                        </div>
                     )}
                  </div>
               </div>
            </div>
         )}
      </div>
   );
}
