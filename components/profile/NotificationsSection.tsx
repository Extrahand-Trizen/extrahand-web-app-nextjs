"use client";

/**
 * Notifications Settings Section - Mobile Responsive
 * Grouped toggles for notification preferences
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
   Bell,
   Mail,
   Smartphone,
   MessageSquare,
   Check,
   Loader2,
} from "lucide-react";
import { NotificationPreferences } from "@/types/profile";

interface NotificationsSectionProps {
   preferences: NotificationPreferences;
   onSave: (preferences: NotificationPreferences) => Promise<void>;
}

const defaultPreferences: NotificationPreferences = {
   email: {
      taskUpdates: true,
      newMessages: true,
      marketing: false,
      accountAlerts: true,
      weeklyDigest: true,
   },
   push: {
      taskUpdates: true,
      newMessages: true,
      marketing: false,
      accountAlerts: true,
   },
   inApp: {
      taskUpdates: true,
      newMessages: true,
      systemAlerts: true,
   },
   sms: {
      taskUpdates: false,
      accountAlerts: true,
   },
};

export function NotificationsSection({
   preferences = defaultPreferences,
   onSave,
}: NotificationsSectionProps) {
   const [localPrefs, setLocalPrefs] =
      useState<NotificationPreferences>(preferences);
   const [isSaving, setIsSaving] = useState(false);
   const [hasChanges, setHasChanges] = useState(false);

   const updatePreference = <K extends keyof NotificationPreferences>(
      category: K,
      key: keyof NotificationPreferences[K],
      value: boolean
   ) => {
      setLocalPrefs((prev) => ({
         ...prev,
         [category]: {
            ...prev[category],
            [key]: value,
         },
      }));
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

         {/* Email Notifications */}
         <NotificationGroup
            icon={<Mail className="w-4 h-4 sm:w-5 sm:h-5" />}
            title="Email Notifications"
            description="Updates delivered to your inbox"
         >
            <NotificationToggle
               label="Task Updates"
               description="Status changes, new offers, and task completions"
               checked={localPrefs.email.taskUpdates}
               onChange={(checked) =>
                  updatePreference("email", "taskUpdates", checked)
               }
            />
            <NotificationToggle
               label="New Messages"
               description="When someone sends you a message"
               checked={localPrefs.email.newMessages}
               onChange={(checked) =>
                  updatePreference("email", "newMessages", checked)
               }
            />
            <NotificationToggle
               label="Account Alerts"
               description="Security alerts and important account updates"
               checked={localPrefs.email.accountAlerts}
               onChange={(checked) =>
                  updatePreference("email", "accountAlerts", checked)
               }
            />
            <NotificationToggle
               label="Weekly Digest"
               description="Summary of your activity and opportunities"
               checked={localPrefs.email.weeklyDigest}
               onChange={(checked) =>
                  updatePreference("email", "weeklyDigest", checked)
               }
            />
            <NotificationToggle
               label="Marketing & Promotions"
               description="Tips, offers, and feature announcements"
               checked={localPrefs.email.marketing}
               onChange={(checked) =>
                  updatePreference("email", "marketing", checked)
               }
            />
         </NotificationGroup>

         {/* Push Notifications */}
         <NotificationGroup
            icon={<Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />}
            title="Push Notifications"
            description="Alerts on your device"
         >
            <NotificationToggle
               label="Task Updates"
               description="Real-time task status changes"
               checked={localPrefs.push.taskUpdates}
               onChange={(checked) =>
                  updatePreference("push", "taskUpdates", checked)
               }
            />
            <NotificationToggle
               label="New Messages"
               description="Instant message alerts"
               checked={localPrefs.push.newMessages}
               onChange={(checked) =>
                  updatePreference("push", "newMessages", checked)
               }
            />
            <NotificationToggle
               label="Account Alerts"
               description="Security and account notifications"
               checked={localPrefs.push.accountAlerts}
               onChange={(checked) =>
                  updatePreference("push", "accountAlerts", checked)
               }
            />
            <NotificationToggle
               label="Marketing"
               description="Promotional notifications"
               checked={localPrefs.push.marketing}
               onChange={(checked) =>
                  updatePreference("push", "marketing", checked)
               }
            />
         </NotificationGroup>

         {/* In-App Notifications */}
         <NotificationGroup
            icon={<Bell className="w-4 h-4 sm:w-5 sm:h-5" />}
            title="In-App Notifications"
            description="Notifications within the app"
         >
            <NotificationToggle
               label="Task Updates"
               description="Updates shown in notification center"
               checked={localPrefs.inApp.taskUpdates}
               onChange={(checked) =>
                  updatePreference("inApp", "taskUpdates", checked)
               }
            />
            <NotificationToggle
               label="New Messages"
               description="Message indicators and alerts"
               checked={localPrefs.inApp.newMessages}
               onChange={(checked) =>
                  updatePreference("inApp", "newMessages", checked)
               }
            />
            <NotificationToggle
               label="System Alerts"
               description="App updates and system messages"
               checked={localPrefs.inApp.systemAlerts}
               onChange={(checked) =>
                  updatePreference("inApp", "systemAlerts", checked)
               }
            />
         </NotificationGroup>

         {/* SMS Notifications */}
         <NotificationGroup
            icon={<MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />}
            title="SMS Notifications"
            description="Text messages to your phone"
         >
            <NotificationToggle
               label="Task Updates"
               description="Important task updates via SMS"
               checked={localPrefs.sms.taskUpdates}
               onChange={(checked) =>
                  updatePreference("sms", "taskUpdates", checked)
               }
            />
            <NotificationToggle
               label="Account Alerts"
               description="Security codes and critical alerts"
               checked={localPrefs.sms.accountAlerts}
               onChange={(checked) =>
                  updatePreference("sms", "accountAlerts", checked)
               }
            />
         </NotificationGroup>

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

interface NotificationGroupProps {
   icon: React.ReactNode;
   title: string;
   description: string;
   children: React.ReactNode;
}

function NotificationGroup({
   icon,
   title,
   description,
   children,
}: NotificationGroupProps) {
   return (
      <div className="bg-white rounded-lg border border-gray-200">
         <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3">
               <span className="text-gray-400">{icon}</span>
               <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                     {title}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                     {description}
                  </p>
               </div>
            </div>
         </div>
         <div className="divide-y divide-gray-100">{children}</div>
      </div>
   );
}

interface NotificationToggleProps {
   label: string;
   description: string;
   checked: boolean;
   onChange: (checked: boolean) => void;
}

function NotificationToggle({
   label,
   description,
   checked,
   onChange,
}: NotificationToggleProps) {
   return (
      <div className="px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-4">
         <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900">
               {label}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
               {description}
            </p>
         </div>
         <Switch checked={checked} onCheckedChange={onChange} />
      </div>
   );
}
