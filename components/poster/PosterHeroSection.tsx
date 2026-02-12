"use client";

import React from "react";
import Link from "next/link";
import type { PosterCategoryDetail, PosterWhyBookFeature } from "@/types/category";
import { HeroSection } from "@/components/categories";

interface PosterHeroSectionProps {
   category: PosterCategoryDetail | null;
   serviceLabel: string;
   whyBookFeatures: PosterWhyBookFeature[];
}

export default function PosterHeroSection({
   category,
   serviceLabel,
   whyBookFeatures,
}: PosterHeroSectionProps) {
   const heroTitle =
      category?.heroTitle ||
      `Find experienced ${serviceLabel.toLowerCase()} near you`;
   const heroDesc =
      category?.heroDescription ||
      `Fill a short form and get free quotes for professional ${serviceLabel.toLowerCase()} services.`;
   const reviewsCount = category?.reviewsCount || "11114+";
   const slug = category?.slug || "";

   const rightCard = (
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl w-full">
         <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
            Looking for {serviceLabel.toLowerCase()} near you?
         </h3>
         <div className="space-y-3 mb-5">
            {whyBookFeatures.slice(0, 5).map((f, i) => (
               <div key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                     ✓
                  </span>
                  <span className="text-sm text-gray-700">{f.title}</span>
               </div>
            ))}
            <p className="text-xs text-gray-500 pl-7">... or anything else</p>
         </div>
         <Link
            href={slug ? `/tasks/new?category=${encodeURIComponent(slug)}` : "/tasks/new"}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3.5 px-4 rounded-lg transition-colors duration-200 text-center text-sm sm:text-base"
         >
            Hire top-rated {serviceLabel.toLowerCase()} near me
         </Link>
         <p className="text-xs text-gray-500 text-center mt-3">
            It only takes 2 minutes. And it is free.
         </p>
         <p className="mt-4 text-xs text-gray-400 text-center">
            Great rating – 4.2/5 ({reviewsCount} reviews)
         </p>
      </div>
   );

   return (
      <HeroSection
         categoryName={category?.name || `${serviceLabel} Services`}
         heroImage={category?.heroImage}
         heroTitle={heroTitle}
         heroDescription={heroDesc}
         showBreadcrumbs={false}
         rightCard={rightCard}
      />
   );
}
