/**
 * Email Verification Component
 * Lightweight inline email verification within the verifications overview
 */

"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
   InputOTP,
   InputOTPGroup,
   InputOTPSlot,
} from "@/components/ui/input-otp";
import { Mail, CheckCircle2, AlertCircle, X, Loader2 } from "lucide-react";
import { FormInput, LoadingButton } from "./VerificationComponents";
import { verificationApi } from "@/lib/api/endpoints/verification";

interface EmailVerificationProps {
   currentEmail?: string;
   isVerified: boolean;
   onVerificationComplete?: () => void;
}

type EmailStep = "display" | "input" | "otp" | "verified";

export function EmailVerification({
   currentEmail,
   isVerified,
   onVerificationComplete,
}: EmailVerificationProps) {
   const [step, setStep] = useState<EmailStep>(
      isVerified ? "verified" : "display"
   );
   const [email, setEmail] = useState(currentEmail || "");
   const [otp, setOtp] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | undefined>();
   const [otpTimer, setOtpTimer] = useState(0);
   const [verificationId, setVerificationId] = useState<string | undefined>();

   // OTP countdown timer
   useEffect(() => {
      let interval: NodeJS.Timeout;
      if (otpTimer > 0) {
         interval = setInterval(() => {
            setOtpTimer((prev) => prev - 1);
         }, 1000);
      }
      return () => clearInterval(interval);
   }, [otpTimer]);

   const validateEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
   };

   const handleSendOtp = async () => {
      if (!validateEmail(email)) {
         setError("Please enter a valid email address");
         return;
      }

      setIsLoading(true);
      setError(undefined);

      try {
         const response = await verificationApi.initiateEmail(email, true);
         if (response.success) {
            setVerificationId(response.data?.verificationId);
            setStep("otp");
            setOtpTimer((response.data?.expiresInMinutes || 5) * 60);
         } else {
            setError(response.message || "Failed to send verification code.");
         }
      } catch (err: unknown) {
         const message = err instanceof Error ? err.message : "Failed to send verification code.";
         setError(message);
      } finally {
         setIsLoading(false);
      }
   };

   const handleVerifyOtp = async () => {
      if (otp.length !== 6) {
         setError("Please enter the complete 6-digit code");
         return;
      }

      setIsLoading(true);
      setError(undefined);

      try {
         const response = await verificationApi.verifyEmail(otp, verificationId);
         if (response.success) {
            setStep("verified");
            onVerificationComplete?.();
         } else {
            setError(response.message || "Invalid code. Please try again.");
            setOtp("");
         }
      } catch (err: unknown) {
         const message = err instanceof Error ? err.message : "Invalid code. Please try again.";
         setError(message);
         setOtp("");
      } finally {
         setIsLoading(false);
      }
   };

   const handleResendOtp = async () => {
      if (otpTimer > 0) return;

      setIsLoading(true);
      setError(undefined);

      try {
         const response = await verificationApi.resendEmailOtp();
         if (response.success) {
            setVerificationId(response.data?.verificationId || verificationId);
            setOtpTimer((response.data?.expiresInMinutes || 5) * 60);
            setOtp("");
         } else {
            setError(response.message || "Failed to resend code. Please try again.");
         }
      } catch (err: unknown) {
         const message = err instanceof Error ? err.message : "Failed to resend code. Please try again.";
         setError(message);
      } finally {
         setIsLoading(false);
      }
   };

   const formatTimer = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
   };

   const handleCancel = () => {
      setStep("display");
      setEmail(currentEmail || "");
      setOtp("");
      setError(undefined);
      setVerificationId(undefined);
   };

   // Verified state
   if (step === "verified") {
      return (
         <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
               <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-green-600" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                     <h3 className="text-sm font-medium text-gray-900">
                        Email Address
                     </h3>
                     <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                     </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                     {maskEmail(email || currentEmail || "")}
                  </p>
               </div>
               <div className="hidden sm:flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
               </div>
            </div>
         </div>
      );
   }

   // Display state (not verified, show add button)
   if (step === "display") {
      return (
         <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
               <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-gray-400" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                     <h3 className="text-sm font-medium text-gray-900">
                        Email Address
                     </h3>
                     <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Not started
                     </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                     {currentEmail
                        ? "Verify your email address"
                        : "Add and verify your email"}
                  </p>
               </div>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep("input")}
                  className="hidden sm:flex text-xs h-8 px-3"
               >
                  {currentEmail ? "Verify" : "Add Email"}
               </Button>
            </div>
            <Button
               variant="outline"
               size="sm"
               onClick={() => setStep("input")}
               className="w-full mt-3 text-xs h-9 sm:hidden"
            >
               {currentEmail ? "Verify Email" : "Add Email"}
            </Button>
         </div>
      );
   }

   // Input state (enter email)
   if (step === "input") {
      return (
         <div className="p-4 sm:p-5 border-l-2 border-gray-900">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-medium text-gray-900">
                  Verify Email Address
               </h3>
               <button
                  onClick={handleCancel}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
               >
                  <X className="w-4 h-4" />
               </button>
            </div>

            <div className="space-y-4">
               <FormInput
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(e) => {
                     setEmail(e.target.value);
                     setError(undefined);
                  }}
                  placeholder="you@example.com"
                  error={error}
               />

               <div className="flex gap-3">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={handleCancel}
                     className="flex-1 h-9"
                  >
                     Cancel
                  </Button>
                  <LoadingButton
                     size="sm"
                     onClick={handleSendOtp}
                     loading={isLoading}
                     loadingText="Sending..."
                     className="flex-1 h-9 bg-gray-900 hover:bg-gray-800"
                  >
                     Send Code
                  </LoadingButton>
               </div>
            </div>
         </div>
      );
   }

   // OTP state (enter verification code)
   return (
      <div className="p-4 sm:p-5 border-l-2 border-gray-900">
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">
               Enter Verification Code
            </h3>
            <button
               onClick={handleCancel}
               className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
               <X className="w-4 h-4" />
            </button>
         </div>

         <p className="text-xs text-gray-500 mb-4">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-gray-700">{email}</span>
         </p>

         <div className="space-y-4">
            {/* OTP Input */}
            <div className="flex justify-center">
               <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => {
                     setOtp(value);
                     setError(undefined);
                  }}
               >
                  <InputOTPGroup className="gap-2">
                     <InputOTPSlot index={0} className="w-9 h-10 text-base" />
                     <InputOTPSlot index={1} className="w-9 h-10 text-base" />
                     <InputOTPSlot index={2} className="w-9 h-10 text-base" />
                     <InputOTPSlot index={3} className="w-9 h-10 text-base" />
                     <InputOTPSlot index={4} className="w-9 h-10 text-base" />
                     <InputOTPSlot index={5} className="w-9 h-10 text-base" />
                  </InputOTPGroup>
               </InputOTP>
            </div>

            {/* Error */}
            {error && (
               <p className="text-xs text-red-600 text-center flex items-center justify-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {error}
               </p>
            )}

            {/* Timer / Resend */}
            <div className="text-center">
               {otpTimer > 0 ? (
                  <p className="text-xs text-gray-500">
                     Resend code in{" "}
                     <span className="font-medium">
                        {formatTimer(otpTimer)}
                     </span>
                  </p>
               ) : (
                  <button
                     onClick={handleResendOtp}
                     disabled={isLoading}
                     className="text-xs text-gray-900 font-medium hover:underline disabled:opacity-50"
                  >
                     Resend code
                  </button>
               )}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep("input")}
                  className="flex-1 h-9"
               >
                  Change Email
               </Button>
               <LoadingButton
                  size="sm"
                  onClick={handleVerifyOtp}
                  loading={isLoading}
                  loadingText="Verifying..."
                  disabled={otp.length !== 6}
                  className="flex-1 h-9 bg-gray-900 hover:bg-gray-800"
               >
                  Verify
               </LoadingButton>
            </div>
         </div>
      </div>
   );
}

// ============================================
// Helper Functions
// ============================================

function maskEmail(email: string): string {
   if (!email) return "";
   const [local, domain] = email.split("@");
   if (!local || !domain) return email;
   if (local.length <= 2) return email;
   return `${local.slice(0, 2)}${"*".repeat(
      Math.min(local.length - 2, 5)
   )}@${domain}`;
}

export default EmailVerification;
