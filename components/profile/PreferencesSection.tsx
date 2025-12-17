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
import { UserPreferences } from "@/types/profile";
import { SUPPORTED_LANGUAGES, SupportedLanguage } from "@/types/consent";

interface PreferencesSectionProps {
   preferences: UserPreferences;
   onSave: (preferences: UserPreferences) => Promise<void>;
}

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

const defaultPreferences: UserPreferences = {
   preferredCategories: [],
   availability: {},
   serviceRadius: 10,
   language: "en",
   currency: "INR",
   timezone: "Asia/Kolkata",
};

export function PreferencesSection({
   preferences = defaultPreferences,
   onSave,
}: PreferencesSectionProps) {
   const [localPrefs, setLocalPrefs] = useState<UserPreferences>(preferences);
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
      setLocalPrefs((prev) => {
         const isSelected = prev.preferredCategories.includes(categoryId);
         return {
            ...prev,
            preferredCategories: isSelected
               ? prev.preferredCategories.filter((c) => c !== categoryId)
               : [...prev.preferredCategories, categoryId],
         };
      });
      setHasChanges(true);
   };

   const updateRadius = (value: number[]) => {
      setLocalPrefs((prev) => ({
         ...prev,
         serviceRadius: value[0],
      }));
      setHasChanges(true);
   };

   const toggleDayAvailability = (day: string) => {
      setLocalPrefs((prev) => {
         const dayKey = day as keyof typeof prev.availability;
         const currentDay = prev.availability[dayKey];
         return {
            ...prev,
            availability: {
               ...prev.availability,
               [dayKey]: currentDay
                  ? undefined
                  : [{ start: "09:00", end: "18:00" }],
            },
         };
      });
      setHasChanges(true);
   };

   const handleSave = async () => {
      setIsSaving(true);
      try {
         await onSave(localPrefs);
         setHasChanges(false);
      } catch (error) {
         console.error("Failed to save preferences:", error);
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className="max-w-4xl space-y-4 sm:space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
               Preferences
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
               Configure your task preferences and availability
            </p>
         </div>

         {/* Task Categories */}
         <CollapsibleSection
            title="Preferred Categories"
            description="Select task types you want to see and accept"
            icon={<Grid3X3 className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("categories")}
            onToggle={() => toggleSection("categories")}
            badge={`${localPrefs.preferredCategories.length} selected`}
         >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
               Leave empty to see all task categories
            </p>
         </CollapsibleSection>

         {/* Availability */}
         <CollapsibleSection
            title="Availability"
            description="Set when you're available for tasks"
            icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("availability")}
            onToggle={() => toggleSection("availability")}
         >
            <div className="space-y-4">
               <div className="grid grid-cols-7 gap-1 sm:gap-2">
                  {DAYS_OF_WEEK.map((day) => {
                     const dayKey =
                        day.id as keyof typeof localPrefs.availability;
                     const isAvailable = !!localPrefs.availability[dayKey];
                     return (
                        <button
                           key={day.id}
                           onClick={() => toggleDayAvailability(day.id)}
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
                  Click on days to toggle availability. Default hours: 9 AM - 6
                  PM
               </p>
            </div>
         </CollapsibleSection>

         {/* Service Radius */}
         <CollapsibleSection
            title="Service Radius"
            description="How far you're willing to travel for tasks"
            icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("radius")}
            onToggle={() => toggleSection("radius")}
            badge={`${localPrefs.serviceRadius} km`}
         >
            <div className="space-y-4">
               <div className="flex items-center justify-between mb-2">
                  <span className="text-xs sm:text-sm text-gray-600">1 km</span>
                  <span className="text-base sm:text-lg font-semibold text-gray-900">
                     {localPrefs.serviceRadius} km
                  </span>
                  <span className="text-xs sm:text-sm text-gray-600">
                     50 km
                  </span>
               </div>
               <Slider
                  value={[localPrefs.serviceRadius]}
                  onValueChange={updateRadius}
                  min={1}
                  max={50}
                  step={1}
                  className="w-full"
               />
               <p className="text-[10px] sm:text-xs text-gray-500">
                  Tasks outside this radius won&apos;t appear in your feed
               </p>
            </div>
         </CollapsibleSection>

         {/* Language & Region */}
         <CollapsibleSection
            title="Language & Region"
            description="Communication and display preferences"
            icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("language")}
            onToggle={() => toggleSection("language")}
         >
            <div className="space-y-4">
               <div>
                  <Label className="text-xs sm:text-sm text-gray-700">
                     Language
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                     {SUPPORTED_LANGUAGES.slice(0, 6).map((lang) => (
                        <button
                           key={lang.value}
                           onClick={() => {
                              setLocalPrefs((prev) => ({
                                 ...prev,
                                 language: lang.value,
                              }));
                              setHasChanges(true);
                           }}
                           className={cn(
                              "px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors text-left",
                              localPrefs.language === lang.value
                                 ? "border-gray-900 bg-gray-900 text-white"
                                 : "border-gray-200 text-gray-600 hover:border-gray-300"
                           )}
                        >
                           {lang.label}
                        </button>
                     ))}
                  </div>
                  {SUPPORTED_LANGUAGES.length > 6 && (
                     <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                        + {SUPPORTED_LANGUAGES.length - 6} more languages
                        available
                     </p>
                  )}
               </div>
               <div>
                  <Label className="text-xs sm:text-sm text-gray-700">
                     Currency
                  </Label>
                  <p className="text-xs sm:text-sm text-gray-900 mt-1">
                     Indian Rupee (₹) - Based on your region
                  </p>
               </div>
            </div>
         </CollapsibleSection>

         {/* Save Button */}
         {hasChanges && (
            <div className="flex items-center justify-end pt-4 border-t border-gray-200">
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
                        Save Preferences
                     </>
                  )}
               </Button>
            </div>
         )}
      </div>
   );
}

interface CollapsibleSectionProps {
   title: string;
   description: string;
   icon: React.ReactNode;
   isExpanded: boolean;
   onToggle: () => void;
   badge?: string;
   children: React.ReactNode;
}

function CollapsibleSection({
   title,
   description,
   icon,
   isExpanded,
   onToggle,
   badge,
   children,
}: CollapsibleSectionProps) {
   return (
      <div className="bg-white rounded-lg border border-gray-200">
         <button
            onClick={onToggle}
            className="w-full px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4 text-left"
         >
            <span className="text-gray-400 shrink-0">{icon}</span>
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                     {title}
                  </h3>
                  {badge && (
                     <Badge
                        variant="secondary"
                        className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 shrink-0"
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
               <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
            ) : (
               <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
            )}
         </button>
         {isExpanded && (
            <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-gray-100 pt-4">
               {children}
            </div>
         )}
      </div>
   );
}
