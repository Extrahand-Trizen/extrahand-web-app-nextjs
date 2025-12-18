"use client";

/**
 * Location Hint Component
 * Very subtle hint for taskers about nearby tasks
 * Non-promotional, minimal styling
 */

import React from "react";
import { useRouter } from "next/navigation";
import { MapPin, ArrowRight } from "lucide-react";

interface LocationHintProps {
   nearbyTasksCount?: number;
   userRole?: "tasker" | "poster" | "both";
}

export function LocationHint({
   nearbyTasksCount = 0,
   userRole,
}: LocationHintProps) {
   const router = useRouter();

   // Only show for taskers
   if (userRole !== "tasker" && userRole !== "both") {
      return null;
   }

   if (!nearbyTasksCount || nearbyTasksCount === 0) {
      return null;
   }

   return (
      <button
         onClick={() => router.push("/tasks")}
         className="w-full text-left flex items-center justify-between gap-2 p-2.5 text-xs text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded transition-colors group"
      >
         <div className="flex items-center gap-2 flex-1 min-w-0">
            <MapPin className="w-3.5 h-3.5 text-secondary-400 shrink-0" />
            <span>
               {nearbyTasksCount} task{nearbyTasksCount > 1 ? "s" : ""} near you
               today
            </span>
         </div>
         <ArrowRight className="w-3 h-3 text-secondary-400 group-hover:text-secondary-600 transition-colors shrink-0" />
      </button>
   );
}
