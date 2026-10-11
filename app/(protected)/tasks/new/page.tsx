"use client";

import { useEffect } from "react";
import { redirectToAppStore } from "@/lib/utils/getAppStoreUrl";

/**
 * Post a Task Page - Redirects to ExtraHand mobile app
 */
export default function PostTaskPage() {
   useEffect(() => {
      redirectToAppStore();
   }, []);

   return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
         <div className="mx-auto max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-secondary-900">
               Redirecting to ExtraHand App...
            </h1>
            <p className="text-secondary-600">
               Post your task and book services directly through our official mobile app.
            </p>
            <div className="pt-2">
               <button
                  type="button"
                  onClick={() => redirectToAppStore()}
                  className="inline-flex items-center justify-center rounded-xl bg-primary-600 px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors cursor-pointer"
               >
                  Open in App Store / Google Play
               </button>
            </div>
         </div>
      </div>
   );
}
