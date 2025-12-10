/**
 * Neighborhoods Grid Component
 * Display all served neighborhoods
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
   return (
      <section className="py-20 lg:py-28 bg-linear-to-br from-secondary-50 via-white to-primary-50/30">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4 tracking-tight">
                  We're in your neighborhood
               </h2>
               <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                  ExtraHand connects you with local taskers across all areas of{" "}
                  {cityName}
               </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
               {neighborhoods.map((neighborhood, index) => (
                  <Link
                     key={neighborhood}
                     href={`/tasks/new?location=${neighborhood}, ${citySlug}`}
                     className="group"
                     style={{
                        animationDelay: `${index * 30}ms`,
                     }}
                  >
                     <div className="relative bg-white hover:bg-gradient-to-br hover:from-primary-50 hover:to-orange-50 rounded-2xl p-5 text-center transition-all duration-300 border-2 border-secondary-100 hover:border-primary-300 hover:shadow-xl hover:-translate-y-1">
                        {/* Decorative element */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary-100 to-orange-100 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <MapPin className="w-6 h-6 text-secondary-400 group-hover:text-primary-600 mx-auto mb-3 transition-colors duration-300" />
                        <div className="font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors text-sm lg:text-base">
                           {neighborhood}
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>
   );
}
