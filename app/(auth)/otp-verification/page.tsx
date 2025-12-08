"use client";

/**
 * OTP Verification Page
 * Phone number verification with OTP (Optional)
 * NO API CALLS - Just routing
 * Matches: web-apps/extrahand-web-app/src/OTPVerificationScreen.tsx
 */

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatPhoneNumber } from "@/lib/utils/phone";

const OTP_LENGTH = 6;

const maskPhone = (phone: string) => {
   if (!phone) return "";
   // If phone is already in E.164 format (+91XXXXXXXXXX), mask it properly
   if (phone.startsWith("+91") && phone.length === 13) {
      const digits = phone.substring(3); // Get digits after +91
      return `+91 ${digits.slice(0, 2)}******${digits.slice(-2)}`;
   }
   // Fallback for other formats
   const digits = phone.replace(/\D/g, "");
   if (digits.length < 6) return phone;
   if (digits.startsWith("91") && digits.length === 12) {
      return `+91 ${digits.slice(2, 4)}******${digits.slice(-2)}`;
   }
   return `+91 ${digits.slice(0, 2)}******${digits.slice(-2)}`;
};

export default function OTPVerificationPage() {
   const router = useRouter();
   const searchParams = useSearchParams();
   const rawPhone = searchParams.get("phone") || "";
   // Format the phone number from URL parameter
   const initialPhone = rawPhone ? formatPhoneNumber(rawPhone) : "";

   const [currentPhone, setCurrentPhone] = useState<string>(initialPhone);
   const [isEditingPhone, setIsEditingPhone] = useState<boolean>(false);
   const [phoneInput, setPhoneInput] = useState<string>(rawPhone); // Keep raw input for editing
   const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
   const [timer, setTimer] = useState(30);
   const [sending, setSending] = useState(false);
   const [verifying, setVerifying] = useState(false);
   const [otpSent, setOtpSent] = useState<boolean>(false);

   const inputRefs = [
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
      useRef<HTMLInputElement>(null),
   ];

   useEffect(() => {
      if (timer > 0 && otpSent) {
         const interval = setInterval(() => setTimer((t) => t - 1), 1000);
         return () => clearInterval(interval);
      }
   }, [timer, otpSent]);

   const focusIndex = (i: number) => {
      if (i >= 0 && i < OTP_LENGTH) {
         inputRefs[i].current?.focus();
      }
   };

   const handleChange = (text: string, idx: number) => {
      const digits = (text || "").replace(/\D/g, "");
      if (digits.length <= 1) {
         const next = [...otp];
         next[idx] = digits;
         setOtp(next);
         if (digits && idx < OTP_LENGTH - 1) focusIndex(idx + 1);
         return;
      }
      const next = [...otp];
      let i = idx;
      for (const d of digits.split("")) {
         if (i >= OTP_LENGTH) break;
         next[i] = d;
         i += 1;
      }
      setOtp(next);
      focusIndex(Math.min(i, OTP_LENGTH - 1));
   };

   const handleKeyPress = (e: React.KeyboardEvent, idx: number) => {
      if (e.key === "Backspace" && !otp[idx] && idx > 0) {
         focusIndex(idx - 1);
      }
   };

   const handleResend = () => {
      if (!currentPhone) {
         alert("Please enter a valid phone number.");
         return;
      }
      // Mock: Just show OTP sent state
      setOtpSent(true);
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimer(30);
      focusIndex(0);
   };

   const handleSendOtp = () => {
      if (!currentPhone) {
         alert("Please enter a valid phone number.");
         return;
      }
      // Mock: Just show OTP sent state (no actual API call)
      setSending(true);
      setTimeout(() => {
         setOtpSent(true);
         setOtp(Array(OTP_LENGTH).fill(""));
         setTimer(30);
         setSending(false);
         focusIndex(0);
      }, 500);
   };

   const handleVerify = () => {
      const code = otp.join("");
      if (code.length !== OTP_LENGTH) {
         alert("Please enter the complete 6-digit code.");
         return;
      }

      if (!otpSent) {
         alert("Please send OTP first.");
         return;
      }

      setVerifying(true);

      // Mock verification - just navigate after a short delay
      setTimeout(() => {
         // Navigate to location selection screen
         router.push("/onboarding/choose-location-method");
         setVerifying(false);
      }, 500);
   };

   const handleUpdatePhone = () => {
      if (!phoneInput || phoneInput.trim().length < 10) {
         alert("Please enter a valid phone number.");
         return;
      }
      // Format the phone number before saving
      const formattedPhone = formatPhoneNumber(phoneInput);
      setCurrentPhone(formattedPhone);
      setIsEditingPhone(false);
   };

   const handleSkip = () => {
      // Skip OTP verification and go directly to location selection screen
      router.push("/onboarding/choose-location-method");
   };

   return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
         <Card padding="lg" shadow="lg" className="w-full max-w-[480px]">
            <h1 className="text-2xl font-bold text-secondary-900 mb-1 text-center">
               Verify Phone
            </h1>
            <p className="text-sm text-secondary-500 mb-2 text-center">
               {currentPhone
                  ? `Enter the code sent to ${maskPhone(currentPhone)}`
                  : "Phone verification is optional"}
            </p>
            <p className="text-xs text-secondary-400 mb-8 text-center">
               You can skip this step and verify later
            </p>

            {isEditingPhone ? (
               <div className="space-y-4 mb-6">
                  <div>
                     <label className="block text-sm font-medium text-secondary-700 mb-1">
                        Phone Number
                     </label>
                     <input
                        type="tel"
                        placeholder="8985******"
                        value={phoneInput}
                        onChange={(e) => setPhoneInput(e.target.value)}
                        className="w-full px-4 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                     />
                  </div>
                  <div className="flex gap-2">
                     <Button
                        variant="primary"
                        onClick={handleSendOtp}
                        disabled={sending}
                     >
                        {sending ? <LoadingSpinner size="sm" /> : "Send OTP"}
                     </Button>
                     <Button
                        variant="outline"
                        onClick={() => setIsEditingPhone(false)}
                     >
                        Cancel
                     </Button>
                  </div>
               </div>
            ) : (
               <>
                  {currentPhone && (
                     <button
                        onClick={() => setIsEditingPhone(true)}
                        className="text-sm text-primary-500 font-semibold mb-6 block mx-auto"
                     >
                        Change Phone Number
                     </button>
                  )}

                  {!otpSent && currentPhone && (
                     <div className="mb-6">
                        <Button
                           variant="outline"
                           fullWidth
                           onClick={handleSendOtp}
                           disabled={sending}
                           className="mb-4"
                        >
                           {sending ? <LoadingSpinner size="sm" /> : "Send OTP"}
                        </Button>
                     </div>
                  )}

                  {otpSent && (
                     <>
                        <div className="flex justify-center gap-2 mb-6">
                           {otp.map((digit, idx) => (
                              <input
                                 key={idx}
                                 ref={inputRefs[idx]}
                                 type="text"
                                 inputMode="numeric"
                                 maxLength={1}
                                 value={digit}
                                 onChange={(e) =>
                                    handleChange(e.target.value, idx)
                                 }
                                 onKeyDown={(e) => handleKeyPress(e, idx)}
                                 className="w-12 h-14 text-center text-2xl font-bold border-2 border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                           ))}
                        </div>

                        <Button
                           variant="primary"
                           fullWidth
                           onClick={handleVerify}
                           disabled={
                              verifying || otp.join("").length !== OTP_LENGTH
                           }
                           className="mb-4"
                        >
                           {verifying ? <LoadingSpinner size="sm" /> : "Verify"}
                        </Button>

                        <div className="text-center mb-4">
                           {timer > 0 ? (
                              <p className="text-sm text-secondary-500">
                                 Resend code in {timer}s
                              </p>
                           ) : (
                              <button
                                 onClick={handleResend}
                                 disabled={sending}
                                 className="text-sm text-primary-500 font-semibold hover:underline"
                              >
                                 {sending ? "Sending..." : "Resend OTP"}
                              </button>
                           )}
                        </div>
                     </>
                  )}

                  {/* Skip Button - Always visible */}
                  <div className="mt-6 pt-6 border-t border-secondary-200">
                     <Button
                        variant="outline"
                        fullWidth
                        onClick={handleSkip}
                        className="text-secondary-700 border-secondary-300 hover:bg-secondary-50"
                     >
                        Skip for Now
                     </Button>
                  </div>
               </>
            )}

            <div className="mt-6 text-center">
               <Link href="/login" className="text-sm text-secondary-700">
                  Back to Login
               </Link>
            </div>
         </Card>

         {/* reCAPTCHA container */}
         <div id="recaptcha-container" style={{ display: "none" }}></div>
      </div>
   );
}
