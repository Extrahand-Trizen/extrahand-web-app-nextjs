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
   CreditCard,
   MessageSquare,
   CheckCircle2,
   ArrowRight,
   Clock,
   Hourglass,
   TrendingDown,
   Trophy,
   User,
   AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DashboardData } from "@/types/dashboard";

interface DynamicActionCardProps {
   data: DashboardData;
   user: {
      name?: string;
      isPhoneVerified?: boolean;
      isEmailVerified?: boolean;
      isAadhaarVerified?: boolean;
      isBankVerified?: boolean;
   };
   overrideState?: CardState;
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

export function DynamicActionCard({
   data,
   user,
   overrideState,
}: DynamicActionCardProps) {
   // Determine card state based on priority or use override
   const cardState = overrideState || determineCardState(data);

   switch (cardState) {
      case "first_time":
         return <FirstTimeCard />;
      case "incomplete_setup":
         return <IncompleteSetupCard data={data} user={user} />;
      case "pending_action":
         return <PendingActionCard data={data} />;
      case "verification_pending":
         return <VerificationPendingCard />;
      case "payment_pending":
         return <PaymentPendingCard data={data} />;
      case "profile_incomplete":
         return <ProfileIncompleteCard />;
      case "low_activity":
         return <LowActivityCard />;
      case "achievement_unlocked":
         return <AchievementUnlockedCard data={data} />;
      case "returning_user":
         return <ReturningUserCard data={data} />;
   }
}

function determineCardState(data: DashboardData): CardState {
   // Priority 1: Pending actions (payments, offers, messages)
   const hasPendingPayments = data.currentStatus.pendingPayments.length > 0;
   const hasPendingOffers = data.currentStatus.pendingOffers.some(
      (o) => o.type === "received"
   );
   const hasUnreadMessages =
      data.currentStatus.activeChats.some((c) => c.unreadCount > 0) ||
      data.currentStatus.activeTasks.length > 0;

   if (hasPendingPayments || hasPendingOffers || hasUnreadMessages) {
      return "pending_action";
   }

   // Priority 2: Incomplete setup
   const hasIncompleteSetup = data.nudges.length > 0;
   if (hasIncompleteSetup) {
      return "incomplete_setup";
   }

   // Priority 3: First-time user (no activity)
   const hasNoActivity =
      data.stats.totalTasksPosted === 0 &&
      data.stats.totalTasksAsTasker === 0 &&
      data.stats.totalEarnings === 0 &&
      data.taskSnapshots.length === 0;

   if (hasNoActivity) {
      return "first_time";
   }

   // Priority 4: Returning user
   return "returning_user";
}

function FirstTimeCard() {
   const router = useRouter();

   return (
      <div className="bg-primary-50 rounded-xl p-6 sm:p-8">
         <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center shrink-0">
               <Sparkles className="w-6 h-6 text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  Welcome to ExtraHand!
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-4">
                  Get started by posting your first task or browse available
                  opportunities to start earning. It only takes a few minutes.
               </p>
               <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                     onClick={() => router.push("/tasks/new")}
                     className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold shadow-sm"
                  >
                     Post Your First Task
                     <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                     variant="outline"
                     onClick={() => router.push("/tasks")}
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

function IncompleteSetupCard({
   data,
   user,
}: {
   data: DashboardData;
   user: DynamicActionCardProps["user"];
}) {
   const router = useRouter();

   // Calculate setup progress
   const setupItems = [
      { key: "phone", verified: user.isPhoneVerified, label: "Phone" },
      { key: "email", verified: user.isEmailVerified, label: "Email" },
      { key: "aadhaar", verified: user.isAadhaarVerified, label: "Identity" },
      { key: "bank", verified: user.isBankVerified, label: "Bank Account" },
   ];

   const completedCount = setupItems.filter((item) => item.verified).length;
   const totalCount = setupItems.length;
   const progress = (completedCount / totalCount) * 100;

   // Get highest priority nudge
   const priorityNudge = data.nudges.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
   })[0];

   return (
      <div className="bg-blue-50 rounded-xl p-6 sm:p-8">
         <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
               <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  Complete Your Account Setup
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-3">
                  {priorityNudge.description ||
                     "Complete your verification to unlock more features and build trust with other users."}
               </p>

               {/* Progress Bar */}
               <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-xs font-medium text-secondary-700">
                        {completedCount} of {totalCount} completed
                     </span>
                     <span className="text-xs text-secondary-500">
                        {Math.round(progress)}%
                     </span>
                  </div>
                  <div className="w-full h-2 bg-secondary-100 rounded-full overflow-hidden">
                     <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                     />
                  </div>
               </div>

               <div className="flex items-center gap-2 text-xs text-secondary-500 mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Takes about 5 minutes • Secure & encrypted</span>
               </div>

               <Button
                  onClick={() => router.push(priorityNudge.actionRoute)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold shadow-sm"
               >
                  {priorityNudge.actionLabel || "Continue Setup"}
                  <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
         </div>
      </div>
   );
}

function PendingActionCard({ data }: { data: DashboardData }) {
   const router = useRouter();

   // Determine the most urgent action
   const pendingPayment = data.currentStatus.pendingPayments[0];
   const pendingOffer = data.currentStatus.pendingOffers.find(
      (o) => o.type === "received"
   );
   const activeTask = data.currentStatus.activeTasks[0];
   const unreadChat = data.currentStatus.activeChats.find(
      (c) => c.unreadCount > 0
   );

   let action;
   if (pendingPayment) {
      action = {
         icon: CreditCard,
         title: `Release Payment: ₹${pendingPayment.amount.toLocaleString(
            "en-IN"
         )}`,
         description: `Complete payment for "${pendingPayment.taskTitle}"`,
         route: pendingPayment.actionRoute,
         label: "Release Payment",
         color: "green",
      };
   } else if (pendingOffer) {
      action = {
         icon: MessageSquare,
         title: `New Offer: ₹${pendingOffer.proposedBudget.toLocaleString(
            "en-IN"
         )}`,
         description: `Review offer for "${pendingOffer.taskTitle}"`,
         route: pendingOffer.actionRoute,
         label: "View Offer",
         color: "primary",
      };
   } else if (unreadChat) {
      action = {
         icon: MessageSquare,
         title: `${unreadChat.unreadCount} new message${
            unreadChat.unreadCount > 1 ? "s" : ""
         }`,
         description: `From ${unreadChat.otherPartyName} about "${unreadChat.taskTitle}"`,
         route: `/chat?id=${unreadChat.id}`,
         label: "Open Chat",
         color: "purple",
      };
   } else if (activeTask) {
      action = {
         icon: CheckCircle2,
         title: activeTask.nextAction,
         description: `"${activeTask.title}" - ${activeTask.otherPartyName}`,
         route: activeTask.nextActionRoute,
         label: activeTask.nextAction,
         color: "blue",
      };
   }

   if (!action) return null;

   const Icon = action.icon;
   const classes = getCardClasses(action.color);

   return (
      <div className={`${classes.card} rounded-xl p-6 sm:p-8`}>
         <div className="flex items-start gap-4">
            <div
               className={`w-12 h-12 rounded-xl ${classes.iconBg} flex items-center justify-center shrink-0`}
            >
               <Icon className={`w-6 h-6 ${classes.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  {action.title}
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-4">
                  {action.description}
               </p>
               <Button
                  onClick={() => router.push(action.route)}
                  className={`${classes.button} text-white font-semibold shadow-sm`}
               >
                  {action.label}
                  <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
         </div>
      </div>
   );
}

function VerificationPendingCard() {
   const router = useRouter();

   return (
      <div className="bg-gradient-to-br from-amber-50 via-white to-amber-50/30 rounded-xl border border-amber-200 p-6 sm:p-8 shadow-sm">
         <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
               <Hourglass className="w-6 h-6 text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  Verification Under Review
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-4">
                  Your verification documents are being reviewed. This usually
                  takes 24-48 hours. We&apos;ll notify you once it&apos;s
                  complete.
               </p>
               <Button
                  onClick={() => router.push("/profile/verify")}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm"
               >
                  Check Status
                  <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
         </div>
      </div>
   );
}

function PaymentPendingCard({ data }: { data: DashboardData }) {
   const router = useRouter();
   const pendingPayment = data.currentStatus.pendingPayments[0];

   if (!pendingPayment) return null;

   return (
      <div className="bg-green-50 rounded-xl p-6 sm:p-8">
         <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
               <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  Payment Ready to Release
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-3">
                  You have ₹{pendingPayment.amount.toLocaleString("en-IN")}{" "}
                  ready to release for &quot;{pendingPayment.taskTitle}&quot;.
                  Complete the payment to finalize the task.
               </p>
               <div className="flex items-center gap-2 text-xs text-secondary-500 mb-4">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Payment will be processed securely</span>
               </div>
               <Button
                  onClick={() => router.push(pendingPayment.actionRoute)}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold shadow-sm"
               >
                  Release Payment
                  <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
         </div>
      </div>
   );
}

function ProfileIncompleteCard() {
   const router = useRouter();

   return (
      <div className="bg-purple-50 rounded-xl p-6 sm:p-8">
         <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0">
               <User className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  Complete Your Profile
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-4">
                  Add a profile photo, bio, and skills to stand out to task
                  posters. Profiles with complete information get 3x more
                  offers.
               </p>
               <Button
                  onClick={() => router.push("/profile")}
                  className="bg-purple-500 hover:bg-purple-600 text-white font-semibold shadow-sm"
               >
                  Complete Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
               </Button>
            </div>
         </div>
      </div>
   );
}

function LowActivityCard() {
   const router = useRouter();

   const daysSinceLastActivity = 7; // Mock data

   return (
      <div className="bg-orange-50 rounded-xl p-6 sm:p-8">
         <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
               <TrendingDown className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  Get Back in the Game
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-4">
                  It&apos;s been {daysSinceLastActivity} days since your last
                  activity. Browse new tasks or post one to stay active and
                  maintain your visibility.
               </p>
               <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                     onClick={() => router.push("/tasks")}
                     className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-sm"
                  >
                     Browse Tasks
                     <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                     variant="outline"
                     onClick={() => router.push("/tasks/new")}
                     className="border-secondary-300 hover:border-orange-300"
                  >
                     Post a Task
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}

function AchievementUnlockedCard({ data }: { data: DashboardData }) {
   const router = useRouter();

   const achievement = "Task Master"; // Mock data
   const milestone =
      data.stats.totalTasksCompleted >= 10
         ? "10 tasks completed"
         : "First task completed";

   return (
      <div className="bg-gradient-to-br from-yellow-50 via-white to-yellow-50/30 rounded-xl border border-yellow-200 p-6 sm:p-8 shadow-sm">
         <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
               <Trophy className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  🎉 Achievement Unlocked!
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-3">
                  Congratulations! You&apos;ve earned the &quot;{achievement}
                  &quot; badge for {milestone}. Keep up the great work!
               </p>
               <div className="flex items-center gap-2 text-xs text-secondary-500 mb-4">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>View all achievements in your profile</span>
               </div>
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
   );
}

function ReturningUserCard({ data }: { data: DashboardData }) {
   const router = useRouter();

   // Calculate milestones
   const totalTasks =
      data.stats.totalTasksPosted + data.stats.totalTasksAsTasker;
   const hasEarnings = data.stats.totalEarnings > 0;
   const hasCompletedTasks = data.stats.totalTasksCompleted > 0;

   let message = "";
   let highlight = "";

   if (hasEarnings && data.stats.totalEarnings >= 10000) {
      message = "You've earned over ₹10,000!";
      highlight = `₹${data.stats.totalEarnings.toLocaleString(
         "en-IN"
      )} total earnings`;
   } else if (totalTasks >= 10) {
      message = "You're making great progress!";
      highlight = `${totalTasks} tasks completed`;
   } else if (hasCompletedTasks) {
      message = "Keep up the great work!";
      highlight = `${data.stats.totalTasksCompleted} task${
         data.stats.totalTasksCompleted > 1 ? "s" : ""
      } completed`;
   } else {
      message = "Welcome back!";
      highlight = "Ready to get things done";
   }

   return (
      <div className="bg-secondary-50 rounded-xl p-6 sm:p-8">
         <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-100 flex items-center justify-center shrink-0">
               <CheckCircle2 className="w-6 h-6 text-secondary-600" />
            </div>
            <div className="flex-1 min-w-0">
               <h3 className="text-lg sm:text-xl font-bold text-secondary-900 mb-2">
                  {message}
               </h3>
               <p className="text-sm sm:text-base text-secondary-600 mb-4">
                  {highlight}. Continue building your reputation and exploring
                  new opportunities.
               </p>
               <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                     onClick={() => router.push("/tasks/new")}
                     className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold shadow-sm"
                  >
                     Post a Task
                  </Button>
                  <Button
                     variant="outline"
                     onClick={() => router.push("/tasks")}
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

// Helper function for card classes
function getCardClasses(color: string) {
   switch (color) {
      case "green":
         return {
            card: "bg-green-50",
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            button: "bg-green-500 hover:bg-green-600",
         };
      case "primary":
         return {
            card: "bg-primary-50",
            iconBg: "bg-primary-100",
            iconColor: "text-primary-600",
            button: "bg-primary-500 hover:bg-primary-600",
         };
      case "purple":
         return {
            card: "bg-purple-50",
            iconBg: "bg-purple-100",
            iconColor: "text-purple-600",
            button: "bg-purple-500 hover:bg-purple-600",
         };
      case "blue":
         return {
            card: "bg-blue-50",
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            button: "bg-blue-500 hover:bg-blue-600",
         };
      default:
         return {
            card: "bg-secondary-50",
            iconBg: "bg-secondary-100",
            iconColor: "text-secondary-600",
            button: "bg-primary-500 hover:bg-primary-600",
         };
   }
}
