"use client";

import { useEffect, useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
   Popover,
   PopoverTrigger,
   PopoverContent,
} from "@/components/ui/popover";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { serviceCategories } from "@/lib/data/categories";

export interface CompactFilterState {
   categories: string[];
   suburb: string;
   remotely: boolean;
   minBudget: number;
   maxBudget: number;
   sortBy: string;
}

interface CompactFilterBarProps {
   filters: CompactFilterState;
   onFilterChange: (filters: CompactFilterState) => void;
   searchQuery: string;
   onSearchChange: (query: string) => void;
   resultCount: number;
}

const PRICE_RANGES = [
   { label: "Any price", min: 0, max: 100000 },
   { label: "Under ₹500", min: 0, max: 500 },
   { label: "₹500 - ₹1,000", min: 500, max: 1000 },
   { label: "₹1,000 - ₹2,500", min: 1000, max: 2500 },
   { label: "₹2,500 - ₹5,000", min: 2500, max: 5000 },
   { label: "Over ₹5,000", min: 5000, max: 100000 },
];

export function CompactFilterBar({
   filters,
   onFilterChange,
   searchQuery,
   onSearchChange,
   resultCount,
}: CompactFilterBarProps) {
   const CATEGORIES = serviceCategories.map((c) => c.id);

   const [showCategoryDialog, setShowCategoryDialog] = useState(false);
   const [showSuburbPopover, setShowSuburbPopover] = useState(false);

   // local suburb state (editable before Apply)
   const [suburbSearch, setSuburbSearch] = useState(filters.suburb || "");

   useEffect(() => {
      setSuburbSearch(filters.suburb || "");
   }, [filters.suburb]);

   // sample suggestions (replace with API later)
   const suburbSuggestions = [
      "Hyderabad Biryani House, Attapur, Hyderabad",
      "Mehdipatnam, Hyderabad",
      "Tarnaka, Hyderabad",
      "Nallagandla, Hyderabad",
   ];

   const filteredSuburbSuggestions = suburbSearch
      ? suburbSuggestions.filter((s) =>
           s.toLowerCase().includes(suburbSearch.toLowerCase())
        )
      : suburbSuggestions.slice(0, 4);

   const handleCategoryToggle = (category: string) => {
      const newCategories = filters.categories.includes(category)
         ? filters.categories.filter((c) => c !== category)
         : [...filters.categories, category];
      onFilterChange({ ...filters, categories: newCategories });
   };

   const handlePriceChange = (label: string) => {
      const range = PRICE_RANGES.find((r) => r.label === label);
      if (range) {
         onFilterChange({
            ...filters,
            minBudget: range.min,
            maxBudget: range.max,
         });
      }
   };

   const clearAllFilters = () => {
      onFilterChange({
         categories: [],
         suburb: "",
         remotely: false,
         minBudget: 0,
         maxBudget: 100000,
         sortBy: "recent",
      });
      setSuburbSearch("");
      onSearchChange("");
   };

   const selectedPriceLabel =
      PRICE_RANGES.find(
         (r) => r.min === filters.minBudget && r.max === filters.maxBudget
      )?.label || "Any price";

   const hasActiveFilters =
      filters.categories.length > 0 ||
      !!filters.suburb ||
      filters.remotely ||
      filters.minBudget > 0 ||
      filters.maxBudget < 100000 ||
      !!searchQuery;

   const applySuburb = (value: string) => {
      onFilterChange({ ...filters, suburb: value });
      setShowSuburbPopover(false);
   };

   const clearSuburb = () => {
      setSuburbSearch("");
      onFilterChange({ ...filters, suburb: "" });
   };

   return (
      <>
         <div className="bg-white border-b border-secondary-200 sticky top-0 z-20">
            <div className="max-w-7xl mx-auto px-4 py-3">
               <div className="flex items-center gap-2 flex-wrap">
                  {/* Search */}
                  <div className="flex-1 min-w-[200px] max-w-[320px]">
                     <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                        <Input
                           value={searchQuery}
                           onChange={(e) => onSearchChange(e.target.value)}
                           placeholder="Search for a task"
                           className="pl-10 pr-3 py-2 text-sm"
                        />
                     </div>
                  </div>

                  {/* Category (Dialog) */}
                  <Button
                     variant="outline"
                     className="px-4 py-2 text-sm flex items-center gap-2"
                     onClick={() => setShowCategoryDialog(true)}
                  >
                     {filters.categories.length > 0
                        ? `Category (${filters.categories.length})`
                        : "Category"}
                     <ChevronDown className="h-4 w-4" />
                  </Button>

                  {/* Suburb (Popover) */}
                  <Popover
                     open={showSuburbPopover}
                     onOpenChange={setShowSuburbPopover}
                  >
                     <PopoverTrigger asChild>
                        <Button
                           variant="outline"
                           className="px-4 py-2 text-sm min-w-[220px] flex items-center gap-2"
                        >
                           <span className="truncate">
                              {filters.suburb
                                 ? filters.suburb
                                 : "50km Mumbai MH 400104"}
                           </span>
                           {filters.remotely && (
                              <span className="text-xs text-blue-600 ml-2">
                                 & remotely
                              </span>
                           )}
                           <ChevronDown className="h-4 w-4 ml-auto" />
                        </Button>
                     </PopoverTrigger>

                     <PopoverContent className="w-[420px] p-4">
                        <div className="space-y-3">
                           <div className="flex items-center gap-2">
                              <Button
                                 size="sm"
                                 variant={
                                    filters.remotely ? "outline" : "default"
                                 }
                                 onClick={() =>
                                    onFilterChange({
                                       ...filters,
                                       remotely: false,
                                    })
                                 }
                              >
                                 In-person
                              </Button>
                              <Button
                                 size="sm"
                                 variant={
                                    filters.remotely ? "default" : "outline"
                                 }
                                 onClick={() =>
                                    onFilterChange({
                                       ...filters,
                                       remotely: true,
                                    })
                                 }
                              >
                                 Remotely
                              </Button>
                              <Button
                                 size="sm"
                                 variant="outline"
                                 onClick={() =>
                                    onFilterChange({
                                       ...filters,
                                       remotely: false,
                                    })
                                 }
                              >
                                 All
                              </Button>
                           </div>

                           <div>
                              <label className="block text-xs font-semibold text-secondary-600 mb-2 uppercase">
                                 Suburb
                              </label>
                              <div className="relative">
                                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
                                 <Input
                                    value={suburbSearch}
                                    onChange={(e) =>
                                       setSuburbSearch(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                       if (e.key === "Enter")
                                          applySuburb(suburbSearch.trim());
                                    }}
                                    placeholder="Type a suburb or address"
                                    className="pl-10"
                                 />
                              </div>
                           </div>

                           <div className="max-h-[200px] overflow-y-auto space-y-1">
                              {filteredSuburbSuggestions.length > 0 ? (
                                 filteredSuburbSuggestions.map((s, i) => (
                                    <button
                                       key={i}
                                       onClick={() => applySuburb(s)}
                                       className="w-full text-left px-3 py-2 text-sm hover:bg-secondary-50 rounded-md transition-colors"
                                    >
                                       {s}
                                    </button>
                                 ))
                              ) : (
                                 <div className="text-sm text-secondary-500 px-2">
                                    No suggestions
                                 </div>
                              )}
                           </div>

                           <div className="flex justify-between items-center pt-2 border-t border-secondary-100">
                              <button
                                 onClick={clearSuburb}
                                 className="text-sm text-secondary-600 hover:text-secondary-900"
                              >
                                 Clear
                              </button>

                              <div className="flex gap-2">
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowSuburbPopover(false)}
                                 >
                                    Cancel
                                 </Button>
                                 <Button
                                    onClick={() =>
                                       applySuburb(suburbSearch.trim())
                                    }
                                 >
                                    Apply
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </PopoverContent>
                  </Popover>

                  {/* Price (Select) */}
                  <Select
                     onValueChange={(val) => handlePriceChange(val)}
                     value={selectedPriceLabel}
                  >
                     <SelectTrigger className="px-4 py-2 text-sm">
                        <SelectValue placeholder="Any price" />
                     </SelectTrigger>
                     <SelectContent>
                        {PRICE_RANGES.map((r) => (
                           <SelectItem key={r.label} value={r.label}>
                              {r.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  {/* Sort (Select) */}
                  <Select
                     value={filters.sortBy}
                     onValueChange={(val) =>
                        onFilterChange({ ...filters, sortBy: val })
                     }
                  >
                     <SelectTrigger className="px-4 py-2 text-sm">
                        <SelectValue placeholder="Sort" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="recent">Recent</SelectItem>
                        <SelectItem value="price-low">
                           Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                           Price: High to Low
                        </SelectItem>
                        <SelectItem value="date">Date Posted</SelectItem>
                     </SelectContent>
                  </Select>

                  {/* Clear */}
                  {hasActiveFilters && (
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="flex items-center gap-2"
                     >
                        <X className="h-4 w-4" />
                        Clear all
                     </Button>
                  )}
               </div>
            </div>
         </div>

         {/* Category Dialog (multi-select) */}
         <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
            <DialogContent className="max-w-2xl p-0">
               <DialogHeader className="p-4 border-b">
                  <DialogTitle>All Categories</DialogTitle>
               </DialogHeader>

               <div className="p-4 max-h-[60vh] overflow-y-auto">
                  <div className="grid grid-cols-2 gap-3">
                     {CATEGORIES.map((category) => (
                        <label
                           key={category}
                           className="flex items-center gap-3 p-3 rounded-md hover:bg-secondary-50 cursor-pointer transition-colors"
                        >
                           <Checkbox
                              checked={filters.categories.includes(category)}
                              onCheckedChange={() =>
                                 handleCategoryToggle(category)
                              }
                           />
                           <span className="text-sm">{category}</span>
                        </label>
                     ))}
                  </div>
               </div>

               <DialogFooter className="p-4 border-t flex justify-between">
                  <button
                     onClick={() =>
                        onFilterChange({ ...filters, categories: [] })
                     }
                     className="text-sm text-secondary-600 hover:text-secondary-900"
                  >
                     Clear all
                  </button>

                  <div className="flex gap-2">
                     <Button
                        variant="ghost"
                        onClick={() => setShowCategoryDialog(false)}
                     >
                        Cancel
                     </Button>
                     <Button onClick={() => setShowCategoryDialog(false)}>
                        Apply
                     </Button>
                  </div>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
}
