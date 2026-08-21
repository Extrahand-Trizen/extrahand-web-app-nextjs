"use client";

import dynamic from "next/dynamic";

const POPULAR_TAGS = [
   "Cleaning",
   "Moving",
   "Handyman",
   "Painting",
   "Gardening",
   "Plumbing",
   "Business",
];

/** Matches HeroSearchForm bar + popular-tags row so lazy load does not shift layout. */
function HeroSearchFormPlaceholder() {
   return (
      <div className="max-w-2xl mx-auto" aria-hidden="true">
         <div className="bg-white px-2 md:py-2 rounded-lg shadow-lg">
            <div className="flex items-center gap-1 md:gap-2 min-h-[40px] md:min-h-[48px]" />
         </div>
         <div className="mt-8 flex flex-wrap justify-center gap-3 min-h-[28px] md:min-h-[36px]">
            {POPULAR_TAGS.map((tag) => (
               <span
                  key={tag}
                  className="px-3 md:px-4 py-1 md:py-2 rounded-full bg-white/20 text-white backdrop-blur-md text-xs md:text-sm font-medium border border-white/30"
               >
                  {tag}
               </span>
            ))}
         </div>
      </div>
   );
}

export const HeroSearchFormLazy = dynamic(
   () =>
      import("@/components/landing/HeroSearchForm").then((mod) => ({
         default: mod.HeroSearchForm,
      })),
   {
      ssr: false,
      loading: () => <HeroSearchFormPlaceholder />,
   }
);
