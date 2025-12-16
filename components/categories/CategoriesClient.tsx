"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Category } from "@/types/category";

interface CategoriesClientProps {
   categories: Category[];
   viewType?: "jobs" | "services" | "tasks";
}

const CategoriesClient: React.FC<CategoriesClientProps> = ({
   categories = [],
   viewType = "tasks",
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
      <main className="min-h-[calc(100vh-56px)] w-full pb-8 sm:pt-12 sm:pb-12 md:py-16 lg:py-20 px-4 sm:px-6 md:px-8 lg:px-20 grid grid-cols-1 gap-4 sm:gap-6 md:gap-[30px] ml-0 sm:ml-6 md:grid-cols-[260px_1fr] md:ml-20 lg:ml-[180px]">
         {/* Left Sidebar - Categories List */}
         <section className="hidden md:flex self-start -mt-2 sm:-mt-5 flex-col gap-px text-sm sm:text-base font-medium text-[#0a1f44] ml-2 sm:ml-4 md:ml-6 lg:ml-8">
            {categories.map((category) => {
               const suffix =
                  viewType === "jobs"
                     ? "Jobs"
                     : viewType === "services"
                     ? "Services"
                     : "Tasks";
               const displayName = category.name.toLowerCase().endsWith("tasks")
                  ? category.name.replace(/ Tasks$/i, ` ${suffix}`)
                  : `${category.name} ${suffix}`;

               return (
                  <button
                     key={category._id || category.slug}
                     onClick={() => scrollToCategory(category.slug)}
                     className="py-2 sm:py-2.5 px-4 sm:px-6 pl-3 sm:pl-[18px] rounded-full border border-transparent flex items-center justify-between transition-all duration-200 hover:border-yellow-500 hover:bg-yellow-500 hover:text-white hover:cursor-pointer hover:shadow-[0_10px_20px_rgba(234,179,8,0.2)] group text-sm sm:text-base text-left w-full"
                  >
                     <span className="whitespace-nowrap flex-1">
                        {displayName}
                     </span>
                     <span className="text-sm ml-2 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
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
                  ? "Find Jobs on Extrahand"
                  : viewType === "services"
                  ? "Find Services on Extrahand"
                  : "Earn money on Extrahand"}
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-[22px] text-[#0a1f44] mb-4 sm:mb-6 leading-[1.6]">
               {viewType === "jobs"
                  ? "Extrahand is India's largest job marketplace. Browse all available jobs from handymen to cleaners to gardeners. Sign up now and get hired!"
                  : viewType === "services"
                  ? "Extrahand is India's largest service marketplace. Find and hire skilled professionals for all kinds of services from handymen to cleaners to gardeners."
                  : "Extrahand is India's largest job marketplace for all kinds of Tasks from handymen to cleaners to gardeners. Sign up now and get hired!"}
            </p>

            {/* All Categories List */}
            {categories.map((category) => {
               const categoryDisplayName = category.name
                  .toLowerCase()
                  .endsWith("tasks")
                  ? category.name
                  : `${category.name} Tasks`;

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
                              ? `/jobs/${category.slug}`
                              : viewType === "services"
                              ? `/services/${category.slug}`
                              : `/categories/${category.slug}`
                        }
                        className="text-xl sm:text-2xl text-[#0a1f44] my-4 sm:my-5 mb-3 sm:mb-4 hover:text-yellow-500 hover:cursor-pointer transition-colors font-semibold block"
                     >
                        {categoryDisplayName}
                     </Link>

                     {/* Category Hero Image */}
                     {category.heroImage ? (
                        category.heroImage.startsWith("data:") ||
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
                        )
                     ) : (
                        <Image
                           className="w-full rounded-[14px] object-cover font-extrabold mb-8 sm:mb-10 mt-3 sm:mt-4 border border-[#e5e7eb]"
                           src="/assets/images/default.png"
                           alt={categoryDisplayName}
                           width={760}
                           height={400}
                        />
                     )}

                     {/* Subcategories List - Below Image */}
                     {category.subcategories &&
                        category.subcategories.length > 0 && (
                           <div className="flex flex-col gap-x-12 sm:gap-x-14 md:gap-x-16 gap-y-3 sm:gap-y-4">
                              {category.subcategories.map((subcategory) => {
                                 let subcategorySlug = subcategory.slug || "";
                                 if (
                                    subcategorySlug.startsWith(
                                       `${category.slug}/`
                                    )
                                 ) {
                                    subcategorySlug = subcategorySlug.replace(
                                       `${category.slug}/`,
                                       ""
                                    );
                                 }
                                 const baseUrl =
                                    viewType === "jobs"
                                       ? "/jobs"
                                       : viewType === "services"
                                       ? "/services"
                                       : "/categories";
                                 return (
                                    <Link
                                       key={subcategory._id || subcategory.slug}
                                       href={`${baseUrl}/${category.slug}/${subcategorySlug}`}
                                       className="text-yellow-500 hover:text-yellow-600 hover:underline transition-colors duration-200 text-sm sm:text-base font-bold"
                                    >
                                       {subcategory.name}
                                    </Link>
                                 );
                              })}
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
