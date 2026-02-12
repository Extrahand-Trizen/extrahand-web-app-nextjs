"use client";

import React from "react";
import PosterBestRatedExperts from "./PosterBestRatedExperts";
import PosterRecentReviewsAndCost from "./PosterRecentReviewsAndCost";
import type { PosterCategoryDetail, PosterTopTasker, PosterReview } from "@/types/category";

interface PosterBestRatedAndReviewsSectionProps {
   serviceLabel: string;
   topTaskers: PosterTopTasker[];
   reviews: PosterReview[];
   category: PosterCategoryDetail | null;
   showCostBlock: boolean;
}

export default function PosterBestRatedAndReviewsSection({
   serviceLabel,
   topTaskers,
   reviews,
   category,
   showCostBlock,
}: PosterBestRatedAndReviewsSectionProps) {
   return (
      <section className="py-16 md:py-24 bg-sky-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PosterBestRatedExperts
               serviceLabel={serviceLabel}
               topTaskers={topTaskers}
            />
            <div className="mt-12 sm:mt-16">
               <PosterRecentReviewsAndCost
                  serviceLabel={serviceLabel}
                  reviews={reviews}
                  category={category}
                  showCostBlock={showCostBlock}
               />
            </div>
         </div>
      </section>
   );
}
