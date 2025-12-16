"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
   Bell,
   Mail,
   Smartphone,
   MessageSquare,
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

   const toggleSection = (section: string) => {
      setExpandedSections((prev) =>
         prev.includes(section)
            ? prev.filter((s) => s !== section)
            : [...prev, section]
      );
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
         setHasChanges(false);
      } catch (error) {
         console.error("Failed to save notification settings:", error);
      } finally {
         setIsSaving(false);
      }
   };

   return (
      <div className="max-w-2xl space-y-4 sm:space-y-6">
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
               {COMMUNICATION_CHANNELS.map((channel) => (
                  <button
                     key={channel.value}
                     onClick={() => {
                        setLocalChannel(channel.value);
                        setHasChanges(true);
                     }}
                     className={cn(
                        "px-3 py-2 rounded-lg border text-xs sm:text-sm font-medium transition-colors",
                        localChannel === channel.value
                           ? "border-primary-600 bg-primary-600 text-white"
                           : "border-gray-200 text-gray-600 hover:border-gray-300"
                     )}
                  >
                     {channel.label}
                  </button>
               ))}
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
            />
            <NotificationToggle
               label="Reminders"
               description="Task deadlines and upcoming appointments"
               checked={localSettings.push.reminders}
               onChange={(v) => updateChannelSetting("push", "reminders", v)}
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
            />
         </NotificationChannel>

         {/* Email Notifications */}
         <NotificationChannel
            icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
            title="Email Notifications"
            description="Updates delivered to your inbox"
            enabled={localSettings.email.enabled}
            onToggleMaster={() => toggleChannelMaster("email")}
            isExpanded={expandedSections.includes("email")}
            onToggle={() => toggleSection("email")}
         >
            <NotificationToggle
               label="Task Updates"
               description="Status changes and new offers"
               checked={localSettings.email.taskUpdates}
               onChange={(v) => updateChannelSetting("email", "taskUpdates", v)}
               disabled={!localSettings.email.enabled}
            />
            <NotificationToggle
               label="Payment Alerts"
               description="Receipts and payment confirmations"
               checked={localSettings.email.payments}
               onChange={(v) => updateChannelSetting("email", "payments", v)}
               disabled={!localSettings.email.enabled}
            />
            <NotificationToggle
               label="Reminders"
               description="Task deadlines and follow-ups"
               checked={localSettings.email.reminders}
               onChange={(v) => updateChannelSetting("email", "reminders", v)}
               disabled={!localSettings.email.enabled}
            />
            <NotificationToggle
               label="Promotions"
               description="Tips, offers, and feature announcements"
               checked={localSettings.email.promotions}
               onChange={(v) => updateChannelSetting("email", "promotions", v)}
               disabled={!localSettings.email.enabled}
            />
            <NotificationToggle
               label="Marketing"
               description="Newsletter and product updates"
               checked={localSettings.email.marketing}
               onChange={(v) => updateChannelSetting("email", "marketing", v)}
               disabled={!localSettings.email.enabled}
            />
         </NotificationChannel>

         {/* SMS Notifications */}
         <NotificationChannel
            icon={<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />}
            title="SMS Notifications"
            description="Text messages to your phone"
            enabled={localSettings.sms.enabled}
            onToggleMaster={() => toggleChannelMaster("sms")}
            isExpanded={expandedSections.includes("sms")}
            onToggle={() => toggleSection("sms")}
         >
            <NotificationToggle
               label="Task Updates"
               description="Important task status changes"
               checked={localSettings.sms.taskUpdates}
               onChange={(v) => updateChannelSetting("sms", "taskUpdates", v)}
               disabled={!localSettings.sms.enabled}
            />
            <NotificationToggle
               label="Payment Alerts"
               description="Payment confirmations and security codes"
               checked={localSettings.sms.payments}
               onChange={(v) => updateChannelSetting("sms", "payments", v)}
               disabled={!localSettings.sms.enabled}
            />
            <NotificationToggle
               label="Reminders"
               description="Critical task reminders"
               checked={localSettings.sms.reminders}
               onChange={(v) => updateChannelSetting("sms", "reminders", v)}
               disabled={!localSettings.sms.enabled}
            />
         </NotificationChannel>

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
                     {localFrequency.quietHours.enabled && (
                        <Badge
                           variant="secondary"
                           className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 shrink-0"
                        >
                           {localFrequency.quietHours.start} -{" "}
                           {localFrequency.quietHours.end}
                        </Badge>
                     )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                     Control when and how often you receive notifications
                  </p>
               </div>
               {expandedSections.includes("frequency") ? (
                  <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
               ) : (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
               )}
            </button>

            {expandedSections.includes("frequency") && (
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
}

function NotificationToggle({
   label,
   description,
   checked,
   onChange,
   disabled,
}: NotificationToggleProps) {
   return (
      <div
         className={cn(
            "px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-4",
            disabled && "opacity-50"
         )}
      >
         <div className="flex-1 min-w-0">
            <p
               className={cn(
                  "text-xs sm:text-sm font-medium",
                  disabled ? "text-gray-400" : "text-gray-900"
               )}
            >
               {label}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
               {description}
            </p>
         </div>
         <Switch
            checked={checked}
            onCheckedChange={onChange}
            disabled={disabled}
            className="data-[state=checked]:bg-primary-600"
         />
      </div>
   );
}

export default NotificationsSection;
