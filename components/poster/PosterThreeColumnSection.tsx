"use client";

import React, { useState } from "react";

const INITIAL_VISIBLE = 5;

function CollapsibleList({
   items,
   onItemClick,
   linkCls,
   expanded,
   onToggle,
}: {
   items: string[];
   onItemClick: (item: string) => void;
   linkCls: string;
   expanded: boolean;
   onToggle: () => void;
}) {
   const hasMore = items.length > INITIAL_VISIBLE;
   const visibleItems = expanded || !hasMore ? items : items.slice(0, INITIAL_VISIBLE);
   return (
      <ul className="space-y-2">
         {visibleItems.map((item, i) => (
            <li key={i}>
               <button type="button" onClick={() => onItemClick(item)} className={linkCls}>
                  {item}
               </button>
            </li>
         ))}
         {hasMore && (
            <li className="pt-1">
               <button
                  type="button"
                  onClick={onToggle}
                  className="text-blue-600 hover:underline text-left text-sm font-medium"
               >
                  {expanded ? "View less" : "View more"}
               </button>
            </li>
         )}
      </ul>
   );
}

interface PosterThreeColumnSectionProps {
   serviceLabel: string;
   categoryServicesList: string[];
   relatedServicesNearMe: string[];
   topLocationsList: string[];
   relatedLocations: string[];
   onHeadingClick: (headingText: string) => void;
}

export default function PosterThreeColumnSection({
   serviceLabel,
   categoryServicesList,
   relatedServicesNearMe,
   topLocationsList,
   relatedLocations,
   onHeadingClick,
}: PosterThreeColumnSectionProps) {
   const linkCls = "text-blue-600 hover:underline text-left";
   const [expanded, setExpanded] = useState({
      services: false,
      relatedServices: false,
      topLocations: false,
      relatedLocations: false,
   });
   const toggle = (key: keyof typeof expanded) => () => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

   return (
      <section className="py-16 md:py-24 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                     {serviceLabel} Services
                  </h3>
                  <CollapsibleList
                     items={categoryServicesList}
                     onItemClick={onHeadingClick}
                     linkCls={linkCls}
                     expanded={expanded.services}
                     onToggle={toggle("services")}
                  />
               </div>
               <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                     Related Services near me
                  </h3>
                  <CollapsibleList
                     items={relatedServicesNearMe}
                     onItemClick={onHeadingClick}
                     linkCls={linkCls}
                     expanded={expanded.relatedServices}
                     onToggle={toggle("relatedServices")}
                  />
               </div>
               <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                     Top Locations
                  </h3>
                  <CollapsibleList
                     items={topLocationsList}
                     onItemClick={onHeadingClick}
                     linkCls={linkCls}
                     expanded={expanded.topLocations}
                     onToggle={toggle("topLocations")}
                  />
               </div>
               <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                     Related Locations
                  </h3>
                  <CollapsibleList
                     items={relatedLocations}
                     onItemClick={onHeadingClick}
                     linkCls={linkCls}
                     expanded={expanded.relatedLocations}
                     onToggle={toggle("relatedLocations")}
                  />
               </div>
            </div>
         </div>
      </section>
   );
}
