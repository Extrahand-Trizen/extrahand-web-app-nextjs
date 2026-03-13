"use client";

import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search, X, ChevronDown } from "lucide-react";
import { categoriesApi } from "@/lib/api/endpoints/categories";
import type { CategoriesListItem } from "@/lib/api/endpoints/categories";

interface CategoryAlertsProps {
   enabled: boolean;
   onAddCategory: (category: CategoriesListItem) => void;
   onRemoveCategory: (categorySlug: string) => void;
   selectedCategories: CategoriesListItem[];
}

export function CategoryAlerts({
   enabled,
   onAddCategory,
   onRemoveCategory,
   selectedCategories = [],
}: CategoryAlertsProps) {
   const [searchInput, setSearchInput] = useState("");
   const [categories, setCategories] = useState<CategoriesListItem[]>([]);
   const [filteredCategories, setFilteredCategories] = useState<CategoriesListItem[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [showSuggestions, setShowSuggestions] = useState(false);
   const [selectedIndex, setSelectedIndex] = useState(-1);
   const searchRef = useRef<HTMLDivElement>(null);

   // Fetch categories on mount
   useEffect(() => {
      const loadCategories = async () => {
         try {
            const cats = await categoriesApi.getCategories();
            setCategories(cats);
         } catch (error) {
            console.error("Failed to load categories:", error);
         } finally {
            setIsLoading(false);
         }
      };

      loadCategories();
   }, []);

   // Filter categories based on search input
   useEffect(() => {
      if (!searchInput.trim()) {
         setFilteredCategories([]);
         setShowSuggestions(false);
         return;
      }

      const query = searchInput.toLowerCase();
      const filtered = categories.filter((cat) => {
         const isSelected = selectedCategories.some((sc) => sc.slug === cat.slug);
         return !isSelected && cat.name.toLowerCase().includes(query);
      });

      setFilteredCategories(filtered);
      setShowSuggestions(true);
      setSelectedIndex(-1);
   }, [searchInput, categories, selectedCategories]);

   const handleSelectCategory = (category: CategoriesListItem) => {
      onAddCategory(category);
      setSearchInput("");
      setShowSuggestions(false);
   };

   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || filteredCategories.length === 0) return;

      switch (e.key) {
         case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) =>
               prev < filteredCategories.length - 1 ? prev + 1 : prev
            );
            break;
         case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
            break;
         case "Enter":
            e.preventDefault();
            if (selectedIndex >= 0) {
               handleSelectCategory(filteredCategories[selectedIndex]);
            }
            break;
         case "Escape":
            e.preventDefault();
            setShowSuggestions(false);
            break;
         default:
            break;
      }
   };

   // Close dropdown when clicking outside
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (
            searchRef.current &&
            !searchRef.current.contains(event.target as Node)
         ) {
            setShowSuggestions(false);
         }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
   }, []);

   return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
         <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
               <Label className="text-xs sm:text-sm font-medium text-gray-900">
                  Category Alerts
               </Label>
               <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                  Select categories to get alerts when new tasks are posted
               </p>
            </div>
         </div>

         {/* Search Input */}
         <div
            ref={searchRef}
            className="relative mb-4"
         >
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
               <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchInput && setShowSuggestions(true)}
                  placeholder="Search categories..."
                  disabled={!enabled || isLoading}
                  className="w-full h-9 pl-10 pr-10 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50"
               />
               {searchInput && (
                  <button
                     type="button"
                     onClick={() => {
                        setSearchInput("");
                        setShowSuggestions(false);
                     }}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                     <X className="w-4 h-4" />
                  </button>
               )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && filteredCategories.length > 0 && (
               <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                  {filteredCategories.map((category, index) => (
                     <button
                        key={category.slug}
                        type="button"
                        onClick={() => handleSelectCategory(category)}
                        className={cn(
                           "w-full text-left px-3 py-2 text-xs sm:text-sm border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors",
                           selectedIndex === index && "bg-gray-100"
                        )}
                     >
                        <div className="font-medium text-gray-900">
                           {category.name}
                        </div>
                        {category.heroDescription && (
                           <div className="text-[10px] text-gray-500 line-clamp-1">
                              {category.heroDescription}
                           </div>
                        )}
                     </button>
                  ))}
               </div>
            )}
         </div>

         {/* Selected Categories */}
         {selectedCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
               {selectedCategories.map((category) => (
                  <Badge
                     key={category.slug}
                     variant="secondary"
                     className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 border border-blue-200"
                  >
                     {category.name}
                     <button
                        type="button"
                        onClick={() => onRemoveCategory(category.slug)}
                        className="ml-1 text-blue-600 hover:text-blue-900"
                        aria-label={`Remove ${category.name} alert`}
                     >
                        ×
                     </button>
                  </Badge>
               ))}
            </div>
         )}

         {selectedCategories.length === 0 && !isLoading && (
            <p className="text-[10px] sm:text-xs text-gray-500">
               No categories selected. Start typing above to add categories.
            </p>
         )}

         {isLoading && (
            <p className="text-[10px] sm:text-xs text-gray-500">
               Loading categories...
            </p>
         )}
      </div>
   );
}
