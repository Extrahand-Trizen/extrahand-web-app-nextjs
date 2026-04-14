"use client";

import React from "react";
import Link from "next/link";
import type { Subcategory } from "@/types/category";
import {
   getSubcategorySlugForRoute,
   subcategorySectionAnchorId,
} from "@/lib/utils/serviceCategoryAnchors";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategorySubservicesSectionProps {
   parentSlug: string;
   subcategories: Subcategory[];
   variant: "poster" | "tasker";
   className?: string;
}

export function CategorySubservicesSection({
   parentSlug,
   subcategories,
   variant,
   className,
}: CategorySubservicesSectionProps) {
   if (!parentSlug || !subcategories?.length) return null;

   const title =
      variant === "poster"
         ? "Available Services"
         : "Available Tasks";

   return (
      <section
         className={cn(
            "border-b border-gray-100 bg-white py-10 md:py-14",
            className
         )}
         aria-labelledby="subservices-heading"
      >
         <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2
               id="subservices-heading"
               className="text-2xl font-semibold tracking-tight text-gray-900 md:text-3xl"
            >
               {title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 md:text-base">
               {variant === "poster"
                  ? "Browse the services in this category and choose the one you need."
                  : "Browse the task types in this category and pick work that matches your skills."}
            </p>
            <ul className="mt-8 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
               {subcategories.map((sub) => {
                  const anchor = subcategorySectionAnchorId(parentSlug, sub.slug);
                  const base =
                     variant === "poster" ? "/services" : "/jobs";
                  const subRouteSlug = getSubcategorySlugForRoute(
                     parentSlug,
                     sub.slug
                  );
                  const href = `${base}/${encodeURIComponent(parentSlug)}/${encodeURIComponent(
                     subRouteSlug
                  )}`;
                  return (
                     <li key={sub._id || `${sub.slug}-${sub.name}`}>
                        <Link
                           href={href}
                           id={anchor}
                           className="block scroll-mt-28 rounded-xl border border-gray-200 bg-gray-50/80 p-4 transition-colors hover:border-primary-300 hover:bg-primary-50/40"
                        >
                           <h3 className="text-base font-semibold text-gray-900">
                              {sub.name}
                           </h3>
                        </Link>
                     </li>
                  );
               })}
            </ul>
            {variant === "poster" && (
               <div className="mt-8">
                  <Button asChild>
                     <Link href="/tasks/new">Post a task</Link>
                  </Button>
               </div>
            )}
         </div>
      </section>
   );
}
