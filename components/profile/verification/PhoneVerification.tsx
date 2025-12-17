/**
 * Phone Verification Component
 * Lightweight inline phone verification within the verifications overview
 */

"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
   InputOTP,
   InputOTPGroup,
   InputOTPSlot,
} from "@/components/ui/input-otp";
import { Phone, CheckCircle2, AlertCircle, X } from "lucide-react";
import { FormInput, LoadingButton } from "./VerificationComponents";

interface PhoneVerificationProps {
   currentPhone?: string;
   isVerified: boolean;
   onVerificationComplete?: () => void;
}

type PhoneStep = "display" | "input" | "otp" | "verified";

export function PhoneVerification({
   currentPhone,
   isVerified,
   onVerificationComplete,
}: PhoneVerificationProps) {
   const [step, setStep] = useState<PhoneStep>(
      isVerified ? "verified" : "display"
   );
   const [phone, setPhone] = useState(currentPhone || "");
   const [otp, setOtp] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | undefined>();
   const [otpTimer, setOtpTimer] = useState(0);

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

   const validatePhone = (phone: string): boolean => {
      // Indian phone number validation (10 digits)
      const phoneRegex = /^[6-9]\d{9}$/;
      return phoneRegex.test(phone.replace(/\s/g, ""));
   };

   const formatPhoneInput = (value: string): string => {
      // Remove non-digits
      const digits = value.replace(/\D/g, "");
      // Limit to 10 digits
      return digits.slice(0, 10);
   };

   const handleSendOtp = async () => {
      const cleanPhone = phone.replace(/\s/g, "");
      if (!validatePhone(cleanPhone)) {
         setError("Please enter a valid 10-digit Indian mobile number");
         return;
      }

      setIsLoading(true);
      setError(undefined);

      try {
         // TODO: Replace with actual API call
         await simulateApiCall(1500);
         setStep("otp");
         setOtpTimer(120); // 2 minutes for SMS OTP
      } catch {
         setError("Failed to send verification code. Please try again.");
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
         // TODO: Replace with actual API call
         await simulateApiCall(1500);
         setStep("verified");
         onVerificationComplete?.();
      } catch {
         setError("Invalid code. Please try again.");
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
         await simulateApiCall(1500);
         setOtpTimer(120);
         setOtp("");
      } catch {
         setError("Failed to resend code. Please try again.");
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
      setPhone(currentPhone || "");
      setOtp("");
      setError(undefined);
   };

   // Verified state
   if (step === "verified") {
      return (
         <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
               <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-green-600" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                     <h3 className="text-sm font-medium text-gray-900">
                        Phone Number
                     </h3>
                     <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                     </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                     +91 {maskPhone(phone || currentPhone || "")}
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
                  <Phone className="w-5 h-5 text-gray-400" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                     <h3 className="text-sm font-medium text-gray-900">
                        Phone Number
                     </h3>
                     <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Not started
                     </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                     {currentPhone
                        ? "Verify your phone number"
                        : "Add and verify your phone"}
                  </p>
               </div>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep("input")}
                  className="hidden sm:flex text-xs h-8 px-3"
               >
                  {currentPhone ? "Verify" : "Add Phone"}
               </Button>
            </div>
            <Button
               variant="outline"
               size="sm"
               onClick={() => setStep("input")}
               className="w-full mt-3 text-xs h-9 sm:hidden"
            >
               {currentPhone ? "Verify Phone" : "Add Phone"}
            </Button>
         </div>
      );
   }

   // Input state (enter phone)
   if (step === "input") {
      return (
         <div className="p-4 sm:p-5 border-l-2 border-gray-900">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-medium text-gray-900">
                  Verify Phone Number
               </h3>
               <button
                  onClick={handleCancel}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
               >
                  <X className="w-4 h-4" />
               </button>
            </div>

            <div className="space-y-4">
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                     Mobile Number
                  </label>
                  <div className="flex">
                     <div className="flex items-center px-3 bg-gray-50 border border-r-0 border-gray-200 rounded-l-lg text-sm text-gray-500">
                        +91
                     </div>
                     <input
                        type="tel"
                        value={phone}
                        onChange={(e) => {
                           setPhone(formatPhoneInput(e.target.value));
                           setError(undefined);
                        }}
                        placeholder="9876543210"
                        className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900"
                     />
                  </div>
                  {error && (
                     <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {error}
                     </p>
                  )}
               </div>

               <p className="text-xs text-gray-500">
                  You will receive an SMS with a verification code
               </p>

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
                     Send OTP
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
            <span className="font-medium text-gray-700">+91 {phone}</span>
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
                  Change Number
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

function maskPhone(phone: string): string {
   if (!phone) return "";
   const digits = phone.replace(/\D/g, "");
   if (digits.length < 10) return phone;
   return `${digits.slice(0, 2)}****${digits.slice(-4)}`;
}

function simulateApiCall(delay: number): Promise<void> {
   return new Promise((resolve) => setTimeout(resolve, delay));
}

export default PhoneVerification;
