"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

type Category = {
   title: string;
   description: string;
   image: string;
   color: string;
};

const categories: Category[] = [
   {
      title: "Gardening",
      description: "Mulching, weeding and tidying up",
      image: "/assets/mobilescreens/garden.png",
      color: "from-emerald-50 to-green-50",
   },
   {
      title: "Handyperson",
      description: "Help with home maintenance",
      image: "/assets/mobilescreens/handy.png",
      color: "from-orange-50 to-amber-50",
   },
   {
      title: "Business",
      description: "Help with accounting and tax",
      image: "/assets/mobilescreens/business.png",
      color: "from-blue-50 to-indigo-50",
   },
   {
      title: "Marketing",
      description: "Help with website",
      image: "/assets/mobilescreens/marketing.png",
      color: "from-purple-50 to-pink-50",
   },
   {
      title: "Cleaning",
      description: "Homes, offices and deep cleans",
      image: "/assets/mobilescreens/cleaning.png",
      color: "from-cyan-50 to-blue-50",
   },
   {
      title: "Moving",
      description: "Packing, loading and unloading",
      image: "/assets/mobilescreens/moving.png",
      color: "from-rose-50 to-red-50",
   },
   {
      title: "Assembly",
      description: "Furniture and flat-pack assembly",
      image: "/assets/mobilescreens/furniture.png",
      color: "from-lime-50 to-green-50",
   },
   {
      title: "Mounting",
      description: "TVs, shelves, art and mirrors",
      image: "/assets/mobilescreens/mounting.png",
      color: "from-sky-50 to-blue-50",
   },
   {
      title: "Painting",
      description: "Walls, rooms and touch-ups",
      image: "/assets/mobilescreens/painting.png",
      color: "from-fuchsia-50 to-purple-50",
   },
   {
      title: "Plumbing",
      description: "Leaks, fittings and repairs",
      image: "/assets/mobilescreens/plumbing.png",
      color: "from-teal-50 to-cyan-50",
   },
   {
      title: "Electrical",
      description: "Lights, fans and wiring fixes",
      image: "/assets/mobilescreens/electrical.png",
      color: "from-yellow-50 to-orange-50",
   },
   {
      title: "Tech Support",
      description: "Setup, troubleshooting and installs",
      image: "/assets/mobilescreens/tech.png",
      color: "from-slate-50 to-gray-100",
   },
];

const marqueeItems = [...categories, ...categories];

export const CategoriesExplorer = () => {
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
                           </div>
                        </motion.div>
                     ))}
                  </motion.div>
               ))}
            </div>

            {/* View all button */}
            <div className="text-center mt-6 md:mt-12">
<<<<<<< Updated upstream
               <a href="/discover" className="inline-flex items-center gap-2 px-5 py-3 md:px-6 bg-primary-500 hover:bg-primary-600 font-semibold rounded-xl text-sm md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white">
                  View all categories
                  <ArrowRight className="h-5 w-5" />
               </a>
=======
               <Link href="/services">
                  <button className="inline-flex items-center gap-2 px-5 py-3 md:px-6 bg-primary-500 hover:bg-primary-600 font-semibold rounded-xl text-sm md:text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-white">
                     View all categories
                     <ArrowRight className="h-5 w-5" />
                  </button>
               </Link>
>>>>>>> Stashed changes
            </div>
         </div>
      </section>
   );
};
