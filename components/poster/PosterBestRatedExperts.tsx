"use client";

import React from "react";
import type { PosterTopTasker } from "@/types/category";

interface PosterBestRatedExpertsProps {
   serviceLabel: string;
   topTaskers: PosterTopTasker[];
}

export default function PosterBestRatedExperts({ serviceLabel, topTaskers }: PosterBestRatedExpertsProps) {
   return (
      <>
         <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Best rated {serviceLabel.toLowerCase()} near me
         </h2>
         <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {topTaskers.slice(0, 8).map((tasker, index) => (
               <div key={index} className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 hover:shadow-lg transition-shadow flex flex-col min-w-0">
                  <div className="flex gap-4 mb-4 flex-shrink-0">
                     <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                        {tasker.profileImage ? (
                           <img src={tasker.profileImage} alt={tasker.name} className="w-full h-full object-cover" />
                        ) : (
                           <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                 <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                           </div>
                        )}
                     </div>
                     <div className="min-w-0 flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 truncate">{tasker.name}</h3>
                        {tasker.location && <p className="text-sm text-gray-500 truncate">{tasker.location}</p>}
                        <div className="flex items-center gap-1.5 mt-1">
                           <svg className="w-4 h-4 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                           </svg>
                           {tasker.rating && <span className="font-bold text-gray-900 text-sm">{tasker.rating}</span>}
                           {tasker.reviewsCount && <span className="text-sm text-gray-500">{tasker.reviewsCount}</span>}
                        </div>
                     </div>
                  </div>
                  <div className="mb-4 flex-1 min-w-0">
                     <h4 className="text-sm font-bold text-gray-900 mb-1.5">Latest Review</h4>
                     {tasker.latestReviewText ? (
                        <p className="text-sm text-gray-600 leading-snug line-clamp-3">&ldquo;{tasker.latestReviewText}&rdquo;</p>
                     ) : (
                        <p className="text-sm text-gray-500 italic">No review yet.</p>
                     )}
                  </div>
                  <div className="mb-4 flex-shrink-0">
                     <h4 className="text-sm font-bold text-gray-900 mb-2">Verified Badges</h4>
                     <div className="flex items-center gap-2 flex-wrap">
                        {tasker.isVerified && (
                           <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0" title="Verified">
                              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                 <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                           </span>
                        )}
                        <span className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0" title="Contact">
                           <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                           </svg>
                        </span>
                        {tasker.isTopRated && (
                           <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs font-medium rounded">Top Rated</span>
                        )}
                     </div>
                  </div>
                  <a
                     href="/tasks/new"
                     className="block w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm sm:text-base mt-auto text-center"
                  >
                     Request a Quote
                  </a>
               </div>
            ))}
         </div>
      </>
   );
}
