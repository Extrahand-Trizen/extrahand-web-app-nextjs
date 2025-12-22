"use client";

/**
 * MyApplicationsFilters - Filter and sort component for My Applications page
 * Provides search, status filter, and sorting options
 */

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import type { TaskApplication } from "@/types/application";

type ApplicationStatus = TaskApplication["status"];

interface MyApplicationsFiltersProps {
   searchQuery: string;
   statusFilter: ApplicationStatus | "all";
   sortBy: string;
   onSearchChange: (query: string) => void;
   onStatusChange: (status: ApplicationStatus | "all") => void;
   onSortChange: (sort: string) => void;
}

const STATUS_FILTERS: Array<{
   value: ApplicationStatus | "all";
   label: string;
}> = [
   { value: "all", label: "All Applications" },
   { value: "pending", label: "Pending" },
   { value: "accepted", label: "Accepted" },
   { value: "rejected", label: "Rejected" },
   { value: "withdrawn", label: "Withdrawn" },
];

const SORT_OPTIONS = [
   { value: "recent", label: "Most Recent" },
   { value: "oldest", label: "Oldest First" },
   { value: "budget-high", label: "Budget: High to Low" },
   { value: "budget-low", label: "Budget: Low to High" },
   { value: "status", label: "By Status" },
];

export function MyApplicationsFilters({
   searchQuery,
   statusFilter,
   sortBy,
   onSearchChange,
   onStatusChange,
   onSortChange,
}: MyApplicationsFiltersProps) {
   return (
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-[9] w-screen">
         <div className="w-full px-4 sm:px-6 lg:px-8 py-4 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
               {/* Search */}
               <div className="flex-1">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-400" />
                     <Input
                        type="text"
                        placeholder="Search applications or tasks..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10 h-10 sm:h-11"
                     />
                  </div>
               </div>
               <div className="flex gap-3">
                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={onStatusChange}>
                     <SelectTrigger className="w-[160px] sm:w-[180px] h-10 sm:h-11!">
                        <SelectValue />
                     </SelectTrigger>
                     <SelectContent>
                        {STATUS_FILTERS.map((filter) => (
                           <SelectItem key={filter.value} value={filter.value}>
                              {filter.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={onSortChange}>
                     <SelectTrigger className="w-[160px] sm:w-[180px] h-10 sm:h-11!">
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
