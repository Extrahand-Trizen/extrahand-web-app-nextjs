/**
 * Verification Components
 * Reusable UI components for verification flows
 */

"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
   CheckCircle2,
   AlertCircle,
   Clock,
   Shield,
   Lock,
   ArrowLeft,
   ChevronRight,
   Loader2,
} from "lucide-react";
import { VerificationStatusType } from "@/types/verification";

// ============================================
// Verification Page Header
// ============================================

interface VerificationPageHeaderProps {
   title: string;
   subtitle?: string;
   onBack?: () => void;
   currentStep?: number;
   totalSteps?: number;
}

export function VerificationPageHeader({
   title,
   subtitle,
   onBack,
   currentStep,
   totalSteps,
}: VerificationPageHeaderProps) {
   return (
      <div className="border-b border-gray-100 bg-white">
         <div className="max-w-lg mx-auto px-4 py-4 sm:px-6 sm:py-5">
            {/* Back button and progress */}
            <div className="flex items-center justify-between mb-4">
               {onBack ? (
                  <button
                     onClick={onBack}
                     className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  >
                     <ArrowLeft className="w-4 h-4" />
                     <span>Back</span>
                  </button>
               ) : (
                  <div />
               )}

               {currentStep && totalSteps && (
                  <span className="text-xs text-gray-500">
                     Step {currentStep} of {totalSteps}
                  </span>
               )}
            </div>

            {/* Title */}
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
               {title}
            </h1>
            {subtitle && (
               <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
            )}

            {/* Progress bar */}
            {currentStep && totalSteps && (
               <div className="mt-4">
                  <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                     <div
                        className="h-full bg-gray-900 rounded-full transition-all duration-300"
                        style={{
                           width: `${(currentStep / totalSteps) * 100}%`,
                        }}
                     />
                  </div>
               </div>
            )}
         </div>
      </div>
   );
}

// ============================================
// Verification Status Badge
// ============================================

interface VerificationStatusBadgeProps {
   status: VerificationStatusType;
   size?: "sm" | "md";
}

export function VerificationStatusBadge({
   status,
   size = "sm",
}: VerificationStatusBadgeProps) {
   const config: Record<
      VerificationStatusType,
      { icon: React.ReactNode; label: string; className: string }
   > = {
      verified: {
         icon: (
            <CheckCircle2 className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
         ),
         label: "Verified",
         className: "bg-green-50 text-green-700 border-green-200",
      },
      pending: {
         icon: <Clock className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />,
         label: "Pending",
         className: "bg-amber-50 text-amber-700 border-amber-200",
      },
      otp_sent: {
         icon: <Clock className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />,
         label: "OTP Sent",
         className: "bg-blue-50 text-blue-700 border-blue-200",
      },
      otp_verified: {
         icon: <Clock className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />,
         label: "Verifying",
         className: "bg-blue-50 text-blue-700 border-blue-200",
      },
      not_started: {
         icon: (
            <AlertCircle className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
         ),
         label: "Not started",
         className: "bg-gray-50 text-gray-600 border-gray-200",
      },
      failed: {
         icon: (
            <AlertCircle className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
         ),
         label: "Failed",
         className: "bg-red-50 text-red-700 border-red-200",
      },
      expired: {
         icon: <Clock className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />,
         label: "Expired",
         className: "bg-red-50 text-red-700 border-red-200",
      },
   };

   const { icon, label, className } = config[status];

   return (
      <Badge
         variant="outline"
         className={cn(
            "gap-1 font-medium",
            size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1",
            className
         )}
      >
         {icon}
         {label}
      </Badge>
   );
}

// ============================================
// Consent Checkbox
// ============================================

interface ConsentCheckboxProps {
   checked: boolean;
   onCheckedChange: (checked: boolean) => void;
   consentText: string;
   disabled?: boolean;
}

export function ConsentCheckbox({
   checked,
   onCheckedChange,
   consentText,
   disabled = false,
}: ConsentCheckboxProps) {
   return (
      <div className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-100">
         <div className="flex items-start gap-3">
            <div className="flex items-center h-5 mt-0.5">
               <Checkbox
                  id="consent"
                  checked={checked}
                  onCheckedChange={onCheckedChange}
                  disabled={disabled}
                  className="data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900"
               />
            </div>
            <div className="flex-1">
               <label
                  htmlFor="consent"
                  className="text-sm text-gray-700 leading-relaxed cursor-pointer whitespace-pre-line"
               >
                  {consentText}
               </label>
            </div>
         </div>
      </div>
   );
}

// ============================================
// Security Notice
// ============================================

interface SecurityNoticeProps {
   variant?: "default" | "minimal";
}

export function SecurityNotice({ variant = "default" }: SecurityNoticeProps) {
   if (variant === "minimal") {
      return (
         <div className="flex items-center gap-2 text-xs text-gray-500">
            <Lock className="w-3 h-3" />
            <span>Your data is encrypted and secure</span>
         </div>
      );
   }

   return (
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
         <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
               <Shield className="w-4 h-4 text-gray-600" />
            </div>
            <div>
               <h4 className="text-sm font-medium text-gray-900">
                  Your data is protected
               </h4>
               <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  We use bank-grade encryption and comply with data protection
                  regulations. Your information is never shared without your
                  consent.
               </p>
            </div>
         </div>
      </div>
   );
}

// ============================================
// Verification Success State
// ============================================

interface VerificationSuccessProps {
   title: string;
   message: string;
   details?: Array<{ label: string; value: string }>;
   onContinue?: () => void;
   continueLabel?: string;
}

export function VerificationSuccess({
   title,
   message,
   details,
   onContinue,
   continueLabel = "Continue",
}: VerificationSuccessProps) {
   return (
      <div className="text-center py-8 sm:py-12">
         <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
         </div>

         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {title}
         </h2>
         <p className="text-sm text-gray-600 max-w-sm mx-auto">{message}</p>

         {details && details.length > 0 && (
            <div className="mt-6 bg-gray-50 rounded-lg p-4 max-w-xs mx-auto">
               <dl className="space-y-2">
                  {details.map((item, index) => (
                     <div key={index} className="flex justify-between text-sm">
                        <dt className="text-gray-500">{item.label}</dt>
                        <dd className="text-gray-900 font-medium">
                           {item.value}
                        </dd>
                     </div>
                  ))}
               </dl>
            </div>
         )}

         {onContinue && (
            <Button
               onClick={onContinue}
               className="mt-8 bg-gray-900 hover:bg-gray-800"
            >
               {continueLabel}
            </Button>
         )}
      </div>
   );
}

// ============================================
// Verification Error State
// ============================================

interface VerificationErrorProps {
   title: string;
   message: string;
   onRetry?: () => void;
   onCancel?: () => void;
}

export function VerificationError({
   title,
   message,
   onRetry,
   onCancel,
}: VerificationErrorProps) {
   return (
      <div className="text-center py-8 sm:py-12">
         <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-600" />
         </div>

         <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {title}
         </h2>
         <p className="text-sm text-gray-600 max-w-sm mx-auto">{message}</p>

         <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {onCancel && (
               <Button variant="outline" onClick={onCancel}>
                  Cancel
               </Button>
            )}
            {onRetry && (
               <Button
                  onClick={onRetry}
                  className="bg-gray-900 hover:bg-gray-800"
               >
                  Try again
               </Button>
            )}
         </div>
      </div>
   );
}

// ============================================
// Verification Card (for overview page)
// ============================================

interface VerificationCardProps {
   icon: React.ReactNode;
   title: string;
   description: string;
   status: VerificationStatusType;
   verifiedAt?: Date;
   maskedValue?: string;
   actionLabel?: string;
   onAction?: () => void;
   isInline?: boolean;
}

export function VerificationCard({
   icon,
   title,
   description,
   status,
   verifiedAt,
   maskedValue,
   actionLabel,
   onAction,
   isInline = false,
}: VerificationCardProps) {
   const isVerified = status === "verified";
   const isPending = status === "pending" || status === "otp_sent";

   return (
      <div className="p-4 sm:p-5">
         <div className="flex items-start gap-3 sm:gap-4">
            {/* Icon */}
            <div
               className={cn(
                  "w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0",
                  isVerified
                     ? "bg-green-50"
                     : isPending
                     ? "bg-amber-50"
                     : "bg-gray-50"
               )}
            >
               <span
                  className={cn(
                     isVerified
                        ? "text-green-600"
                        : isPending
                        ? "text-amber-600"
                        : "text-gray-400"
                  )}
               >
                  {icon}
               </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
               <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-medium text-gray-900">{title}</h3>
                  <VerificationStatusBadge status={status} />
               </div>

               <p className="text-sm text-gray-500 mt-0.5">
                  {isVerified && maskedValue ? maskedValue : description}
               </p>

               {isVerified && verifiedAt && (
                  <p className="text-xs text-gray-400 mt-1">
                     Verified on {formatDate(verifiedAt)}
                  </p>
               )}
            </div>

            {/* Action */}
            {!isVerified && actionLabel && onAction && (
               <Button
                  variant="outline"
                  size="sm"
                  onClick={onAction}
                  className="hidden sm:flex text-xs h-8 px-3"
               >
                  {actionLabel}
                  {!isInline && <ChevronRight className="w-3 h-3 ml-1" />}
               </Button>
            )}
         </div>

         {/* Mobile action button */}
         {!isVerified && actionLabel && onAction && (
            <Button
               variant="outline"
               size="sm"
               onClick={onAction}
               className="w-full mt-3 text-xs h-9 sm:hidden"
            >
               {actionLabel}
               {!isInline && <ChevronRight className="w-3 h-3 ml-1" />}
            </Button>
         )}
      </div>
   );
}

// ============================================
// Loading Button
// ============================================

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
   loading?: boolean;
   loadingText?: string;
}

export function LoadingButton({
   loading,
   loadingText,
   children,
   disabled,
   ...props
}: LoadingButtonProps) {
   return (
      <Button disabled={loading || disabled} {...props}>
         {loading ? (
            <>
               <Loader2 className="w-4 h-4 animate-spin" />
               {loadingText || "Please wait..."}
            </>
         ) : (
            children
         )}
      </Button>
   );
}

// ============================================
// Input with Label
// ============================================

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
   label: string;
   error?: string;
   hint?: string;
}

export function FormInput({
   label,
   error,
   hint,
   className,
   id,
   ...props
}: FormInputProps) {
   const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

   return (
      <div className="space-y-1.5">
         <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
         >
            {label}
         </label>
         <input
            id={inputId}
            className={cn(
               "w-full h-10 sm:h-11 px-3 rounded-lg border bg-white text-sm",
               "focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-400",
               "placeholder:text-gray-400",
               "disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed",
               error
                  ? "border-red-300 focus:ring-red-500/10 focus:border-red-400"
                  : "border-gray-200",
               className
            )}
            {...props}
         />
         {error && <p className="text-xs text-red-600">{error}</p>}
         {hint && !error && <p className="text-xs text-gray-500">{hint}</p>}
      </div>
   );
}

// ============================================
// Helper Functions
// ============================================

function formatDate(date: Date): string {
   return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
   });
}
