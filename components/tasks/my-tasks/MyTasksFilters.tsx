"use client";

/**
 * MyTasksFilters - Filter bar component for My Tasks page
 * Mobile responsive with consistent styling
 */

import React from "react";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";
import type { Task } from "@/types/task";

type TaskStatus = Task["status"];

interface MyTasksFiltersProps {
   searchQuery: string;
   statusFilter: TaskStatus | "all";
   sortBy: string;
   onSearchChange: (query: string) => void;
   onStatusChange: (status: TaskStatus | "all") => void;
   onSortChange: (sort: string) => void;
}

const STATUS_FILTERS: Array<{ value: TaskStatus | "all"; label: string }> = [
   { value: "all", label: "All Tasks" },
   { value: "open", label: "Open" },
   { value: "assigned", label: "Assigned" },
   { value: "started", label: "Started" },
   { value: "in_progress", label: "In Progress" },
   { value: "review", label: "Under Review" },
   { value: "completed", label: "Completed" },
   { value: "cancelled", label: "Cancelled" },
];

const SORT_OPTIONS = [
   { value: "recent", label: "Most Recent" },
   { value: "oldest", label: "Oldest First" },
   { value: "budget-high", label: "Budget: High to Low" },
   { value: "budget-low", label: "Budget: Low to High" },
   { value: "applications", label: "Most Applications" },
];

export function MyTasksFilters({
   searchQuery,
   statusFilter,
   sortBy,
   onSearchChange,
   onStatusChange,
   onSortChange,
}: MyTasksFiltersProps) {
   return (
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
               {/* Search */}
               <div className="flex-1">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                     <Input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 h-10 sm:h-11"
                     />
                  </div>
               </div>
               <div className="flex gap-3">
                  {/* Status Filter */}
                  <Select
                     value={statusFilter}
                     onValueChange={(value) =>
                        onStatusChange(value as TaskStatus | "all")
                     }
                  >
                     <SelectTrigger className="w-full sm:w-[180px] h-10 sm:h-11!">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        {STATUS_FILTERS.map((status) => (
                           <SelectItem key={status.value} value={status.value}>
                              {status.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={onSortChange}>
                     <SelectTrigger className="w-full sm:w-[180px] h-10 sm:h-11!">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        {SORT_OPTIONS.map((option) => (
                           <SelectItem key={option.value} value={option.value}>
                              {option.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>
               </div>
            </div>
         </div>
      </div>
   );
}
