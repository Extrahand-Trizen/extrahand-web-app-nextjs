"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ShieldCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerificationPromptProps {
   type: "phone" | "email" | "aadhaar" | "pan" | "bank";
   message: string;
   actionText?: string;
   onDismiss?: () => void;
   variant?: "default" | "destructive" | "warning";
   className?: string;
}

const VERIFICATION_ROUTES = {
   phone: "/profile/verify/phone",
   email: "/profile/verify/email",
   aadhaar: "/profile/verify/aadhaar",
   pan: "/profile/verify/pan",
   bank: "/profile/verify/bank",
};

const VERIFICATION_ICONS = {
   phone: "📱",
   email: "✉️",
   aadhaar: "🆔",
   pan: "🏦",
   bank: "💳",
};

export function VerificationPrompt({
   type,
   message,
   actionText,
   onDismiss,
   variant = "warning",
   className,
}: VerificationPromptProps) {
   const router = useRouter();

   const handleVerify = () => {
      router.push(VERIFICATION_ROUTES[type]);
   };

   return (
      <Alert
         className={cn(
            "relative border-2",
            variant === "warning" && "border-yellow-400 bg-yellow-50",
            variant === "destructive" && "border-red-400 bg-red-50",
            variant === "default" && "border-blue-400 bg-blue-50",
            className
         )}
      >
         {onDismiss && (
            <button
               onClick={onDismiss}
               className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
               <X className="h-4 w-4" />
            </button>
         )}
         <AlertCircle className="h-5 w-5" />
         <AlertDescription className="flex items-start justify-between gap-4">
            <div className="flex-1">
               <p className="font-medium mb-1 flex items-center gap-2">
                  <span className="text-xl">{VERIFICATION_ICONS[type]}</span>
                  Verification Required
               </p>
               <p className="text-sm text-gray-700">{message}</p>
            </div>
            <Button
               onClick={handleVerify}
               size="sm"
               className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold whitespace-nowrap"
            >
               {actionText || `Verify ${type.charAt(0).toUpperCase() + type.slice(1)}`}
            </Button>
         </AlertDescription>
      </Alert>
   );
}

interface MultiVerificationPromptProps {
   missing: string[];
   context: "posting" | "applying" | "starting" | "withdrawal";
   onDismiss?: () => void;
   className?: string;
}

const CONTEXT_MESSAGES = {
   posting: "You need to verify the following to post tasks:",
   applying: "You need to verify the following to apply for tasks:",
   starting: "You need to verify the following before starting this task:",
   withdrawal: "You need to verify the following to withdraw payments:",
};

export function MultiVerificationPrompt({
   missing,
   context,
   onDismiss,
   className,
}: MultiVerificationPromptProps) {
   const router = useRouter();

   if (missing.length === 0) return null;

   const handleVerifyAll = () => {
      // Navigate to the first missing verification
      const firstMissing = missing[0].toLowerCase() as keyof typeof VERIFICATION_ROUTES;
      if (VERIFICATION_ROUTES[firstMissing]) {
         router.push(VERIFICATION_ROUTES[firstMissing]);
      }
   };

   return (
      <Alert
         className={cn(
            "relative border-2 border-yellow-400 bg-yellow-50",
            className
         )}
      >
         {onDismiss && (
            <button
               onClick={onDismiss}
               className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
               <X className="h-4 w-4" />
            </button>
         )}
         <ShieldCheck className="h-5 w-5 text-yellow-600" />
         <AlertDescription>
            <div className="space-y-3">
               <div>
                  <p className="font-semibold text-gray-900 mb-2">
                     Verification Required
                  </p>
                  <p className="text-sm text-gray-700 mb-2">
                     {CONTEXT_MESSAGES[context]}
                  </p>
               </div>
               <div className="flex flex-wrap gap-2">
                  {missing.map((item) => {
                     const type = item.toLowerCase() as keyof typeof VERIFICATION_ICONS;
                     return (
                        <div
                           key={item}
                           className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-yellow-300 rounded-md"
                        >
                           <span className="text-lg">
                              {VERIFICATION_ICONS[type] || "🔒"}
                           </span>
                           <span className="text-sm font-medium text-gray-800">
                              {item}
                           </span>
                        </div>
                     );
                  })}
               </div>
               <Button
                  onClick={handleVerifyAll}
                  size="sm"
                  className="bg-primary-500 hover:bg-primary-600 text-secondary-900 font-semibold"
               >
                  Start Verification
               </Button>
            </div>
         </AlertDescription>
      </Alert>
   );
}
