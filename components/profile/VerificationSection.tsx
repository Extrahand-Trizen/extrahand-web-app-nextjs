// VerificationSection.tsx - Complete Mobile Responsive
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   CheckCircle2,
   AlertCircle,
   Clock,
   Phone,
   Mail,
   Fingerprint,
   Building2,
   Shield,
   ChevronRight,
   ExternalLink,
} from "lucide-react";
import { UserProfile } from "@/types/user";
import { VerificationStatus } from "@/types/profile";

interface VerificationSectionProps {
   user: UserProfile;
   onVerify: (type: string) => void;
}

interface VerificationItem {
   id: string;
   type: string;
   label: string;
   description: string;
   icon: React.ReactNode;
   status: VerificationStatus;
   verifiedAt?: Date;
   whyItMatters: string;
   action?: string;
   route?: string;
}

export function VerificationSection({
   user,
   onVerify,
}: VerificationSectionProps) {
   const router = useRouter();

   const verifications: VerificationItem[] = [
      {
         id: "phone",
         type: "phone",
         label: "Phone Number",
         description: user.phone
            ? `+91 ${maskPhone(user.phone)}`
            : "Not provided",
         icon: <Phone className="w-4 h-4 sm:w-5 sm:h-5" />,
         status: user.phone ? "verified" : "not_started",
         whyItMatters: "Required for task communications and account recovery",
         action: user.phone ? undefined : "Add Phone Number",
      },
      {
         id: "email",
         type: "email",
         label: "Email Address",
         description: user.isEmailVerified
            ? maskEmail(user.email || "")
            : user.email
            ? "Verification pending"
            : "Not provided",
         icon: <Mail className="w-4 h-4 sm:w-5 sm:h-5" />,
         status: user.isEmailVerified ? "verified" : "not_started",
         verifiedAt: user.emailVerifiedAt
            ? new Date(user.emailVerifiedAt)
            : undefined,
         whyItMatters: "Receive important updates and notifications",
         action: user.isEmailVerified ? undefined : "Verify Email",
         route: "/profile/verify/email",
      },
      {
         id: "aadhaar",
         type: "aadhaar",
         label: "Aadhaar Verification",
         description: user.isAadhaarVerified
            ? user.maskedAadhaar || "Identity verified"
            : "Government ID verification",
         icon: <Fingerprint className="w-4 h-4 sm:w-5 sm:h-5" />,
         status: user.isAadhaarVerified ? "verified" : "not_started",
         verifiedAt: user.aadhaarVerifiedAt
            ? new Date(user.aadhaarVerifiedAt)
            : undefined,
         whyItMatters:
            "Builds trust with other users and unlocks higher task values",
         action: user.isAadhaarVerified ? undefined : "Verify Aadhaar",
         route: "/profile/verify/aadhaar",
      },
      {
         id: "bank",
         type: "bank",
         label: "Bank Account",
         description:
            user.isBankVerified && user.bankAccount
               ? `${user.bankAccount.bankName} - ${user.bankAccount.maskedAccountNumber}`
               : "Add bank account for payouts",
         icon: <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />,
         status: user.isBankVerified ? "verified" : "not_started",
         verifiedAt: user.bankVerifiedAt
            ? new Date(user.bankVerifiedAt)
            : undefined,
         whyItMatters: "Required to receive payments for completed tasks",
         action: user.isBankVerified ? undefined : "Add Bank Account",
         route: "/profile/verify/bank",
      },
   ];

   const verifiedCount = verifications.filter(
      (v) => v.status === "verified"
   ).length;
   const totalCount = verifications.length;

   return (
      <div className="max-w-2xl space-y-4 sm:space-y-6">
         {/* Header */}
         <div>
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
               Verifications
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
               Verify your identity to build trust and unlock more features
            </p>
         </div>

         {/* Summary Card */}
         <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2 sm:gap-3">
                  <div
                     className={cn(
                        "w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shrink-0",
                        verifiedCount === totalCount
                           ? "bg-green-100"
                           : "bg-amber-100"
                     )}
                  >
                     <Shield
                        className={cn(
                           "w-5 h-5 sm:w-6 sm:h-6",
                           verifiedCount === totalCount
                              ? "text-green-600"
                              : "text-amber-600"
                        )}
                     />
                  </div>
                  <div>
                     <h3 className="text-xs sm:text-sm font-medium text-gray-900">
                        Verification Status
                     </h3>
                     <p className="text-xs sm:text-sm text-gray-500">
                        {verifiedCount} of {totalCount} verifications complete
                     </p>
                  </div>
               </div>
               <Badge
                  variant="secondary"
                  className={cn(
                     "text-[10px] sm:text-xs shrink-0",
                     verifiedCount === totalCount
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                  )}
               >
                  {verifiedCount === totalCount
                     ? "Fully Verified"
                     : "Incomplete"}
               </Badge>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
               <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                     className={cn(
                        "h-full rounded-full transition-all",
                        verifiedCount === totalCount
                           ? "bg-green-500"
                           : "bg-amber-500"
                     )}
                     style={{ width: `${(verifiedCount / totalCount) * 100}%` }}
                  />
               </div>
            </div>
         </div>

         {/* Verification Items */}
         <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
            {verifications.map((item) => (
               <VerificationRow
                  key={item.id}
                  item={item}
                  onVerify={() => {
                     if (item.route) {
                        router.push(item.route);
                     } else {
                        onVerify(item.type);
                     }
                  }}
               />
            ))}
         </div>

         {/* View All Link */}
         <div className="flex justify-center">
            <Button
               variant="ghost"
               size="sm"
               onClick={() => router.push("/profile/verify")}
               className="text-xs text-gray-500 hover:text-gray-700"
            >
               View All Verifications
               <ExternalLink className="w-3 h-3 ml-1.5" />
            </Button>
         </div>

         {/* Trust Info */}
         <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
            <h3 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">
               Why Verification Matters
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
               <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Verified profiles get 3x more task offers</span>
               </li>
               <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>
                     Access higher value tasks with complete verification
                  </span>
               </li>
               <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 shrink-0" />
                  <span>Build trust with task posters and taskers</span>
               </li>
            </ul>
         </div>
      </div>
   );
}

interface VerificationRowProps {
   item: VerificationItem;
   onVerify: () => void;
}

function VerificationRow({ item, onVerify }: VerificationRowProps) {
   return (
      <div className="px-4 py-3 sm:px-5 sm:py-4">
         <div className="flex items-start gap-3 sm:gap-4">
            <div
               className={cn(
                  "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0",
                  item.status === "verified" ? "bg-green-100" : "bg-gray-100"
               )}
            >
               <span
                  className={cn(
                     item.status === "verified"
                        ? "text-green-600"
                        : "text-gray-400"
                  )}
               >
                  {item.icon}
               </span>
            </div>

            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                     {item.label}
                  </h4>
                  <StatusBadge status={item.status} />
               </div>
               <p className="text-xs sm:text-sm text-gray-500 mt-0.5 truncate">
                  {item.description}
               </p>
               <p className="text-[10px] sm:text-xs text-gray-400 mt-1 line-clamp-2">
                  {item.whyItMatters}
               </p>
            </div>

            {item.action && (
               <Button
                  variant="outline"
                  size="sm"
                  onClick={onVerify}
                  className="shrink-0 text-xs h-8 px-2 sm:px-3 hidden sm:flex"
               >
                  {item.action}
               </Button>
            )}

            {item.status === "verified" && item.verifiedAt && (
               <span className="text-[10px] sm:text-xs text-gray-400 shrink-0 hidden sm:block">
                  {formatDate(item.verifiedAt)}
               </span>
            )}
         </div>

         {/* Mobile action button */}
         {item.action && (
            <Button
               variant="outline"
               size="sm"
               onClick={onVerify}
               className="w-full mt-3 text-xs h-8 sm:hidden"
            >
               {item.action}
               <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
         )}
      </div>
   );
}

interface StatusBadgeProps {
   status: VerificationStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
   const config = {
      verified: {
         icon: <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
         label: "Verified",
         className: "bg-green-100 text-green-700",
      },
      pending: {
         icon: <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
         label: "Pending",
         className: "bg-amber-100 text-amber-700",
      },
      not_started: {
         icon: <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
         label: "Not Started",
         className: "bg-gray-100 text-gray-600",
      },
      failed: {
         icon: <AlertCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
         label: "Failed",
         className: "bg-red-100 text-red-700",
      },
      expired: {
         icon: <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3" />,
         label: "Expired",
         className: "bg-red-100 text-red-700",
      },
   };

   const { icon, label, className } = config[status];

   return (
      <Badge
         variant="secondary"
         className={cn("text-[10px] sm:text-xs gap-1 shrink-0", className)}
      >
         {icon}
         {label}
      </Badge>
   );
}

// Helper functions
function maskPhone(phone: string): string {
   const digits = phone.replace(/\D/g, "");
   if (digits.length >= 10) {
      return `${digits.slice(0, 2)}****${digits.slice(-4)}`;
   }
   return phone;
}

function maskEmail(email: string): string {
   const [local, domain] = email.split("@");
   if (local.length > 2) {
      return `${local.slice(0, 2)}***@${domain}`;
   }
   return email;
}

function formatDate(date: Date): string {
   return date.toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
   });
}

export default VerificationSection;
