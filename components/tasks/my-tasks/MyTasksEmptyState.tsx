"use client";

/**
 * MyTasksEmptyState - Empty state component for My Tasks page
 */

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface MyTasksEmptyStateProps {
   hasFilters: boolean;
}

export function MyTasksEmptyState({ hasFilters }: MyTasksEmptyStateProps) {
   const router = useRouter();

   return (
      <div className="flex items-center justify-center py-12 sm:py-20 px-4">
         <div className="text-center max-w-md">
            <p className="text-xl sm:text-2xl font-bold text-secondary-900 mb-2">
               {hasFilters ? "No tasks found" : "No tasks posted yet"}
            </p>
            <p className="text-sm sm:text-base text-secondary-600 mb-6">
               {hasFilters
                  ? "Try adjusting your filters or search query"
                  : "Create your first task to get started!"}
            </p>
            {!hasFilters && (
               <Button
                  onClick={() => router.push("/tasks/new")}
                  className="bg-primary-600 hover:bg-primary-700"
               >
                  <Plus className="w-4 h-4 mr-2" />
                  Post Your First Task
               </Button>
            )}
         </div>
      </div>
   );
}
