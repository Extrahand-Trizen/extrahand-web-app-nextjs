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
import { cn } from "@/lib/utils";
import { sanitizeString, sanitizeStringArray } from "@/lib/utils/sanitization";

interface TaskBasicsStepProps {
   form: UseFormReturn<TaskFormData>;
   onNext: () => Promise<void>;
}

const CATEGORIES = [
   { id: "cleaning", label: "Cleaning", icon: "🧹" },
   { id: "repair", label: "Repairs", icon: "🔧" },
   { id: "delivery", label: "Delivery", icon: "📦" },
   { id: "assembly", label: "Assembly", icon: "🔨" },
   { id: "gardening", label: "Gardening", icon: "🌱" },
   { id: "petcare", label: "Pet Care", icon: "🐕" },
   { id: "other", label: "Other", icon: "✨" },
];

const SUBCATEGORIES: Record<string, string[]> = {
   cleaning: [
      "House Cleaning",
      "Office Cleaning",
      "Deep Cleaning",
      "Move-out Cleaning",
      "Car Wash",
   ],
   repair: [
      "Plumbing",
      "Electrical",
      "Appliance Repair",
      "Carpentry",
      "Painting",
   ],
   delivery: [
      "Food Delivery",
      "Parcel Pickup",
      "Grocery Shopping",
      "Document Drop-off",
   ],
   assembly: [
      "Furniture Assembly",
      "TV Mounting",
      "Shelf Installation",
      "Equipment Setup",
   ],
   gardening: [
      "Lawn Mowing",
      "Weeding",
      "Plant Care",
      "Trimming",
      "Garden Cleanup",
   ],
   petcare: [
      "Dog Walking",
      "Pet Sitting",
      "Pet Grooming",
      "Vet Visit",
      "Pet Feeding",
   ],
   other: [],
};

export function TaskBasicsStep({ form, onNext }: TaskBasicsStepProps) {
   const [requirementInput, setRequirementInput] = useState("");
   const [tagInput, setTagInput] = useState("");
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
                     <div className="grid grid-cols-2 gap-3">
                        {CATEGORIES.map((cat) => (
                           <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                 field.onChange(cat.id);
                                 form.setValue("subcategory", "");
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
                              <div className="flex items-center gap-3">
                                 <span className="text-2xl md:text-3xl">{cat.icon}</span>
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
                        <Input
                           type="number"
                           placeholder="2"
                           min="0.5"
                           max="168"
                           step="0.5"
                           className="h-10 text-sm flex-1"
                           value={field.value || ""}
                           onChange={(e) =>
                              field.onChange(
                                 e.target.value
                                    ? parseFloat(e.target.value)
                                    : null
                              )
                           }
                        />
                        <span className="text-xs md:text-sm text-gray-600 font-medium">
                           hours
                        </span>
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
            render={({ field }) => (
               <FormItem>
                  <FormLabel className="text-xs md:text-sm">Tags (optional)</FormLabel>
                  <FormControl>
                     <div>
                        <div className="relative">
                           <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                           <Input
                              value={tagInput}
                              onChange={(e) => setTagInput(e.target.value)}
                              onKeyDown={handleTagKeyDown}
                              placeholder="Type and press Enter (2-20 chars)"
                              className="h-10 text-sm pl-12"
                              disabled={tags.length >= 5}
                              maxLength={20}
                           />
                        </div>
                     </div>
                  </FormControl>
                  <FormDescription className="text-xs">
                     Add keywords to help taskers find your task (max 5)
                  </FormDescription>
                  {tags.length > 0 && (
                     <div className="flex flex-wrap gap-2 mt-1">
                        {tags.map((tag, index) => (
                           <Badge
                              key={index}
                              variant="secondary"
                              className="h-7 px-3 text-xs bg-primary-50 text-primary-700 hover:bg-primary-100"
                           >
                              #{tag}
                              <button
                                 type="button"
                                 onClick={() => removeTag(index)}
                                 className="ml-1.5 hover:text-primary-900"
                                 aria-label="Remove tag"
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
