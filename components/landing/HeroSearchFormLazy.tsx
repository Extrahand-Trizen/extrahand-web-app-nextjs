"use client";

import dynamic from "next/dynamic";

export const HeroSearchFormLazy = dynamic(
   () =>
      import("@/components/landing/HeroSearchForm").then((mod) => ({
         default: mod.HeroSearchForm,
      })),
   {
      ssr: false,
      loading: () => (
         <div
            className="bg-white px-2 md:py-2 rounded-lg shadow-lg max-w-2xl mx-auto h-[52px] md:h-[56px]"
            aria-hidden
         />
      ),
   }
);
