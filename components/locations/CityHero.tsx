/**
 * City Hero Section Component
 * Beautiful hero with city image background
 */

"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp } from "lucide-react";
import { CityInfo } from "@/lib/data/cities";

interface CityHeroProps {
   city: CityInfo;
}

export function CityHero({ city }: CityHeroProps) {
   return (
      <section className="relative h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden">
         <div className="absolute inset-0">
            <div
               className="absolute opacity-70 inset-0 bg-cover bg-center"
               style={{
                  backgroundImage: `url('${
                     city.heroImage || "/assets/images/cities/default.jpg"
                  }')`,
               }}
            />
            <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/50 to-black/60" />
         </div>

         <div className="relative z-10 max-w-360 mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center gap-2 text-xl text-white/90 mb-6">
               <Link
                  href="/"
                  className="text-primary-400"
               >
                  Home
               </Link>
               <span>/</span>
               <span className="text-white font-medium">{city.name}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white tracking-tight mb-6 leading-tight">
               Find Local Help in{" "}
               <span className="relative inline-block">
                  {city.name}
                  <div className="absolute -bottom-2 left-0 right-0 h-1.5 bg-primary-400 rounded-full" />
               </span>
            </h1>

            <p className="text-xl sm:text-2xl text-white/95 mb-10 leading-relaxed max-w-4xl mx-auto font-light">
               {city.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
               <Link href="/tasks/new" className="group">
                  <Button
                     size="lg"
                     className="w-full sm:w-auto bg-primary-500 hover:bg-primary-600 text-white font-bold text-lg px-10 py-7 rounded-2xl shadow-2xl transition-all hover:scale-105"
                  >
                     Post a Task
                     <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </Link>
               <Link href="/signup">
                  <Button
                     variant="outline"
                     size="lg"
                     className="w-full sm:w-auto border-2 border-white/80 font-semibold text-lg px-8 py-7 rounded-2xl backdrop-blur-sm transition-all hover:bg-white/90"
                  >
                     Become a Tasker
                  </Button>
               </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12 text-white/95">
               <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-primary-400" />
                  <div className="text-left">
                     <div className="text-2xl font-bold text-white">
                        {city.activeTasks.toLocaleString()}
                     </div>
                     <div className="text-sm">Active Tasks</div>
                  </div>
               </div>
               <div className="w-px h-12 bg-white/30 hidden sm:block" />
               <div className="flex items-center gap-3">
                  <div className="text-left">
                     <div className="text-2xl font-bold text-white">
                        {city.activeTaskers.toLocaleString()}+
                     </div>
                     <div className="text-sm">Verified Taskers</div>
                  </div>
               </div>
               <div className="w-px h-12 bg-white/30 hidden sm:block" />
               <div className="flex items-center gap-3">
                  <span className="text-primary-400 text-2xl">★</span>
                  <div className="text-left">
                     <div className="text-2xl font-bold text-white">
                        {city.avgRating}
                     </div>
                     <div className="text-sm">Average Rating</div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
