"use client";

/**
 * MyApplicationsEmptyState - Empty state component for My Applications page
 * Shows different messages based on whether filters are applied
 */

import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Search } from "lucide-react";
import Link from "next/link";

interface MyApplicationsEmptyStateProps {
   hasFilters: boolean;
}

export function MyApplicationsEmptyState({
   hasFilters,
}: MyApplicationsEmptyStateProps) {
   if (hasFilters) {
      return (
         <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4">
            <div className="w-24 h-24 md:w-32 md:h-32 mb-6 bg-secondary-50 rounded-full flex items-center justify-center">
               <Search className="w-12 h-12 md:w-16 md:h-16 text-secondary-300" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-secondary-900 mb-2">
               No applications found
            </h3>
            <p className="text-sm md:text-base text-secondary-600 text-center max-w-md mb-6">
               Try adjusting your filters to see more results.
            </p>
         </div>
      );
   }

   return (
      <div className="flex flex-col items-center justify-center py-16 md:py-24 px-4">
         <div className="w-24 h-24 md:w-32 md:h-32 mb-6 bg-secondary-50 rounded-full flex items-center justify-center">
            <FileText className="w-12 h-12 md:w-16 md:h-16 text-secondary-300" />
         </div>
         <h3 className="text-lg md:text-xl font-bold text-secondary-900 mb-2">
            No applications yet
         </h3>
         <p className="text-sm md:text-base text-secondary-600 text-center max-w-md mb-6">
            Start applying to tasks to see your applications here. Browse
            available tasks and submit your offers!
         </p>
         <Link href="/tasks">
            <Button className="bg-primary-600 hover:bg-primary-700 text-white">
               Browse Tasks
            </Button>
         </Link>
      </div>
   );
}
