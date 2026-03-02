"use client";

import { useState } from "react";
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
import { cn } from "@/lib/utils";

export const CompactFilterBar = ({
   filters,
   onFilterChange,
   searchQuery,
   onSearchChange,
}) => {
   const isMobile = useIsMobile();

   const hasActiveFilters =
      filters.categories.length > 0 ||
      !!filters.suburb ||
      filters.remotely !== null && typeof filters.remotely !== 'undefined' ||
      filters.minBudget !== 0 ||
      filters.maxBudget !== 100000 ||
      searchQuery.length > 0;

   const clearAll = () => {
      onFilterChange({
         categories: [],
         suburb: "",
         remotely: null,
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

export const SearchFilter = ({ value, onChange, className }) => {
   return (
      <div
         className={cn(
            "flex-1 min-w-[200px] max-w-[320px]",
            className
         )}
      >
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
            <Input
               value={value}
               onChange={(e) => onChange(e.target.value)}
               placeholder="Search for a task"
               className="pl-10 pr-3 py-2 text-sm w-full"
            />
         </div>
      </div>
   );
};

export const CategoryFilter = ({ filters, onFilterChange }) => {
   const [open, setOpen] = useState(false);
   const CATEGORIES = serviceCategories;

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
                        key={cat.id}
                        className="flex items-center gap-2 p-1 hover:bg-secondary-50 rounded-md cursor-pointer"
                     >
                        <Checkbox
                           checked={filters.categories.includes(cat.id)}
                           onCheckedChange={() => toggleCategory(cat.id)}
                        />
                        <span className="text-sm">{cat.name}</span>
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
      <Popover
         open={open}
         onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (nextOpen) {
               setSuburbSearch(filters.suburb);
            }
         }}
      >
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               className="min-w-[220px] flex items-center gap-2 text-sm"
            >
               <span className="truncate">
                  {filters.suburb || "50km Hyderabad TG 500081"}
               </span>
               <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
         </PopoverTrigger>

         <PopoverContent className="md:w-[420px] p-4 space-y-4">
            {/* Toggle in-person / remote */}
            <div className="flex gap-2">
               <Button
                  size="sm"
                  variant={filters.remotely === false ? "default" : "outline"}
                  onClick={() =>
                     onFilterChange({ ...filters, remotely: filters.remotely === false ? null : false })
                  }
               >
                  In-person
               </Button>

               <Button
                  size="sm"
                  variant={filters.remotely === true ? "default" : "outline"}
                  onClick={() => onFilterChange({ ...filters, remotely: filters.remotely === true ? null : true })}
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
   clearAll,
}) => {
   const [open, setOpen] = useState(false);

   const handleApply = () => {
      setOpen(false);
   };

   const filterRowClass = "w-full [&_button]:w-full [&_button]:justify-between";

   return (
      <div className="sticky bg-white border-b px-4 py-3">
         <div className="flex items-center gap-2">
            <SearchFilter
               value={searchQuery}
               onChange={onSearchChange}
               className="flex-1 min-w-0 max-w-none"
            />

            <Sheet open={open} onOpenChange={setOpen}>
               <SheetTrigger asChild>
                  <Button variant="outline" className="shrink-0">
                     Filters <ChevronDown className="h-4 w-4" />
                  </Button>
               </SheetTrigger>

               <SheetContent
                  side="bottom"
                  className="h-[70vh] max-h-[560px] rounded-t-xl overflow-y-auto px-4 pt-4 pb-6"
               >
                  <SheetHeader className="px-0 pb-4 border-b border-secondary-100">
                     <SheetTitle className="font-semibold text-base pr-8">
                        Filters
                     </SheetTitle>
                  </SheetHeader>

                  <div className="pt-4 space-y-4">
                     <div className={filterRowClass}>
                        <CategoryFilter
                           filters={filters}
                           onFilterChange={onFilterChange}
                        />
                     </div>

                     <div className={filterRowClass}>
                        <LocationFilter
                           filters={filters}
                           onFilterChange={onFilterChange}
                        />
                     </div>

                     <div className={filterRowClass}>
                        <PriceFilter
                           filters={filters}
                           onFilterChange={onFilterChange}
                        />
                     </div>

                     <div className={filterRowClass}>
                        <SortFilter
                           value={filters.sortBy}
                           onChange={(v) =>
                              onFilterChange({ ...filters, sortBy: v })
                           }
                        />
                     </div>
                  </div>

                  <div className="flex justify-between items-center gap-4 border-t border-secondary-200 pt-4 mt-6">
                     <Button
                        variant="ghost"
                        onClick={clearAll}
                        className="flex items-center gap-2"
                     >
                        <X className="h-4 w-4 shrink-0" /> Clear
                     </Button>
                     <Button onClick={handleApply} className="min-w-[100px]">
                        Apply
                     </Button>
                  </div>
               </SheetContent>
            </Sheet>
         </div>
      </div>
   );
};
