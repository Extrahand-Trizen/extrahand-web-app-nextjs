"use client";

import React from "react";

interface WaysToEarnContent {
   heading?: string;
   text?: string;
}

interface WaysToEarnSectionProps {
   title?: string;
   content: WaysToEarnContent[];
}

export const WaysToEarnSection: React.FC<WaysToEarnSectionProps> = ({
   title,
   content,
}) => {
   if (!content || content.length === 0) return null;

   // Split content items into 3 columns
   const itemsPerColumn = Math.ceil(content.length / 3);
   const columns: WaysToEarnContent[][] = [[], [], []];

   content.forEach((item, index) => {
      const columnIndex = Math.floor(index / itemsPerColumn);
      if (columnIndex < 3) {
         columns[columnIndex].push(item);
      }
   });

   return (
      <section className="py-16 md:py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            {title && (
               <div className="mb-10 md:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                     {title}
                  </h2>
               </div>
            )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12">
               {columns.map((columnItems, colIndex) => (
                  <div key={colIndex} className="space-y-6">
                     {columnItems.map((item, itemIndex) => (
                        <div key={itemIndex}>
                           {item.heading && (
                              <h3 className="md:text-lg font-semibold text-slate-900 mb-3">
                                 {item.heading}
                              </h3>
                           )}
                           {item.text && (
                              <div className="space-y-4">
                                 {item.text
                                    .split("\n\n")
                                    .filter((p) => p.trim())
                                    .map((paragraph, pIndex) => (
                                       <p
                                          key={pIndex}
                                          className="text-slate-600 leading-relaxed text-sm md:text-base"
                                       >
                                          {paragraph.trim()}
                                       </p>
                                    ))}
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};
