"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
   CheckCircle2,
   Zap,
   Sparkles,
   Layers,
   ArrowRight,
   Briefcase,
   Shield,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface TopCategoryCard {
   title: string;
   description: string;
   image: string;
   tags: string[];
   slug: string;
}

const topCategoryCards: TopCategoryCard[] = [
   {
      title: "Electricians",
      description: "Wiring, switch board fitting, fan and light installation.",
      image: "/assets/mobilescreens/electrical.webp",
      tags: ["Fan Installation", "Light Fix", "Wiring"],
      slug: "electricians",
   },
   {
      title: "Plumbers",
      description: "Fix leaks, pipe blocks, bathroom fittings, and tap issues.",
      image: "/assets/mobilescreens/plumbing.webp",
      tags: ["Leak Repair", "Tap Fitting", "Drain Cleaning"],
      slug: "plumbers",
   },
   {
      title: "Home Cleaning",
      description: "Book regular, deep, kitchen, and full-home cleaning.",
      image: "/assets/mobilescreens/cleaning.webp",
      tags: ["Deep Cleaning", "Kitchen", "Sofa"],
      slug: "home-cleaning",
   },
   {
      title: "Carpenters",
      description: "Furniture assembly, repair work, shelves, and fittings.",
      image: "/assets/mobilescreens/work.webp",
      tags: ["Furniture", "Repair", "Installation"],
      slug: "carpenters",
   },
   {
      title: "Flooring Services",
      description: "Tile, wooden, and vinyl flooring support by professionals.",
      image: "/assets/mobilescreens/garden.webp",
      tags: ["Tiles", "Wooden", "Repairs"],
      slug: "flooring-services",
   },
   {
      title: "Delivery & Pickup",
      description: "Same-day parcel, grocery, and item pickup/drop service.",
      image: "/assets/mobilescreens/delivery.webp",
      tags: ["Parcel", "Grocery", "Document"],
      slug: "delivery-pickup",
   },
   {
      title: "General Handyman",
      description: "Quick help for minor repairs and home maintenance tasks.",
      image: "/assets/mobilescreens/handy.webp",
      tags: ["Curtain Rod", "Door Fix", "Small Jobs"],
      slug: "general-handyman",
   },
   {
      title: "Pet Care Services",
      description: "Pet walking, grooming assistance, and day-care support.",
      image: "/assets/mobilescreens/cleaning.webp",
      tags: ["Pet Walk", "Pet Sitting", "Care"],
      slug: "pet-care-services",
   },
];

const CATEGORY_MARQUEE_DURATION_SECONDS = 48;

const whyChoosePoints = [
   {
      icon: Layers,
      title: "Compare Service Providers Easily",
      description: "Compare profiles, ratings, and offers to pick the right pro.",
      color: "text-blue-600",
      iconBg: "bg-blue-50",
   },
   {
      icon: Shield,
      title: "Set Your Own Budget for Services",
      description: "Post your task with your budget and receive matching quotes.",
      color: "text-green-600",
      iconBg: "bg-green-50",
   },
   {
      icon: CheckCircle2,
      title: "Verified & Skilled Professionals",
      description: "Work with trusted taskers verified for quality and reliability.",
      color: "text-amber-600",
      iconBg: "bg-amber-50",
   },
   {
      icon: Sparkles,
      title: "Transparent Communication",
      description: "Clear in-app communication keeps you updated at every step.",
      color: "text-purple-600",
      iconBg: "bg-purple-50",
   },
   {
      icon: Zap,
      title: "Quick Response & Booking",
      description: "Get fast responses and confirm bookings in just a few taps.",
      color: "text-orange-600",
      iconBg: "bg-orange-50",
   },
   {
      icon: Briefcase,
      title: "All Services in One Platform",
      description: "From home fixes to daily tasks, manage everything in one place.",
      color: "text-red-600",
      iconBg: "bg-red-50",
   },
];

export const ServicesSection: React.FC = () => {
   return (
      <section className="relative py-14 md:py-24 bg-[radial-gradient(120%_70%_at_50%_0%,rgba(255,245,220,0.5),rgba(255,255,255,1))] overflow-hidden">
         <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-primary-200/25 blur-3xl" />
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* One Platform Section - H2 */}
            <div className="mb-16 md:mb-24 bg-white/90 backdrop-blur rounded-3xl shadow-xl shadow-secondary-200/40 border border-secondary-100 p-6 md:p-12">
               <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-6 md:mb-8">
                  One Platform to Book Home Services Within Your Budget
               </h2>
               <p className="text-secondary-600 mb-8 text-base md:text-2xl/9 max-w-5xl">
                  ExtraHand is a smart home services platform that connects customers
                  with verified service providers. Simply post your requirement, mention
                  your budget, and get the best service at your price.
               </p>

               {/* Process steps */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mb-8">
                  {[
                     "Post Your Requirement",
                     "Set Your Budget",
                     "Get Matched with Experts",
                     "Book Instantly",
                  ].map((step, idx) => (
                     <div
                        key={idx}
                        className="flex items-center gap-3 rounded-xl border border-secondary-100 bg-secondary-50/70 px-4 py-3"
                     >
                        <span className="inline-flex size-7 items-center justify-center rounded-full bg-green-100 shrink-0">
                           <CheckCircle2 className="size-4 text-green-700" />
                        </span>
                        <span className="text-secondary-800 font-semibold">{step}</span>
                     </div>
                  ))}
               </div>

               {/* CTAs */}
               <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/tasks/new">
                     <Button size="lg" className="w-full sm:w-auto px-7">
                        Post Your Requirement
                        <ArrowRight className="size-4 ml-2" />
                     </Button>
                  </Link>
                  <Link href="/tasks">
                     <Button
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto px-7 border-secondary-300 hover:bg-secondary-50"
                     >
                        Get Quotes Now
                     </Button>
                  </Link>
               </div>
            </div>

            {/* Categories Section - H2 */}
            <div className="mb-16 md:mb-24">
               <div className="relative overflow-hidden rounded-3xl px-3 py-8 md:px-8 md:py-12 bg-linear-to-b from-primary-50/40 via-white to-primary-50/40">
                  <div className="pointer-events-none absolute top-6 left-6 h-40 w-40 rounded-full bg-primary-200/20 blur-3xl" />
                  <div className="pointer-events-none absolute bottom-4 right-6 h-52 w-52 rounded-full bg-primary-300/10 blur-3xl" />

                  <div className="relative z-10 mx-auto max-w-4xl text-center mb-10 md:mb-12">
                  <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-3">
                     Our Top Categories
                  </h2>
                  <p className="text-secondary-600 text-base md:text-xl/8">
                     Choose from a wide range of home and daily services. All services
                     are handled by verified professionals to ensure quality and safety.
                  </p>
                  </div>

                  <div className="relative overflow-hidden rounded-3xl">
                     <div className="hidden md:block pointer-events-none absolute left-0 top-0 h-full w-24 bg-linear-to-r from-white via-white/80 to-transparent z-10" />
                     <div className="hidden md:block pointer-events-none absolute right-0 top-0 h-full w-24 bg-linear-to-l from-white via-white/80 to-transparent z-10" />

                     {Array.from({ length: 2 }).map((_, lane) => (
                        <motion.div
                           key={lane}
                           className="flex w-max gap-4 md:gap-6 py-2 md:py-3"
                           animate={
                              lane === 0
                                 ? { x: ["0%", "-33.333%"] }
                                 : { x: ["-33.333%", "0%"] }
                           }
                           transition={{
                              duration: CATEGORY_MARQUEE_DURATION_SECONDS,
                              ease: "linear",
                              repeat: Infinity,
                           }}
                        >
                           {[...topCategoryCards, ...topCategoryCards].map((category, idx) => (
                              <Link
                                 key={`${category.slug}-${lane}-${idx}`}
                                 href={`/tasks/new?category=${category.slug}`}
                                 className="group"
                              >
                                 <article className="min-w-[300px] sm:min-w-[420px] lg:min-w-[520px] rounded-2xl bg-white border border-secondary-100 p-4 md:p-5 shadow-sm hover:shadow-xl hover:shadow-secondary-200/40 hover:border-primary-200 transition-all duration-300">
                                    <div className="flex items-start gap-4">
                                       <div className="relative size-20 md:size-24 shrink-0 overflow-hidden rounded-xl bg-secondary-100">
                                          <Image
                                             src={category.image}
                                             alt={category.title}
                                             fill
                                             className="object-cover group-hover:scale-110 transition-transform duration-300"
                                          />
                                       </div>

                                       <div className="min-w-0 flex-1">
                                          <div className="flex items-center justify-between gap-3">
                                             <h3 className="text-xl md:text-2xl font-bold text-secondary-900 group-hover:text-primary-700 transition-colors">
                                                {category.title}
                                             </h3>
                                             <ArrowRight className="size-5 text-secondary-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all shrink-0" />
                                          </div>

                                          <p className="mt-2 text-secondary-600 text-sm md:text-base leading-relaxed">
                                             {category.description}
                                          </p>

                                          <div className="mt-3 flex flex-wrap gap-2">
                                             {category.tags.map((tag) => (
                                                <span
                                                   key={tag}
                                                   className="inline-flex items-center rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs md:text-sm text-primary-700"
                                                >
                                                   {tag}
                                                </span>
                                             ))}
                                          </div>
                                       </div>
                                    </div>
                                 </article>
                              </Link>
                           ))}
                        </motion.div>
                     ))}
                  </div>

                  <div className="relative z-10 text-center mt-6 md:mt-10">
                     <Link
                        href="/services"
                        className="inline-flex items-center gap-2 px-5 py-3 md:px-6 bg-primary-500 hover:bg-primary-600 transition-colors font-semibold rounded-xl text-sm md:text-lg shadow-lg text-white"
                     >
                        View all categories
                        <ArrowRight className="h-5 w-5" />
                     </Link>
                  </div>
               </div>
            </div>

            {/* Why Choose ExtraHand - H2 */}
            <div>
               <div className="mx-auto max-w-4xl text-center mb-8 md:mb-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-100 px-4 py-1.5 text-green-700 text-sm md:text-[15px] font-medium mb-4">
                     <Shield className="size-4" />
                     Your safety is our priority
                  </div>
                  <h2 className="text-2xl md:text-4xl font-bold text-secondary-900 mb-2">
                     Why Choose ExtraHand
                  </h2>
                  <p className="text-secondary-600 text-base md:text-xl/8">
                     We make your life easier by connecting you with trusted service
                     providers.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {whyChoosePoints.map((point, idx) => {
                     const Icon = point.icon;
                     return (
                        <div
                           key={idx}
                           className="group bg-white rounded-xl p-4 border border-secondary-100 shadow-sm hover:shadow-md hover:shadow-secondary-200/40 transition-all duration-300"
                        >
                           <div className="flex items-start gap-3">
                              <div
                                 className={cn(
                                    "inline-flex size-10 items-center justify-center rounded-lg shrink-0",
                                    point.iconBg
                                 )}
                              >
                                 <Icon className={cn("size-5", point.color)} />
                              </div>
                              <div>
                                 <h3 className="font-bold text-secondary-900 text-base mb-1">
                                    {point.title}
                                 </h3>
                                 <p className="text-secondary-600 text-sm/6">
                                    {point.description}
                                 </p>
                              </div>
                           </div>
                        </div>
                     );
                  })}
               </div>
            </div>
         </div>
      </section>
   );
};

export default ServicesSection;
