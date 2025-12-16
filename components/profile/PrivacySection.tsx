"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
   Check,
   Loader2,
   Eye,
   MapPin,
   BarChart3,
   Shield,
   Users,
   Lock,
   Globe,
   ChevronDown,
   ChevronUp,
   Info,
} from "lucide-react";
import {
   PrivacySettingsState,
   ProfileVisibilityLevel,
   DEFAULT_PRIVACY_SETTINGS,
} from "@/types/consent";

interface PrivacySectionProps {
   settings?: PrivacySettingsState;
   onSave: (settings: PrivacySettingsState) => Promise<void>;
}

const VISIBILITY_OPTIONS: {
   value: ProfileVisibilityLevel;
   label: string;
   description: string;
   icon: React.ReactNode;
}[] = [
   {
      value: "public",
      label: "Public",
      description: "Anyone can view your profile",
      icon: <Globe className="w-4 h-4" />,
   },
   {
      value: "registered_users",
      label: "Registered Users",
      description: "Only logged-in users can view",
      icon: <Users className="w-4 h-4" />,
   },
   {
      value: "connections_only",
      label: "Connections Only",
      description: "Only people you've worked with",
      icon: <Lock className="w-4 h-4" />,
   },
];

export function PrivacySection({
   settings = DEFAULT_PRIVACY_SETTINGS,
   onSave,
}: PrivacySectionProps) {
   const [localSettings, setLocalSettings] =
      useState<PrivacySettingsState>(settings);
   const [isSaving, setIsSaving] = useState(false);
   const [hasChanges, setHasChanges] = useState(false);
   const [expandedSections, setExpandedSections] = useState<string[]>([
      "visibility",
   ]);

   const toggleSection = (section: string) => {
      setExpandedSections((prev) =>
         prev.includes(section)
            ? prev.filter((s) => s !== section)
            : [...prev, section]
      );
   };

   const updateSetting = <K extends keyof PrivacySettingsState>(
      key: K,
      value: PrivacySettingsState[K]
   ) => {
      setLocalSettings((prev) => ({
         ...prev,
         [key]: value,
      }));
      setHasChanges(true);
   };

   const handleSave = async () => {
      setIsSaving(true);
      try {
         await onSave(localSettings);
         setHasChanges(false);
      } catch (error) {
         console.error("Failed to save privacy settings:", error);
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className="max-w-2xl space-y-4 sm:space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
               Privacy & Data
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
               Control your privacy settings and how your data is used
            </p>
         </div>

         {/* Profile Visibility */}
         <CollapsibleSection
            title="Profile Visibility"
            description="Who can see your profile information"
            icon={<Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("visibility")}
            onToggle={() => toggleSection("visibility")}
            badge={
               VISIBILITY_OPTIONS.find(
                  (v) => v.value === localSettings.profileVisibility
               )?.label
            }
         >
            <div className="space-y-3">
               {VISIBILITY_OPTIONS.map((option) => {
                  const isSelected =
                     localSettings.profileVisibility === option.value;
                  return (
                     <button
                        key={option.value}
                        onClick={() =>
                           updateSetting("profileVisibility", option.value)
                        }
                        className={cn(
                           "w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors",
                           isSelected
                              ? "border-gray-900 bg-gray-50"
                              : "border-gray-200 hover:border-gray-300"
                        )}
                     >
                        <div
                           className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                              isSelected
                                 ? "bg-primary-600 text-white"
                                 : "bg-gray-100 text-gray-500"
                           )}
                        >
                           {option.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                           <p
                              className={cn(
                                 "text-sm font-medium",
                                 isSelected ? "text-gray-900" : "text-gray-700"
                              )}
                           >
                              {option.label}
                           </p>
                           <p className="text-xs text-gray-500 mt-0.5">
                              {option.description}
                           </p>
                        </div>
                        {isSelected && (
                           <Check className="w-4 h-4 text-gray-900 shrink-0 mt-1" />
                        )}
                     </button>
                  );
               })}
            </div>
         </CollapsibleSection>

         {/* Profile Information */}
         <CollapsibleSection
            title="Profile Information"
            description="Control what information others can see"
            icon={<Users className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("info")}
            onToggle={() => toggleSection("info")}
         >
            <div className="space-y-1 divide-y divide-gray-100">
               <PrivacyToggle
                  label="Show Earnings"
                  description="Display your total earnings on your profile"
                  checked={localSettings.showEarnings}
                  onChange={(checked) => updateSetting("showEarnings", checked)}
               />
               <PrivacyToggle
                  label="Show Task History"
                  description="Display completed tasks on your profile"
                  checked={localSettings.showTaskHistory}
                  onChange={(checked) =>
                     updateSetting("showTaskHistory", checked)
                  }
               />
               <PrivacyToggle
                  label="Show Reviews"
                  description="Display reviews and ratings on your profile"
                  checked={localSettings.showReviews}
                  onChange={(checked) => updateSetting("showReviews", checked)}
               />
            </div>
         </CollapsibleSection>

         {/* Location & Tracking */}
         <CollapsibleSection
            title="Location & Tracking"
            description="Control location sharing and analytics"
            icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("location")}
            onToggle={() => toggleSection("location")}
         >
            <div className="space-y-1 divide-y divide-gray-100">
               <PrivacyToggle
                  label="Location Sharing"
                  description="Share your location for task matching and navigation"
                  checked={localSettings.locationSharing}
                  onChange={(checked) =>
                     updateSetting("locationSharing", checked)
                  }
                  note="Required for task matching features"
               />
               <PrivacyToggle
                  label="Analytics Tracking"
                  description="Help us improve by sharing usage data"
                  checked={localSettings.analyticsTracking}
                  onChange={(checked) =>
                     updateSetting("analyticsTracking", checked)
                  }
                  note="Anonymous usage data only"
               />
            </div>
         </CollapsibleSection>

         {/* Data Management */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <div className="flex items-start gap-3">
               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
               </div>
               <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900">
                     Your Data Rights
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                     You can request a copy of your data or delete your account
                     at any time.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                     <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                     >
                        Download My Data
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                     >
                        Delete Account
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         {/* Info Box */}
         <div className="bg-primary-50 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
            <div className="text-xs text-primary-700">
               <p className="font-medium">Privacy Policy</p>
               <p className="mt-1">
                  Learn more about how we collect, use, and protect your data in
                  our{" "}
                  <a href="/privacy" className="underline hover:no-underline">
                     Privacy Policy
                  </a>
                  .
               </p>
            </div>
         </div>

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
                        Save Changes
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

interface PrivacyToggleProps {
   label: string;
   description: string;
   checked: boolean;
   onChange: (checked: boolean) => void;
   note?: string;
}

function PrivacyToggle({
   label,
   description,
   checked,
   onChange,
   note,
}: PrivacyToggleProps) {
   return (
      <div className="py-3 sm:py-4 flex items-start justify-between gap-4">
         <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900">
               {label}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
               {description}
            </p>
            {note && (
               <p className="text-[10px] sm:text-xs text-amber-600 mt-1 flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  {note}
               </p>
            )}
         </div>
         <Switch
            checked={checked}
            onCheckedChange={onChange}
            className="data-[state=checked]:bg-primary-600"
         />
      </div>
   );
}

export default PrivacySection;
