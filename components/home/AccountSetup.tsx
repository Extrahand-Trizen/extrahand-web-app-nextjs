"use client";

/**
 * AccountSetup Component
 * Consolidated account setup/verification module with progress
 * Includes trust score/verification tier indicator
 */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
   CheckCircle2,
   Circle,
   ChevronRight,
   X,
   Shield,
   HelpCircle,
} from "lucide-react";
import type { ContextualNudge } from "@/types/dashboard";

interface AccountSetupProps {
   nudges: ContextualNudge[];
   loading?: boolean;
   trustLevel?: "none" | "basic" | "verified" | "trusted";
   verificationTier?: number;
}

interface SetupItem {
   id: string;
   label: string;
   completed: boolean;
   route: string;
   priority: "high" | "medium" | "low";
}

const trustLevelConfig = {
   none: {
      label: "Basic",
      color: "text-secondary-600",
      bg: "bg-secondary-100",
      tier: 0,
   },
   basic: {
      label: "Basic",
      color: "text-secondary-700",
      bg: "bg-secondary-100",
      tier: 1,
   },
   verified: {
      label: "Verified",
      color: "text-blue-700",
      bg: "bg-blue-100",
      tier: 2,
   },
   trusted: {
      label: "Trusted",
      color: "text-green-700",
      bg: "bg-green-100",
      tier: 3,
   },
};

export function AccountSetup({
   nudges,
   loading,
   trustLevel = "basic",
   verificationTier,
}: AccountSetupProps) {
   const router = useRouter();
   const [isDismissed, setIsDismissed] = useState(false);
   const [showTrustTooltip, setShowTrustTooltip] = useState(false);

   if (loading || nudges.length === 0 || isDismissed) {
      return null;
   }

   // Convert nudges to setup items
   const setupItems: SetupItem[] = nudges.map((nudge) => ({
      id: nudge.id,
      label: getSetupLabel(nudge.type),
      completed: false,
      route: nudge.actionRoute,
      priority: nudge.priority,
   }));

   const completedCount = setupItems.filter((item) => item.completed).length;
   const totalCount = setupItems.length;
   const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

   // Only show if there are incomplete items
   const incompleteItems = setupItems.filter((item) => !item.completed);
   if (incompleteItems.length === 0) {
      return null;
   }

   const nextItem = incompleteItems.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
   })[0];

   const trustConfig = trustLevelConfig[trustLevel];

   return (
      <div className="bg-gradient-to-br from-primary-50 to-white rounded-lg border border-primary-200 p-4 shadow-sm">
         <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-secondary-900">
                     Complete your account setup
                  </h3>
                  {/* Trust Level Indicator */}
                  <div className="relative">
                     <button
                        onMouseEnter={() => setShowTrustTooltip(true)}
                        onMouseLeave={() => setShowTrustTooltip(false)}
                        className="flex items-center gap-1"
                     >
                        <Shield className="w-3.5 h-3.5 text-secondary-500" />
                        <span
                           className={`text-xs font-medium px-1.5 py-0.5 rounded ${trustConfig.bg} ${trustConfig.color}`}
                        >
                           {trustConfig.label}
                        </span>
                        <HelpCircle className="w-3 h-3 text-secondary-400" />
                     </button>
                     {showTrustTooltip && (
                        <div className="absolute left-0 top-full mt-1 w-48 bg-secondary-900 text-white text-xs rounded p-2 z-50 shadow-lg">
                           <p className="font-medium mb-1">
                              Trust Level: {trustConfig.label}
                           </p>
                           <p className="text-secondary-300">
                              Complete verification to increase your trust level
                              and unlock more features.
                           </p>
                        </div>
                     )}
                  </div>
               </div>
               <p className="text-xs text-secondary-600">
                  {completedCount} of {totalCount} completed
               </p>
            </div>
            <button
               onClick={() => setIsDismissed(true)}
               className="p-1 text-secondary-400 hover:text-secondary-600 shrink-0 transition-colors"
               title="Dismiss"
            >
               <X className="w-4 h-4" />
            </button>
         </div>

         {/* Progress bar */}
         <div className="mb-3">
            <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden">
               <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
               />
            </div>
         </div>

         {/* Next action */}
         {nextItem && (
            <button
               onClick={() => router.push(nextItem.route)}
               className="w-full text-left flex items-center justify-between p-2.5 hover:bg-primary-100 rounded-lg transition-colors group"
            >
               <div className="flex items-center gap-2">
                  <Circle className="w-4 h-4 text-primary-500" />
                  <span className="text-sm font-medium text-secondary-700">
                     {nextItem.label}
                  </span>
               </div>
               <ChevronRight className="w-4 h-4 text-primary-500 group-hover:text-primary-600 transition-colors" />
            </button>
         )}
      </div>
   );
}

function getSetupLabel(type: string): string {
   const labels: Record<string, string> = {
      phone_unverified: "Verify phone number",
      email_unverified: "Verify email address",
      verification_pending: "Complete identity verification",
      payout_method_missing: "Add payout method",
      profile_incomplete: "Complete your profile",
      bank_unverified: "Verify bank account",
   };
   return labels[type] || "Complete setup";
}
