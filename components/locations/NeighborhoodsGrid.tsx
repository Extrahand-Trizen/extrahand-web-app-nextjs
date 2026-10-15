/**
 * Neighborhoods Grid - Production Ready
 * Simple neighborhood coverage display
 */

"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { redirectToAppStore } from "@/lib/utils/getAppStoreUrl";
import type { CityPageContent } from "@/lib/data/city-page-content";

interface NeighborhoodsGridProps {
   neighborhoods: string[];
   citySlug: string;
   cityName: string;
   content?: CityPageContent["neighborhoods"];
}

export function NeighborhoodsGrid({
   neighborhoods,
   citySlug,
   cityName,
   content,
}: NeighborhoodsGridProps) {
   const areas =
      content?.areas || neighborhoods.map((name) => ({
         id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
         name,
      }));
   // Split into popular and other neighborhoods
   const popularCount = Math.min(6, Math.floor(areas.length / 2));
   const popularNeighborhoods = areas.slice(0, popularCount);
   const otherNeighborhoods = areas.slice(popularCount);

   const getNeighborhoodHref = (neighborhoodId: string) => {
      if (citySlug === "hyderabad") {
         return `/locations/hyderabad/${neighborhoodId}`;
      }

      return "#";
   };

   const handleNeighborhoodClick = (e: React.MouseEvent) => {
      if (citySlug !== "hyderabad") {
         e.preventDefault();
         redirectToAppStore();
      }
   };

   return (
      <section className="py-16 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-10">
               <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  {content?.title ?? "Neighborhood Coverage"}
               </h2>
               <p className="text-gray-600">
                  {content?.description ??
                     `ExtraHand is available across ${cityName}`}
               </p>
            </div>

            {/* Popular neighborhoods */}
            <div className="mb-8">
               <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                  {content?.popularAreasHeading ?? "Popular Areas"}
               </h3>
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {popularNeighborhoods.map((neighborhood) => (
                     <Link
                        key={neighborhood.id}
                        href={getNeighborhoodHref(neighborhood.id)}
                        onClick={handleNeighborhoodClick}
                        className="flex items-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
                     >
                        <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm font-medium text-gray-900 truncate">
                           {neighborhood.name}
                        </span>
                     </Link>
                  ))}
               </div>
            </div>

            {/* Other neighborhoods */}
            {otherNeighborhoods.length > 0 && (
               <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                     {content?.otherAreasHeading ?? "Also Available In"}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                     {otherNeighborhoods.map((neighborhood) => (
                        <Link
                           key={neighborhood.id}
                           href={getNeighborhoodHref(neighborhood.id)}
                           onClick={handleNeighborhoodClick}
                           className="px-3 py-2 bg-gray-100 hover:bg-gray-200 border border-gray-200 rounded-md text-sm text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
                        >
                           {neighborhood.name}
                        </Link>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </section>
   );
}
