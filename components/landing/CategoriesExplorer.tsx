"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { categoriesApi } from "@/lib/api/endpoints/categories";

type Subcategory = {
   _id?: string;
   name: string;
   slug: string;
   categorySlug?: string;
};

type Category = {
   title: string;
   description: string;
   image: string;
   color: string;
   slug?: string;
   subcategories?: Subcategory[];
};

// Color palette for categories (repeats to ensure enough colors)
const colorPalette = [
   "from-emerald-50 to-green-50",
   "from-orange-50 to-amber-50",
   "from-blue-50 to-indigo-50",
   "from-purple-50 to-pink-50",
   "from-cyan-50 to-blue-50",
   "from-rose-50 to-red-50",
   "from-lime-50 to-green-50",
   "from-sky-50 to-blue-50",
   "from-fuchsia-50 to-purple-50",
   "from-teal-50 to-cyan-50",
   "from-yellow-50 to-orange-50",
   "from-slate-50 to-gray-100",
];

export const CategoriesExplorer = () => {
   const [categories, setCategories] = useState<Category[]>([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const fetchCategories = async () => {
         try {
            const data = await categoriesApi.getCategories({
               includeUnpublished: false,
            });
            
            console.log("🔍 Raw categories data from API:", data);
            console.log("🔍 First category subcategories:", data?.[0]?.subcategories);
            
            // Map backend data to frontend format
            const formattedCategories = (data || []).map((cat, index) => {
               console.log(`Category: ${cat.name}, Subcategories:`, cat.subcategories);
               return {
                  title: cat.name,
                  description: cat.heroDescription || "Discover this category",
                  image: cat.heroImage || "/assets/mobilescreens/default.png",
                  color: colorPalette[index % colorPalette.length],
                  slug: cat.slug,
                  subcategories: cat.subcategories?.filter(
                     (sub) => sub._id || sub.name
                  ) || [],
               };
            });

            console.log("🔍 Formatted categories:", formattedCategories);
            setCategories(formattedCategories);
         } catch (error) {
            console.error("Failed to fetch categories:", error);
            setCategories([]);
         } finally {
            setLoading(false);
         }
      };

      fetchCategories();
   }, []);

   const marqueeItems = [...categories, ...categories];
   if (loading || categories.length === 0) {
      return (
         <section className="py-12 md:py-20 bg-linear-to-b from-primary-50/30 via-white to-primary-50/30 relative overflow-hidden">
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />

            <div className="max-w-7xl mx-auto md:px-8 relative z-10">
               <div className="text-center max-w-2xl mx-auto mb-12">
                  <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-primary-100 rounded-full text-primary-700 text-xs md:text-sm font-medium mb-4">
                     <Sparkles className="size-3 md:size-4" />
                     Popular Categories
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-4">
                     Browse by category
                  </h2>
                  <p className="text-sm md:text-lg text-secondary-600">
                     {loading ? "Loading categories..." : "No categories available"}
                  </p>
               </div>
            </div>
         </section>
      );
   }

   return (
      <section className="py-12 md:py-20 bg-linear-to-b from-primary-50/30 via-white to-primary-50/30 relative overflow-hidden">
         <div className="absolute top-10 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
         <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary-300/10 rounded-full blur-3xl" />

         <div className="max-w-7xl mx-auto md:px-8 relative z-10">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
               <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 bg-primary-100 rounded-full text-primary-700 text-xs md:text-sm font-medium mb-4">
                  <Sparkles className="size-3 md:size-4" />
                  Popular Categories
               </div>
               <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-4">
                  Browse by category
               </h2>
               <p className="text-sm md:text-lg text-secondary-600 max-w-2xl mx-auto">
                  Discover the most popular task categories and find the perfect
                  help for your needs
               </p>
            </div>

            <div className="relative overflow-hidden rounded-3xl">
               {/* edge fades */}
               <div className="hidden md:block pointer-events-none absolute left-0 top-0 h-full w-28 bg-linear-to-r from-white via-white/80 to-transparent z-10" />
               <div className="hidden md:block pointer-events-none absolute right-0 top-0 h-full w-28 bg-linear-to-l from-white via-white/80 to-transparent z-10" />

               {/* Scrolling cards */}
               {Array.from({ length: 2 }).map((_, i) => (
                  <motion.div
                     key={i}
                     className="flex w-max gap-6 py-2 md:py-4"
                     animate={
                        i === 0
                           ? { x: ["0%", "-33.333%"] }
                           : { x: ["-33.333%", "0%"] }
                     }
                     transition={{
                        duration: 120,
                        ease: "linear",
                        repeat: Infinity,
                     }}
                  >
                     {marqueeItems.map((item, index) => (
                        <motion.div
                           key={`${item.title}-${index}`}
                           className="group flex min-w-[260px] sm:min-w-[320px] lg:min-w-[340px] items-center gap-5 rounded-2xl bg-white p-3 md:p-5 shadow-sm md:shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 cursor-pointer"
                           whileHover={{ scale: 1.02, y: -4 }}
                           transition={{ duration: 0.2 }}
                        >
                           <div
                              className={`relative h-16 w-16 md:h-24 md:w-24 shrink-0 overflow-hidden rounded-xl bg-linear-to-br ${item.color}`}
                           >
                              <div className="relative h-full w-full overflow-hidden rounded-lg bg-white">
                                 <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-120 transition-transform duration-300"
                                 />
                              </div>
                           </div>

                           <div className="flex-1">
                              <div className="flex items-center justify-between gap-3">
                                 <h3 className="md:text-lg sm:text-xl font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">
                                    {item.title}
                                 </h3>
                                 <ArrowRight className="size-4 md:size-5 text-gray-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                              </div>
                              <p className="mt-2 text-xs md:text-sm text-secondary-600 leading-relaxed">
                                 {item.description}
                              </p>
                              {item.subcategories && item.subcategories.length > 0 && (
                                 <div className="mt-3 flex flex-wrap gap-1.5">
                                    {item.subcategories.slice(0, 3).map((sub) => (
                                       <span
                                          key={sub.slug}
                                          className="inline-block px-2 py-0.5 text-xs bg-primary-50 text-primary-700 rounded-md border border-primary-100"
                                       >
                                          {sub.name}
                                       </span>
                                    ))}
                                    {item.subcategories.length > 3 && (
                                       <span className="inline-block px-2 py-0.5 text-xs bg-gray-50 text-gray-600 rounded-md">
                                          +{item.subcategories.length - 3} more
                                       </span>
                                    )}
                                 </div>
                              )}
                           </div>
                        </motion.div>
                     ))}
                  </motion.div>
               ))}
            </div>

            {/* View all button */}
            <div className="text-center mt-6 md:mt-12">
               <Link href="/services">
                  <button className="inline-flex items-center gap-2 px-5 py-3 md:px-6 bg-primary-500 hover:bg-primary-600 font-semibold rounded-xl text-sm md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white">
                     View all categories
                     <ArrowRight className="h-5 w-5" />
                  </button>
               </Link>
            </div>
         </div>
      </section>
   );
};
