"use client";

import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { TaskFormData } from "../TaskCreationFlow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Tag } from "lucide-react";
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
import { sanitizeString, sanitizeStringArray } from "@/lib/utils/sanitization";

interface TaskBasicsStepProps {
   form: UseFormReturn<TaskFormData>;
   onNext: () => Promise<void>;
}

const CATEGORIES = [
   { id: "home-cleaning", label: "Home Cleaning" },
   { id: "deep-cleaning", label: "Deep Cleaning" },
   { id: "plumbing", label: "Plumbing" },
   { id: "water-tanker-services", label: "Water & Tanker Services" },
   { id: "electrical", label: "Electrical" },
   { id: "carpenter", label: "Carpenter" },
   { id: "painting", label: "Painting" },
   { id: "ac-repair", label: "AC Repair & Service" },
   { id: "appliance-repair", label: "Appliance Repair" },
   { id: "pest-control", label: "Pest Control" },
   { id: "car-washing", label: "Car Washing / Car Cleaning" },
   { id: "gardening", label: "Gardening" },
   { id: "handyperson", label: "Handyperson / General Repairs" },
   { id: "furniture-assembly", label: "Furniture Assembly" },
   { id: "security-patrol", label: "Security Patrol / Watchman" },
   { id: "beauty-services", label: "Beauty Services" },
   { id: "massage-spa", label: "Massage / Spa" },
   { id: "fitness-trainers", label: "Fitness Trainers" },
   { id: "tutors", label: "Tutors" },
   { id: "it-support", label: "IT Support / Laptop Repair" },
   { id: "photographer-videographer", label: "Photographer / Videographer" },
   { id: "event-services", label: "Event Services" },
   { id: "pet-services", label: "Pet Services" },
   { id: "driver-chauffeur", label: "Driver / Chauffeur" },
   { id: "cooking-home-chef", label: "Cooking / Home Chef" },
   { id: "laundry-ironing", label: "Laundry / Ironing" },
   { id: "other", label: "Other" },
];

const CATEGORY_TAGS: Record<string, string[]> = {
   "home-cleaning": ["dusting", "mopping", "vacuuming", "bathrooms", "kitchens", "pet-friendly", "eco-friendly"],
   "deep-cleaning": ["carpets", "windows", "bathrooms", "kitchens", "walls", "move-in", "move-out"],
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

export function TaskBasicsStep({ form, onNext }: TaskBasicsStepProps) {
   const [requirementInput, setRequirementInput] = useState("");
   const [tagInput, setTagInput] = useState("");
   const [showAllCategories, setShowAllCategories] = useState(false);
   const category = form.watch("category");
   const requirements = form.watch("requirements") || [];
   const tags = form.watch("tags") || [];
   const attachments = form.watch("attachments") || [];
   const title = form.watch("title");
   const description = form.watch("description");

   const addRequirement = () => {
      const sanitized = sanitizeString(requirementInput);
      if (sanitized && sanitized.length >= 3 && requirements.length < 10) {
         form.setValue("requirements", [...requirements, sanitized]);
         setRequirementInput("");
      } else if (sanitized && sanitized.length < 3) {
         // Don't add too short requirements
         return;
      }
   };

   const removeRequirement = (index: number) => {
      form.setValue(
         "requirements",
         requirements.filter((_, i) => i !== index)
      );
   };

   const addTag = () => {
      const sanitized = sanitizeString(tagInput.toLowerCase());
      if (
         sanitized &&
         sanitized.length >= 2 &&
         sanitized.length <= 20 &&
         tags.length < 5 &&
         !tags.includes(sanitized)
      ) {
         form.setValue("tags", [...tags, sanitized]);
         setTagInput("");
      }
   };

   const removeTag = (index: number) => {
      form.setValue(
         "tags",
         tags.filter((_, i) => i !== index)
      );
   };

   const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
         e.preventDefault();
         addRequirement();
      }
   };

   const handleTagKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
         e.preventDefault();
         addTag();
      }
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

         {/* Category */}
         <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Category</FormLabel>
                  <FormControl>
                     <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                           {CATEGORIES.slice(0, 4).map((cat) => (
                              <button
                                 key={cat.id}
                                 type="button"
                                 onClick={() => {
                                    if (field.value === cat.id) {
                                       field.onChange("");
                                    } else {
                                       field.onChange(cat.id);
                                       form.setValue("subcategory", "");
                                    }
                                 }}
                                 className={`
                                    relative h-16 rounded-xl border-2 p-3 text-left transition-all
                                    ${
                                       field.value === cat.id
                                          ? "border-primary-600 bg-primary-50"
                                          : "border-gray-200 bg-white hover:border-gray-300"
                                    }
                                 `}
                              >
                                 <div className="flex items-center">
                                    <span className="text-sm font-medium text-gray-900">
                                       {cat.label}
                                    </span>
                                 </div>
                                 {field.value === cat.id && (
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

                        <Dialog open={showAllCategories} onOpenChange={setShowAllCategories}>
                           <button
                              type="button"
                              onClick={() => setShowAllCategories(true)}
                              className="w-full h-10 rounded-lg border-2 border-gray-300 bg-white text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-all"
                           >
                              View all categories
                           </button>
                           <DialogContent className="max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                 <DialogTitle>Select Category</DialogTitle>
                              </DialogHeader>
                              <div className="grid grid-cols-2 gap-3 py-4">
                                 {CATEGORIES.map((cat) => (
                                    <button
                                       key={cat.id}
                                       type="button"
                                       onClick={() => {
                                          if (field.value === cat.id) {
                                             field.onChange("");
                                             setShowAllCategories(false);
                                          } else {
                                             field.onChange(cat.id);
                                             form.setValue("subcategory", "");
                                             setShowAllCategories(false);
                                          }
                                       }}
                                       className={`
                                          relative h-20 rounded-xl border-2 p-3 text-left transition-all
                                          ${
                                             field.value === cat.id
                                                ? "border-primary-600 bg-primary-50"
                                                : "border-gray-200 bg-white hover:border-gray-300"
                                          }
                                       `}
                                    >
                                       <div className="flex items-center">
                                          <span className="text-sm font-medium text-gray-900">
                                             {cat.label}
                                          </span>
                                       </div>
                                       {field.value === cat.id && (
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
                  </FormControl>
                  <FormMessage />
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

         {/* Requirements */}
         <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Special requirements (optional)</FormLabel>
                  <FormControl>
                     <div>
                        <Input
                           value={requirementInput}
                           onChange={(e) => setRequirementInput(e.target.value)}
                           onKeyDown={handleKeyDown}
                           placeholder="Type and press Enter"
                           className="h-10 text-sm"
                           disabled={requirements.length >= 10}
                        />
                     </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                     e.g., pet-friendly, tools needed, parking available
                  </FormDescription>
                  {requirements.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-1">
                        {requirements.map((req, index) => (
                           <Badge
                              key={index}
                              variant="secondary"
                              className="h-5 px-3 text-xs md:text-sm bg-gray-100 text-gray-700 hover:bg-gray-200"
                           >
                              {req}
                              <button
                                 type="button"
                                 onClick={() => removeRequirement(index)}
                                 className="ml-1.5 hover:text-gray-900"
                                 aria-label="Remove requirement"
                              >
                                 <X className="size-2 md:size-3" />
                              </button>
                           </Badge>
                        ))}
                     </div>
                  )}
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Estimated Duration */}
         <FormField
            control={form.control}
            name="estimatedDuration"
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Estimated time needed (optional)</FormLabel>
                  <FormControl>
                     <div className="flex items-center gap-3">
                        <div className="flex-1">
                           <div className="flex items-center gap-2">
                              <Input
                                 type="number"
                                 placeholder="0"
                                 min="0"
                                 max="365"
                                 step="1"
                                 className="h-10 text-sm flex-1"
                                 value={field.value && Math.floor(field.value / 24) > 0 ? Math.floor(field.value / 24) : ""}
                                 onChange={(e) => {
                                    const days = e.target.value ? parseFloat(e.target.value) : 0;
                                    const hours = field.value ? (field.value % 24) : 0;
                                    field.onChange(days * 24 + hours || null);
                                 }}
                              />
                              <span className="text-xs text-gray-600 font-medium min-w-fit">
                                 days
                              </span>
                           </div>
                        </div>
                        <div className="flex-1">
                           <div className="flex items-center gap-2">
                              <Input
                                 type="number"
                                 placeholder="0"
                                 min="0"
                                 max="23"
                                 step="1"
                                 className="h-10 text-sm flex-1"
                                 value={field.value && Math.floor(field.value % 24) > 0 ? Math.floor(field.value % 24) : ""}
                                 onChange={(e) => {
                                    const hours = e.target.value ? parseFloat(e.target.value) : 0;
                                    const days = field.value ? Math.floor(field.value / 24) : 0;
                                    field.onChange(days * 24 + hours || null);
                                 }}
                              />
                              <span className="text-xs text-gray-600 font-medium min-w-fit">
                                 hours
                              </span>
                           </div>
                        </div>
                     </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                     Your best guess helps taskers plan
                  </FormDescription>
                  <FormMessage />
               </FormItem>
            )}
         />

         {/* Tags */}
         <FormField
            control={form.control}
            name="tags"
            render={({ field }) => {
               const categoryTags = category && CATEGORY_TAGS[category] ? CATEGORY_TAGS[category] : [];
               
               return (
                  <FormItem>
                     <FormLabel className="text-xs md:text-sm">Skills & Tags (optional)</FormLabel>
                     <FormControl>
                        <div className="space-y-3">
                           {/* Preset category-based tags */}
                           {categoryTags.length > 0 && (
                              <div>
                                 <p className="text-xs text-gray-600 font-medium mb-2">Suggested tags for this category:</p>
                                 <div className="flex flex-wrap gap-2">
                                    {categoryTags.map((suggestedTag) => (
                                       <button
                                          key={suggestedTag}
                                          type="button"
                                          onClick={() => {
                                             if (!tags.includes(suggestedTag) && tags.length < 5) {
                                                field.onChange([...tags, suggestedTag]);
                                             }
                                          }}
                                          className={cn(
                                             "px-3 py-1.5 rounded-full text-xs font-medium transition-all border-2",
                                             tags.includes(suggestedTag)
                                                ? "bg-primary-100 border-primary-600 text-primary-700 cursor-default"
                                                : "bg-gray-100 border-gray-300 text-gray-700 hover:border-primary-400 cursor-pointer"
                                          )}
                                          disabled={tags.length >= 5 && !tags.includes(suggestedTag)}
                                       >
                                          {suggestedTag}
                                       </button>
                                    ))}
                                 </div>
                              </div>
                           )}

                           {/* Selected tags display */}
                           {tags.length > 0 && (
                              <div>
                                 <p className="text-xs text-gray-600 font-medium mb-2">Selected tags ({tags.length}/5):</p>
                                 <div className="flex flex-wrap gap-2">
                                    {tags.map((tag, index) => (
                                       <Badge
                                          key={index}
                                          className="h-7 px-3 text-xs bg-primary-600 text-white hover:bg-primary-700"
                                       >
                                          {tag}
                                          <button
                                             type="button"
                                             onClick={() => removeTag(index)}
                                             className="ml-1.5 hover:text-primary-100"
                                             aria-label="Remove tag"
                                          >
                                             <X className="size-2 md:size-3" />
                                          </button>
                                       </Badge>
                                    ))}
                                 </div>
                              </div>
                           )}

                           {/* Custom tag input (optional) */}
                           {tags.length < 5 && (
                              <div>
                                 <p className="text-xs text-gray-600 font-medium mb-2">Or add a custom tag:</p>
                                 <div className="relative">
                                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <Input
                                       value={tagInput}
                                       onChange={(e) => setTagInput(e.target.value)}
                                       onKeyDown={handleTagKeyDown}
                                       placeholder="Type and press Enter (2-20 chars)"
                                       className="h-10 text-sm pl-12"
                                       maxLength={20}
                                    />
                                 </div>
                              </div>
                           )}
                        </div>
                     </FormControl>
                     <FormDescription className="text-xs">
                        Select suggested tags or add custom ones to help taskers find your task
                     </FormDescription>
                     <FormMessage />
                  </FormItem>
               );
            }}
         />

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
                        maxSizeMB={5}
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
