"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
   Check,
   Loader2,
   Grid3X3,
   Clock,
   MapPin,
   Globe,
   ChevronDown,
   ChevronUp,
} from "lucide-react";

const TASK_CATEGORIES = [
   { id: "home_services", label: "Home Services", emoji: "🏠" },
   { id: "cleaning", label: "Cleaning", emoji: "🧹" },
   { id: "delivery", label: "Delivery", emoji: "📦" },
   { id: "beauty", label: "Beauty & Wellness", emoji: "💅" },
   { id: "tech", label: "Tech Support", emoji: "💻" },
   { id: "tutoring", label: "Tutoring", emoji: "📚" },
   { id: "handyman", label: "Handyman", emoji: "🔧" },
   { id: "moving", label: "Moving & Packing", emoji: "📦" },
   { id: "events", label: "Events", emoji: "🎉" },
   { id: "photography", label: "Photography", emoji: "📷" },
   { id: "gardening", label: "Gardening", emoji: "🌱" },
   { id: "other", label: "Other", emoji: "✨" },
];

const DAYS_OF_WEEK = [
   { id: "monday", label: "Mon" },
   { id: "tuesday", label: "Tue" },
   { id: "wednesday", label: "Wed" },
   { id: "thursday", label: "Thu" },
   { id: "friday", label: "Fri" },
   { id: "saturday", label: "Sat" },
   { id: "sunday", label: "Sun" },
];

export function PreferencesSection({ preferences, onSave }: any) {
   const [localPrefs, setLocalPrefs] = useState(preferences);
   const [isSaving, setIsSaving] = useState(false);
   const [hasChanges, setHasChanges] = useState(false);
   const [expandedSections, setExpandedSections] = useState<string[]>([
      "categories",
   ]);

   const toggleSection = (section: string) => {
      setExpandedSections((prev) =>
         prev.includes(section)
            ? prev.filter((s) => s !== section)
            : [...prev, section]
      );
   };

   const updateCategories = (categoryId: string) => {
      setLocalPrefs((prev: any) => ({
         ...prev,
         preferredCategories: prev.preferredCategories.includes(categoryId)
            ? prev.preferredCategories.filter((c: string) => c !== categoryId)
            : [...prev.preferredCategories, categoryId],
      }));
      setHasChanges(true);
   };

   const handleSave = async () => {
      setIsSaving(true);
      try {
         await onSave(localPrefs);
         setHasChanges(false);
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className="space-y-4 sm:space-y-6">
         <div className="px-1">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
               Preferences
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
               Configure your task preferences
            </p>
         </div>

         {/* Task Categories */}
         <CollapsibleSection
            title="Preferred Categories"
            description="Select task types you want"
            icon={<Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("categories")}
            onToggle={() => toggleSection("categories")}
            badge={`${localPrefs.preferredCategories.length} selected`}
         >
            <div className="grid grid-cols-2 gap-2">
               {TASK_CATEGORIES.map((category) => {
                  const isSelected = localPrefs.preferredCategories.includes(
                     category.id
                  );
                  return (
                     <button
                        key={category.id}
                        onClick={() => updateCategories(category.id)}
                        className={cn(
                           "flex items-center gap-1.5 sm:gap-2 px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg border text-left transition-colors",
                           isSelected
                              ? "border-gray-900 bg-gray-900 text-white"
                              : "border-gray-200 hover:border-gray-300 text-gray-700"
                        )}
                     >
                        <span className="text-sm sm:text-base">
                           {category.emoji}
                        </span>
                        <span className="text-xs sm:text-sm font-medium truncate">
                           {category.label}
                        </span>
                     </button>
                  );
               })}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-3">
               Leave empty to see all categories
            </p>
         </CollapsibleSection>

         {/* Availability */}
         <CollapsibleSection
            title="Availability"
            description="Set when you're available"
            icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("availability")}
            onToggle={() => toggleSection("availability")}
         >
            <div className="space-y-4">
               <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {DAYS.map((day) => {
                     const isAvailable = !!localPrefs.availability[day.id];
                     return (
                        <button
                           key={day.id}
                           onClick={() => {
                              setLocalPrefs((prev: any) => ({
                                 ...prev,
                                 availability: {
                                    ...prev.availability,
                                    [day.id]: isAvailable
                                       ? undefined
                                       : [{ start: "09:00", end: "18:00" }],
                                 },
                              }));
                              setHasChanges(true);
                           }}
                           className={cn(
                              "py-1.5 sm:py-2 rounded-lg border text-[10px] sm:text-sm font-medium transition-colors",
                              isAvailable
                                 ? "border-gray-900 bg-gray-900 text-white"
                                 : "border-gray-200 text-gray-500 hover:border-gray-300"
                           )}
                        >
                           {day.label}
                        </button>
                     );
                  })}
               </div>
               <p className="text-[10px] sm:text-xs text-gray-500">
                  Default hours: 9 AM - 6 PM
               </p>
            </div>
         </CollapsibleSection>

         {/* Service Radius */}
         <CollapsibleSection
            title="Service Radius"
            description="How far you'll travel"
            icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("radius")}
            onToggle={() => toggleSection("radius")}
            badge={`${localPrefs.serviceRadius} km`}
         >
            <div className="space-y-4">
               <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">1 km</span>
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                     {localPrefs.serviceRadius} km
                  </span>
                  <span className="text-gray-600">50 km</span>
               </div>
               <Slider
                  value={[localPrefs.serviceRadius]}
                  onValueChange={(value) => {
                     setLocalPrefs((prev: any) => ({
                        ...prev,
                        serviceRadius: value[0],
                     }));
                     setHasChanges(true);
                  }}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
               />
            </div>
         </CollapsibleSection>

         {/* Language & Region */}
         <CollapsibleSection
            title="Language & Region"
            description="Communication preferences"
            icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("language")}
            onToggle={() => toggleSection("language")}
         >
            <div className="space-y-4">
               <div>
                  <Label className="text-xs sm:text-sm text-gray-700">
                     Language
                  </Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                     {[
                        { id: "en", label: "English" },
                        { id: "hi", label: "हिंदी" },
                        { id: "ta", label: "தமிழ்" },
                        { id: "te", label: "తెలుగు" },
                     ].map((lang) => (
                        <button
                           key={lang.id}
                           onClick={() => {
                              setLocalPrefs((prev: any) => ({
                                 ...prev,
                                 language: lang.id,
                              }));
                              setHasChanges(true);
                           }}
                           className={cn(
                              "px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors",
                              localPrefs.language === lang.id
                                 ? "border-gray-900 bg-gray-900 text-white"
                                 : "border-gray-200 text-gray-600 hover:border-gray-300"
                           )}
                        >
                           {lang.label}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </CollapsibleSection>

         {/* Save Button */}
         {hasChanges && (
            <div className="flex items-center justify-end pt-4 border-t border-gray-200 sticky bottom-0 bg-white sm:static sm:bg-transparent -mx-4 px-4 sm:mx-0 sm:px-0">
               <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full sm:w-auto sm:min-w-[140px]"
                  size="sm"
               >
                  {isSaving ? (
                     <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                     </>
                  ) : (
                     <>
                        <Check className="w-4 h-4 mr-2" />
                        Save
                     </>
                  )}
               </Button>
            </div>
         )}
      </div>
   );
}

function CollapsibleSection({
   title,
   description,
   icon,
   isExpanded,
   onToggle,
   badge,
   children,
}: any) {
   return (
      <div className="bg-white rounded-lg border border-gray-200">
         <button
            onClick={onToggle}
            className="w-full px-3 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4 text-left"
         >
            <span className="text-gray-400 flex-shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                     {title}
                  </h3>
                  {badge && (
                     <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs bg-gray-100 text-gray-600"
                     >
                        {badge}
                     </Badge>
                  )}
               </div>
               <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                  {description}
               </p>
            </div>
            {isExpanded ? (
               <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
            ) : (
               <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
            )}
         </button>
         {isExpanded && (
            <div className="px-3 pb-4 sm:px-5 sm:pb-5 border-t border-gray-100 pt-4">
               {children}
            </div>
         )}
      </div>
   );
}
