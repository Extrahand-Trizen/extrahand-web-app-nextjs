"use client";

import dynamic from "next/dynamic";

/** Matches HeroSearchForm bar + popular-tags row so lazy load does not shift layout. */
function HeroSearchFormPlaceholder() {
   return (
      <div className="max-w-2xl mx-auto" aria-hidden>
         <div className="bg-white px-2 md:py-2 rounded-lg shadow-lg h-[44px] md:h-[56px]" />
         <div className="mt-8 flex flex-wrap justify-center gap-3 min-h-[28px] md:min-h-[36px]" />
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
