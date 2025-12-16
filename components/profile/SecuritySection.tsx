"use client";

/**
 * Security Settings Section - Complete Mobile Responsive
 * Password, sessions, privacy, and account controls
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
   Lock,
   Key,
   Smartphone,
   Monitor,
   Globe,
   LogOut,
   Trash2,
   AlertTriangle,
   CheckCircle2,
   Eye,
   EyeOff,
   Shield,
   Clock,
} from "lucide-react";
import {
   SecuritySettings,
   SessionInfo,
   PrivacySettings,
} from "@/types/profile";
import { Switch } from "../ui/switch";

interface SecuritySectionProps {
   security: SecuritySettings;
   privacy: PrivacySettings;
   onChangePassword: (
      oldPassword: string,
      newPassword: string
   ) => Promise<void>;
   onRevokeSession: (sessionId: string) => Promise<void>;
   onRevokeAllSessions: () => Promise<void>;
   onUpdatePrivacy: (settings: PrivacySettings) => Promise<void>;
   onDeleteAccount: () => Promise<void>;
}

const defaultSecurity: SecuritySettings = {
   passwordLastChanged: undefined,
   twoFactorEnabled: false,
   activeSessions: [],
   loginHistory: [],
};

const defaultPrivacy: PrivacySettings = {
   showLastActive: true,
   showLocation: true,
   showRating: true,
   showCompletedTasks: true,
   allowMessagesFromAll: true,
   showOnSearch: true,
};

export function SecuritySection({
   security = defaultSecurity,
   privacy = defaultPrivacy,
   onChangePassword,
   onRevokeSession,
   onRevokeAllSessions,
   onUpdatePrivacy,
   onDeleteAccount,
}: SecuritySectionProps) {
   return (
      <div className="max-w-2xl space-y-4 sm:space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
               Security & Privacy
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
               Manage your password, sessions, and privacy settings
            </p>
         </div>

         {/* Password Section */}
         <PasswordSection
            lastChanged={security.passwordLastChanged}
            onChangePassword={onChangePassword}
         />

         {/* Two-Factor Auth */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
               <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                     <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                     <h3 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                        Two-Factor Authentication
                     </h3>
                     <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                        Add an extra layer of security to your account
                     </p>
                  </div>
               </div>
               <Badge
                  variant="secondary"
                  className={cn(
                     "shrink-0 text-[10px] sm:text-xs",
                     security.twoFactorEnabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                  )}
               >
                  {security.twoFactorEnabled ? "Enabled" : "Disabled"}
               </Badge>
            </div>
            <Button
               variant="outline"
               size="sm"
               className="mt-3 sm:mt-4 text-xs h-8 px-3 w-full sm:w-auto"
            >
               {security.twoFactorEnabled ? "Manage 2FA" : "Enable 2FA"}
            </Button>
         </div>

         {/* Active Sessions */}
         <SessionsSection
            sessions={security.activeSessions}
            onRevokeSession={onRevokeSession}
            onRevokeAllSessions={onRevokeAllSessions}
         />

         {/* Privacy Settings */}
         <PrivacySection privacy={privacy} onUpdate={onUpdatePrivacy} />

         {/* Danger Zone */}
         <DangerZone onDeleteAccount={onDeleteAccount} />
      </div>
   );
}

interface PasswordSectionProps {
   lastChanged?: Date;
   onChangePassword: (
      oldPassword: string,
      newPassword: string
   ) => Promise<void>;
}

function PasswordSection({
   lastChanged,
   onChangePassword,
}: PasswordSectionProps) {
   const [isEditing, setIsEditing] = useState(false);
   const [oldPassword, setOldPassword] = useState("");
   const [newPassword, setNewPassword] = useState("");
   const [confirmPassword, setConfirmPassword] = useState("");
   const [showOld, setShowOld] = useState(false);
   const [showNew, setShowNew] = useState(false);
   const [error, setError] = useState("");
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async () => {
      setError("");

      if (newPassword.length < 8) {
         setError("Password must be at least 8 characters");
         return;
      }
      if (newPassword !== confirmPassword) {
         setError("Passwords do not match");
         return;
      }

      setIsLoading(true);
      try {
         await onChangePassword(oldPassword, newPassword);
         setIsEditing(false);
         setOldPassword("");
         setNewPassword("");
         setConfirmPassword("");
      } catch (err: any) {
         setError(err.message || "Failed to change password");
      } finally {
         setIsLoading(false);
      }
   };

   if (!isEditing) {
      return (
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
               <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                     <Key className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                     <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                        Password
                     </h3>
                     <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                        {lastChanged
                           ? `Last changed ${formatDate(lastChanged)}`
                           : "Set a strong password for your account"}
                     </p>
                  </div>
               </div>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-xs h-8 px-3 shrink-0"
               >
                  Change Password
               </Button>
            </div>
         </div>
      );
   }

   return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 space-y-3 sm:space-y-4">
         <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
               <Key className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </div>
            <div>
               <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                  Change Password
               </h3>
               <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                  Enter your current password and choose a new one
               </p>
            </div>
         </div>

         <Separator />

         <div className="space-y-3">
            <div>
               <Label className="text-xs sm:text-sm text-gray-700">
                  Current Password
               </Label>
               <div className="relative mt-1.5">
                  <Input
                     type={showOld ? "text" : "password"}
                     value={oldPassword}
                     onChange={(e) => setOldPassword(e.target.value)}
                     placeholder="Enter current password"
                     className="h-9 sm:h-10 text-sm pr-10"
                  />
                  <button
                     type="button"
                     onClick={() => setShowOld(!showOld)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                     {showOld ? (
                        <EyeOff className="w-4 h-4" />
                     ) : (
                        <Eye className="w-4 h-4" />
                     )}
                  </button>
               </div>
            </div>

            <div>
               <Label className="text-xs sm:text-sm text-gray-700">
                  New Password
               </Label>
               <div className="relative mt-1.5">
                  <Input
                     type={showNew ? "text" : "password"}
                     value={newPassword}
                     onChange={(e) => setNewPassword(e.target.value)}
                     placeholder="Enter new password"
                     className="h-9 sm:h-10 text-sm pr-10"
                  />
                  <button
                     type="button"
                     onClick={() => setShowNew(!showNew)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                     {showNew ? (
                        <EyeOff className="w-4 h-4" />
                     ) : (
                        <Eye className="w-4 h-4" />
                     )}
                  </button>
               </div>
               <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                  Minimum 8 characters
               </p>
            </div>

            <div>
               <Label className="text-xs sm:text-sm text-gray-700">
                  Confirm New Password
               </Label>
               <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="mt-1.5 h-9 sm:h-10 text-sm"
               />
            </div>

            {error && (
               <p className="text-xs sm:text-sm text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
                  {error}
               </p>
            )}

            <div className="flex gap-2 pt-2">
               <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  size="sm"
                  className="flex-1 text-xs h-9"
               >
                  {isLoading ? "Updating..." : "Update Password"}
               </Button>
               <Button
                  variant="ghost"
                  onClick={() => {
                     setIsEditing(false);
                     setOldPassword("");
                     setNewPassword("");
                     setConfirmPassword("");
                     setError("");
                  }}
                  disabled={isLoading}
                  size="sm"
                  className="flex-1 text-xs h-9"
               >
                  Cancel
               </Button>
            </div>
         </div>
      </div>
   );
}

interface SessionsSectionProps {
   sessions: SessionInfo[];
   onRevokeSession: (sessionId: string) => Promise<void>;
   onRevokeAllSessions: () => Promise<void>;
}

function SessionsSection({
   sessions,
   onRevokeSession,
   onRevokeAllSessions,
}: SessionsSectionProps) {
   return (
      <div className="bg-white rounded-lg border border-gray-200">
         <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
               <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
               <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                     Active Sessions
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                     Devices currently logged in to your account
                  </p>
               </div>
            </div>
            {sessions.length > 1 && (
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRevokeAllSessions}
                  className="text-xs h-8 px-2 sm:px-3 shrink-0"
               >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Sign Out All</span>
                  <span className="sm:hidden">All</span>
               </Button>
            )}
         </div>

         {sessions.length > 0 ? (
            <div className="divide-y divide-gray-100">
               {sessions.map((session) => (
                  <div
                     key={session.id}
                     className="px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3"
                  >
                     <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                        {session.device.toLowerCase().includes("mobile") ? (
                           <Smartphone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        ) : (
                           <Monitor className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                        )}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                           <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {session.browser} on {session.device}
                           </p>
                           {session.isCurrent && (
                              <Badge
                                 variant="secondary"
                                 className="bg-green-100 text-green-700 text-[10px] shrink-0"
                              >
                                 Current
                              </Badge>
                           )}
                        </div>
                        <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
                           {session.location || "Unknown location"} • Last
                           active {formatDate(session.lastActive)}
                        </p>
                     </div>
                     {!session.isCurrent && (
                        <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => onRevokeSession(session.id)}
                           className="text-xs h-8 px-2 sm:px-3 shrink-0"
                        >
                           Sign Out
                        </Button>
                     )}
                  </div>
               ))}
            </div>
         ) : (
            <div className="px-4 py-6 sm:px-5 sm:py-8 text-center">
               <p className="text-xs sm:text-sm text-gray-500">
                  No active sessions
               </p>
            </div>
         )}
      </div>
   );
}

interface PrivacySectionProps {
   privacy: PrivacySettings;
   onUpdate: (settings: PrivacySettings) => Promise<void>;
}

function PrivacySection({ privacy, onUpdate }: PrivacySectionProps) {
   const [localPrivacy, setLocalPrivacy] = useState(privacy);
   const [hasChanges, setHasChanges] = useState(false);

   const updateSetting = (key: keyof PrivacySettings, value: boolean) => {
      setLocalPrivacy((prev) => ({ ...prev, [key]: value }));
      setHasChanges(true);
   };

   const handleSave = async () => {
      await onUpdate(localPrivacy);
      setHasChanges(false);
   };

   return (
      <div className="bg-white rounded-lg border border-gray-200">
         <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100">
            <div className="flex items-center gap-2 sm:gap-3">
               <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
               <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                     Privacy
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                     Control what others can see about you
                  </p>
               </div>
            </div>
         </div>

         <div className="divide-y divide-gray-100">
            <PrivacyToggle
               label="Show last active status"
               description="Let others see when you were last online"
               checked={localPrivacy.showLastActive}
               onChange={(checked) => updateSetting("showLastActive", checked)}
            />
            <PrivacyToggle
               label="Show location"
               description="Display your city/area on your profile"
               checked={localPrivacy.showLocation}
               onChange={(checked) => updateSetting("showLocation", checked)}
            />
            <PrivacyToggle
               label="Show rating and reviews"
               description="Display your rating and reviews publicly"
               checked={localPrivacy.showRating}
               onChange={(checked) => updateSetting("showRating", checked)}
            />
            <PrivacyToggle
               label="Allow messages from anyone"
               description="Receive messages from users you haven't worked with"
               checked={localPrivacy.allowMessagesFromAll}
               onChange={(checked) =>
                  updateSetting("allowMessagesFromAll", checked)
               }
            />
            <PrivacyToggle
               label="Appear in search results"
               description="Let your profile appear when users search for taskers"
               checked={localPrivacy.showOnSearch}
               onChange={(checked) => updateSetting("showOnSearch", checked)}
            />
         </div>

         {hasChanges && (
            <div className="px-4 py-3 sm:px-5 sm:py-4 border-t border-gray-100">
               <Button
                  onClick={handleSave}
                  size="sm"
                  className="w-full sm:w-auto text-xs h-8 bg-primary-600"
               >
                  Save Privacy Settings
               </Button>
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
}

function PrivacyToggle({
   label,
   description,
   checked,
   onChange,
}: PrivacyToggleProps) {
   return (
      <div className="px-4 py-3 sm:px-5 sm:py-4 flex items-center justify-between gap-3">
         <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900">
               {label}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 line-clamp-2">
               {description}
            </p>
         </div>
         <Switch
            checked={checked}
            onCheckedChange={onChange}
            className="data-[state=checked]:bg-primary-600"
         />
      </div>
   );
}

interface DangerZoneProps {
   onDeleteAccount: () => Promise<void>;
}

function DangerZone({ onDeleteAccount }: DangerZoneProps) {
   const [showConfirm, setShowConfirm] = useState(false);

   return (
      <div className="bg-white rounded-lg border border-red-200">
         <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-red-100">
            <div className="flex items-center gap-2 sm:gap-3">
               <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
               <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                     Danger Zone
                  </h3>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                     Irreversible actions for your account
                  </p>
               </div>
            </div>
         </div>

         <div className="px-4 py-3 sm:px-5 sm:py-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
               <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900">
                     Delete Account
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                     Permanently delete your account and all associated data
                  </p>
               </div>
               {showConfirm ? (
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                     <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                           await onDeleteAccount();
                           setShowConfirm(false);
                        }}
                        className="flex-1 sm:flex-initial text-xs h-8"
                     >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        Confirm Delete
                     </Button>
                     <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowConfirm(false)}
                        className="flex-1 sm:flex-initial text-xs h-8"
                     >
                        Cancel
                     </Button>
                  </div>
               ) : (
                  <Button
                     variant="outline"
                     size="sm"
                     className="text-red-600 border-red-200 hover:bg-red-50 text-xs h-8 px-3 w-full sm:w-auto"
                     onClick={() => setShowConfirm(true)}
                  >
                     Delete Account
                  </Button>
               )}
            </div>
         </div>
      </div>
   );
}

function formatDate(date: Date | string): string {
   const d = new Date(date);
   const now = new Date();
   const diffMs = now.getTime() - d.getTime();
   const diffMins = Math.floor(diffMs / 60000);
   const diffHours = Math.floor(diffMs / 3600000);
   const diffDays = Math.floor(diffMs / 86400000);

   if (diffMins < 1) return "just now";
   if (diffMins < 60) return `${diffMins}m ago`;
   if (diffHours < 24) return `${diffHours}h ago`;
   if (diffDays < 7) return `${diffDays}d ago`;

   return d.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
   });
}

export default SecuritySection;
