"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

interface HeroSectionProps {
   categoryName: string;
   heroImage?: string;
   heroTitle: string;
   heroDescription: string;
   rightCard: React.ReactNode;
   // Optional breadcrumb customization
   breadcrumbHome?: string;
   breadcrumbCategory?: string;
   breadcrumbCategoryLink?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
   categoryName,
   heroImage,
   heroTitle,
   heroDescription,
   rightCard,
   breadcrumbHome = "Home",
   breadcrumbCategory = "Categories",
   breadcrumbCategoryLink = "/categories",
}) => {
   return (
      <section className="relative w-full bg-slate-900">
         {/* Background Image with Overlay */}
         <div className="absolute inset-0">
            {heroImage ? (
               heroImage.startsWith("data:") || heroImage.startsWith("http") ? (
                  <img
                     src={heroImage}
                     alt={categoryName}
                     className="w-full h-full object-cover"
                  />
               ) : (
                  <Image
                     src={heroImage}
                     alt={categoryName}
                     fill
                     sizes="100vw"
                     className="object-cover"
                     priority
                  />
               )
            ) : (
               <Image
                  src="/assets/images/default.png"
                  alt="Default"
                  className="h-full w-full"
                  fill
               />
            )}
            {/* Dark overlay - solid, no gradient */}
            <div className="absolute inset-0 bg-slate-900/70" />
         </div>

         {/* Content Container */}
         <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="pt-8 pb-16 md:pt-12 md:pb-24 lg:pt-16 lg:pb-32">
               {/* Breadcrumb */}
               <nav className="mb-6 md:mb-8">
                  <ol className="flex items-center gap-2 text-sm text-white/70">
                     <li>
                        <Link
                           href="/"
                           className="hover:text-white transition-colors"
                        >
                           {breadcrumbHome}
                        </Link>
                     </li>
                     <ChevronRight className="w-4 h-4" />
                     <li>
                        <Link
                           href={breadcrumbCategoryLink}
                           className="hover:text-white transition-colors"
                        >
                           {breadcrumbCategory}
                        </Link>
                     </li>
                     <ChevronRight className="w-4 h-4" />
                     <li className="text-white font-medium">{categoryName}</li>
                  </ol>
               </nav>

               {/* Main Content Grid */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
                  {/* Left Content */}
                  <div className="space-y-6">
                     <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight">
                        {heroTitle}
                     </h1>
                     <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-xl">
                        {heroDescription}
                     </p>
                  </div>

                  {/* Right Card */}
                  <div className="lg:justify-self-end w-full max-w-md">
                     {rightCard}
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};
