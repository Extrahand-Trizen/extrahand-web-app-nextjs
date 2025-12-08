"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
   Drill,
   Hammer,
   Truck,
   Sparkles,
   Leaf,
   Paintbrush,
   Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Families (top tabs)
const families = [
   { key: "assembly", label: "Assembly", icon: Wrench },
   { key: "mounting", label: "Mounting", icon: Drill },
   { key: "moving", label: "Moving", icon: Truck },
   { key: "cleaning", label: "Cleaning", icon: Sparkles },
   { key: "outdoor", label: "Outdoor Help", icon: Leaf },
   { key: "homerepairs", label: "Home Repairs", icon: Hammer },
   { key: "painting", label: "Painting", icon: Paintbrush },
   { key: "trending", label: "Trending", icon: Sparkles },
] as const;

// Pills per family
const pills: Record<string, string[]> = {
   assembly: [
      "Furniture Assembly",
      "IKEA Assembly",
      "Bed Frame",
      "Wardrobe",
      "Desk",
      "Kitchen Cabinets",
   ],
   mounting: [
      "Hang Art, Mirror & Decor",
      "Install Blinds & Window Treatments",
      "Mount & Anchor Furniture",
      "Install Shelves, Rods & Hooks",
      "Other Mounting",
      "TV Mounting",
   ],
   moving: ["Local Move", "Pack & Unpack", "Load & Unload", "Mini Truck"],
   cleaning: ["Deep Clean", "Bedroom", "Bathroom", "Kitchen", "Sofa"],
   outdoor: ["Garden", "Lawn", "Gutter", "Patio"],
   homerepairs: ["Plumbing", "Electrical", "Carpentry", "Handyman"],
   painting: ["Walls", "Ceilings", "Doors", "Touch-ups"],
   trending: ["Gallery Walls", "Wire Conceal", "Smart Home", "Soundbars"],
};

// Featured content per family
const featured: Record<
   string,
   { title: string; bullets: string[]; image: string; cta?: string }
> = {
   mounting: {
      title: "Mounting",
      bullets: [
         "Securely mount your TV, shelves, art, mirrors, dressers, and more.",
         "Now Trending: Gallery walls, art TVs, and wraparound bookcases.",
      ],
      image: "/assets/mobilescreens/mounting.png",
      cta: "Post a Mounting Task",
   },
   assembly: {
      title: "Assembly",
      bullets: [
         "Fast assembly for furniture and modular systems, done right.",
         "Specialists in IKEA, Urban Ladder, and custom builds.",
      ],
      image: "/assets/mobilescreens/furniture.png",
      cta: "Post an Assembly Task",
   },
   moving: {
      title: "Moving",
      bullets: [
         "From mini-truck to room-to-room, get reliable help.",
         "Careful packing, loading, and unloading with insurance options.",
      ],
      image: "/assets/mobilescreens/moving.png",
      cta: "Post a Moving Task",
   },
   cleaning: {
      title: "Cleaning",
      bullets: [
         "Deep cleans and regular maintenance — kitchens, bathrooms, sofas.",
         "Eco-friendly options and vetted professionals.",
      ],
      image: "/assets/mobilescreens/cleaning.png",
      cta: "Post a Cleaning Task",
   },
   outdoor: {
      title: "Outdoor Help",
      bullets: [
         "Garden care, lawn maintenance, gutter cleaning.",
         "Seasonal upkeep.",
      ],
      image: "/assets/mobilescreens/garden.png",
      cta: "Post an Outdoor Task",
   },
   homerepairs: {
      title: "Home Repairs",
      bullets: [
         "Plumbing, electrical, carpentry, and general handyman work.",
         "Quick fixes and renovations.",
      ],
      image: "/assets/mobilescreens/handy.png",
      cta: "Post a Repair Task",
   },
   painting: {
      title: "Painting",
      bullets: [
         "Interior/exterior painting with clean edges.",
         "Touch-ups and full room coverage.",
      ],
      image: "/assets/mobilescreens/painting.png",
      cta: "Post a Painting Task",
   },
   trending: {
      title: "Trending",
      bullets: [
         "Gallery walls, wire conceal, smart home setup.",
         "Soundbar + art TV alignment.",
      ],
      image: "/assets/mobilescreens/business.png",
      cta: "Post a Trending Task",
   },
};

export const CategoriesExplorer: React.FC = () => {
   const [active, setActive] =
      useState<(typeof families)[number]["key"]>("mounting");

   const ActiveIcon = families.find((f) => f.key === active)?.icon ?? Sparkles;
   const activeFeatured = featured[active];

   return (
      <section className="py-16 bg-secondary-50/50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div>
               <h2 className="text-3xl sm:text-4xl font-bold text-secondary-900 mb-3">
                  Popular Categories
               </h2>
               <p className="text-lg text-secondary-600 mb-8">
                  Browse thousands of tasks across categories. Find help for
                  anything you need.
               </p>
            </div>
            {/* Tabs */}
            <div className="relative">
               <div className="flex gap-6 overflow-x-auto px-1 pb-3 scrollbar-hide">
                  {families.map((f) => {
                     const isActive = f.key === active;
                     return (
                        <button
                           key={f.key}
                           type="button"
                           onClick={() => setActive(f.key)}
                           className={cn(
                              "flex flex-col justify-center items-center gap-2 px-3 py-2 border-b-2",
                              isActive
                                 ? "text-secondary-900  border-secondary-900"
                                 : "text-secondary-600 hover:text-secondary-900"
                           )}
                           aria-selected={isActive}
                           role="tab"
                        >
                           <f.icon className="h-5 w-5" />
                           <span className="text-sm font-medium">
                              {f.label}
                           </span>
                        </button>
                     );
                  })}
               </div>
               {/* gradient fades hint more tabs */}
               <div className="pointer-events-none absolute left-0 top-0 h-full w-6 bg-linear-to-r from-white to-transparent" />
               <div className="pointer-events-none absolute right-0 top-0 h-full w-6 bg-linear-to-l from-white to-transparent" />
            </div>

            {/* Pills */}
            <div
               className="mt-4 flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
               role="tablist"
               aria-label="Category options"
            >
               {pills[active].map((p) => (
                  <button
                     key={p}
                     type="button"
                     className="shrink-0 rounded-full border border-secondary-300 bg-white px-4 py-2 text-sm text-secondary-800 hover:bg-secondary-50"
                  >
                     {p}
                  </button>
               ))}
               {/* Optional More pill */}
               <button
                  type="button"
                  className="shrink-0 rounded-full border border-secondary-300 bg-white px-4 py-2 text-sm text-secondary-800 hover:bg-secondary-50"
               >
                  More…
               </button>
            </div>

            {/* Featured panel — overlay card on image like TaskRabbit */}
            <div className="mt-8 rounded-3xl bg-[#e8f5f0] p-4 sm:p-6">
               <div className="relative overflow-hidden rounded-2xl">
                  {/* Background image — full width */}
                  <div className="relative w-full aspect-16/7 sm:aspect-12/5">
                     <Image
                        src={activeFeatured.image}
                        alt={`${activeFeatured.title} showcase`}
                        fill
                        sizes="(min-width: 1024px) 1200px, 100vw"
                        className="object-cover"
                        priority={active === "mounting"}
                     />
                  </div>
                  {/* Overlaid info card */}
                  <div className="absolute inset-y-0 left-0 flex items-center p-4 sm:p-8">
                     <div className="rounded-xl bg-white/95 backdrop-blur p-5 sm:p-6 shadow-lg max-w-xs sm:max-w-sm">
                        <h3 className="text-xl sm:text-2xl font-bold text-secondary-900">
                           {activeFeatured.title}
                        </h3>
                        <ul className="mt-4 space-y-3 text-secondary-700">
                           {activeFeatured.bullets.map((b, i) => (
                              <li key={i} className="flex gap-2 items-start">
                                 <svg
                                    className="mt-1 h-4 w-4 shrink-0 text-green-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M5 13l4 4L19 7"
                                    />
                                 </svg>
                                 <span className="text-sm sm:text-base leading-snug">
                                    {b}
                                 </span>
                              </li>
                           ))}
                        </ul>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
};
