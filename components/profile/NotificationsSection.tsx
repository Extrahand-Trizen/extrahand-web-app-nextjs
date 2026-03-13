"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
   Bell,
   Smartphone,
   Check,
   Loader2,
   Clock,
   ChevronDown,
   ChevronUp,
   Info,
} from "lucide-react";
import {
   NotificationSettingsState,
   FrequencySettings,
   DEFAULT_NOTIFICATION_SETTINGS,
   CommunicationChannel,
   COMMUNICATION_CHANNELS,
} from "@/types/consent";
import { profilesApi } from "@/lib/api/endpoints/profiles";

// Same categories as used in task posting
const KEYWORD_CATEGORIES = [
   { name: "Home Cleaning", slug: "home-cleaning" },
   { name: "Deep Cleaning", slug: "deep-cleaning" },
   { name: "Plumbing", slug: "plumbing" },
   { name: "Electrical", slug: "electrical" },
   { name: "Carpenter", slug: "carpenter" },
   { name: "Painting", slug: "painting" },
   { name: "AC Repair & Service", slug: "ac-repair" },
   { name: "Appliance Repair", slug: "appliance-repair" },
   { name: "Pest Control", slug: "pest-control" },
   { name: "Car Washing / Car Cleaning", slug: "car-washing" },
   { name: "Gardening", slug: "gardening" },
   { name: "Handyperson / General Repairs", slug: "handyperson" },
   { name: "Furniture Assembly", slug: "furniture-assembly" },
   { name: "Security Patrol / Watchman", slug: "security-patrol" },
   { name: "Beauty Services", slug: "beauty-services" },
   { name: "Massage / Spa", slug: "massage-spa" },
   { name: "Fitness Trainers", slug: "fitness-trainers" },
   { name: "Tutors", slug: "tutors" },
   { name: "IT Support / Laptop Repair", slug: "it-support" },
   { name: "Photographer / Videographer", slug: "photographer-videographer" },
   { name: "Event Services", slug: "event-services" },
   { name: "Pet Services", slug: "pet-services" },
   { name: "Driver / Chauffeur", slug: "driver-chauffeur" },
   { name: "Cooking / Home Chef", slug: "cooking-home-chef" },
   { name: "Laundry / Ironing", slug: "laundry-ironing" },
   { name: "Other", slug: "other" },
];

interface NotificationsSectionProps {
   settings?: NotificationSettingsState;
   frequencySettings?: FrequencySettings;
   preferredChannel?: CommunicationChannel;
   onSave: (
      settings: NotificationSettingsState,
      frequency?: FrequencySettings,
      preferredChannel?: CommunicationChannel
   ) => Promise<void>;
}

const DEFAULT_FREQUENCY: FrequencySettings = {
   dailyDigest: false,
   quietHours: {
      enabled: false,
      start: "22:00",
      end: "08:00",
      timezone: "Asia/Kolkata",
   },
   maxPerDay: 0,
};

export function NotificationsSection({
   settings = DEFAULT_NOTIFICATION_SETTINGS,
   frequencySettings = DEFAULT_FREQUENCY,
   preferredChannel = "push",
   onSave,
}: NotificationsSectionProps) {
   const [localSettings, setLocalSettings] =
      useState<NotificationSettingsState>(settings);
   const [localFrequency, setLocalFrequency] =
      useState<FrequencySettings>(frequencySettings);
   const [localChannel, setLocalChannel] =
      useState<CommunicationChannel>(preferredChannel);
   const [isSaving, setIsSaving] = useState(false);
   const [hasChanges, setHasChanges] = useState(false);
   const [expandedSections, setExpandedSections] = useState<string[]>(["push"]);
   const [keywordInput, setKeywordInput] = useState("");
   const [keywordAlerts, setKeywordAlerts] = useState<string[]>([]);
   const [showDropdown, setShowDropdown] = useState(false);
   const [filteredCategories, setFilteredCategories] =
      useState(KEYWORD_CATEGORIES);

   const keywordAlertsEnabled =
      (localSettings.push.enabled && localSettings.push.keywordTaskAlerts) ||
      (localSettings.email.enabled && localSettings.email.keywordTaskAlerts);

   const toggleSection = (section: string) => {
      setExpandedSections((prev) =>
         prev.includes(section)
            ? prev.filter((s) => s !== section)
            : [...prev, section]
      );
   };

   // Load keyword alerts from localStorage
   useEffect(() => {
      if (typeof window === "undefined") return;
      const stored = window.localStorage.getItem("notificationKeywordAlerts");
      if (!stored) return;
      try {
         const parsed = JSON.parse(stored);
         if (Array.isArray(parsed)) {
            setKeywordAlerts(parsed.filter((k) => typeof k === "string"));
         }
      } catch (error) {
         console.error("Failed to parse keyword alerts from storage:", error);
      }
   }, []);

   // Sync alerts from backend (keywords + categories)
   useEffect(() => {
      let isMounted = true;

      const loadAlerts = async () => {
         try {
            const localKeywordStore = typeof window !== "undefined"
               ? window.localStorage.getItem("notificationKeywordAlerts")
               : null;

            const localKeywords = localKeywordStore
               ? (() => {
                    try {
                       const parsed = JSON.parse(localKeywordStore);
                       return Array.isArray(parsed) ? parsed : [];
                    } catch {
                       return [];
                    }
                 })()
               : [];

            const keywordRes = await profilesApi.getKeywordAlerts();

            if (keywordRes) {
               const keywords = keywordRes.data?.keywords;
               if (Array.isArray(keywords) && isMounted) {
                  const resolvedKeywords = keywords.length > 0 ? keywords : localKeywords;
                  setKeywordAlerts(resolvedKeywords);
                  if (typeof window !== "undefined") {
                     window.localStorage.setItem(
                        "notificationKeywordAlerts",
                        JSON.stringify(resolvedKeywords)
                     );
                  }
                  if (keywords.length === 0 && localKeywords.length > 0) {
                     profilesApi.updateKeywordAlerts(localKeywords).catch((error) =>
                        console.error("Failed to sync local keywords:", error)
                     );
                  }
               }
            }
         } catch (error) {
            console.error("Failed to load alert preferences:", error);
         }
      };

      loadAlerts();
      return () => {
         isMounted = false;
      };
   }, []);

   // Update category suggestions dropdown based on input
   useEffect(() => {
      const term = keywordInput.trim().toLowerCase();
      if (!term) {
         setFilteredCategories([]);
         setShowDropdown(false);
         return;
      }

      const matches = KEYWORD_CATEGORIES.filter((cat) =>
         cat.name.toLowerCase().includes(term)
      );
      setFilteredCategories(matches);
      setShowDropdown(matches.length > 0);
   }, [keywordInput]);

   const persistKeywordAlerts = (next: string[]) => {
      setKeywordAlerts(next);
      setHasChanges(true);
      if (typeof window !== "undefined") {
         window.localStorage.setItem(
            "notificationKeywordAlerts",
            JSON.stringify(next)
         );
      }
   };

   const addKeywordAlert = (categoryName?: string) => {
      const nameToAdd = categoryName || keywordInput.trim().toLowerCase();
      if (!nameToAdd || nameToAdd.length < 2 || nameToAdd.length > 30) return;
      if (keywordAlerts.includes(nameToAdd) || keywordAlerts.length >= 10) return;
      persistKeywordAlerts([...keywordAlerts, nameToAdd]);
      setKeywordInput("");
      setShowDropdown(false);
   };

   const removeKeywordAlert = (keyword: string) => {
      persistKeywordAlerts(keywordAlerts.filter((k) => k !== keyword));
   };

   const updateChannelSetting = <K extends keyof NotificationSettingsState>(
      channel: K,
      key: keyof NotificationSettingsState[K],
      value: boolean
   ) => {
      setLocalSettings((prev) => ({
         ...prev,
         [channel]: {
            ...prev[channel],
            [key]: value,
         },
      }));
      setHasChanges(true);
   };

   const toggleChannelMaster = (channel: keyof NotificationSettingsState) => {
      const newEnabled = !localSettings[channel].enabled;
      setLocalSettings((prev) => ({
         ...prev,
         [channel]: {
            ...prev[channel],
            enabled: newEnabled,
         },
      }));
      setHasChanges(true);
   };

   const updateFrequency = <K extends keyof FrequencySettings>(
      key: K,
      value: FrequencySettings[K]
   ) => {
      setLocalFrequency((prev) => ({
         ...prev,
         [key]: value,
      }));
      setHasChanges(true);
   };

   const handleSave = async () => {
      setIsSaving(true);
      try {
         await onSave(localSettings, localFrequency, localChannel);

         await Promise.allSettled([
            profilesApi.updateKeywordAlerts(keywordAlerts),
         ]);

         setHasChanges(false);
      } catch (error) {
         console.error("Failed to save notification settings:", error);
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className="max-w-4xl space-y-4 sm:space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
               Notifications
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
               Choose how you want to receive updates and communications
            </p>
         </div>

         {/* Preferred Channel */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <Label className="text-xs sm:text-sm font-medium text-gray-900">
               Preferred Channel
            </Label>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 mb-3">
               Your primary channel for receiving important notifications
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
               {COMMUNICATION_CHANNELS.map((channel) => {
                  const isComingSoon = channel.value === "sms" || channel.value === "whatsapp";
                  return (
                     <button
                        key={channel.value}
                        onClick={() => {
                           if (!isComingSoon) {
                              setLocalChannel(channel.value);
                              setHasChanges(true);
                           }
                        }}
                        disabled={isComingSoon}
                        className={cn(
                           "px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors relative",
                           localChannel === channel.value && !isComingSoon
                              ? "border-primary-600 bg-primary-600 text-white"
                              : "border-gray-200 text-gray-600 hover:border-gray-300",
                           isComingSoon && "opacity-50 cursor-not-allowed bg-gray-50"
                        )}
                     >
                        {channel.label}
                        {isComingSoon && (
                           <Badge
                              variant="secondary"
                              className="absolute -top-2 -right-2 text-[8px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200"
                           >
                              Soon
                           </Badge>
                        )}
                     </button>
                  );
               })}
            </div>
         </div>

         {/* Push Notifications */}
         <NotificationChannel
            icon={<Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />}
            title="Push Notifications"
            description="Real-time alerts on your device"
            enabled={localSettings.push.enabled}
            onToggleMaster={() => toggleChannelMaster("push")}
            isExpanded={expandedSections.includes("push")}
            onToggle={() => toggleSection("push")}
         >
            <NotificationToggle
               label="Transactional"
               description="Important confirmations and account actions"
               checked={localSettings.push.transactional}
               onChange={(v) => updateChannelSetting("push", "transactional", v)}
               disabled={!localSettings.push.enabled}
               comingSoon={true}
            />
            <NotificationToggle
               label="Task Updates"
               description="Status changes, new offers, task completions"
               checked={localSettings.push.taskUpdates}
               onChange={(v) => updateChannelSetting("push", "taskUpdates", v)}
               disabled={!localSettings.push.enabled}
            />
            <NotificationToggle
               label="Payment Alerts"
               description="Payment confirmations and refunds"
               checked={localSettings.push.payments}
               onChange={(v) => updateChannelSetting("push", "payments", v)}
               disabled={!localSettings.push.enabled}
               comingSoon={true}
            />
            <NotificationToggle
               label="Task Reminders"
               description="Task-specific reminder alerts"
               checked={localSettings.push.taskReminders}
               onChange={(v) => updateChannelSetting("push", "taskReminders", v)}
               disabled={!localSettings.push.enabled}
               comingSoon={true}
            />
            <NotificationToggle
               label="Keyword Task Alerts"
               description="Alerts for tasks matching your keywords"
               checked={localSettings.push.keywordTaskAlerts}
               onChange={(v) => updateChannelSetting("push", "keywordTaskAlerts", v)}
               disabled={!localSettings.push.enabled}
            />
            <NotificationToggle
               label="System Alerts"
               description="Security and account notifications"
               checked={localSettings.push.system}
               onChange={(v) => updateChannelSetting("push", "system", v)}
               disabled={!localSettings.push.enabled}
            />
            <NotificationToggle
               label="Promotions"
               description="Deals, offers, and feature announcements"
               checked={localSettings.push.promotions}
               onChange={(v) => updateChannelSetting("push", "promotions", v)}
               disabled={!localSettings.push.enabled}
               comingSoon={true}
            />
         </NotificationChannel>

         {/* Email and SMS channel sections removed (handled via Preferred Channel) */}

         {/* Keyword Task Alerts */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
               <div className="flex-1 min-w-0">
                  <Label className="text-xs sm:text-sm font-medium text-gray-900">
                     Keyword Task Alerts
                  </Label>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                     Add keywords to get alerts when matching tasks are posted
                  </p>
               </div>
               <Badge
                  variant="secondary"
                  className={cn(
                     "text-[10px] sm:text-xs shrink-0",
                     keywordAlertsEnabled
                        ? "bg-green-50 text-green-700"
                        : "bg-gray-100 text-gray-500"
                  )}
               >
                  {keywordAlertsEnabled ? "On" : "Off"}
               </Badge>
            </div>

            <div className="mt-3 sm:mt-4 relative">
               <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                     <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => {
                           if (e.key === "Enter" && !showDropdown) {
                              e.preventDefault();
                              addKeywordAlert();
                           } else if (e.key === "Enter" && filteredCategories.length > 0) {
                              e.preventDefault();
                              addKeywordAlert(filteredCategories[0].name.toLowerCase());
                           } else if (e.key === "Escape") {
                              setShowDropdown(false);
                           }
                        }}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        placeholder="e.g., plumbing, AC repair"
                        disabled={!keywordAlertsEnabled}
                        className="w-full h-9 px-3 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent disabled:bg-gray-50"
                     />

                     {/* Suggestions Dropdown */}
                     {showDropdown && filteredCategories.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                           {filteredCategories.map((cat) => (
                              <button
                                 key={cat.slug}
                                 type="button"
                                 onClick={() => addKeywordAlert(cat.name.toLowerCase())}
                                 className="w-full px-3 py-2 text-left text-xs sm:text-sm hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                              >
                                 {cat.name}
                              </button>
                           ))}
                        </div>
                     )}
                  </div>
                  <Button
                     type="button"
                     size="sm"
                     onClick={() => {
                        if (filteredCategories.length > 0) {
                           addKeywordAlert(filteredCategories[0].name.toLowerCase());
                        } else {
                           addKeywordAlert();
                        }
                     }}
                     disabled={!keywordAlertsEnabled}
                  >
                     Add
                  </Button>
               </div>
            </div>

            <p className="text-[10px] sm:text-xs text-gray-500 mt-3">
               Start typing to see category suggestions. Max 10 keywords. Saved on this device.
            </p>

            {keywordAlerts.length > 0 && (
               <div className="flex flex-wrap gap-2 mt-3">
                  {keywordAlerts.map((keyword) => (
                     <Badge
                        key={keyword}
                        variant="secondary"
                        className="text-[10px] sm:text-xs bg-gray-100 text-gray-700"
                     >
                        {keyword}
                        <button
                           type="button"
                           onClick={() => removeKeywordAlert(keyword)}
                           className="ml-1 text-gray-600 hover:text-gray-900"
                           aria-label={`Remove ${keyword}`}
                        >
                           x
                        </button>
                     </Badge>
                  ))}
               </div>
            )}
         </div>

         {/* Quiet Hours & Frequency */}
         <div className="bg-white rounded-lg border border-gray-200">
            <button
               onClick={() => toggleSection("frequency")}
               className="w-full px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4 text-left"
            >
               <span className="text-gray-400 shrink-0">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
               </span>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                     <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        Quiet Hours & Frequency
                     </h3>
                     <Badge
                        variant="secondary"
                        className="text-[8px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200"
                     >
                        Coming Soon
                     </Badge>
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                     Control when and how often you receive notifications
                  </p>
               </div>
            </button>
         </div>

         {/* Hidden frequency section removed - Coming Soon */}
         {false && (
               <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-gray-100 pt-4 space-y-4">
                  {/* Quiet Hours Toggle */}
                  <div className="flex items-start justify-between gap-4">
                     <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                           Quiet Hours
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                           Pause non-urgent notifications during set hours
                        </p>
                     </div>
                     <Switch
                        checked={localFrequency.quietHours.enabled}
                        onCheckedChange={(checked) =>
                           updateFrequency("quietHours", {
                              ...localFrequency.quietHours,
                              enabled: checked,
                           })
                        }
                        className="data-[state=checked]:bg-primary-600"
                     />
                  </div>

                  {/* Quiet Hours Time Inputs */}
                  {localFrequency.quietHours.enabled && (
                     <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                           <div>
                              <Label className="text-[10px] sm:text-xs text-gray-600">
                                 Start Time
                              </Label>
                              <input
                                 type="time"
                                 value={localFrequency.quietHours.start}
                                 onChange={(e) => {
                                    updateFrequency("quietHours", {
                                       ...localFrequency.quietHours,
                                       start: e.target.value,
                                    });
                                 }}
                                 className="mt-1 w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                              />
                           </div>
                           <div>
                              <Label className="text-[10px] sm:text-xs text-gray-600">
                                 End Time
                              </Label>
                              <input
                                 type="time"
                                 value={localFrequency.quietHours.end}
                                 onChange={(e) => {
                                    updateFrequency("quietHours", {
                                       ...localFrequency.quietHours,
                                       end: e.target.value,
                                    });
                                 }}
                                 className="mt-1 w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                              />
                           </div>
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-2 flex items-center gap-1">
                           <Info className="w-3 h-3" />
                           Security alerts will still be delivered
                        </p>
                     </div>
                  )}

                  {/* Daily Digest */}
                  <div className="flex items-start justify-between gap-4 pt-2">
                     <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-900">
                           Daily Digest
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                           Receive a summary of your notifications once daily
                        </p>
                     </div>
                     <Switch
                        checked={localFrequency.dailyDigest}
                        onCheckedChange={(checked) =>
                           updateFrequency("dailyDigest", checked)
                        }
                        className="data-[state=checked]:bg-primary-600"
                     />
                  </div>
               </div>
            )}

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

interface NotificationChannelProps {
   icon: React.ReactNode;
   title: string;
   description: string;
   enabled: boolean;
   onToggleMaster: () => void;
   isExpanded: boolean;
   onToggle: () => void;
   children: React.ReactNode;
}

function NotificationChannel({
   icon,
   title,
   description,
   enabled,
   onToggleMaster,
   isExpanded,
   onToggle,
   children,
}: NotificationChannelProps) {
   return (
      <div className="bg-white rounded-lg border border-gray-200">
         <div className="px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 sm:gap-4">
            <button
               onClick={onToggle}
               className="flex-1 flex items-center gap-3 sm:gap-4 text-left"
            >
               <span
                  className={cn(
                     "shrink-0",
                     enabled ? "text-gray-600" : "text-gray-300"
                  )}
               >
                  {icon}
               </span>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                     <h3
                        className={cn(
                           "text-xs sm:text-sm font-medium truncate",
                           enabled ? "text-gray-900" : "text-gray-400"
                        )}
                     >
                        {title}
                     </h3>
                     <Badge
                        variant="secondary"
                        className={cn(
                           "text-[10px] sm:text-xs shrink-0",
                           enabled
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-500"
                        )}
                     >
                        {enabled ? "On" : "Off"}
                     </Badge>
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
            <Switch
               checked={enabled}
               onCheckedChange={onToggleMaster}
               className="data-[state=checked]:bg-primary-600"
            />
         </div>
         {isExpanded && (
            <div className="border-t border-gray-100 divide-y divide-gray-100">
               {children}
            </div>
         )}
      </div>
   );
}

interface NotificationToggleProps {
   label: string;
   description: string;
   checked: boolean;
   onChange: (checked: boolean) => void;
   disabled?: boolean;
   comingSoon?: boolean;
}

function NotificationToggle({
   label,
   description,
   checked,
   onChange,
   disabled,
   comingSoon = false,
}: NotificationToggleProps) {
   return (
      <div
         className={cn(
            "px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-4",
            (disabled || comingSoon) && "opacity-50"
         )}
      >
         <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
               <p
                  className={cn(
                     "text-xs sm:text-sm font-medium",
                     disabled || comingSoon ? "text-gray-400" : "text-gray-900"
                  )}
               >
                  {label}
               </p>
               {comingSoon && (
                  <Badge
                     variant="secondary"
                     className="text-[8px] px-1.5 py-0.5 bg-amber-50 text-amber-700 border border-amber-200"
                  >
                     Coming Soon
                  </Badge>
               )}
            </div>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
               {description}
            </p>
         </div>
         <Switch
            checked={checked}
            onCheckedChange={onChange}
            disabled={disabled || comingSoon}
            className="data-[state=checked]:bg-primary-600"
         />
      </div>
   );
}

export default NotificationsSection;
