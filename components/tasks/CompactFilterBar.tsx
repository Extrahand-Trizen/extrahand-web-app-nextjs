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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { getAvailableLocations } from "@/lib/utils/locationMapping";

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

            <OtherFiltersButton filters={filters} onFilterChange={onFilterChange} />

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

export const SearchFilter = ({ value, onChange, className }: { value: string, onChange: (val: string) => void, className?: string }) => {
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
            className={cn(
               "px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-200",
               open ? "relative z-50 ring-2 ring-primary border-primary bg-white" : ""
            )}
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
   const [distanceSearch, setDistanceSearch] = useState(filters.maxDistance || 50);
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

   const allLocations = getAvailableLocations();

   const handleSuburbSearch = (value: string) => {
      setSuburbSearch(value);

      if (!value.trim()) {
         setSuggestions([]);
         return;
      }

      setIsLoadingSuggestions(true);

      // Simulate async search - filter locations
      const filtered = allLocations.filter((area) =>
         area.toLowerCase().includes(value.toLowerCase())
      );

      setSuggestions(filtered.slice(0, 10)); // Limit to 10 suggestions
      setIsLoadingSuggestions(false);
   };

   const apply = (v: string) => {
      onFilterChange({
         ...filters,
         suburb: v,
         address: v,
         maxDistance: distanceSearch
      });
      setOpen(false);
   };

   const applyDistance = () => {
      onFilterChange({
         ...filters,
         maxDistance: distanceSearch
      });
   };

   return (
      <Popover
         open={open}
         onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (nextOpen) {
               setSuburbSearch(filters.suburb || "");
               setDistanceSearch(filters.maxDistance || 50);
               if (filters.suburb && filters.suburb.trim()) {
                  const filtered = allLocations.filter((area) =>
                     area.toLowerCase().includes(filters.suburb.toLowerCase())
                  );
                  setSuggestions(filtered.slice(0, 10));
               } else {
                  setSuggestions([]);
               }
            }
         }}
      >
         {open && (
            <div
               className="fixed inset-0 z-40 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
               aria-hidden="true"
            />
         )}
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               className={cn(
                  "min-w-[220px] flex items-center gap-2 text-sm bg-white transition-colors duration-200",
                  open ? "relative z-50 ring-2 ring-primary border-primary" : ""
               )}
            >
               <span className="truncate">
                  {filters.suburb
                     ? `${distanceSearch}km ${filters.suburb}`
                     : `${distanceSearch}km radius`}
               </span>
               <ChevronDown className="h-4 w-4 ml-auto" />
            </Button>
         </PopoverTrigger>

         <PopoverContent className="md:w-[420px] p-4 space-y-4">
            {/* Toggle in-person / remote / all */}
            <div className="flex gap-2">
               <Button
                  size="sm"
                  variant={filters.remotely === false ? "default" : "outline"}
                  onClick={() =>
                     onFilterChange({ ...filters, remotely: false })
                  }
               >
                  In-person
               </Button>

               <Button
                  size="sm"
                  variant={filters.remotely === true ? "default" : "outline"}
                  onClick={() => onFilterChange({ ...filters, remotely: true })}
               >
                  Remotely
               </Button>

               <Button
                  size="sm"
                  variant={filters.remotely === null ? "default" : "outline"}
                  onClick={() =>
                     onFilterChange({ ...filters, remotely: null })
                  }
               >
                  All
               </Button>
            </div>

            {/* Location Input */}
            <div>
               <label className="block text-xs font-semibold mb-2 text-secondary-900">LOCATION</label>
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3 md:size-4 text-secondary-400" />
                  <Input
                     value={suburbSearch}
                     onChange={(e) => handleSuburbSearch(e.target.value)}
                     placeholder="Search for a location..."
                     className="pl-10 text-xs md:text-sm"
                  />
               </div>
            </div>

            {/* Location Suggestions */}
            {(suburbSearch.trim().length > 0 || isLoadingSuggestions) && (
               <div className="max-h-[200px] overflow-y-auto space-y-1 border border-secondary-100 rounded-md p-2">
                  {isLoadingSuggestions ? (
                     <div className="text-center py-2 text-xs text-secondary-500">
                        Searching locations...
                     </div>
                  ) : suggestions.length > 0 ? (
                     suggestions.map((s) => (
                        <button
                           key={s}
                           onClick={() => apply(s)}
                           className="block w-full text-left px-3 py-2 text-xs md:text-sm hover:bg-primary-50 rounded-md transition-colors"
                        >
                           {s}
                        </button>
                     ))
                  ) : (
                     <div className="text-center py-2 text-xs text-secondary-500">
                        No locations found
                     </div>
                  )}
               </div>
            )}

            {/* Distance Range Slider */}
            <div>
               <label className="block text-xs font-semibold mb-3 text-secondary-900">
                  DISTANCE: {distanceSearch}km
               </label>
               <Slider
                  value={[distanceSearch]}
                  onValueChange={(values) => {
                     setDistanceSearch(values[0]);
                  }}
                  min={1}
                  max={100}
                  step={1}
                  className="w-full"
               />
               <div className="flex justify-between text-xs text-secondary-500 mt-2">
                  <span>1km</span>
                  <span>100km</span>
               </div>
            </div>

            {/* Apply Button */}
            <div className="flex gap-2 pt-2">
               <Button
                  variant="outline"
                  className="flex-1 text-sm"
                  onClick={() => setOpen(false)}
               >
                  Cancel
               </Button>
               <Button
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white text-sm rounded-full font-semibold"
                  onClick={() => {
                     if (suburbSearch) {
                        apply(suburbSearch);
                     } else {
                        applyDistance();
                        setOpen(false);
                     }
                  }}
               >
                  Apply
               </Button>
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
         {open && (
            <div
               className="fixed inset-0 z-40 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
               aria-hidden="true"
            />
         )}
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               className={cn(
                  "px-4 py-2 text-sm bg-white transition-colors duration-200",
                  open ? "relative z-50 ring-2 ring-primary border-primary" : ""
               )}
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



export const SortFilter = ({ value, onChange }) => {
   const [open, setOpen] = useState(false);

   return (
      <>
         {open && (
            <div
               className="fixed inset-0 z-40 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
               aria-hidden="true"
            />
         )}
         <Select value={value} onValueChange={onChange} onOpenChange={setOpen} open={open}>
            <SelectTrigger
               className={cn(
                  "px-4 py-2 text-sm bg-white transition-colors duration-200",
                  open ? "relative z-50 ring-2 ring-primary border-primary" : ""
               )}
            >
               <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="z-50">
               <SelectItem value="recent">Recent</SelectItem>
               <SelectItem value="nearest">Nearest</SelectItem>
               <SelectItem value="price-low">Price: Low to High</SelectItem>
               <SelectItem value="price-high">Price: High to Low</SelectItem>
               <SelectItem value="date">Date Posted</SelectItem>
            </SelectContent>
         </Select>
      </>
   );
};

export const OtherFiltersButton = ({ filters, onFilterChange }) => {
   const [open, setOpen] = useState(false);
   const [tempFilters, setTempFilters] = useState({
      availableOnly: filters.availableOnly,
      noOffersOnly: filters.noOffersOnly,
   });

   const hasActiveOtherFilters = filters.availableOnly || filters.noOffersOnly;

   const handleApply = () => {
      onFilterChange({
         ...filters,
         availableOnly: tempFilters.availableOnly,
         noOffersOnly: tempFilters.noOffersOnly,
      });
      setOpen(false);
   };

   const handleCancel = () => {
      setTempFilters({
         availableOnly: filters.availableOnly,
         noOffersOnly: filters.noOffersOnly,
      });
      setOpen(false);
   };

   return (
      <>
         {open && (
            <div
               className="fixed inset-0 z-40 bg-black/20 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
               aria-hidden="true"
            />
         )}
         <Button
            variant={hasActiveOtherFilters ? "default" : "outline"}
            className={cn(
               "px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-200",
               hasActiveOtherFilters ? "bg-primary-600 hover:bg-primary-700 text-white" : "bg-white",
               open ? "relative z-50 ring-2 ring-primary border-primary bg-white" : (hasActiveOtherFilters && open ? "bg-primary-600" : "")
            )}
            onClick={() => {
               setOpen(true);
               setTempFilters({
                  availableOnly: filters.availableOnly,
                  noOffersOnly: filters.noOffersOnly,
               });
            }}
         >
            Other Filters
            <ChevronDown className="h-4 w-4" />
         </Button>

         <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
               <DialogHeader>
                  <DialogTitle>Other Filters</DialogTitle>
               </DialogHeader>

               <div className="space-y-6 py-4">
                  {/* Available tasks only */}
                  <div className="flex items-center justify-between p-4 border border-secondary-100 rounded-lg hover:bg-secondary-50">
                     <div className="flex-1">
                        <h4 className="font-semibold text-sm text-secondary-900">
                           Available tasks only
                        </h4>
                        <p className="text-xs text-secondary-500 mt-1">
                           Hide tasks that are already assigned
                        </p>
                     </div>
                     <Switch
                        checked={tempFilters.availableOnly}
                        onCheckedChange={(checked) =>
                           setTempFilters({
                              ...tempFilters,
                              availableOnly: checked,
                           })
                        }
                     />
                  </div>

                  {/* Tasks with no offers only */}
                  <div className="flex items-center justify-between p-4 border border-secondary-100 rounded-lg hover:bg-secondary-50">
                     <div className="flex-1">
                        <h4 className="font-semibold text-sm text-secondary-900">
                           Tasks with no offers only
                        </h4>
                        <p className="text-xs text-secondary-500 mt-1">
                           Hide tasks that have offers
                        </p>
                     </div>
                     <Switch
                        checked={tempFilters.noOffersOnly}
                        onCheckedChange={(checked) =>
                           setTempFilters({
                              ...tempFilters,
                              noOffersOnly: checked,
                           })
                        }
                     />
                  </div>
               </div>

               <DialogFooter className="flex gap-3 justify-end">
                  <Button
                     variant="ghost"
                     onClick={handleCancel}
                     className="text-primary-600 hover:text-primary-700 hover:bg-transparent"
                  >
                     Cancel
                  </Button>
                  <Button
                     onClick={handleApply}
                     className="bg-primary-600 hover:bg-primary-700 text-white rounded-full font-semibold"
                  >
                     Apply
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </>
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
                        <OtherFiltersButton
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
