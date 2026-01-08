"use client";

/**
 * Dynamic Action Card Component
 * Single adaptive card that guides users toward their next best action
 * Full-width seamless design integrated with hero section
 */

import React from "react";
import { useRouter } from "next/navigation";
import {
   Sparkles,
   Shield,
   CheckCircle2,
   ArrowRight,
   Clock,
   User,
   FileText,
   Building2,
   Trophy,
   BadgeCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/user";

interface DynamicActionCardProps {
   user: UserProfile;
}

type CardState =
   | "first_time"
   | "incomplete_setup"
   | "pending_action"
   | "returning_user"
   | "verification_pending"
   | "payment_pending"
   | "profile_incomplete"
   | "low_activity"
   | "achievement_unlocked";

export function DynamicActionCard({ user }: DynamicActionCardProps) {
   const cardState = determineCardState(user);

   switch (cardState) {
      case "first_time":
         return <FirstTimeCard />;
      case "profile_incomplete":
         return <ProfileIncompleteCard user={user} />;
      case "verification_pending":
         return <VerificationPendingCard user={user} />;
      case "achievement_unlocked":
         return <AchievementUnlockedCard user={user} />;
      case "returning_user":
      default:
         return <ReturningUserCard user={user} />;
   }
}

function determineCardState(user: UserProfile): CardState {
   const isBusiness = user.userType === "business";
   
   // Priority 1: Profile incomplete (no photo or basic info missing)
   if (!user.photoURL || !user.onboardingStatus?.completedSteps?.profile) {
      return "profile_incomplete";
   }

   // Priority 2: Business verification pending
   if (isBusiness) {
      const biz = user.business;
      const needsVerification = 
         !biz?.pan?.isPANVerified ||
         !biz?.isGSTVerified ||
         !biz?.bankAccount?.isVerified;
      
      if (needsVerification) {
         return "verification_pending";
      }
   }

   // Priority 3: Individual verification pending
   if (!isBusiness && (!user.isAadhaarVerified || !user.isBankVerified)) {
      return "verification_pending";
   }

   // Priority 4: First-time user (no activity)
   const hasNoActivity = 
      (user.totalTasks || 0) === 0 && 
      (user.completedTasks || 0) === 0;
   
   if (hasNoActivity) {
      return "first_time";
   }

   // Priority 5: Achievement unlocked (milestones)
   if ((user.completedTasks || 0) >= 10) {
      return "achievement_unlocked";
   }

   // Default: Returning user
   return "returning_user";
}

function FirstTimeCard() {
   const router = useRouter();

   return (
      <div className="bg-primary-50 rounded-xl p-6 sm:p-8">
         <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
               <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1 max-w-2xl">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  Welcome to ExtraHand!
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-4">
                  Get started by posting your first task or browse available
                  opportunities to start earning.
               </p>
               <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                     onClick={() => router.push("/tasks/new")}
                     className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold shadow-sm"
                  >
                     Post Your First Task
                     <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                     variant="outline"
                     onClick={() => router.push("/discover")}
                     className="border-secondary-300 hover:border-primary-300"
                  >
                     Browse Tasks
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}

function ProfileIncompleteCard({ user }: { user: UserProfile }) {
   const router = useRouter();

   const missingItems: string[] = [];
   if (!user.photoURL) missingItems.push("profile photo");
   if (!user.onboardingStatus?.completedSteps?.profile) missingItems.push("profile details");

   return (
      <div className="bg-primary-50 rounded-xl p-6 sm:p-8">
         <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
               <User className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1 max-w-2xl">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  Complete Your Profile
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-4">
                  Add your {missingItems.join(" and ")} to stand out. 
                  Complete profiles get 3x more engagement.
               </p>
               <div className="flex justify-center">
                  <Button
                     onClick={() => router.push("/profile")}
                     className="bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-sm"
                  >
                     Complete Profile
                     <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}

function VerificationPendingCard({ user }: { user: UserProfile }) {
   const router = useRouter();
   const isBusiness = user.userType === "business";

   // Calculate verification progress
   let verificationItems: { key: string; verified: boolean; label: string; route: string }[] = [];
   let primaryAction = { label: "Verify Now", route: "/profile/verify" };

   if (isBusiness) {
      const biz = user.business;
      verificationItems = [
         { key: "pan", verified: !!biz?.pan?.isPANVerified, label: "PAN", route: "/profile/verify/pan" },
         { key: "gst", verified: !!biz?.isGSTVerified, label: "GST", route: "/profile/verify/gst" },
         { key: "bank", verified: !!biz?.bankAccount?.isVerified, label: "Bank", route: "/profile/verify/bank" },
      ];
      
      const pendingItem = verificationItems.find(item => !item.verified);
      if (pendingItem) {
         primaryAction = { label: `Verify ${pendingItem.label}`, route: pendingItem.route };
      }
   } else {
      verificationItems = [
         { key: "aadhaar", verified: !!user.isAadhaarVerified, label: "Identity", route: "/profile/verify/aadhaar" },
         { key: "bank", verified: !!user.isBankVerified, label: "Bank", route: "/profile/verify/bank" },
      ];
      
      const pendingItem = verificationItems.find(item => !item.verified);
      if (pendingItem) {
         primaryAction = { label: `Verify ${pendingItem.label}`, route: pendingItem.route };
      }
   }

   const completedCount = verificationItems.filter(item => item.verified).length;
   const totalCount = verificationItems.length;
   const progress = (completedCount / totalCount) * 100;

   return (
      <div className="bg-primary-50 rounded-xl p-6 sm:p-8">
         <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
               <Shield className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1 max-w-2xl">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  Complete Your Verification
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-3">
                  Verify your {isBusiness ? "business" : "identity"} to unlock all features and build trust.
               </p>

               {/* Progress Bar */}
               <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-xs font-medium text-secondary-700">
                        {completedCount} of {totalCount} verified
                     </span>
                     <span className="text-xs text-secondary-500">
                        {Math.round(progress)}%
                     </span>
                  </div>
                  <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden">
                     <div
                        className="h-full bg-primary-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                     />
                  </div>
               </div>

               {/* Verification Status Badges */}
               <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {verificationItems.map(item => (
                     <span 
                        key={item.key}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                           item.verified 
                              ? "bg-green-100 text-green-700" 
                              : "bg-secondary-100 text-secondary-600"
                        }`}
                     >
                        {item.verified && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
                        {item.label}
                     </span>
                  ))}
               </div>

               <div className="flex items-center justify-center gap-2 text-xs text-secondary-500 mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Takes about 5 minutes • Secure & encrypted</span>
               </div>

               <div className="flex justify-center">
                  <Button
                     onClick={() => router.push(primaryAction.route)}
                     className="bg-primary-500 hover:bg-primary-600 text-white font-semibold shadow-sm"
                  >
                     {primaryAction.label}
                     <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}

function AchievementUnlockedCard({ user }: { user: UserProfile }) {
   const router = useRouter();
   const completedTasks = user.completedTasks || 0;

   let achievement = "Rising Star";
   let milestone = `${completedTasks} tasks completed`;
   
   if (completedTasks >= 50) {
      achievement = "Expert Tasker";
   } else if (completedTasks >= 25) {
      achievement = "Task Master";
   } else if (completedTasks >= 10) {
      achievement = "Reliable Helper";
   }

   return (
      <div className="bg-yellow-50 rounded-xl p-6 sm:p-8">
         <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
               <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1 max-w-2xl">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  🎉 Achievement Unlocked!
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-3">
                  You&apos;ve earned the &quot;{achievement}&quot; badge for {milestone}. 
                  Keep up the great work!
               </p>
               <div className="flex justify-center">
                  <Button
                     onClick={() => router.push("/profile")}
                     className="bg-yellow-500 hover:bg-yellow-600 text-secondary-900 font-semibold shadow-sm"
                  >
                     View Profile
                     <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}

function ReturningUserCard({ user }: { user: UserProfile }) {
   const router = useRouter();
   
   const completedTasks = user.completedTasks || 0;
   const rating = user.rating || 0;

   let message = "Welcome back!";
   let highlight = "Ready to get things done";

   if (completedTasks > 0) {
      message = "Keep up the great work!";
      highlight = `${completedTasks} task${completedTasks > 1 ? "s" : ""} completed`;
      
      if (rating > 0) {
         highlight += ` • ${rating.toFixed(1)} ⭐ rating`;
      }
   }

   return (
      <div className="bg-primary-50 rounded-xl p-6 sm:p-8">
         <div className="flex flex-col items-center text-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center">
               <CheckCircle2 className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1 max-w-2xl">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  {message}
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-4">
                  {highlight}. Continue building your reputation.
               </p>
               <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                     onClick={() => router.push("/tasks/new")}
                     className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold shadow-sm"
                  >
                     Post a Task
                  </Button>
                  <Button
                     variant="outline"
                     onClick={() => router.push("/discover")}
                     className="border-secondary-300 hover:border-primary-300"
                  >
                     Browse Tasks
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
