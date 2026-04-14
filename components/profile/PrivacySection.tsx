"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
   AlertTriangle,
   Trash2,
   X,
} from "lucide-react";
import {
   PrivacySettingsState,
   ProfileVisibilityLevel,
   DEFAULT_PRIVACY_SETTINGS,
} from "@/types/consent";
import { toast } from "sonner";
import { privacyApi } from "@/lib/api/endpoints/privacy";

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

// ---------------------------------------------------------------------------
// Portal wrapper – renders children directly on document.body so that parent
// overflow:hidden / transform stacking contexts can never clip the dialog.
// ---------------------------------------------------------------------------
function Portal({ children }: { children: React.ReactNode }) {
   const [mounted, setMounted] = useState(false);
   useEffect(() => { setMounted(true); }, []);
   if (!mounted) return null;
   return createPortal(children, document.body);
}

// ---------------------------------------------------------------------------
// Deletion confirmation dialog
// ---------------------------------------------------------------------------
interface DeleteDialogProps {
   openTasksCount: number;
   reason: string;
   onReasonChange: (v: string) => void;
   onConfirm: () => void;
   onCancel: () => void;
   isDeleting: boolean;
}

function DeleteConfirmDialog({
   openTasksCount,
   reason,
   onReasonChange,
   onConfirm,
   onCancel,
   isDeleting,
}: DeleteDialogProps) {
   // Lock body scroll while open
   useEffect(() => {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = prev; };
   }, []);

   return (
      <Portal>
         <div
            style={{ zIndex: 9999 }}
            className="fixed inset-0 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="del-dlg-title"
         >
            {/* Backdrop */}
            <div
               className="absolute inset-0 bg-black/50 backdrop-blur-sm"
               onClick={!isDeleting ? onCancel : undefined}
            />

            {/* Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
               {/* Header */}
               <div className="bg-red-600 px-5 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white">
                     <Trash2 className="w-5 h-5 shrink-0" />
                     <h2
                        id="del-dlg-title"
                        className="font-semibold text-sm sm:text-base"
                     >
                        Delete Account
                     </h2>
                  </div>
                  {!isDeleting && (
                     <button
                        onClick={onCancel}
                        className="text-white/80 hover:text-white transition-colors p-1 rounded"
                        aria-label="Close"
                     >
                        <X className="w-4 h-4" />
                     </button>
                  )}
               </div>

               <div className="px-5 py-5 space-y-4">
                  {/* Open-tasks warning — only shown when > 0 */}
                  {openTasksCount > 0 && (
                     <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm font-semibold text-amber-900 mb-2">
                           You have:
                        </p>
                        <ul className="list-disc list-inside space-y-1 mb-3">
                           <li className="text-sm text-amber-800">
                              <span className="font-semibold">{openTasksCount}</span>{" "}
                              active{" "}
                              {openTasksCount === 1 ? "task" : "tasks"}{" "}
                              <span className="text-amber-700">(not started)</span>
                           </li>
                        </ul>
                        <p className="text-xs text-amber-800 leading-relaxed">
                           Your active tasks will be{" "}
                           <strong>automatically deleted</strong> after deletion.
                           Are you sure you want to continue?
                        </p>
                     </div>
                  )}

                  {/* Standard deletion warning */}
                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                     <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div>
                           <p className="text-sm font-semibold text-red-900">
                              24–48 hour grace period
                           </p>
                           <p className="text-xs text-red-800 mt-1 leading-relaxed">
                              Deletion is scheduled — not instant. You can cancel
                              anytime before the scheduled time. Personal data is
                              anonymised; legal records are retained for compliance.
                           </p>
                        </div>
                     </div>
                  </div>

                  {/* Optional reason */}
                  <div>
                     <label
                        htmlFor="deletion-reason"
                        className="block text-xs font-medium text-gray-700 mb-1.5"
                     >
                        Reason for leaving{" "}
                        <span className="font-normal text-gray-400">(optional)</span>
                     </label>
                     <textarea
                        id="deletion-reason"
                        rows={3}
                        value={reason}
                        onChange={(e) => onReasonChange(e.target.value)}
                        disabled={isDeleting}
                        placeholder="Help us improve by telling us why you're leaving…"
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none disabled:opacity-60"
                     />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col-reverse sm:flex-row gap-2 pt-1">
                     <Button
                        type="button"
                        variant="outline"
                        className="flex-1"
                        onClick={onCancel}
                        disabled={isDeleting}
                        id="cancel-delete-account-btn"
                     >
                        Cancel
                     </Button>
                     <Button
                        type="button"
                        variant="destructive"
                        className="flex-1 gap-2"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        id="confirm-delete-account-btn"
                     >
                        {isDeleting ? (
                           <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Scheduling…
                           </>
                        ) : (
                           <>
                              <Trash2 className="w-4 h-4" />
                              Continue
                           </>
                        )}
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </Portal>
   );
}

// ---------------------------------------------------------------------------
// Main PrivacySection
// ---------------------------------------------------------------------------
export function PrivacySection({
   settings = DEFAULT_PRIVACY_SETTINGS,
   onSave,
}: PrivacySectionProps) {
   const [localSettings, setLocalSettings] =
      useState<PrivacySettingsState>(settings);
   const [isSaving, setIsSaving] = useState(false);
   const [hasChanges, setHasChanges] = useState(false);

   // Deletion dialog states
   const [showDeleteDialog, setShowDeleteDialog] = useState(false);
   const [deletionReason, setDeletionReason] = useState("");
   const [openTasksCount, setOpenTasksCount] = useState(0);
   const [isCheckingTasks, setIsCheckingTasks] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const [isCancellingDeletion, setIsCancellingDeletion] = useState(false);
   const [deletionRequested, setDeletionRequested] = useState(false);
   const [deletionScheduledFor, setDeletionScheduledFor] = useState<
      string | null
   >(null);

   const [expandedSections, setExpandedSections] = useState<string[]>([
      "visibility",
   ]);

   // Load deletion status on mount
   useEffect(() => {
      let mounted = true;
      const load = async () => {
         try {
            const result = await privacyApi.getDashboard();
            const status = (result as any)?.dashboard?.deletionStatus;
            if (!mounted || !status) return;
            setDeletionRequested(Boolean(status.requested));
            setDeletionScheduledFor(status.scheduledFor || null);
         } catch {
            // Non-critical
         }
      };
      void load();
      return () => { mounted = false; };
   }, []);

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

   const toggleSection = (s: string) =>
      setExpandedSections((prev) =>
         prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
      );

   const updateSetting = <K extends keyof PrivacySettingsState>(
      key: K,
      value: PrivacySettingsState[K]
   ) => {
      setLocalSettings((prev) => ({ ...prev, [key]: value }));
      setHasChanges(true);
   };

   const handleSave = async () => {
      setIsSaving(true);
      try {
         await onSave(localSettings);
         setHasChanges(false);
      } catch (e) {
         console.error("Failed to save privacy settings:", e);
      } finally {
         setIsSaving(false);
      }
   };

   // ── Step 1: button click → fetch count → show dialog ──────────────────
   const handleDeleteButtonClick = async () => {
      setIsCheckingTasks(true);
      let count = 0;
      try {
         const res = await privacyApi.checkOpenTasks();
         count = res?.openTasksCount ?? 0;
      } catch (e) {
         console.warn("Could not fetch open task count:", e);
         count = 0;
      } finally {
         setIsCheckingTasks(false);
      }
      setOpenTasksCount(count);
      setDeletionReason("");
      setShowDeleteDialog(true); // ← always show, regardless of count
   };

   // ── Step 2: user clicked "Continue" inside dialog ──────────────────────
   const handleConfirmDeletion = async () => {
      setIsDeleting(true);
      try {
         const res = await privacyApi.requestDeletion(
            true,
            deletionReason || undefined
         );
         setDeletionRequested(true);
         setDeletionScheduledFor(
            res?.deletionScheduledFor
               ? new Date(
                    res.deletionScheduledFor as unknown as string
                 ).toISOString()
               : null
         );
         setShowDeleteDialog(false);
         toast.success(
            "Account deletion scheduled. You can cancel until the scheduled time."
         );
      } catch (error: any) {
         toast.error(error?.message || "Failed to request account deletion");
      } finally {
         setIsDeleting(false);
      }
   };

   // ── Step 2b: user clicked "Cancel" inside dialog ───────────────────────
   const handleCancelDialog = () => {
      if (!isDeleting) {
         setShowDeleteDialog(false);
      }
   };

   const handleCancelDeletion = async () => {
      setIsCancellingDeletion(true);
      try {
         await privacyApi.cancelDeletion();
         setDeletionRequested(false);
         setDeletionScheduledFor(null);
         toast.success("Account deletion request cancelled");
      } catch (error: any) {
         toast.error(error?.message || "Failed to cancel deletion request");
      } finally {
         setIsCancellingDeletion(false);
      }
   };

   return (
      <>
         {/* Dialog rendered via Portal — cannot be clipped by parent overflow */}
         {showDeleteDialog && (
            <DeleteConfirmDialog
               openTasksCount={openTasksCount}
               reason={deletionReason}
               onReasonChange={setDeletionReason}
               onConfirm={handleConfirmDeletion}
               onCancel={handleCancelDialog}
               isDeleting={isDeleting}
            />
         )}

         <div className="max-w-4xl space-y-4 sm:space-y-6">
            {/* Header */}
            <div>
               <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Privacy &amp; Data
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
               badge="Coming Soon"
            >
               <ComingSoonNotice description="Profile information controls are under development and will be available soon." />
            </CollapsibleSection>

            {/* Location & Tracking */}
            <CollapsibleSection
               title="Location &amp; Tracking"
               description="Control location sharing and analytics"
               icon={<MapPin className="w-4 h-4 sm:w-5 sm:h-5" />}
               isExpanded={expandedSections.includes("location")}
               onToggle={() => toggleSection("location")}
               badge="Coming Soon"
            >
               <ComingSoonNotice description="Location sharing and analytics controls are under development and will be available soon." />
            </CollapsibleSection>

            {/* Advanced Settings */}
            <CollapsibleSection
               title="Advanced Settings"
               description="Data export and account management"
               icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
               isExpanded={expandedSections.includes("advanced")}
               onToggle={() => toggleSection("advanced")}
               badge="Account Controls"
            >
               <div className="space-y-3">
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                     <p className="text-sm font-medium text-red-900 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        Delete Account
                     </p>
                     <p className="text-xs text-red-800 mt-1">
                        Removes personal profile data and anonymises your name.
                        Open tasks are cancelled. Active or in-progress tasks must
                        be resolved first. Legal records are retained for
                        compliance.
                     </p>
                  </div>

                  {deletionRequested ? (
                     <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-3">
                        <p className="text-xs font-medium text-amber-900">
                           Deletion is scheduled
                        </p>
                        <p className="text-xs text-amber-800">
                           Scheduled for:{" "}
                           {deletionScheduledFor
                              ? new Date(
                                   deletionScheduledFor
                                ).toLocaleString()
                              : "Not available"}
                        </p>
                        <Button
                           type="button"
                           variant="outline"
                           onClick={handleCancelDeletion}
                           disabled={isCancellingDeletion}
                           className="w-full sm:w-auto"
                        >
                           {isCancellingDeletion ? (
                              <>
                                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                 Cancelling…
                              </>
                           ) : (
                              "Cancel Deletion Request"
                           )}
                        </Button>
                     </div>
                  ) : (
                     <Button
                        id="request-account-deletion-btn"
                        type="button"
                        variant="destructive"
                        onClick={handleDeleteButtonClick}
                        disabled={isCheckingTasks}
                        className="w-full sm:w-auto gap-2"
                     >
                        {isCheckingTasks ? (
                           <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Checking…
                           </>
                        ) : (
                           <>
                              <Trash2 className="w-4 h-4" />
                              Request Account Deletion
                           </>
                        )}
                     </Button>
                  )}
               </div>
            </CollapsibleSection>

            {/* Privacy Policy info */}
            <div className="bg-primary-50 rounded-lg p-4 flex items-start gap-3">
               <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
               <div className="text-xs text-primary-700">
                  <p className="font-medium">Privacy Policy</p>
                  <p className="mt-1">
                     Learn more about how we collect, use, and protect your data
                     in our{" "}
                     <a
                        href="/privacy-policy"
                        className="underline hover:no-underline"
                     >
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
                           Saving…
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
      </>
   );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
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
