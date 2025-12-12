"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { serviceCategories } from "@/lib/data/categories";

import {
   Popover,
   PopoverTrigger,
   PopoverContent,
} from "@/components/ui/popover";

import {
   Sheet,
   SheetHeader,
   SheetTitle,
   SheetContent,
   SheetTrigger,
} from "@/components/ui/sheet";

import {
   Select,
   SelectTrigger,
   SelectContent,
   SelectItem,
   SelectValue,
} from "@/components/ui/select";

export const CompactFilterBar = ({
   filters,
   onFilterChange,
   searchQuery,
   onSearchChange,
   resultCount,
}) => {
   const isMobile = useIsMobile();

   const hasActiveFilters =
      filters.categories.length > 0 ||
      filters.suburb ||
      filters.remotely ||
      filters.minBudget !== 0 ||
      filters.maxBudget !== 100000 ||
      searchQuery.length > 0;

   const clearAll = () => {
      onFilterChange({
         categories: [],
         suburb: "",
         remotely: false,
         minBudget: 0,
         maxBudget: 100000,
         sortBy: "recent",
      });
      onSearchChange("");
   };

   if (isMobile) {
      return (
         <MobileFilterSheet
            filters={filters}
            onFilterChange={onFilterChange}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            resultCount={resultCount}
            clearAll={clearAll}
         />
      );
   }

   return (
      <div className="bg-white border-b border-secondary-200 sticky top-0 z-20">
         <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
            <SearchFilter value={searchQuery} onChange={onSearchChange} />

            <CategoryFilter filters={filters} onFilterChange={onFilterChange} />

            <LocationFilter filters={filters} onFilterChange={onFilterChange} />

            <PriceFilter filters={filters} onFilterChange={onFilterChange} />

            <SortFilter
               value={filters.sortBy}
               onChange={(v) => onFilterChange({ ...filters, sortBy: v })}
            />

            {hasActiveFilters && (
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="flex items-center gap-2"
               >
                  <X className="h-4 w-4" /> Clear all
               </Button>
            )}
         </div>
      </div>
   );
};

export const SearchFilter = ({ value, onChange }) => {
   return (
      <div className="flex-1 min-w-[200px] max-w-[320px]">
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <Input
               value={value}
               onChange={(e) => onChange(e.target.value)}
               placeholder="Search for a task"
               className="pl-10 pr-3 py-2 text-sm"
            />
         </div>
      </div>
   );
};

export const CategoryFilter = ({ filters, onFilterChange }) => {
   const [open, setOpen] = useState(false);
   const CATEGORIES = serviceCategories.map((c) => c.id);

   const toggleCategory = (category: string) => {
      const updated = filters.categories.includes(category)
         ? filters.categories.filter((c) => c !== category)
         : [...filters.categories, category];

      onFilterChange({ ...filters, categories: updated });
   };

   return (
      <>
         <Button
            variant="outline"
            className="px-4 py-2 text-sm flex items-center gap-2"
            onClick={() => setOpen(true)}
         >
            {filters.categories.length
               ? `Category (${filters.categories.length})`
               : "Category"}
            <ChevronDown className="h-4 w-4" />
         </Button>

         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>All Categories</DialogTitle>
               </DialogHeader>

               <div className="grid grid-cols-2 gap-1 max-h-[60vh] overflow-y-auto px-2">
                  {CATEGORIES.map((cat) => (
                     <label
                        key={cat}
                        className="flex items-center gap-2 p-1 hover:bg-secondary-50 rounded-md cursor-pointer"
                     >
                        <Checkbox
                           checked={filters.categories.includes(cat)}
                           onCheckedChange={() => toggleCategory(cat)}
                        />
                        <span className="text-sm">{cat}</span>
                     </label>
                  ))}
               </div>

               <DialogFooter className="flex justify-end flex-row">
                  <Button
                     variant="ghost"
                     onClick={() =>
                        onFilterChange({ ...filters, categories: [] })
                     }
                  >
                     Clear all
                  </Button>
                  <Button onClick={() => setOpen(false)}>Apply</Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
   );
};

export const LocationFilter = ({ filters, onFilterChange }) => {
   const [open, setOpen] = useState(false);
   const [suburbSearch, setSuburbSearch] = useState(filters.suburb);

   useEffect(() => setSuburbSearch(filters.suburb), [filters.suburb]);

   const suggestions = [
      "Hyderabad Biryani House, Attapur, Hyderabad",
      "Mehdipatnam, Hyderabad",
      "Tarnaka, Hyderabad",
      "Nallagandla, Hyderabad",
   ].filter((s) =>
      suburbSearch ? s.toLowerCase().includes(suburbSearch.toLowerCase()) : true
   );

   const apply = (v: string) => {
      onFilterChange({ ...filters, suburb: v });
      setOpen(false);
   };

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               className="min-w-[220px] flex items-center gap-2 text-sm"
            >
               <span className="truncate">
                  {filters.suburb || "50km Mumbai MH 400104"}
               </span>
               <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
         </PopoverTrigger>

         <PopoverContent className="md:w-[420px] p-4 space-y-4">
            {/* Toggle in-person / remote */}
            <div className="flex gap-2">
               <Button
                  size="sm"
                  variant={filters.remotely ? "outline" : "default"}
                  onClick={() =>
                     onFilterChange({ ...filters, remotely: false })
                  }
               >
                  In-person
               </Button>

               <Button
                  size="sm"
                  variant={filters.remotely ? "default" : "outline"}
                  onClick={() => onFilterChange({ ...filters, remotely: true })}
               >
                  Remotely
               </Button>
            </div>

            {/* Input */}
            <div>
               <label className="block text-xs mb-1">Suburb</label>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 md:size-4 text-secondary-400" />
                  <Input
                     value={suburbSearch}
                     onChange={(e) => setSuburbSearch(e.target.value)}
                     className="pl-10 text-xs md:text-sm"
                  />
               </div>
            </div>

            {/* Suggestions */}
            <div className="max-h-[200px] overflow-y-auto space-y-1">
               {suggestions.map((s) => (
                  <button
                     key={s}
                     onClick={() => apply(s)}
                     className="block w-full text-left px-3 py-1 text-xs md:text-sm hover:bg-secondary-50 rounded-md"
                  >
                     {s}
                  </button>
               ))}
            </div>
         </PopoverContent>
      </Popover>
   );
};

const PRICE_RANGES = [
   { label: "Any price", min: 0, max: 100000 },
   { label: "Under ₹500", min: 0, max: 500 },
   { label: "₹500 - ₹1,000", min: 500, max: 1000 },
   { label: "₹1,000 - ₹2,500", min: 1000, max: 2500 },
   { label: "₹2,500 - ₹5,000", min: 2500, max: 5000 },
   { label: "Over ₹5,000", min: 5000, max: 100000 },
];

export const PriceFilter = ({ filters, onFilterChange }) => {
   const selected = PRICE_RANGES.find(
      (r) => r.min === filters.minBudget && r.max === filters.maxBudget
   )?.label;

   const apply = (label: string) => {
      const r = PRICE_RANGES.find((x) => x.label === label);
      if (!r) return;

      onFilterChange({
         ...filters,
         minBudget: r.min,
         maxBudget: r.max,
      });
   };

   return (
      <Select value={selected} onValueChange={apply}>
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
   );
};

export const SortFilter = ({ value, onChange }) => {
   return (
      <Select value={value} onValueChange={onChange}>
         <SelectTrigger className="px-4 py-2 text-sm">
            <SelectValue placeholder="Sort" />
         </SelectTrigger>
         <SelectContent>
            <SelectItem value="recent">Recent</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="date">Date Posted</SelectItem>
         </SelectContent>
      </Select>
   );
};

export const MobileFilterSheet = ({
   filters,
   onFilterChange,
   searchQuery,
   onSearchChange,
   resultCount,
   clearAll,
}) => {
   const [open, setOpen] = useState(false);

   const handleApply = () => {
      setOpen(false);
   };

   return (
      <div className="sticky bg-white border-b px-4 py-3 flex items-center justify-between">
         <span className="text-secondary-600 text-sm">{resultCount} tasks</span>

         <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
               <Button variant="outline">
                  Filters <ChevronDown className="h-4 w-4" />
               </Button>
            </SheetTrigger>

            <SheetContent
               side="bottom"
               className="h-[63vh] rounded-t-xl p-3 overflow-y-auto"
            >
               <SheetHeader>
                  <SheetTitle className="font-semibold">
                     Filters
                  </SheetTitle>
               </SheetHeader>

               <div className="space-y-3">
                  <SearchFilter value={searchQuery} onChange={onSearchChange} />

                  <CategoryFilter
                     filters={filters}
                     onFilterChange={onFilterChange}
                  />

                  <LocationFilter
                     filters={filters}
                     onFilterChange={onFilterChange}
                  />

                  <PriceFilter
                     filters={filters}
                     onFilterChange={onFilterChange}
                  />

                  <SortFilter
                     value={filters.sortBy}
                     onChange={(v) => onFilterChange({ ...filters, sortBy: v })}
                  />
               </div>

               <div className="flex justify-between items-center border-t pt-4 mt-6">
                  <Button variant="ghost" onClick={clearAll}>
                     <X className="h-4 w-4" /> Clear
                  </Button>

                  <Button onClick={handleApply}>Apply</Button>
               </div>
            </SheetContent>
         </Sheet>
      </div>
   );
};
