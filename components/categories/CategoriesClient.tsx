"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/category";

interface CategoriesClientProps {
   categories: Category[];
   viewType?: "jobs" | "services" | "task";
}

// Display category name as-is from database (no modification)
const getCategoryDisplayName = (name: string): string => name;

const CategoriesClient: React.FC<CategoriesClientProps> = ({
   categories = [],
   viewType = "jobs",
}) => {
   const [selectedCategory, setSelectedCategory] = useState<string | null>(
      null
   );

   const scrollToCategory = (categorySlug: string) => {
      const element = document.getElementById(`category-${categorySlug}`);
      if (element) {
         const elementPosition = element.getBoundingClientRect().top;
         const offsetPosition = elementPosition + window.pageYOffset - 100;

         window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
         });
         setSelectedCategory(categorySlug);
      }
   };

   return (
      <main className="min-h-[calc(100vh-56px)] w-full pb-8 sm:pt-12 sm:pb-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-20 grid grid-cols-1 gap-4 sm:gap-6 md:gap-[30px] ml-0 sm:ml-6 md:grid-cols-[280px_1fr] md:ml-20 lg:ml-[180px]">
         {/* Left Sidebar - Categories List with Images */}
         <section className="hidden md:flex self-start -mt-2 sm:-mt-5 flex-col gap-3 text-sm sm:text-base font-medium text-[#0a1f44] ml-2 sm:ml-4 md:ml-6 lg:ml-8">
            {categories.map((category) => {
               // Display category name directly from database
               const displayName = getCategoryDisplayName(category.name);

               return (
                  <button
                     key={category._id || category.slug}
                     onClick={() => scrollToCategory(category.slug)}
                     className="py-2 sm:py-3 px-3 sm:px-4 rounded-lg border border-transparent flex items-center gap-3 transition-all duration-200 hover:border-yellow-500 hover:bg-yellow-50 group text-sm sm:text-base text-left w-full"
                  >
                     {/* Category Image Thumbnail */}
                     {category.heroImage && (
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                           {category.heroImage.startsWith("data:") ||
                           category.heroImage.startsWith("http") ? (
                              <img
                                 src={category.heroImage}
                                 alt={displayName}
                                 className="w-full h-full object-cover"
                              />
                           ) : (
                              <Image
                                 src={category.heroImage}
                                 alt={displayName}
                                 width={48}
                                 height={48}
                                 className="w-full h-full object-cover"
                              />
                           )}
                        </div>
                     )}

                     <div className="flex-1 min-w-0">
                        <span className="whitespace-nowrap flex-1 truncate block">
                           {displayName}
                        </span>
                        {/* Show subcategory count */}
                        {category.subcategories &&
                           category.subcategories.length > 0 && (
                              <span className="text-xs text-gray-500 block">
                                 {category.subcategories.length}{" "}
                                 {category.subcategories.length === 1
                                    ? "option"
                                    : "options"}
                              </span>
                           )}
                     </div>

                     <span className="text-sm ml-2 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0">
                        →
                     </span>
                  </button>
               );
            })}
         </section>

         {/* Right Content Area */}
         <div className="flex-1 max-w-[760px] py-4 sm:py-6 px-4 sm:px-6 pb-6 sm:pb-8 md:pb-10 mt-0 ml-0 md:py-5 md:px-10 md:-mt-[60px]">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-3 text-[#0a1f44]">
               {viewType === "jobs"
                  ? "Find Tasks on Extrahand"
                  : viewType === "services"
                  ? "Find Services on Extrahand"
                  : "Earn money on Extrahand"}
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-[22px] text-[#0a1f44] mb-4 sm:mb-6 leading-[1.6]">
               {viewType === "jobs"
                  ? "Extrahand is India's largest task marketplace. Browse all available tasks from handymen to cleaners to gardeners. Sign up now and get hired!"
                  : viewType === "services"
                  ? "Extrahand is India's largest service marketplace. Find and hire skilled professionals for all kinds of services from handymen to cleaners to gardeners."
                  : "Extrahand is India's largest job marketplace for all kinds of Tasks from handymen to cleaners to gardeners. Sign up now and get hired!"}
            </p>

            {/* All Categories List */}
            {categories.map((category) => {
               const categoryDisplayName = getCategoryDisplayName(category.name);

               return (
                  <div
                     key={category._id || category.slug}
                     id={`category-${category.slug}`}
                     className="mb-8 sm:mb-10 md:mb-12 scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-32"
                  >
                     {/* Category Name - Clickable Link */}
                     <Link
                        href={
                           viewType === "jobs"
                              ? `/task/${category.slug}`
                              : viewType === "services"
                              ? `/services/${category.slug}`
                              : `/categories/${category.slug}`
                        }
                        className="text-xl sm:text-2xl text-[#0a1f44] my-4 sm:my-5 mb-3 sm:mb-4 hover:text-yellow-500 hover:cursor-pointer transition-colors font-semibold block"
                     >
                        {categoryDisplayName}
                     </Link>

                     {/* Category Hero Image (only if provided) */}
                     {category.heroImage &&
                        (category.heroImage.startsWith("data:") ||
                        category.heroImage.startsWith("http") ? (
                           <img
                              src={category.heroImage}
                              alt={categoryDisplayName}
                              className="w-full rounded-[14px] object-cover font-extrabold mb-8 sm:mb-10 mt-3 sm:mt-4 border border-[#e5e7eb]"
                              style={{
                                 width: "100%",
                                 height: "auto",
                                 maxHeight: "400px",
                              }}
                           />
                        ) : (
                           <Image
                              className="w-full rounded-[14px] object-cover font-extrabold mb-8 sm:mb-10 mt-3 sm:mt-4 border border-[#e5e7eb]"
                              src={category.heroImage}
                              alt={categoryDisplayName}
                              width={760}
                              height={400}
                           />
                        ))}

                     {/* Subcategories List - Below Image */}
                     {category.subcategories &&
                        category.subcategories.length > 0 && (
                           <div className="mt-6 sm:mt-8">
                              <h3 className="text-lg sm:text-xl font-semibold text-[#0a1f44] mb-3 sm:mb-4">
                                 Available Options
                              </h3>
                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                                 {category.subcategories.map((subcategory) => {
                                    let subcategorySlug = subcategory.slug || "";

                                    // If API returns slugs like "category/subcategory",
                                    // strip the duplicated category prefix once so
                                    // URLs don't contain "category/category/subcategory".
                                    const prefix = `${category.slug}/`;
                                    if (subcategorySlug.startsWith(prefix)) {
                                       subcategorySlug = subcategorySlug.slice(
                                          prefix.length
                                       );
                                    }

                                    return (
                                       <Link
                                          key={subcategory._id || subcategory.slug}
                                          href={
                                             viewType === "jobs"
                                                ? `/task/${category.slug}/${subcategorySlug}`
                                                : viewType === "services"
                                                ? `/services/${category.slug}/${subcategorySlug}`
                                                : `/categories/${category.slug}/${subcategorySlug}`
                                          }
                                          className="p-3 sm:p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 hover:border-yellow-400 rounded-lg transition-all duration-200 text-center"
                                       >
                                          <span className="text-yellow-700 hover:text-yellow-900 transition-colors duration-200 text-sm sm:text-base font-semibold block">
                                             {subcategory.name}
                                          </span>
                                       </Link>
                                    );
                                 })}
                              </div>
                           </div>
                        )}
                  </div>
               );
            })}
         </div>
      </main>
   );
};

export default CategoriesClient;
