/**
 * Neighborhoods Grid - Production Ready
 * Simple neighborhood coverage display
 */

"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";

interface NeighborhoodsGridProps {
   neighborhoods: string[];
   citySlug: string;
   cityName: string;
}

export function NeighborhoodsGrid({
   neighborhoods,
   citySlug,
   cityName,
}: NeighborhoodsGridProps) {
   // Split into popular and other neighborhoods
   const popularCount = Math.min(6, Math.floor(neighborhoods.length / 2));
   const popularNeighborhoods = neighborhoods.slice(0, popularCount);
   const otherNeighborhoods = neighborhoods.slice(popularCount);

   return (
      <section className="py-16 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
               <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Neighborhood Coverage
               </h2>
               <p className="text-gray-600">
                  ExtraHand is available across {cityName}
               </p>
            </div>

            {/* Popular neighborhoods */}
            <div className="mb-8">
               <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  Popular Areas
               </h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {popularNeighborhoods.map((neighborhood) => (
                     <Link
                        key={neighborhood}
                        href={`/tasks/new?location=${neighborhood}, ${citySlug}`}
                        className="flex items-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
                     >
                        <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">
                           {neighborhood}
                        </span>
                     </Link>
                  ))}
               </div>
            </div>

            {/* Other neighborhoods */}
            {otherNeighborhoods.length > 0 && (
               <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                     Also Available In
                  </h3>
                  <div className="flex flex-wrap gap-2">
                     {otherNeighborhoods.map((neighborhood) => (
                        <Link
                           key={neighborhood}
                           href={`/tasks/new?location=${neighborhood}, ${citySlug}`}
                           className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md text-sm text-gray-700 hover:text-gray-900 transition-colors"
                        >
                           {neighborhood}
                        </Link>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </section>
   );
}
