/**
 * Service Categories Grid - Production Ready
 * Clean, locally relevant service categories
 */

"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceCategory } from "@/lib/data/categories";

interface ServiceCategoriesGridProps {
   categories: ServiceCategory[];
   citySlug: string;
   cityName: string;
}

export function ServiceCategoriesGrid({
   categories,
   citySlug,
   cityName,
}: ServiceCategoriesGridProps) {
   return (
      <section className="py-16 bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-10">
               <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Popular Services in {cityName}
               </h2>
               <p className="text-gray-600">
                  What do people in {cityName} need help with?
               </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {categories.map((category) => (
                  <Link
                     key={category.id}
                     href={`/tasks/new?category=${category.id}&location=${citySlug}`}
                     className="group block"
                  >
                     <div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-500 hover:shadow-md transition-all">
                        {/* Icon */}
                        <div className="text-3xl mb-3">{category.icon}</div>

                        {/* Content */}
                        <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                           {category.name}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2">
                           {category.description}
                        </p>

                        {/* Footer */}
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                           {category.avgPrice && (
                              <span className="text-sm font-medium text-gray-700">
                                 {category.avgPrice}
                              </span>
                           )}
                           <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                        </div>
                     </div>
                  </Link>
               ))}
            </div>
         </div>
      </section>
   );
}
