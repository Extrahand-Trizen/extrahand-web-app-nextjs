"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormData } from "../TaskCreationFlow";
import { Button } from "@/components/ui/button";
import {
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
   FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "../../shared/ImageUpload";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { postTaskCategories } from "@/lib/data/categories";

interface TaskBasicsStepProps {
   form: UseFormReturn<TaskFormData>;
   onNext: () => Promise<void>;
}

interface CategorySuggestion {
   id: string;
   label: string;
   score: number;
   confidence: number;
}

const CATEGORIES = postTaskCategories;
const DISPLAY_CATEGORIES = [...postTaskCategories].sort((a, b) => {
   if (a.id === "other") return 1;
   if (b.id === "other") return -1;
   return a.label.localeCompare(b.label);
});

const CATEGORY_TAGS: Record<string, string[]> = {
   "home-cleaning": ["dusting", "mopping", "vacuuming", "bathrooms", "kitchens", "pet-friendly", "eco-friendly"],
   "deep-cleaning": ["carpets", "windows", "bathrooms", "kitchens", "walls", "move-in", "move-out"],
   "delivery-pickup-services": ["delivery", "pickup", "drop-off", "courier", "parcel", "same-day", "document"],
   "plumbing": ["leaks", "repairs", "installation", "drains", "faucets", "emergency", "licensed"],
   "water-tanker-services": ["water-supply", "tanker", "drinking-water", "bulk", "emergency", "residential", "commercial"],
   "electrical": ["wiring", "fixtures", "repairs", "switchboards", "emergency", "licensed", "solar"],
   "carpenter": ["doors", "windows", "shelves", "cabinets", "repairs", "custom-work", "modular"],
   "painting": ["interior", "exterior", "walls", "doors", "furniture", "touch-up", "eco-friendly"],
   "ac-repair": ["repair", "servicing", "installation", "cleaning", "gas-refill", "emergency", "warranty"],
   "appliance-repair": ["washing-machine", "refrigerator", "oven", "microwave", "dishwasher", "emergency"],
   "pest-control": ["mosquitoes", "termites", "cockroaches", "rats", "bedbugs", "eco-friendly", "chemical-free"],
   "car-washing": ["exterior", "interior", "polishing", "detailing", "deep-clean", "waterless", "mobile"],
   "gardening": ["landscaping", "trimming", "planting", "watering", "pest-control", "maintenance", "design"],
   "handyperson": ["repairs", "maintenance", "installation", "small-jobs", "tools-needed", "emergency"],
   "furniture-assembly": ["ikea", "branded", "modular", "wardrobes", "beds", "shelves", "installation"],
   "security-patrol": ["residential", "commercial", "night-duty", "event-security", "armed", "trained"],
   "beauty-services": ["hair", "makeup", "nails", "facial", "threading", "bridal", "eco-friendly"],
   "massage-spa": ["body-massage", "facial-massage", "head-massage", "aromatherapy", "reflexology", "couples"],
   "packers-movers": ["packing", "moving", "relocation", "shifting", "loading", "unloading", "transport"],
   "fitness-trainers": ["cardio", "strength", "yoga", "pilates", "functional", "at-home", "group-classes"],
   "tutors": ["math", "english", "science", "languages", "coding", "competitive-exams", "online"],
   "it-support": ["hardware", "software", "virus-removal", "data-recovery", "networking", "troubleshooting"],
   "photographer-videographer": ["wedding", "events", "portraits", "product", "editing", "drone", "streaming"],
   "event-services": ["catering", "decoration", "dj", "venue", "planning", "coordination", "setup"],
   "pet-services": ["grooming", "walking", "training", "sitting", "boarding", "health-check"],
   "driver-chauffeur": ["daily-commute", "airport-drop", "intercity", "event-driver", "experienced"],
   "cooking-home-chef": ["daily-meals", "meal-prep", "diet-specific", "vegan", "party-catering", "healthy"],
   "laundry-ironing": ["regular", "dry-clean", "ironing", "pressing", "delicate", "express-service"],
   "other": [],
};

const SUBCATEGORIES: Record<string, string[]> = {
   other: [],
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
   "ac-repair": ["ac", "air conditioner", "cooling", "gas refill", "split ac", "window ac", "ac servicing"],
   "appliance-repair": ["appliance", "washing machine", "fridge", "refrigerator", "microwave", "oven", "geyser", "repair"],
   "beauty-services": ["beauty", "makeup", "salon", "facial", "threading", "bridal", "hair styling"],
   "car-washing": ["car wash", "car cleaning", "vehicle cleaning", "detailing", "polish", "interior cleaning"],
   carpenter: ["carpenter", "woodwork", "furniture repair", "shelf", "cabinet", "wardrobe", "door repair"],
   "cooking-home-chef": ["cook", "home chef", "meal prep", "food", "kitchen help", "daily meals", "catering"],
   "deep-cleaning": ["deep clean", "move out clean", "move in clean", "intensive cleaning", "sanitize"],
   "delivery-pickup-services": [
      "delivery",
      "pickup",
      "pick up",
      "drop",
      "drop off",
      "courier",
      "parcel",
      "package",
      "document delivery",
      "grocery pickup",
      "send package",
      "collect item",
   ],
   "driver-chauffeur": ["driver", "chauffeur", "airport drop", "pickup", "intercity", "driving"],
   electrical: ["electrician", "electrical", "wiring", "switch", "fan", "light", "power issue"],
   "event-services": ["event", "decoration", "dj", "wedding", "party", "planner", "setup"],
   "fitness-trainers": ["fitness", "trainer", "gym", "workout", "yoga", "pilates", "cardio"],
   "furniture-assembly": ["furniture assembly", "assemble", "ikea", "bed assembly", "table assembly"],
   gardening: ["gardening", "garden", "plant", "landscape", "lawn", "trimming", "watering"],
   handyperson: ["handyman", "handyperson", "general repair", "fix", "small jobs", "maintenance"],
   "home-cleaning": ["home cleaning", "house cleaning", "maid", "cleaning", "cleaner", "room cleaning", "dusting", "mopping"],
   "it-support": ["laptop", "computer", "it support", "printer", "wifi", "network", "software", "virus"],
   "laundry-ironing": ["laundry", "ironing", "press", "clothes wash", "dry clean"],
   "massage-spa": ["massage", "spa", "relaxation", "therapy", "aromatherapy"],
   "packers-movers": [
      "packers",
      "movers",
      "packers movers",
      "moving service",
      "house shifting",
      "office shifting",
      "relocation",
      "pack and move",
      "load unload",
      "transport household",
      "move furniture",
   ],
   painting: ["paint", "painting", "wall paint", "interior paint", "exterior paint"],
   "pest-control": ["pest", "termite", "cockroach", "mosquito", "rat", "bedbug", "fumigation"],
   "photographer-videographer": ["photographer", "videographer", "photo shoot", "video shoot", "wedding shoot", "editing"],
   plumbing: ["plumber", "plumbing", "leak", "tap", "pipe", "drain", "toilet", "water issue"],
   "security-patrol": ["security", "guard", "watchman", "patrol", "night guard"],
   tutors: ["tutor", "tuition", "teacher", "home tuition", "maths", "science", "english classes"],
   "water-tanker-services": ["water tanker", "water supply", "tanker", "water delivery", "tank refill"],
   other: ["other", "misc", "custom"],
};

const normalizeToken = (token: string): string => {
   let value = token.toLowerCase().replace(/[^a-z0-9]/g, "");
   if (value.length > 4 && value.endsWith("ing")) value = value.slice(0, -3);
   else if (value.length > 4 && value.endsWith("ers")) value = value.slice(0, -3);
   else if (value.length > 3 && value.endsWith("er")) value = value.slice(0, -2);
   else if (value.length > 3 && value.endsWith("ed")) value = value.slice(0, -2);
   else if (value.length > 3 && value.endsWith("s")) value = value.slice(0, -1);
   return value;
};

const tokenize = (input: string): string[] =>
   input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .map((token) => normalizeToken(token))
      .filter(Boolean);

const normalizeText = (input: string): string =>
   tokenize(input).join(" ");

function inferCategories(title: string, description: string): CategorySuggestion[] {
   const combined = normalizeText(`${title} ${description}`);
   if (!combined.trim()) {
      const otherCategory = CATEGORIES.find((cat) => cat.id === "other");
      return otherCategory
         ? [{ id: otherCategory.id, label: otherCategory.label, score: 5, confidence: 100 }]
         : [];
   }

   const tokenSet = new Set(combined.split(" "));

   const scored = CATEGORIES.map((cat) => {
      const labelKeywords = tokenize(cat.label);
      const manualKeywords = CATEGORY_KEYWORDS[cat.id] || [];
      const tagKeywords = (CATEGORY_TAGS[cat.id] || []).map((t) => t.replace(/-/g, " "));
      const allKeywords = Array.from(new Set([...labelKeywords, ...manualKeywords, ...tagKeywords]));

      let score = 0;
      allKeywords.forEach((keyword) => {
         const normalizedKeyword = normalizeText(keyword);
         if (!normalizedKeyword) return;

         if (normalizedKeyword.includes(" ")) {
            if (combined.includes(normalizedKeyword)) {
               score += 4;
            }
            return;
         }

         if (tokenSet.has(normalizedKeyword)) {
            score += 2;
            return;
         }

         if (combined.includes(normalizedKeyword)) {
            score += 1;
         }
      });

      return {
         id: cat.id,
         label: cat.label,
         score,
         confidence: 0,
      };
   }).filter((item) => item.score > 0);

   if (scored.length === 0) {
      const otherCategory = CATEGORIES.find((cat) => cat.id === "other");
      return otherCategory
         ? [{ id: otherCategory.id, label: otherCategory.label, score: 5, confidence: 100 }]
         : [];
   }

   const sorted = scored.sort((a, b) => b.score - a.score);
   const topSum = sorted.slice(0, 3).reduce((sum, item) => sum + item.score, 0);

   return sorted.slice(0, 3).map((item) => ({
      ...item,
      confidence: topSum > 0 ? Math.round((item.score / topSum) * 100) : 0,
   }));
}

function isHighConfidence(suggestions: CategorySuggestion[]): boolean {
   if (suggestions.length === 0) return false;
   const [top, second] = suggestions;
   if (!top) return false;

   const margin = top.score - (second?.score || 0);
   return top.score >= 4 && (margin >= 2 || top.confidence >= 60);
}

export function TaskBasicsStep({ form, onNext }: TaskBasicsStepProps) {
   const [showAllCategories, setShowAllCategories] = useState(false);
   const [categoryEditedManually, setCategoryEditedManually] = useState(
      Boolean(form.getValues("category"))
   );
   const autoSelectedCategoryRef = useRef<string | null>(null);
   const category = form.watch("category");
   const title = form.watch("title");
   const description = form.watch("description");

   const categorySuggestions = useMemo(
      () => inferCategories(title, description),
      [title, description]
   );
   const bestSuggestion = categorySuggestions[0];
   const shouldAutoSelect = isHighConfidence(categorySuggestions);
   const selectedCategory = CATEGORIES.find((cat) => cat.id === category);
   const selectedCategoryChip = selectedCategory
      ? [{ id: selectedCategory.id, label: selectedCategory.label, score: 0, confidence: 100 }]
      : [];
   const displayedCategoryChips =
      selectedCategoryChip.length > 0 ? selectedCategoryChip : categorySuggestions;

   useEffect(() => {
      const autoSelectedCategory = autoSelectedCategoryRef.current;

      if (categoryEditedManually) return;

      if (!bestSuggestion) {
         if (autoSelectedCategory && category === autoSelectedCategory) {
            form.setValue("category", "", { shouldValidate: true, shouldDirty: true });
            form.setValue("subcategory", "", { shouldValidate: true, shouldDirty: true });
         }
         autoSelectedCategoryRef.current = null;
         return;
      }

      if (!shouldAutoSelect) {
         if (autoSelectedCategory && category === autoSelectedCategory) {
            form.setValue("category", "", { shouldValidate: true, shouldDirty: true });
            form.setValue("subcategory", "", { shouldValidate: true, shouldDirty: true });
         }
         autoSelectedCategoryRef.current = null;
         return;
      }

      if (category !== bestSuggestion.id) {
         form.setValue("category", bestSuggestion.id, {
            shouldValidate: true,
            shouldDirty: true,
         });
         form.setValue("subcategory", "", {
            shouldValidate: false,
            shouldDirty: true,
         });
      }
      autoSelectedCategoryRef.current = bestSuggestion.id;
   }, [
      bestSuggestion,
      category,
      categoryEditedManually,
      form,
      shouldAutoSelect,
   ]);

   const selectCategory = (categoryId: string, isManualSelection = true) => {
      if (isManualSelection) {
         setCategoryEditedManually(true);
         autoSelectedCategoryRef.current = null;
      }

      if (category === categoryId) {
         form.setValue("category", "", { shouldValidate: true, shouldDirty: true });
         form.setValue("subcategory", "", { shouldValidate: true, shouldDirty: true });
         return;
      }

      form.setValue("category", categoryId, { shouldValidate: true, shouldDirty: true });
      form.setValue("subcategory", "", { shouldValidate: false, shouldDirty: true });
   };

   return (
      <div className="space-y-4 md:space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
               What do you need done?
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
               Give taskers a clear idea of the job
            </p>
         </div>

         {/* Title */}
         <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Task title</FormLabel>
                  <FormControl>
                     <Input
                        placeholder="e.g., Deep clean 2-bedroom apartment"
                        {...field}
                        className="h-10 text-sm"
                        maxLength={200}
                     />
                  </FormControl>
                  {title.length >= 150 && (
                     <FormDescription className="text-xs text-gray-500">
                        {title.length}/200 characters
                     </FormDescription>
                  )}
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Description */}
         <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Description</FormLabel>
                  <FormControl>
                     <Textarea
                        placeholder="Describe what needs to be done, any specific requirements, and what the tasker should know"
                        {...field}
                        rows={4}
                        maxLength={2000}
                        className="min-h-[100px] text-sm max-h-80 resize-none"
                     />
                  </FormControl>
                  <FormDescription className="text-xs">
                     Be specific about what you need. Clear details help you get
                     better offers.
                  </FormDescription>
                  {description.length >= 1800 && (
                     <FormDescription className="text-gray-500">
                        {description.length}/2000 characters
                     </FormDescription>
                  )}
                  <FormMessage />
               </FormItem>
            )}
         />

         {((title.trim() || description.trim()) && categorySuggestions.length > 0) ||
         Boolean(selectedCategory) ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 md:p-4 space-y-3">
               <div className="flex items-start justify-between gap-3">
                  <div>
                     <p className="text-xs md:text-sm font-semibold text-gray-900">
                        Suggested category
                     </p>
                     {categorySuggestions.length > 1 && !selectedCategory && (
                        <p className="text-[11px] md:text-xs text-gray-600 mt-1">
                           Select a category
                        </p>
                     )}
                  </div>
                  <button
                     type="button"
                     className="text-xs font-medium text-primary-700 hover:text-primary-800"
                     onClick={() => {
                        setCategoryEditedManually(true);
                        setShowAllCategories(true);
                     }}
                  >
                     Change
                  </button>
               </div>

               <div className="flex flex-wrap gap-2">
                  {displayedCategoryChips.map((suggestion) => {
                     const isSelected = category === suggestion.id;
                     return (
                        <button
                           key={suggestion.id}
                           type="button"
                           onClick={() => selectCategory(suggestion.id, true)}
                           className={cn(
                              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                              isSelected
                                 ? "border-primary-600 bg-primary-100 text-primary-700"
                                 : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                           )}
                        >
                           <span>{suggestion.label}</span>
                        </button>
                     );
                  })}
               </div>

               <Dialog open={showAllCategories} onOpenChange={setShowAllCategories}>
                  <DialogContent className="max-h-[80vh] overflow-y-auto">
                     <DialogHeader>
                        <DialogTitle>Select Category</DialogTitle>
                     </DialogHeader>
                     <div className="grid grid-cols-2 gap-3 py-4">
                        {DISPLAY_CATEGORIES.map((cat) => (
                           <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                 selectCategory(cat.id, true);
                                 setShowAllCategories(false);
                              }}
                              className={cn(
                                 "relative h-20 rounded-xl border-2 p-3 text-left transition-all",
                                 category === cat.id
                                    ? "border-primary-600 bg-primary-50"
                                    : "border-gray-200 bg-white hover:border-gray-300"
                              )}
                           >
                              <div className="flex items-center">
                                 <span className="text-sm font-medium text-gray-900">
                                    {cat.label}
                                 </span>
                              </div>
                              {category === cat.id && (
                                 <div className="absolute top-2 right-2">
                                    <svg
                                       className="w-5 h-5 text-primary-600"
                                       fill="currentColor"
                                       viewBox="0 0 20 20"
                                    >
                                       <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                          clipRule="evenodd"
                                       />
                                    </svg>
                                 </div>
                              )}
                           </button>
                        ))}
                     </div>
                  </DialogContent>
               </Dialog>
            </div>
         ) : null}

         {/* Category (hidden field; selection is controlled via Suggested category UI) */}
         <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
               <FormItem>
                  <FormControl>
                     <input type="hidden" {...field} />
                  </FormControl>
               </FormItem>
            )}
         />

         {/* Subcategory (conditional) */}
         {category && SUBCATEGORIES[category]?.length > 0 && (
            <FormField
               control={form.control}
               name="subcategory"
               render={({ field }) => (
                  <FormItem className="animate-in slide-in-from-top duration-200">
                     <FormLabel className="text-xs md:text-sm">
                        Type of{" "}
                        {CATEGORIES.find(
                           (c) => c.id === category
                        )?.label.toLowerCase()}
                     </FormLabel>
                     <FormControl>
                        <select
                           {...field}
                           className="w-full text-sm h-10 px-4 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary-600 focus:border-transparent"
                        >
                           <option value="" className="rounded-md text-sm text-muted-foreground">
                              Select specific type (optional)
                           </option>
                           {SUBCATEGORIES[category].map((sub) => (
                              <option key={sub} value={sub} className="rounded-md text-sm">
                                 {sub}
                              </option>
                           ))}
                        </select>
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         )}

         {/* Custom Category Input (for "Other" category) */}
         {category === "other" && (
            <FormField
               control={form.control}
               name="subcategory"
               render={({ field }) => (
                  <FormItem className="animate-in slide-in-from-top duration-200">
                     <FormLabel className="text-xs md:text-sm">What type of task is it?</FormLabel>
                     <FormControl>
                        <Input
                           {...field}
                           placeholder="e.g., Window cleaning, Tutoring, Photography"
                           className="h-10 text-sm"
                           maxLength={50}
                        />
                     </FormControl>
                     <FormDescription className="text-xs">
                        Please describe your task in a few words (3-50
                        characters)
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               )}
            />
         )}

         {/* Priority */}
         <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Task priority (optional)</FormLabel>
                  <FormControl>
                     <div className="grid grid-cols-3 gap-4">
                        {["low", "normal", "high"].map((priority) => (
                           <button
                              key={priority}
                              type="button"
                              onClick={() => field.onChange(priority)}
                              className={cn(
                                 "h-10 rounded-lg border-2 text-sm font-medium transition-all capitalize",
                                 field.value === priority
                                    ? "border-primary-600 bg-primary-50 text-primary-600"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                              )}
                           >
                              {priority}
                           </button>
                        ))}
                     </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                     Priority helps taskers gauge importance
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Image Upload */}
         <FormField
            control={form.control}
            name="attachments"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Task images (optional)</FormLabel>
                  <FormControl>
                     <ImageUpload
                        value={field.value || []}
                        onChange={field.onChange}
                        maxFiles={5}
                        maxSizeMB={10}
                     />
                  </FormControl>
                  <FormDescription className="text-xs">
                     Upload photos to help taskers understand the task better
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Continue Button */}
         <div className="pt-4">
            <Button
               type="button"
               onClick={onNext}
               className="w-full h-10 font-medium bg-primary-600 hover:bg-primary-700"
               size="lg"
            >
               Continue
            </Button>
         </div>
      </div>
   );
}
