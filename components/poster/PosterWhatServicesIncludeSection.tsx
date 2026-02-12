"use client";

import React from "react";
import type { PosterWhatTheyDoSection } from "@/types/category";

interface PosterWhatServicesIncludeSectionProps {
   serviceLabel: string;
   whatTheyDoTitle: string;
   whatTheyDoSections: PosterWhatTheyDoSection[];
}

export default function PosterWhatServicesIncludeSection({
   serviceLabel,
   whatTheyDoTitle,
   whatTheyDoSections,
}: PosterWhatServicesIncludeSectionProps) {
   const displayTitle =
      whatTheyDoTitle?.trim() &&
      whatTheyDoTitle.toLowerCase().includes((serviceLabel || "").toLowerCase())
         ? whatTheyDoTitle
         : `What does ${(serviceLabel || "these").toLowerCase()} services include?`;
   return (
      <section className="py-16 md:py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
               {displayTitle}
            </h2>
            <div className="space-y-8">
               {whatTheyDoSections.map((section, index) => (
                  <div
                     key={index}
                     className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0"
                  >
                     {section.heading && (
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                           {section.heading}
                        </h3>
                     )}
                     <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {section.body}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
