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
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
   postTaskCategories,
   postTaskSubcategories,
} from "@/lib/data/categories";

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

const SUBCATEGORIES = postTaskSubcategories;

const CATEGORY_TAGS: Record<string, string[]> = {
   "it-computer-support": [
      "laptop",
      "desktop",
      "wifi",
      "router",
      "virus",
      "malware",
      "backup",
      "server",
      "windows",
      "mac",
      "office-it",
   ],
   design: [
      "logo",
      "graphic",
      "ui",
      "ux",
      "branding",
      "brochure",
      "illustration",
      "3d",
      "animation",
      "landing-page",
   ],
   events: [
      "wedding",
      "birthday",
      "corporate",
      "decoration",
      "dj",
      "catering",
      "photography",
      "balloon",
      "festival",
   ],
   "repair-maintenance": [
      "carpenter",
      "furniture",
      "appliance",
      "locksmith",
      "windows",
      "doors",
      "assembly",
   ],
   "personal-lifestyle": [
      "beauty",
      "massage",
      "spa",
      "fitness",
      "hair",
      "makeup",
      "wellness",
   ],
   "care-services": [
      "senior",
      "elder",
      "childcare",
      "babysitting",
      "pet",
      "dog",
      "cat",
   ],
   "education-training": [
      "tutor",
      "coaching",
      "dance",
      "music",
      "fitness",
      "lessons",
   ],
   "professional-services": [
      "accounting",
      "legal",
      "real-estate",
      "consulting",
      "business",
   ],
   other: [],
};

const CATEGORY_KEYWORDS: Record<string, string[]> = {
   "it-computer-support": [
      "laptop",
      "desktop",
      "computer",
      "pc",
      "mac",
      "windows",
      "slow",
      "virus",
      "malware",
      "wifi",
      "router",
      "internet",
      "network",
      "software",
      "install",
      "backup",
      "recovery",
      "it support",
      "amc",
      "server",
      "office it",
   ],
   design: [
      "logo",
      "graphic design",
      "ui",
      "ux",
      "branding",
      "brochure",
      "flyer",
      "poster",
      "social media",
      "illustration",
      "3d",
      "animation",
      "motion",
      "landing page",
      "packaging",
      "business card",
   ],
   events: [
      "wedding",
      "birthday",
      "party",
      "engagement",
      "housewarming",
      "anniversary",
      "festival",
      "diwali",
      "corporate event",
      "balloon",
      "flower",
      "decoration",
      "dj",
      "catering",
      "photography",
      "videography",
      "anchor",
      "event",
   ],
   "repair-maintenance": [
      "carpenter",
      "furniture",
      "repair",
      "assembly",
      "appliance",
      "electronic",
      "locksmith",
      "glazier",
      "window",
      "door",
      "handyman",
   ],
   "personal-lifestyle": [
      "beauty",
      "salon",
      "massage",
      "spa",
      "fitness",
      "trainer",
      "hair",
      "hairdresser",
      "makeup",
      "wellness",
   ],
   "care-services": [
      "senior care",
      "elder",
      "childcare",
      "babysit",
      "pet care",
      "dog",
      "cat",
      "nanny",
   ],
   "education-training": [
      "tutor",
      "tuition",
      "coaching",
      "dance class",
      "music lesson",
      "fitness coaching",
      "teacher",
   ],
   "professional-services": [
      "accounting",
      "accountant",
      "legal",
      "lawyer",
      "real estate",
      "property",
      "consulting",
      "business",
   ],
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
   const [categoryModalStep, setCategoryModalStep] = useState<
      "primary" | "secondary"
   >("primary");
   const [categoryModalParentId, setCategoryModalParentId] = useState<
      string | null
   >(null);
   const [categoryEditedManually, setCategoryEditedManually] = useState(
      Boolean(form.getValues("category"))
   );
   const autoSelectedCategoryRef = useRef<string | null>(null);
   const category = form.watch("category");
   const subcategory = form.watch("subcategory");
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
      if (showAllCategories) {
         setCategoryModalStep("primary");
         setCategoryModalParentId(null);
      }
   }, [showAllCategories]);

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

               <Dialog
                  open={showAllCategories}
                  onOpenChange={(open) => {
                     setShowAllCategories(open);
                     if (!open) {
                        setCategoryModalStep("primary");
                        setCategoryModalParentId(null);
                     }
                  }}
               >
                  <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
                     <DialogHeader className="space-y-1">
                        {categoryModalStep === "secondary" &&
                        categoryModalParentId ? (
                           <>
                              <button
                                 type="button"
                                 onClick={() => {
                                    setCategoryModalStep("primary");
                                    setCategoryModalParentId(null);
                                 }}
                                 className="mb-2 flex items-center gap-1 text-sm font-medium text-primary-700 hover:text-primary-800 -ml-1"
                              >
                                 <ChevronLeft className="h-4 w-4" />
                                 Back
                              </button>
                              <DialogTitle className="text-left">
                                 {CATEGORIES.find(
                                    (c) => c.id === categoryModalParentId
                                 )?.label || "Select type"}
                              </DialogTitle>
                              <p className="text-left text-xs text-muted-foreground">
                                 Choose a specific type (required)
                              </p>
                           </>
                        ) : (
                           <>
                              <DialogTitle>Select category</DialogTitle>
                              <p className="text-left text-xs text-muted-foreground">
                                 Pick a category, then choose a specific type
                              </p>
                           </>
                        )}
                     </DialogHeader>

                     {categoryModalStep === "primary" ? (
                        <div className="grid grid-cols-2 gap-3 py-4">
                           {DISPLAY_CATEGORIES.map((cat) => (
                              <button
                                 key={cat.id}
                                 type="button"
                                 onClick={() => {
                                    if (cat.id === "other") {
                                       form.setValue("category", "other", {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                       });
                                       form.setValue("subcategory", "", {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                       });
                                       setCategoryEditedManually(true);
                                       setShowAllCategories(false);
                                       return;
                                    }
                                    const subs = SUBCATEGORIES[cat.id];
                                    if (subs && subs.length > 0) {
                                       setCategoryModalParentId(cat.id);
                                       setCategoryModalStep("secondary");
                                       return;
                                    }
                                    selectCategory(cat.id, true);
                                    setShowAllCategories(false);
                                 }}
                                 className={cn(
                                    "relative min-h-[4.5rem] rounded-xl border-2 p-3 text-left transition-all",
                                    category === cat.id
                                       ? "border-primary-600 bg-primary-50"
                                       : "border-gray-200 bg-white hover:border-gray-300"
                                 )}
                              >
                                 <span className="text-sm font-medium text-gray-900 leading-snug">
                                    {cat.label}
                                 </span>
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
                     ) : (
                        categoryModalParentId && (
                           <div className="grid grid-cols-1 gap-2 py-4 sm:grid-cols-2">
                              {(
                                 SUBCATEGORIES[categoryModalParentId] || []
                              ).map((sub) => (
                                 <button
                                    key={sub}
                                    type="button"
                                    onClick={() => {
                                       form.setValue(
                                          "category",
                                          categoryModalParentId,
                                          {
                                             shouldValidate: true,
                                             shouldDirty: true,
                                          }
                                       );
                                       form.setValue("subcategory", sub, {
                                          shouldValidate: true,
                                          shouldDirty: true,
                                       });
                                       setCategoryEditedManually(true);
                                       setShowAllCategories(false);
                                    }}
                                    className={cn(
                                       "rounded-xl border-2 px-3 py-3 text-left text-sm font-medium transition-all",
                                       category === categoryModalParentId &&
                                          subcategory === sub
                                          ? "border-primary-600 bg-primary-50 text-primary-900"
                                          : "border-gray-200 bg-white text-gray-900 hover:border-gray-300"
                                    )}
                                 >
                                    {sub}
                                 </button>
                              ))}
                           </div>
                        )
                     )}
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

         {/* Subcategory: chosen in two-step modal; hidden field for validation */}
         {category &&
            category !== "other" &&
            SUBCATEGORIES[category]?.length > 0 && (
               <FormField
                  control={form.control}
                  name="subcategory"
                  render={({ field }) => (
                     <FormItem className="animate-in slide-in-from-top duration-200">
                        <FormControl>
                           <input type="hidden" {...field} />
                        </FormControl>
                        <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm">
                           <span className="text-gray-500">Specific type: </span>
                           <span className="font-medium text-gray-900">
                              {field.value?.trim() || (
                                 <span className="text-amber-700">
                                    Tap &quot;Change&quot; above to choose
                                 </span>
                              )}
                           </span>
                        </div>
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
