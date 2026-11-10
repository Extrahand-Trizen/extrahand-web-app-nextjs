"use client";

import { ShoppingCart } from "lucide-react";
import { redirectToAppStore } from "@/lib/utils/getAppStoreUrl";

export function HeroSearchForm() {
   return (
      <div className="mx-auto max-w-2xl">
         <div className="flex min-h-[28px] flex-wrap justify-center gap-3 md:min-h-[36px]">
            {[
               "Cleaning",
               "Moving",
               "Handyman",
               "Painting",
               "Gardening",
               "Plumbing",
            ].map((tag) => (
               <span
                  key={tag}
                  className="px-3 md:px-4 py-1 md:py-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-md text-xs md:text-sm font-medium transition-colors border border-white/30"
               >
                  {tag}
               </span>
            ))}
         </div>
         <div className="mt-4 flex justify-center">
            <button
               type="button"
               onClick={() => redirectToAppStore()}
               className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-6 py-2.5 text-sm font-semibold text-white shadow-sm backdrop-blur-md transition-colors hover:bg-white/30 md:text-base"
               aria-label="Get ExtraMart in the ExtraHand app"
            >
               <ShoppingCart className="size-5" aria-hidden="true" />
               ExtraMart
            </button>
         </div>
      </div>
   );
}
