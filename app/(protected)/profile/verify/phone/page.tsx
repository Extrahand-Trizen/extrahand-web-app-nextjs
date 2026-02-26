/**
 * Phone Verification Page
 * Beautiful, responsive OTP-based Phone verification
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
   InputOTP,
   InputOTPGroup,
   InputOTPSlot,
} from "@/components/ui/input-otp";
import {
   Phone,
   Lock,
   AlertCircle,
   CheckCircle2,
   Shield,
   Clock,
   XCircle,
   RefreshCw,
   MessageSquare,
   Sparkles,
   Bell,
} from "lucide-react";

interface PhoneVerificationState {
   step: "input" | "otp" | "success" | "error";
   phone: string;
   otp: string;
   attemptsRemaining: number;
   error?: string;
}

export default function PhoneVerificationPage() {
   const router = useRouter();
   const inputRef = useRef<HTMLInputElement>(null);

   const [state, setState] = useState<PhoneVerificationState>({
      step: "input",
      phone: "",
      otp: "",
      attemptsRemaining: 5,
   });

   const [isLoading, setIsLoading] = useState(false);
   const [otpTimer, setOtpTimer] = useState(0);

   useEffect(() => {
      if (state.step === "input" && inputRef.current) {
         inputRef.current.focus();
      }
   }, [state.step]);

   useEffect(() => {
      let interval: NodeJS.Timeout;
      if (otpTimer > 0) {
         interval = setInterval(() => setOtpTimer((p) => p - 1), 1000);
      }
      return () => clearInterval(interval);
   }, [otpTimer]);

   const handleBack = () => {
      switch (state.step) {
         case "input":
            router.push("/profile/verify");
            break;
         case "otp":
            setState((p) => ({ ...p, step: "input", otp: "" }));
            break;
         default:
            router.push("/profile/verify");
      }
   };

   const validatePhone = (phone: string): boolean => {
      const phoneRegex = /^[6-9]\d{9}$/;
      return phoneRegex.test(phone.replace(/\s/g, ""));
   };

   const formatPhoneInput = (value: string): string => {
      return value.replace(/\D/g, "").slice(0, 10);
   };

   const handleSendOTP = async () => {
      const cleanPhone = state.phone.replace(/\s/g, "");
      if (!validatePhone(cleanPhone)) {
         setState((p) => ({
            ...p,
            error: "Please enter a valid 10-digit Indian mobile number",
         }));
         return;
      }

      setIsLoading(true);
      setState((p) => ({ ...p, error: undefined }));

      try {
         // TODO: Replace with actual API call
         await new Promise((r) => setTimeout(r, 1500));
         setState((p) => ({ ...p, step: "otp" }));
         setOtpTimer(300); // 5 minutes for SMS OTP
      } catch {
         setState((p) => ({
            ...p,
            error: "Failed to send OTP. Please try again.",
         }));
      } finally {
         setIsLoading(false);
      }
   };

   const handleVerifyOTP = async () => {
      if (state.otp.length !== 6) {
         setState((p) => ({
            ...p,
            error: "Please enter the complete 6-digit code",
         }));
         return;
      }

      setIsLoading(true);
      setState((p) => ({ ...p, error: undefined }));

      try {
         // TODO: Replace with actual API verification
         await new Promise((r) => setTimeout(r, 1500));
         setState((p) => ({ ...p, step: "success" }));
      } catch {
         const remaining = state.attemptsRemaining - 1;
         if (remaining <= 0) {
            setState((p) => ({ ...p, step: "error" }));
         } else {
            setState((p) => ({
               ...p,
               otp: "",
               attemptsRemaining: remaining,
               error: `Invalid code. ${remaining} attempts remaining.`,
            }));
         }
      } finally {
         setIsLoading(false);
      }
   };

   const handleResendOTP = async () => {
      if (otpTimer > 0) return;
      setIsLoading(true);
      try {
         await new Promise((r) => setTimeout(r, 1500));
         setOtpTimer(300);
         setState((p) => ({ ...p, otp: "", error: undefined }));
      } catch {
         setState((p) => ({ ...p, error: "Failed to resend OTP." }));
      } finally {
         setIsLoading(false);
      }
   };

   const formatTimer = (secs: number) => {
      const m = Math.floor(secs / 60);
      const s = secs % 60;
      return `${m}:${s.toString().padStart(2, "0")}`;
   };

   // ========================================
   // Render Functions
   // ========================================

   const renderInputStep = () => (
      <div className="space-y-6">
         {/* Phone Input */}
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
               Mobile Number
            </label>
            <div className="flex">
               <div className="flex items-center px-4 bg-gray-50 border border-r-0 border-gray-200 rounded-l-xl text-sm text-gray-500 font-medium">
                  +91
               </div>
               <input
                  ref={inputRef}
                  type="tel"
                  value={state.phone}
                  onChange={(e) =>
                     setState((p) => ({
                        ...p,
                        phone: formatPhoneInput(e.target.value),
                        error: undefined,
                     }))
                  }
                  placeholder="9876543210"
                  className={cn(
                     "flex-1 px-4 py-3 text-base border rounded-r-xl transition-all duration-200",
                     "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                     state.error
                        ? "border-red-300 bg-red-50/50"
                        : "border-gray-200"
                  )}
               />
            </div>
            {state.error && (
               <p className="text-sm text-red-600 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {state.error}
               </p>
            )}
         </div>

         {/* Info Box */}
         <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <p className="text-sm text-gray-600">
               You&apos;ll receive a 6-digit verification code via SMS
            </p>
            <div className="flex items-start gap-2 text-xs text-gray-500">
               <Shield className="w-4 h-4 mt-0.5 text-primary-500" />
               <span>
                  Your number is secure and will only be used for account
                  verification and important notifications
               </span>
            </div>
         </div>

         {/* Benefits */}
         <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
               Why verify your phone?
            </p>
            <div className="grid grid-cols-1 gap-2">
               {[
                  {
                     icon: Shield,
                     text: "Secure your account with 2FA",
                  },
                  {
                     icon: Bell,
                     text: "Get instant task notifications",
                  },
                  {
                     icon: MessageSquare,
                     text: "Communicate with taskers easily",
                  },
               ].map((item, i) => (
                  <div
                     key={i}
                     className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg"
                  >
                     <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-primary-600" />
                     </div>
                     <span className="text-sm text-gray-700">{item.text}</span>
                  </div>
               ))}
            </div>
         </div>

         {/* Submit Button */}
         <Button
            onClick={handleSendOTP}
            disabled={isLoading || state.phone.length !== 10}
            className="w-full h-12 text-base font-medium bg-primary-500 hover:bg-primary-600"
         >
            {isLoading ? (
               <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Sending OTP...
               </div>
            ) : (
               "Send Verification Code"
            )}
         </Button>
      </div>
   );

   const renderOTPStep = () => (
      <div className="space-y-6">
         {/* OTP Info */}
         <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-2">
               <MessageSquare className="w-8 h-8 text-primary-600" />
            </div>
            <p className="text-sm text-gray-600">
               We&apos;ve sent a 6-digit code to
            </p>
            <p className="text-base font-semibold text-gray-900">
               +91 {state.phone}
            </p>
         </div>

         {/* OTP Input */}
         <div className="flex justify-center">
            <InputOTP
               maxLength={6}
               value={state.otp}
               onChange={(value) =>
                  setState((p) => ({ ...p, otp: value, error: undefined }))
               }
            >
               <InputOTPGroup className="gap-2 sm:gap-3">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                     <InputOTPSlot
                        key={i}
                        index={i}
                        className={cn(
                           "w-10 h-12 sm:w-12 sm:h-14 text-lg sm:text-xl font-semibold rounded-xl border-2 transition-all",
                           state.error
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 focus:border-primary-500"
                        )}
                     />
                  ))}
               </InputOTPGroup>
            </InputOTP>
         </div>

         {/* Error */}
         {state.error && (
            <div className="flex items-center justify-center gap-2 text-sm text-red-600">
               <AlertCircle className="w-4 h-4" />
               {state.error}
            </div>
         )}

         {/* Timer / Resend */}
         <div className="text-center">
            {otpTimer > 0 ? (
               <p className="text-sm text-gray-500">
                  Resend code in{" "}
                  <span className="font-semibold text-gray-900">
                     {formatTimer(otpTimer)}
                  </span>
               </p>
            ) : (
               <button
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50"
               >
                  Didn&apos;t receive the code? Resend
               </button>
            )}
         </div>

         {/* Attempts Warning */}
         {state.attemptsRemaining < 5 && (
            <div className="flex items-center justify-center gap-2 text-sm text-amber-600 bg-amber-50 rounded-lg p-3">
               <Clock className="w-4 h-4" />
               {state.attemptsRemaining} attempts remaining
            </div>
         )}

         {/* Verify Button */}
         <Button
            onClick={handleVerifyOTP}
            disabled={isLoading || state.otp.length !== 6}
            className="w-full h-12 text-base font-medium bg-primary-500 hover:bg-primary-600"
         >
            {isLoading ? (
               <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
               </div>
            ) : (
               "Verify Code"
            )}
         </Button>

         {/* Change Number */}
         <button
            onClick={() => setState((p) => ({ ...p, step: "input", otp: "" }))}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
         >
            Change phone number
         </button>
      </div>
   );

   const renderSuccessStep = () => (
      <div className="text-center space-y-6 py-8">
         <div className="relative inline-flex">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
               <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
               <Sparkles className="w-4 h-4 text-yellow-600" />
            </div>
         </div>

         <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
               Phone Verified Successfully!
            </h2>
            <p className="text-gray-600">
               Your phone number <strong>+91 {state.phone}</strong> has been
               verified.
            </p>
         </div>

         <div className="bg-primary-50 rounded-xl p-4 text-left space-y-2">
            <p className="text-sm font-medium text-primary-800">
               You&apos;ve unlocked:
            </p>
            <ul className="space-y-2 text-sm text-primary-700">
               <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Two-factor authentication
               </li>
               <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  SMS notifications for tasks
               </li>
               <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Direct communication with taskers
               </li>
            </ul>
         </div>

         <div className="flex flex-col gap-3">
            <Button
               onClick={() => router.push("/profile")}
               className="w-full h-12 text-base font-medium bg-primary-600 hover:bg-primary-500"
            >
               Continue to Profile
            </Button>
            <Button
               variant="outline"
               onClick={() => router.push("/profile/verify")}
               className="w-full h-12 text-base"
            >
               Complete More Verifications
            </Button>
         </div>
      </div>
   );

   const renderErrorStep = () => (
      <div className="text-center space-y-6 py-8">
         <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-10 h-10 text-red-600" />
         </div>

         <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
               Verification Failed
            </h2>
            <p className="text-gray-600">
               Too many incorrect attempts. Please try again later.
            </p>
         </div>

         <div className="bg-red-50 rounded-xl p-4 text-sm text-red-700">
            For security reasons, please wait 10 minutes before trying again.
         </div>

         <Button
            variant="outline"
            onClick={() => router.push("/profile/verify")}
            className="w-full h-12 text-base"
         >
            Back to Verifications
         </Button>
      </div>
   );

   // ========================================
   // Main Render
   // ========================================

   return (
      <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
         {/* Header */}
         <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
               <h1 className="text-base font-semibold text-gray-900">
                  Phone Verification
               </h1>
            </div>
         </div>

         {/* Progress Steps */}
         {state.step !== "success" && state.step !== "error" && (
            <div className="max-w-5xl mx-auto px-4 pt-6">
               <div className="flex items-center gap-2">
                  <div
                     className={cn(
                        "flex-1 h-1.5 rounded-full transition-colors",
                        state.step === "input"
                           ? "bg-primary-500"
                           : "bg-primary-500"
                     )}
                  />
                  <div
                     className={cn(
                        "flex-1 h-1.5 rounded-full transition-colors",
                        state.step === "otp" ? "bg-primary-500" : "bg-gray-200"
                     )}
                  />
               </div>
               <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Enter Phone</span>
                  <span>Verify OTP</span>
               </div>
            </div>
         )}

         {/* Content */}
         <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Title */}
            {state.step !== "success" && state.step !== "error" && (
               <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 mb-4">
                     <Phone className="w-7 h-7 text-primary-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                     Verify Your Phone
                  </h1>
                  <p className="text-gray-500 mt-2">
                     Secure your account with phone verification
                  </p>
               </div>
            )}

            {/* Steps */}
            {state.step === "input" && renderInputStep()}
            {state.step === "otp" && renderOTPStep()}
            {state.step === "success" && renderSuccessStep()}
            {state.step === "error" && renderErrorStep()}
         </div>

         {/* Security Footer */}
         {state.step !== "success" && state.step !== "error" && (
            <div className="max-w-lg mx-auto px-4 pb-8">
               <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Secured with end-to-end encryption</span>
               </div>
            </div>
         )}
      </div>
   );
}
