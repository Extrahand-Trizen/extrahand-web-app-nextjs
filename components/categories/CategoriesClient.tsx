"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/category";
import { cn } from "@/lib/utils";

interface CategoriesClientProps {
   categories: Category[];
   viewType?: "jobs" | "services" | "task";
}

// Display category name as-is from database (no modification)
const getCategoryDisplayName = (name: string): string => name;

const getCategoryAnchorKey = (category: Category): string => {
   const raw = (
      category.slug ||
      category.name ||
      category._id ||
      ""
   )
      .trim()
      .toLowerCase();
   return raw
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
};

const CategoriesClient: React.FC<CategoriesClientProps> = ({
   categories = [],
   viewType = "jobs",
}) => {
   const isServicesView = viewType === "services" || viewType === "jobs";

   return (
      <main
         className={
            isServicesView
               ? "min-h-[calc(100vh-56px)] w-full px-4 pb-10 pt-6 sm:px-6 md:px-8 md:pt-10 lg:px-12"
               : "min-h-[calc(100vh-56px)] w-full pb-8 sm:pt-12 sm:pb-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-20 grid grid-cols-1 gap-4 sm:gap-6 md:gap-[30px] ml-0 sm:ml-6 md:grid-cols-[280px_1fr] md:ml-20 lg:ml-[180px]"
         }
      >
         <div
            className={
               isServicesView
                  ? "mx-auto grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-[220px_minmax(0,1fr)] md:gap-12"
                  : "contents"
            }
         >
         {/* Left Sidebar - Categories List with Images */}
         <section
            className={cn(
               "hidden md:flex self-start flex-col text-sm sm:text-base font-medium text-[#0a1f44]",
               isServicesView
                  ? "sticky top-24 gap-2 pr-4"
                  : "-mt-2 sm:-mt-5 gap-3 ml-2 sm:ml-4 md:ml-6 lg:ml-8"
            )}
         >
            {categories.map((category) => {
               // Display category name directly from database
               const displayName = getCategoryDisplayName(category.name);
               const anchorKey = getCategoryAnchorKey(category);

               return (
                  <a
                     key={category._id || category.slug}
                     href={`#category-${anchorKey}`}
                     className={cn(
                        "transition-all duration-200 text-left w-full",
                        isServicesView
                           ? "py-1.5 text-[15px] text-[#0a1f44] hover:text-[#c07a00] truncate"
                           : "py-2 sm:py-3 px-3 sm:px-4 rounded-lg border border-transparent flex items-center gap-3 hover:border-yellow-500 hover:bg-yellow-50 group text-sm sm:text-base"
                     )}
                  >
                     {/* Category Image Thumbnail */}
                     {!isServicesView && category.heroImage && (
                        <div className="shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
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
                        {!isServicesView &&
                           category.subcategories &&
                           category.subcategories.length > 0 && (
                              <span className="text-xs text-gray-500 block">
                                 {category.subcategories.length}{" "}
                                 {category.subcategories.length === 1
                                    ? "option"
                                    : "options"}
                              </span>
                           )}
                     </div>

                     {!isServicesView && (
                        <span className="text-sm ml-2 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 shrink-0">
                           →
                        </span>
                     )}
                  </a>
               );
            })}
         </section>

         {/* Right Content Area */}
         <div
            className={cn(
               "flex-1",
               isServicesView
                  ? "max-w-5xl"
                  : "max-w-[760px] py-4 sm:py-6 px-4 sm:px-6 pb-6 sm:pb-8 md:pb-10 mt-0 ml-0 md:py-5 md:px-10 md:-mt-[60px]"
            )}
         >
            <h1
               className={cn(
                  "text-[#0a1f44]",
                  isServicesView
                     ? "mb-4 text-3xl font-extrabold sm:text-4xl md:text-5xl"
                     : "mb-3 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black"
               )}
            >
               {viewType === "jobs"
                  ? "Find Tasks on Extrahand"
                  : viewType === "services"
                  ? "Find Services on Extrahand"
                  : "Earn money on Extrahand"}
            </h1>

            <p
               className={cn(
                  "text-[#0a1f44] leading-[1.6]",
                  isServicesView
                     ? "mb-8 max-w-3xl text-base sm:text-lg"
                     : "mb-4 text-base sm:text-lg md:text-xl lg:text-[22px] sm:mb-6"
               )}
            >
               {viewType === "jobs"
                  ? "Extrahand is India's largest task marketplace. Browse all available tasks from handymen to cleaners to gardeners. Sign up now and get hired!"
                  : viewType === "services"
                  ? "Extrahand is India's largest service marketplace. Find and hire skilled professionals for all kinds of services from handymen to cleaners to gardeners."
                  : "Extrahand is India's largest job marketplace for all kinds of Tasks from handymen to cleaners to gardeners. Sign up now and get hired!"}
            </p>

            {/* All Categories List */}
            {categories.map((category) => {
               const categoryDisplayName = getCategoryDisplayName(category.name);
               const anchorKey = getCategoryAnchorKey(category);
               const hasCategorySlug = Boolean(category.slug?.trim());
               const categoryHref =
                  viewType === "jobs"
                     ? `/task/${category.slug}`
                     : viewType === "services"
                     ? `/services/${category.slug}`
                     : `/categories/${category.slug}`;

               return (
                  <div
                     key={category._id || category.slug}
                     id={`category-${anchorKey}`}
                     className="mb-8 sm:mb-10 md:mb-12 scroll-mt-24 sm:scroll-mt-28 md:scroll-mt-32"
                  >
                     {/* Category Name - Clickable Link */}
                     {hasCategorySlug ? (
                        <Link
                           href={categoryHref}
                           className={cn(
                              "text-[#0a1f44] hover:text-yellow-600 hover:cursor-pointer transition-colors font-semibold block",
                              isServicesView
                                 ? "mb-3 text-2xl sm:text-3xl"
                                 : "my-4 mb-3 text-xl sm:my-5 sm:mb-4 sm:text-2xl"
                           )}
                        >
                           {categoryDisplayName}
                        </Link>
                     ) : (
                        <h2
                           className={cn(
                              "text-[#0a1f44] font-semibold block",
                              isServicesView
                                 ? "mb-3 text-2xl sm:text-3xl"
                                 : "my-4 mb-3 text-xl sm:my-5 sm:mb-4 sm:text-2xl"
                           )}
                        >
                           {categoryDisplayName}
                        </h2>
                     )}



                     {/* Category Hero Image (only if provided) */}
                     {category.heroImage &&
                        (category.heroImage.startsWith("data:") ||
                        category.heroImage.startsWith("http") ? (
                           <img
                              src={category.heroImage}
                              alt={categoryDisplayName}
                              className={cn(
                                 "w-full object-cover font-extrabold border border-[#e5e7eb]",
                                 isServicesView
                                    ? "mb-8 mt-2 rounded-[22px]"
                                    : "mb-8 sm:mb-10 mt-3 sm:mt-4 rounded-[14px]"
                              )}
                              style={{
                                 width: "100%",
                                 height: "auto",
                                 maxHeight: isServicesView ? "360px" : "400px",
                              }}
                           />
                        ) : (
                           <Image
                              className={cn(
                                 "w-full object-cover font-extrabold border border-[#e5e7eb]",
                                 isServicesView
                                    ? "mb-8 mt-2 rounded-[22px]"
                                    : "mb-8 sm:mb-10 mt-3 sm:mt-4 rounded-[14px]"
                              )}
                              src={category.heroImage}
                              alt={categoryDisplayName}
                              width={760}
                              height={isServicesView ? 360 : 400}
                           />
                        ))}

                     {/* Subcategories List - Below Image */}
                     {category.subcategories &&
                        category.subcategories.length > 0 && (
                           <div className={cn(isServicesView ? "mt-2" : "mt-6 sm:mt-8")}>
                              {!isServicesView && (
                                 <h3 className="text-lg sm:text-xl font-semibold text-[#0a1f44] mb-3 sm:mb-4">
                                    Available Options
                                 </h3>
                              )}
                              <div
                                 className={cn(
                                    isServicesView
                                       ? "grid grid-cols-1 gap-x-16 gap-y-4 md:grid-cols-2"
                                       : "grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
                                 )}
                              >
                                 {category.subcategories.map((subcategory) => {
                                    const subcategoryWithCategoryPage = subcategory as typeof subcategory & {
                                       categoryPageSlug?: string;
                                    };
                                    let subcategorySlug = subcategory.slug || "";
                                    const directCategoryPageSlug = (
                                       subcategoryWithCategoryPage.categoryPageSlug || ""
                                    ).trim();
                                    const parentSlugForSubcategory =
                                       (subcategory.categorySlug || category.slug || "").trim();

                                    // If API returns slugs like "category/subcategory",
                                    // strip the duplicated category prefix once so
                                    // URLs don't contain "category/category/subcategory".
                                    const prefix = `${parentSlugForSubcategory}/`;
                                    if (!directCategoryPageSlug && subcategorySlug.startsWith(prefix)) {
                                       subcategorySlug = subcategorySlug.slice(
                                          prefix.length
                                       );
                                    }

                                    const hasSubcategorySlug = Boolean(
                                       subcategorySlug?.trim()
                                    );
                                    const subcategoryHref = directCategoryPageSlug
                                       ? viewType === "jobs"
                                          ? `/task/${directCategoryPageSlug}`
                                          : viewType === "services"
                                          ? `/services/${directCategoryPageSlug}`
                                          : `/categories/${directCategoryPageSlug}`
                                       : viewType === "jobs"
                                       ? `/task/${parentSlugForSubcategory}/${subcategorySlug}`
                                       : viewType === "services"
                                       ? `/services/${parentSlugForSubcategory}/${subcategorySlug}`
                                       : `/categories/${parentSlugForSubcategory}/${subcategorySlug}`;

                                    if (
                                       (!directCategoryPageSlug && !hasSubcategorySlug) ||
                                       (!directCategoryPageSlug && !parentSlugForSubcategory)
                                    ) {
                                       return (
                                          <div
                                             key={subcategory._id || subcategory.slug || subcategory.name}
                                             className={cn(
                                                isServicesView
                                                   ? "text-left"
                                                   : "p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg text-center"
                                             )}
                                          >
                                             <span
                                                className={cn(
                                                   "font-semibold block",
                                                   isServicesView
                                                      ? "text-lg text-[#1560d8]"
                                                      : "text-gray-700 text-sm sm:text-base"
                                                )}
                                             >
                                                {subcategory.name}
                                             </span>
                                          </div>
                                       );
                                    }

                                    return (
                                       <Link
                                          key={subcategory._id || subcategory.slug}
                                          href={subcategoryHref}
                                          className={cn(
                                             "transition-all duration-200",
                                             isServicesView
                                                ? "text-left text-lg font-medium text-[#1560d8] hover:text-[#0a47b8] hover:underline"
                                                : "p-3 sm:p-4 bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 hover:border-yellow-400 rounded-lg text-center"
                                          )}
                                       >
                                          <span
                                             className={cn(
                                                "block",
                                                isServicesView
                                                   ? "text-inherit"
                                                   : "text-yellow-700 hover:text-yellow-900 transition-colors duration-200 text-sm sm:text-base font-semibold"
                                             )}
                                          >
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
         </div>
      </main>
   );
};

export default CategoriesClient;
