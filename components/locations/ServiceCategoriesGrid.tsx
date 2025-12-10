/**
 * Service Categories Grid Component
 * Premium card design for service categories
 */

"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp } from "lucide-react";
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
      <section className="py-20 lg:py-28 bg-white">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-16">
               <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                  <TrendingUp className="w-4 h-4" />
                  Popular Services
               </div>
               <h2 className="text-4xl sm:text-5xl font-bold text-secondary-900 mb-4 tracking-tight">
                  What do you need help with?
               </h2>
               <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                  Browse the most requested services in {cityName}
               </p>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
               {categories.map((category, index) => (
                  <Link
                     key={category.id}
                     href={`/tasks/new?category=${category.id}&location=${citySlug}`}
                     className="group"
                     style={{
                        animationDelay: `${index * 50}ms`,
                     }}
                  >
                     <Card className="relative h-full overflow-hidden border-2 border-transparent hover:border-primary-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 bg-white">
                        {/* Gradient overlay on hover */}
                        <div
                           className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                        />

                        <div className="relative p-8">
                           {/* Icon */}
                           <div className="mb-6">
                              <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                 {category.icon}
                              </div>
                              <div
                                 className={`h-1 w-16 bg-gradient-to-r ${category.gradient} rounded-full`}
                              />
                           </div>

                           {/* Content */}
                           <div className="mb-6">
                              <h3 className="text-2xl font-bold text-secondary-900 mb-3 group-hover:text-primary-700 transition-colors">
                                 {category.name}
                              </h3>
                              <p className="text-secondary-600 leading-relaxed">
                                 {category.description}
                              </p>
                           </div>

                           {/* Popular tasks */}
                           {category.popularTasks && (
                              <div className="mb-6 space-y-2">
                                 {category.popularTasks.slice(0, 3).map((task) => (
                                    <div
                                       key={task}
                                       className="flex items-center gap-2 text-sm text-secondary-500"
                                    >
                                       <div className="w-1.5 h-1.5 bg-primary-400 rounded-full" />
                                       <span>{task}</span>
                                    </div>
                                 ))}
                              </div>
                           )}

                           {/* Footer */}
                           <div className="flex items-center justify-between pt-4 border-t border-secondary-100">
                              {category.avgPrice && (
                                 <span className="text-sm font-semibold text-secondary-700">
                                    {category.avgPrice}
                                 </span>
                              )}
                              <div className="flex items-center gap-2 text-primary-600 font-medium ml-auto">
                                 <span className="text-sm">Get started</span>
                                 <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                              </div>
                           </div>
                        </div>
                     </Card>
                  </Link>
               ))}
            </div>

            {/* View More CTA */}
            <div className="text-center mt-12">
               <Link
                  href="/tasks"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-lg group"
               >
                  View all categories
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
         </div>
      </section>
   );
}
