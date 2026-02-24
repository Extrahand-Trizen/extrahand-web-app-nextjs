"use client";

/**
 * Profile Overview Section - Complete Mobile Responsive
 * Summary view of account status, stats, and quick actions
 */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
   Star,
   CheckCircle2,
   AlertCircle,
   Clock,
   ArrowRight,
   Shield,
   Briefcase,
   MapPin,
   Award,
   Share2,
} from "lucide-react";
import { UserProfile } from "@/types/user";
import { ProfileSection } from "@/types/profile";
import { ShareModal } from "@/components/shared/ShareModal";
import { toast } from "sonner";

interface ProfileOverviewProps {
   user: UserProfile;
   onNavigate: (section: ProfileSection) => void;
}

export function ProfileOverview({ user, onNavigate }: ProfileOverviewProps) {
   const [shareOpen, setShareOpen] = useState(false);

   // Generate the public profile URL
   const getProfileUrl = () => {
      if (typeof window !== "undefined") {
         const userId = user.uid || user._id;
         return `${window.location.origin}/profile/${userId}`;
      }
      return "";
   };

   const handleShare = async () => {
      const url = getProfileUrl();

      if (navigator.share) {
         try {
            await navigator.share({
               title: `${user.name}'s Profile on ExtraHand`,
               text: `Check out ${user.name}'s profile on ExtraHand`,
               url: url,
            });
         } catch (err) {
            console.log("Share cancelled");
         }
      } else {
         setShareOpen(true);
      }
   };

   const completionPercentage = calculateCompletionPercentage(user);
   const verificationItems = getVerificationStatus(user);
   const verifiedCount = verificationItems.filter(
      (v) => v.status === "verified"
   ).length;

   return (
      <div className="space-y-4 sm:space-y-6">
         {/* Header Card */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4">
               <Avatar className="w-12 h-12 sm:w-16 sm:h-16 shrink-0">
                  <AvatarImage
                     src={user.photoURL || undefined}
                     alt={user.name}
                  />
                  <AvatarFallback className="bg-gray-100 text-gray-600 text-lg sm:text-xl font-medium">
                     {user.name?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
               </Avatar>

               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                     <h1 className="text-base sm:text-xl font-semibold text-gray-900 truncate">
                        {user.name}
                     </h1>
                     {user.verificationBadge &&
                        user.verificationBadge !== "none" && (
                           <Badge
                              variant="secondary"
                              className={cn(
                                 "capitalize text-[10px] sm:text-xs shrink-0",
                                 user.verificationBadge === "trusted" &&
                                    "bg-green-100 text-green-700",
                                 user.verificationBadge === "verified" &&
                                    "bg-blue-100 text-blue-700",
                                 user.verificationBadge === "basic" &&
                                    "bg-gray-100 text-gray-700"
                              )}
                           >
                              <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                              {user.verificationBadge}
                           </Badge>
                        )}
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-gray-500 flex-wrap">
                     {user.location?.city && (
                        <span className="flex items-center gap-1">
                           <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                           {user.location.city}
                        </span>
                     )}
                     <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                        {user.roles?.includes("tasker") &&
                        user.roles?.includes("poster")
                           ? "Tasker & Poster"
                           : user.roles?.includes("tasker")
                           ? "Tasker"
                           : "Poster"}
                     </span>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("public-profile")}
                        className="text-xs h-8 px-3"
                     >
                        View Profile
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate("edit-profile")}
                        className="text-xs h-8 px-3"
                     >
                        Edit
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShare}
                        className="text-xs h-8 px-3"
                     >
                        <Share2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />
                        <span className="hidden sm:inline">Share</span>
                     </Button>
                  </div>
               </div>
            </div>
         </div>

         {/* Profile Completion */}
         {completionPercentage < 100 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
               <div className="flex items-center justify-between mb-3">
                  <div>
                     <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                        Profile Completion
                     </h3>
                     <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">
                        Complete your profile to increase visibility
                     </p>
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-gray-900">
                     {completionPercentage}%
                  </span>
               </div>
               <Progress value={completionPercentage} className="h-2" />

               {completionPercentage < 100 && (
                  <button
                     onClick={() => onNavigate("edit-profile")}
                     className="flex items-center gap-1 mt-3 text-xs sm:text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                     Complete your profile
                     <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
               )}
            </div>
         )}

         {/* Stats Grid */}
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <StatCard
               label="Rating"
               value={user.rating?.toFixed(1) || "0.0"}
               icon={<Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />}
               subtext={`${user.totalReviews || 0} reviews`}
            />
            <StatCard
               label="Completed"
               value={String(user.completedTasks || 0)}
               icon={
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
               }
            />
            <StatCard
               label="Total"
               value={String(user.totalTasks || 0)}
               icon={
                  <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
               }
            />
            <StatCard
               label="Verified"
               value={`${verifiedCount}/${verificationItems.length}`}
               icon={
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
               }
               onClick={() => onNavigate("verifications")}
            />
         </div>

         {/* Quick Actions */}
         <div className="bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 sm:px-5 sm:py-4 border-b border-gray-100">
               <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                  Quick Actions
               </h3>
            </div>
            <div className="divide-y divide-gray-100">
               <QuickActionItem
                  icon={<Shield className="w-4 h-4 sm:w-5 sm:h-5" />}
                  title="Complete Verifications"
                  description={
                     verifiedCount === verificationItems.length
                        ? "All verifications complete"
                        : `${verificationItems.length - verifiedCount} pending`
                  }
                  status={
                     verifiedCount === verificationItems.length
                        ? "complete"
                        : "pending"
                  }
                  onClick={() => onNavigate("verifications")}
               />
               <QuickActionItem
                  icon={<Award className="w-4 h-4 sm:w-5 sm:h-5" />}
                  title="View Badges"
                  description="Check your reputation and badges"
                  onClick={() => onNavigate("badges")}
               />
               <QuickActionItem
                  icon={<CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />}
                  title="Update Preferences"
                  description="Set your task categories and availability"
                  onClick={() => onNavigate("preferences")}
               />
               <QuickActionItem
                  icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
                  title="Review Notifications"
                  description="Manage your communication settings"
                  onClick={() => onNavigate("notifications")}
               />
            </div>
         </div>

         {/* Account Status */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-4">
               Account Status
            </h3>
            <div className="space-y-3">
               <StatusRow
                  label="Account Status"
                  value={user.isActive ? "Active" : "Inactive"}
                  status={user.isActive ? "success" : "warning"}
               />
               <StatusRow
                  label="Member Since"
                  value={formatDate(user.createdAt)}
                  status="neutral"
               />
               <StatusRow
                  label="Last Updated"
                  value={formatDate(user.updatedAt)}
                  status="neutral"
               />
            </div>
         </div>

         {/* Share Modal */}
         <ShareModal
            isOpen={shareOpen}
            onClose={() => setShareOpen(false)}
            title="Profile"
            description={`Share ${user.name}'s profile`}
            url={getProfileUrl()}
            shareText={`Check out ${user.name}'s profile on ExtraHand!`}
         />
      </div>
   );
}

// Helper Components
interface StatCardProps {
   label: string;
   value: string;
   icon: React.ReactNode;
   subtext?: string;
   onClick?: () => void;
}

function StatCard({ label, value, icon, subtext, onClick }: StatCardProps) {
   const Component = onClick ? "button" : "div";
   return (
      <Component
         onClick={onClick}
         className={cn(
            "bg-white rounded-lg border border-gray-200 p-3 sm:p-4",
            onClick &&
               "hover:border-gray-300 transition-colors cursor-pointer text-left"
         )}
      >
         <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
            {icon}
            <span className="text-[10px] sm:text-xs text-gray-500 font-medium truncate">
               {label}
            </span>
         </div>
         <p className="text-lg sm:text-2xl font-semibold text-gray-900">
            {value}
         </p>
         {subtext && (
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1 truncate">
               {subtext}
            </p>
         )}
      </Component>
   );
}

interface QuickActionItemProps {
   icon: React.ReactNode;
   title: string;
   description: string;
   status?: "complete" | "pending" | "warning";
   onClick: () => void;
}

function QuickActionItem({
   icon,
   title,
   description,
   status,
   onClick,
}: QuickActionItemProps) {
   return (
      <button
         onClick={onClick}
         className="w-full flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-5 sm:py-4 hover:bg-gray-50 transition-colors text-left"
      >
         <span className="text-gray-400 shrink-0">{icon}</span>
         <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
               {title}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5 truncate">
               {description}
            </p>
         </div>
         {status === "complete" && (
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" />
         )}
         {status === "pending" && (
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 shrink-0" />
         )}
         <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
      </button>
   );
}

interface StatusRowProps {
   label: string;
   value: string;
   status: "success" | "warning" | "error" | "neutral";
}

function StatusRow({ label, value, status }: StatusRowProps) {
   return (
      <div className="flex items-center justify-between">
         <span className="text-xs sm:text-sm text-gray-500">{label}</span>
         <span
            className={cn(
               "text-xs sm:text-sm font-medium",
               status === "success" && "text-green-600",
               status === "warning" && "text-amber-600",
               status === "error" && "text-red-600",
               status === "neutral" && "text-gray-900"
            )}
         >
            {value}
         </span>
      </div>
   );
}

// Helper functions
function calculateCompletionPercentage(user: UserProfile): number {
   const fields = {
      name: !!user.name,
      email: !!user.email,
      phone: !!user.phone,
      location: !!user.location,
      roles: !!user.roles && user.roles.length > 0,
      skills: !!user.skills && user.skills.list && user.skills.list.length > 0,
   };

   const completedFields = Object.values(fields).filter(Boolean).length;
   return Math.round((completedFields / Object.keys(fields).length) * 100);
}

function getVerificationStatus(user: UserProfile) {
   return [
      { type: "phone", status: user.phone ? "verified" : "not_started" },
      { type: "email", status: user.email ? "verified" : "not_started" },
      {
         type: "aadhaar",
         status: user.isAadhaarVerified ? "verified" : "not_started",
      },
   ];
}

function formatDate(date?: Date | string): string {
   if (!date) return "N/A";
   const d = new Date(date);
   return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
   });
}

export default ProfileOverview;
