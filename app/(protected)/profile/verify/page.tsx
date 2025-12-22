/**
 * Verifications Overview Page
 * Main page showing all verification statuses with navigation to individual verification flows
 */

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Shield,
   Fingerprint,
   Mail,
   Building2,
   ChevronRight,
   CheckCircle2,
   ArrowLeft,
   Phone,
} from "lucide-react";
import {
   VerificationStatusBadge,
   SecurityNotice,
} from "@/components/profile/verification";
import { VerificationStatusType } from "@/types/verification";
import { UserProfile } from "@/types/user";

// Props interface for when user data is passed
interface VerificationsPageProps {
   user?: UserProfile;
}

// Helper to derive verification status from user profile
function getVerificationStatusFromUser(user?: UserProfile) {
   if (!user) {
      // Mock data for development - replace with actual API call
      return {
         aadhaar: {
            status: "not_started" as VerificationStatusType,
            verifiedAt: undefined,
            maskedValue: undefined,
         },
         email: {
            status: "not_started" as VerificationStatusType,
            verifiedAt: undefined,
            maskedValue: undefined,
         },
         bank: {
            status: "not_started" as VerificationStatusType,
            verifiedAt: undefined,
            maskedValue: undefined,
         },
      };
   }

   return {
      aadhaar: {
         status: (user.isAadhaarVerified
            ? "verified"
            : "not_started") as VerificationStatusType,
         verifiedAt: user.aadhaarVerifiedAt
            ? new Date(user.aadhaarVerifiedAt)
            : undefined,
         maskedValue: user.maskedAadhaar,
      },
      email: {
         status: (user.isEmailVerified
            ? "verified"
            : "not_started") as VerificationStatusType,
         verifiedAt: user.emailVerifiedAt
            ? new Date(user.emailVerifiedAt)
            : undefined,
         maskedValue: user.email ? maskEmail(user.email) : undefined,
      },
      bank: {
         status: (user.isBankVerified
            ? "verified"
            : "not_started") as VerificationStatusType,
         verifiedAt: user.bankVerifiedAt
            ? new Date(user.bankVerifiedAt)
            : undefined,
         maskedValue: user.bankAccount
            ? `${user.bankAccount.bankName} - ${user.bankAccount.maskedAccountNumber}`
            : undefined,
      },
   };
}

// Helper function to mask email
function maskEmail(email: string): string {
   if (!email) return "";
   const [local, domain] = email.split("@");
   if (!local || !domain) return email;
   if (local.length <= 2) return email;
   return `${local.slice(0, 2)}${"*".repeat(
      Math.min(local.length - 2, 5)
   )}@${domain}`;
}

interface VerificationItemData {
   id: string;
   type: "aadhaar" | "email" | "bank" | "phone";
   title: string;
   description: string;
   verifiedDescription: string;
   icon: React.ReactNode;
   route: string;
   priority: number;
}

const verificationItems: VerificationItemData[] = [
   {
      id: "aadhaar",
      type: "aadhaar",
      title: "Aadhaar Verification",
      description: "Verify your identity with Aadhaar OTP",
      verifiedDescription: "Government ID verified",
      icon: <Fingerprint className="w-5 h-5" />,
      route: "/profile/verify/aadhaar",
      priority: 1,
   },
   {
      id: "email",
      type: "email",
      title: "Email Address",
      description: "Add and verify your email address",
      verifiedDescription: "Email verified",
      icon: <Mail className="w-5 h-5" />,
      route: "/profile/verify/email",
      priority: 2,
   },
   {
      id: "phone",
      type: "phone",
      title: "Phone Number",
      description: "Add and verify your phone number",
      verifiedDescription: "Phone number verified",
      icon: <Phone className="w-5 h-5" />,
      route: "/profile/verify/phone",
      priority: 3,
   },
   {
      id: "bank",
      type: "bank",
      title: "Bank Account",
      description: "Add bank account to receive payments",
      verifiedDescription: "Bank account verified",
      icon: <Building2 className="w-5 h-5" />,
      route: "/profile/verify/bank",
      priority: 4,
   },
];

export default function VerificationsPage({ user }: VerificationsPageProps) {
   const router = useRouter();

   // Get verification status from user or use mock data
   const verificationStatus = getVerificationStatusFromUser(user);

   // Calculate verification progress
   const verifications = verificationItems.map((item) => ({
      ...item,
      ...verificationStatus[item.type],
   }));

   const verifiedCount = verifications.filter(
      (v) => v.status === "verified"
   ).length;
   const totalCount = verifications.length;
   const progressPercent = (verifiedCount / totalCount) * 100;
   const isFullyVerified = verifiedCount === totalCount;

   const handleVerificationAction = (item: VerificationItemData) => {
      router.push(item.route);
   };

   return (
      <div className="min-h-screen bg-slate-50">
         {/* Header */}
         <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-slate-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
               <div className="flex items-center h-14 sm:h-16">
                  <button
                     onClick={() =>
                        router.push("/profile?section=verifications")
                     }
                     className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
                  >
                     <ArrowLeft className="w-5 h-5 text-slate-600" />
                  </button>
                  <h1 className="flex-1 text-center text-sm sm:text-base font-semibold text-slate-900">
                     Verifications
                  </h1>
                  <div className="w-9" />
               </div>
            </div>
         </header>

         {/* Content */}
         <main className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:py-12 space-y-5">
            {/* Hero Section */}
            <div className="text-center pb-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
               <div
                  className={cn(
                     "w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-sm",
                     isFullyVerified ? "bg-green-50" : "bg-amber-50"
                  )}
               >
                  <Shield
                     className={cn(
                        "w-8 h-8 sm:w-10 sm:h-10",
                        isFullyVerified ? "text-green-600" : "text-amber-600"
                     )}
                  />
               </div>
               <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  {isFullyVerified ? "Fully Verified!" : "Build Your Trust"}
               </h2>
               <p className="text-sm text-slate-500 mt-2">
                  {isFullyVerified
                     ? "All verifications complete"
                     : "Complete verifications to unlock all features"}
               </p>
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-100">
               <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">
                     Progress
                  </span>
                  <Badge
                     variant="secondary"
                     className={cn(
                        "text-xs font-medium",
                        isFullyVerified
                           ? "bg-green-50 text-green-700 border-green-200"
                           : "bg-amber-50 text-amber-700 border-amber-200"
                     )}
                  >
                     {verifiedCount}/{totalCount} complete
                  </Badge>
               </div>
               <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                     className={cn(
                        "h-full rounded-full transition-all duration-700 ease-out",
                        isFullyVerified ? "bg-green-500" : "bg-amber-500"
                     )}
                     style={{ width: `${progressPercent}%` }}
                  />
               </div>
            </div>

            {/* Verification Items */}
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300 delay-150">
               {verifications
                  .sort((a, b) => a.priority - b.priority)
                  .map((item, index) => (
                     <VerificationRow
                        key={item.id}
                        item={item}
                        onAction={() => handleVerificationAction(item)}
                        index={index}
                     />
                  ))}
            </div>

            {/* Why Verification Matters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300 delay-200">
               <div className="p-4 sm:p-5 border-b border-slate-100">
                  <h3 className="text-sm font-semibold text-slate-900">
                     Why verification matters
                  </h3>
               </div>
               <div className="p-4 sm:p-5 space-y-3">
                  {[
                     { text: "Build trust with task posters and taskers" },
                     {
                        text: "Access higher value tasks and priority matching",
                     },
                     { text: "Receive payments directly to your bank account" },
                  ].map((item, i) => (
                     <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                           <CheckCircle2 className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-sm text-slate-600">
                           {item.text}
                        </span>
                     </div>
                  ))}
               </div>
            </div>

            {/* Security Notice */}
            <SecurityNotice />
         </main>
      </div>
   );
}

// ============================================
// Verification Row Component
// ============================================

interface VerificationRowProps {
   item: VerificationItemData & {
      status: VerificationStatusType;
      verifiedAt?: Date;
      maskedValue?: string;
   };
   onAction: () => void;
   index: number;
}

function VerificationRow({ item, onAction, index }: VerificationRowProps) {
   const isVerified = item.status === "verified";
   const isPending = item.status === "pending" || item.status === "otp_sent";

   const getActionLabel = () => {
      if (isVerified) return "View";
      if (isPending) return "Continue";
      return "Verify Now";
   };

   const getBgGradient = () => {
      // if (item.type === "aadhaar") return "bg-emerald-50";
      // if (item.type === "email") return "bg-blue-50";
      // if (item.type === "bank") return "bg-violet-50";
      return "bg-slate-100";
   };

   const getIconColor = () => {
      if (isVerified) return "text-green-600";
      // if (item.type === "aadhaar") return "text-emerald-600";
      // if (item.type === "email") return "text-blue-600";
      // if (item.type === "bank") return "text-violet-600";
      return "text-slate-600";
   };

   const getBtnColor = () => {
      // if (item.type === "aadhaar") return "bg-emerald-600 hover:bg-emerald-700";
      // if (item.type === "email") return "bg-blue-600 hover:bg-blue-700";
      // if (item.type === "bank") return "bg-violet-600 hover:bg-violet-700";
      return "bg-primary-600 hover:bg-primary-500";
   };

   return (
      <div
         className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5 transition-all hover:shadow-md cursor-pointer group"
         onClick={onAction}
         style={{ animationDelay: `${index * 50}ms` }}
      >
         <div className="flex items-center gap-3 sm:gap-4">
            {/* Icon */}
            <div
               className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                  isVerified ? "bg-green-50" : getBgGradient()
               )}
            >
               <span className={getIconColor()}>
                  {isVerified ? (
                     <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                  ) : (
                     item.icon
                  )}
               </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                     {item.title}
                  </h3>
                  {isVerified && (
                     <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-green-50 text-green-700 rounded-full border border-green-100">
                        Verified
                     </span>
                  )}
                  {isPending && (
                     <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium bg-amber-50 text-amber-700 rounded-full border border-amber-100">
                        In Progress
                     </span>
                  )}
               </div>

               <p className="text-xs sm:text-sm text-slate-500 mt-0.5 line-clamp-1">
                  {isVerified
                     ? item.maskedValue || item.verifiedDescription
                     : item.description}
               </p>

               {isVerified && item.verifiedAt && (
                  <p className="text-[10px] sm:text-xs text-slate-400 mt-1">
                     {new Date(item.verifiedAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                     })}
                  </p>
               )}
            </div>

            {/* Action */}
            <div className="shrink-0">
               {isVerified ? (
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-400 transition-colors" />
               ) : (
                  <Button
                     size="sm"
                     className={cn(
                        "hidden sm:flex text-xs h-8 px-4 rounded-lg text-white",
                        getBtnColor()
                     )}
                     onClick={(e) => {
                        e.stopPropagation();
                        onAction();
                     }}
                  >
                     {getActionLabel()}
                  </Button>
               )}
            </div>
         </div>

         {/* Mobile Action Button */}
         {!isVerified && (
            <Button
               size="sm"
               className={cn(
                  "w-full mt-3 text-xs h-10 rounded-xl text-white sm:hidden",
                  getBtnColor()
               )}
               onClick={(e) => {
                  e.stopPropagation();
                  onAction();
               }}
            >
               {getActionLabel()}
               <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
         )}
      </div>
   );
}
