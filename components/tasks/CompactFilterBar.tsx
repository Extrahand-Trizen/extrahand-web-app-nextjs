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
import { Slider } from "@/components/ui/slider";
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
      filters.minBudget !== 50 ||
      filters.maxBudget !== 50000 ||
      filters.availableOnly ||
      filters.noOffersOnly ||
      filters.status !== "open" ||
      searchQuery.length > 0;

   const clearAll = () => {
      onFilterChange({
         categories: [],
         suburb: "",
         remotely: null,
         minBudget: 50,
         maxBudget: 50000,
         sortBy: "recent",
         availableOnly: false,
         noOffersOnly: false,
         status: "open",
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

            <StatusFilter filters={filters} onFilterChange={onFilterChange} />

            <OtherFilters filters={filters} onFilterChange={onFilterChange} />

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

export const PriceFilter = ({ filters, onFilterChange }) => {
   const [open, setOpen] = useState(false);
   const [localMin, setLocalMin] = useState(filters.minBudget);
   const [localMax, setLocalMax] = useState(filters.maxBudget);
   const MIN_PRICE = 50;
   const MAX_PRICE = 50000;

   const handleApply = () => {
      onFilterChange({
         ...filters,
         minBudget: localMin,
         maxBudget: localMax,
      });
      setOpen(false);
   };

   const handleRangeChange = (values: number[]) => {
      if (values.length === 2) {
         setLocalMin(values[0]);
         setLocalMax(values[1]);
      }
   };

   const priceDisplay = `₹${localMin.toLocaleString('en-IN')} - ₹${localMax.toLocaleString('en-IN')}`;

   return (
      <Popover open={open} onOpenChange={(nextOpen) => {
         if (!nextOpen) {
            setLocalMin(filters.minBudget);
            setLocalMax(filters.maxBudget);
         }
         setOpen(nextOpen);
      }}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               className="px-4 py-2 text-sm"
            >
               {filters.minBudget === MIN_PRICE && filters.maxBudget === MAX_PRICE
                  ? "Any price"
                  : priceDisplay}
               <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-72 p-6">
            <div className="space-y-4">
               {/* Title */}
               <h3 className="text-sm font-semibold text-secondary-900">TASK PRICE</h3>

               {/* Display */}
               <div className="text-center">
                  <p className="text-lg font-semibold text-secondary-900">
                     ₹{localMin.toLocaleString('en-IN')} - ₹{localMax.toLocaleString('en-IN')}
                  </p>
               </div>

               {/* Slider */}
               <Slider
                  value={[localMin, localMax]}
                  onValueChange={handleRangeChange}
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  step={50}
                  className="w-full"
               />

               {/* Buttons */}
               <div className="flex gap-3 pt-4">
                  <Button
                     variant="ghost"
                     className="flex-1 text-primary-600 hover:text-primary-700 hover:bg-transparent"
                     onClick={() => {
                        setLocalMin(filters.minBudget);
                        setLocalMax(filters.maxBudget);
                        setOpen(false);
                     }}
                  >
                     Cancel
                  </Button>
                  <Button
                     className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold"
                     onClick={handleApply}
                  >
                     Apply
                  </Button>
               </div>
            </div>
         </PopoverContent>
      </Popover>
   );
};

export const OtherFilters = ({ filters, onFilterChange }) => {
   const [open, setOpen] = useState(false);
   const [localAvailableOnly, setLocalAvailableOnly] = useState(filters.availableOnly);
   const [localNoOffersOnly, setLocalNoOffersOnly] = useState(filters.noOffersOnly);

   const handleApply = () => {
      onFilterChange({
         ...filters,
         availableOnly: localAvailableOnly,
         noOffersOnly: localNoOffersOnly,
      });
      setOpen(false);
   };

   const handleCancel = () => {
      setLocalAvailableOnly(filters.availableOnly);
      setLocalNoOffersOnly(filters.noOffersOnly);
      setOpen(false);
   };

   const hasActiveOtherFilters = filters.availableOnly || filters.noOffersOnly;

   return (
      <Popover open={open} onOpenChange={(nextOpen) => {
         if (!nextOpen) {
            setLocalAvailableOnly(filters.availableOnly);
            setLocalNoOffersOnly(filters.noOffersOnly);
         }
         setOpen(nextOpen);
      }}>
         <PopoverTrigger asChild>
            <Button
               variant={hasActiveOtherFilters ? "default" : "outline"}
               className="px-4 py-2 text-sm"
            >
               Other Filters
               {hasActiveOtherFilters && (
                  <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-white text-primary-600 text-xs font-semibold">
                     {(localAvailableOnly ? 1 : 0) + (localNoOffersOnly ? 1 : 0)}
                  </span>
               )}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-72 p-6">
            <div className="space-y-4">
               {/* Title */}
               <h3 className="text-sm font-semibold text-secondary-900">OTHER FILTERS</h3>

               {/* Available tasks only */}
               <div 
                  className="flex items-center justify-between p-3 rounded-lg border border-secondary-200 cursor-pointer hover:bg-secondary-50"
                  onClick={() => setLocalAvailableOnly(!localAvailableOnly)}
               >
                  <div className="flex-1">
                     <p className="text-sm font-medium text-secondary-900">Available tasks only</p>
                     <p className="text-xs text-secondary-500 mt-1">Hide tasks that are already assigned</p>
                  </div>
                  <div 
                     className={cn(
                        "h-6 w-11 rounded-full border-2 flex items-center transition-colors",
                        localAvailableOnly 
                           ? "bg-primary-600 border-primary-600" 
                           : "bg-secondary-200 border-secondary-200"
                     )}
                  >
                     <div 
                        className={cn(
                           "h-5 w-5 rounded-full bg-white shadow transition-transform",
                           localAvailableOnly ? "translate-x-5" : "translate-x-0"
                        )}
                     />
                  </div>
               </div>

               {/* Tasks with no offers only */}
               <div 
                  className="flex items-center justify-between p-3 rounded-lg border border-secondary-200 cursor-pointer hover:bg-secondary-50"
                  onClick={() => setLocalNoOffersOnly(!localNoOffersOnly)}
               >
                  <div className="flex-1">
                     <p className="text-sm font-medium text-secondary-900">Tasks with no offers only</p>
                     <p className="text-xs text-secondary-500 mt-1">Hide tasks that have offers</p>
                  </div>
                  <div 
                     className={cn(
                        "h-6 w-11 rounded-full border-2 flex items-center transition-colors",
                        localNoOffersOnly 
                           ? "bg-primary-600 border-primary-600" 
                           : "bg-secondary-200 border-secondary-200"
                     )}
                  >
                     <div 
                        className={cn(
                           "h-5 w-5 rounded-full bg-white shadow transition-transform",
                           localNoOffersOnly ? "translate-x-5" : "translate-x-0"
                        )}
                     />
                  </div>
               </div>

               {/* Buttons */}
               <div className="flex gap-3 pt-4">
                  <Button
                     variant="ghost"
                     className="flex-1 text-primary-600 hover:text-primary-700 hover:bg-transparent"
                     onClick={handleCancel}
                  >
                     Cancel
                  </Button>
                  <Button
                     className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold"
                     onClick={handleApply}
                  >
                     Apply
                  </Button>
               </div>
            </div>
         </PopoverContent>
      </Popover>
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
export const StatusFilter = ({ filters, onFilterChange }) => {
   const statuses = [
      { value: "open" as const, label: "Open" },
      { value: "assigned" as const, label: "Assigned" },
      { value: "completed" as const, label: "Completed" },
   ];

   return (
      <div className="flex items-center gap-1 bg-secondary-100 rounded-lg p-1">
         {statuses.map((status) => (
            <Button
               key={status.value}
               size="sm"
               variant={filters.status === status.value ? "default" : "ghost"}
               onClick={() => onFilterChange({ ...filters, status: status.value })}
               className={cn(
                  "text-xs sm:text-sm px-3 sm:px-4",
                  filters.status === status.value
                     ? "bg-primary-600 hover:bg-primary-700 text-white"
                     : "text-secondary-700 hover:bg-secondary-200"
               )}
            >
               {status.label}
            </Button>
         ))}
      </div>
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

                     <div className={filterRowClass}>
                        <StatusFilter
                           filters={filters}
                           onFilterChange={onFilterChange}
                        />
                     </div>

                     <div className={filterRowClass}>
                        <OtherFilters
                           filters={filters}
                           onFilterChange={onFilterChange}
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
