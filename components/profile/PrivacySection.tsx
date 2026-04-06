"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Check,
   Loader2,
   Eye,
   MapPin,
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
import { toast } from "sonner";

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

   useEffect(() => {
      setLocalSettings(settings);
      setHasChanges(false);
   }, [
      settings.profileVisibility,
      settings.showEarnings,
      settings.showTaskHistory,
      settings.showReviews,
      settings.locationSharing,
      settings.analyticsTracking,
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
      <div className="max-w-4xl space-y-4 sm:space-y-6">
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
                        onClick={() => updateSetting("profileVisibility", option.value)}
                        className={cn(
                           "w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-colors relative",
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
                           <div className="flex items-center gap-2">
                              <p
                                 className={cn(
                                    "text-sm font-medium",
                                    isSelected ? "text-gray-900" : "text-gray-700"
                                 )}
                              >
                                 {option.label}
                              </p>
                           </div>
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
            badge="Coming Soon"
         >
            <ComingSoonNotice description="Profile information controls are under development and will be available soon." />
         </CollapsibleSection>

         {/* Location & Tracking */}
         <CollapsibleSection
            title="Location & Tracking"
            description="Control location sharing and analytics"
            icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("location")}
            onToggle={() => toggleSection("location")}
            badge="Coming Soon"
         >
            <ComingSoonNotice description="Location sharing and analytics controls are under development and will be available soon." />
         </CollapsibleSection>

         {/* Data Management */}
         <CollapsibleSection
            title="Advanced Settings"
            description="Data export and account management"
            icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
            isExpanded={expandedSections.includes("advanced")}
            onToggle={() => toggleSection("advanced")}
            badge="Coming Soon"
         >
            <ComingSoonNotice description="Data export and account management controls are under development and will be available soon." />
         </CollapsibleSection>

         {/* Info Box */}
         <div className="bg-primary-50 rounded-lg p-4 flex items-start gap-3">
            <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
            <div className="text-xs text-primary-700">
               <p className="font-medium">Privacy Policy</p>
               <p className="mt-1">
                  Learn more about how we collect, use, and protect your data in
                  our{" "}
                  <a href="/privacy-policy" className="underline hover:no-underline">
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

function ComingSoonNotice({ description }: { description: string }) {
   return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
         <p className="text-xs font-medium text-amber-900">Coming Soon</p>
         <p className="text-xs text-amber-700 mt-1">{description}</p>
      </div>
   );
}

export default PrivacySection;
