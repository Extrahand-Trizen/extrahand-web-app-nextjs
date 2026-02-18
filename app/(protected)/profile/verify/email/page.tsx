/**
 * Email Verification Page
 * Beautiful, responsive OTP-based Email verification
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
   Mail,
   Lock,
   AlertCircle,
   CheckCircle2,
   Shield,
   Clock,
   XCircle,
   RefreshCw,
   Inbox,
   Sparkles,
   Bell,
} from "lucide-react";
import { EMAIL_CONSENT_TEXT } from "@/types/verification";
import { verificationApi } from "@/lib/api/endpoints/verification";
import { useAuth } from "@/lib/auth/context";

interface EmailVerificationState {
   step: "input" | "otp" | "success" | "error";
   email: string;
   otp: string;
   attemptsRemaining: number;
   verificationId?: string;
   error?: string;
   isAlreadyVerified?: boolean;
}

export default function EmailVerificationPage() {
   const router = useRouter();
   const inputRef = useRef<HTMLInputElement>(null);
   const { userData } = useAuth();

   const [state, setState] = useState<EmailVerificationState>({
      step: "input",
      email: "",
      otp: "",
      attemptsRemaining: 5,
   });

   const [isLoading, setIsLoading] = useState(false);
   const [otpTimer, setOtpTimer] = useState(0);

   // Pre-populate email from user profile
   useEffect(() => {
      if (userData?.email) {
         setState((p) => ({ ...p, email: userData.email || "" }));
         // If email is already verified, show success state
         if (userData.isEmailVerified) {
            setState((p) => ({
               ...p,
               email: userData.email || "",
               step: "success",
               isAlreadyVerified: true,
            }));
         }
      }
   }, [userData]);

   useEffect(() => {
      if (state.step === "input" && inputRef.current && !state.email) {
         inputRef.current.focus();
      }
   }, [state.step, state.email]);

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
            router.push("/profile?section=verifications");
            break;
         case "otp":
            setState((p) => ({ ...p, step: "input", otp: "" }));
            break;
         default:
            router.push("/profile?section=verifications");
      }
   };

   const validateEmail = (email: string): boolean => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
   };

   const handleSendOtp = async () => {
      if (!validateEmail(state.email)) {
         setState((p) => ({
            ...p,
            error: "Please enter a valid email address",
         }));
         return;
      }
      setIsLoading(true);
      setState((p) => ({ ...p, error: undefined }));
      try {
         const response = await verificationApi.initiateEmail(state.email, true);
         if (response.success) {
            setState((p) => ({
               ...p,
               step: "otp",
               verificationId: response.data.verificationId,
            }));
            setOtpTimer(response.data.expiresInMinutes * 60);
         } else {
            setState((p) => ({ ...p, error: response.message || "Failed to send verification code" }));
         }
      } catch (err: unknown) {
         const errorMessage = err instanceof Error ? err.message : "Failed to send verification code";
         setState((p) => ({ ...p, error: errorMessage }));
      } finally {
         setIsLoading(false);
      }
   };

   const handleVerifyOtp = async () => {
      if (state.otp.length !== 6) {
         setState((p) => ({ ...p, error: "Please enter complete code" }));
         return;
      }
      setIsLoading(true);
      setState((p) => ({ ...p, error: undefined }));
      try {
         const response = await verificationApi.verifyEmail(state.otp, state.verificationId);
         if (response.success) {
            setState((p) => ({ ...p, step: "success" }));
         } else {
            const newAttempts = state.attemptsRemaining - 1;
            if (newAttempts <= 0) {
               setState((p) => ({
                  ...p,
                  step: "error",
                  error: "Max attempts exceeded",
               }));
            } else {
               setState((p) => ({
                  ...p,
                  attemptsRemaining: newAttempts,
                  otp: "",
                  error: response.message || `Invalid code. ${newAttempts} attempts left.`,
               }));
            }
         }
      } catch (err: unknown) {
         const newAttempts = state.attemptsRemaining - 1;
         const errorMessage = err instanceof Error ? err.message : "Verification failed";
         if (newAttempts <= 0) {
            setState((p) => ({
               ...p,
               step: "error",
               error: "Max attempts exceeded",
            }));
         } else {
            setState((p) => ({
               ...p,
               attemptsRemaining: newAttempts,
               otp: "",
               error: `${errorMessage}. ${newAttempts} attempts left.`,
            }));
         }
      } finally {
         setIsLoading(false);
      }
   };

   const handleResend = async () => {
      if (otpTimer > 0) return;
      setIsLoading(true);
      try {
         const response = await verificationApi.resendEmailOtp();
         if (response.success) {
            setOtpTimer(response.data.expiresInMinutes * 60);
            setState((p) => ({
               ...p,
               otp: "",
               attemptsRemaining: 5,
               verificationId: response.data.verificationId,
               error: undefined,
            }));
         } else {
            setState((p) => ({ ...p, error: response.message || "Failed to resend code" }));
         }
      } catch (err: unknown) {
         const errorMessage = err instanceof Error ? err.message : "Failed to resend code";
         setState((p) => ({ ...p, error: errorMessage }));
      } finally {
         setIsLoading(false);
      }
   };

   const formatTimer = (s: number) =>
      `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

   const stepNum = { input: 1, otp: 2, success: 2, error: 2 }[state.step] || 1;
   const showBack = !["success"].includes(state.step);

   return (
      <div className="min-h-screen bg-linear-to-b from-primary-50/50 via-white to-slate-50">
         {/* Header */}
         <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-slate-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
               <div className="flex items-center h-14 sm:h-16">
                  <h1 className="flex-1 text-center text-sm sm:text-base font-semibold text-slate-900">
                     Email Verification
                  </h1>
               </div>
               {!["success", "error"].includes(state.step) && (
                  <div className="pb-3">
                     <div className="flex gap-1.5">
                        {[1, 2].map((s) => (
                           <div
                              key={s}
                              className={cn(
                                 "h-1 flex-1 rounded-full transition-all",
                                 s <= stepNum ? "bg-primary-600" : "bg-slate-200"
                              )}
                           />
                        ))}
                     </div>
                     <p className="text-[10px] sm:text-xs text-slate-500 mt-2 text-center">
                        Step {stepNum} of 2
                     </p>
                  </div>
               )}
            </div>
         </header>

         {/* Content */}
         <main className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
            {state.step === "input" && (
               <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="text-center pb-2">
                     <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-linear-to-br from-primary-50 to-primary-100 flex items-center justify-center mb-4 shadow-sm">
                        <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
                     </div>
                     <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Verify your email
                     </h2>
                     <p className="text-sm text-slate-500 mt-2">
                        Quick verification via email code
                     </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                     <div className="p-4 sm:p-5 border-b border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-900">
                           Why verify email?
                        </h3>
                     </div>
                     <div className="p-4 sm:p-5 space-y-3">
                        {[
                           {
                              icon: Bell,
                              text: "Receive important notifications",
                           },
                           { icon: Shield, text: "Secure your account" },
                           {
                              icon: Sparkles,
                              text: "Get personalized recommendations",
                           },
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                                 <item.icon className="w-4 h-4 text-primary-600" />
                              </div>
                              <span className="text-sm text-slate-700">
                                 {item.text}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                     <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                           Email Address
                        </span>
                        <input
                           ref={inputRef}
                           type="email"
                           value={state.email}
                           onChange={(e) =>
                              setState((p) => ({
                                 ...p,
                                 email: e.target.value,
                                 error: undefined,
                              }))
                           }
                           placeholder="you@example.com"
                           className={cn(
                              "mt-2 w-full px-4 py-3.5 text-base border rounded-xl focus:outline-none focus:ring-2 transition-all",
                              state.error
                                 ? "border-red-300 focus:ring-red-500"
                                 : "border-slate-200 focus:ring-primary-500"
                           )}
                        />
                     </label>
                     {state.error && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-red-600">
                           <AlertCircle className="w-4 h-4" />
                           <span>{state.error}</span>
                        </div>
                     )}
                     <p className="text-xs text-slate-500 mt-3">
                        {EMAIL_CONSENT_TEXT}
                     </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                     <Lock className="w-3.5 h-3.5" />
                     <span>Your email is kept private</span>
                  </div>

                  <Button
                     onClick={handleSendOtp}
                     disabled={!state.email.trim() || isLoading}
                     className="w-full h-12 text-sm font-medium bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-500 rounded-xl"
                  >
                     {isLoading ? (
                        <span className="flex items-center gap-2">
                           <RefreshCw className="w-4 h-4 animate-spin" />
                           Sending code...
                        </span>
                     ) : (
                        "Send Verification Code"
                     )}
                  </Button>
               </div>
            )}

            {state.step === "otp" && (
               <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center">
                     <div className="w-14 h-14 mx-auto rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                        <Inbox className="w-7 h-7 text-primary-600" />
                     </div>
                     <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                        Check your inbox
                     </h2>
                     <p className="text-sm text-slate-500 mt-1">
                        Enter the 6-digit code sent to
                     </p>
                     <p className="text-sm font-medium text-slate-900 mt-1">
                        {state.email}
                     </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                     <div className="flex justify-center">
                        <InputOTP
                           maxLength={6}
                           value={state.otp}
                           onChange={(v) =>
                              setState((p) => ({
                                 ...p,
                                 otp: v,
                                 error: undefined,
                              }))
                           }
                        >
                           <InputOTPGroup className="gap-1.5 sm:gap-2">
                              {[0, 1, 2, 3, 4, 5].map((i) => (
                                 <InputOTPSlot
                                    key={i}
                                    index={i}
                                    className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-lg border-slate-200"
                                 />
                              ))}
                           </InputOTPGroup>
                        </InputOTP>
                     </div>
                     {state.error && (
                        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-red-600">
                           <AlertCircle className="w-4 h-4" />
                           <span>{state.error}</span>
                        </div>
                     )}
                     <div className="mt-5 text-center">
                        {otpTimer > 0 ? (
                           <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
                              <Clock className="w-4 h-4" />
                              <span>
                                 Resend in{" "}
                                 <span className="font-medium text-slate-700">
                                    {formatTimer(otpTimer)}
                                 </span>
                              </span>
                           </div>
                        ) : (
                           <button
                              onClick={handleResend}
                              disabled={isLoading}
                              className="text-sm font-medium text-primary-600 hover:underline disabled:opacity-50"
                           >
                              Resend Code
                           </button>
                        )}
                     </div>
                     {state.attemptsRemaining < 3 && (
                        <p className="text-xs text-center text-amber-600 mt-2">
                           {state.attemptsRemaining} attempt
                           {state.attemptsRemaining > 1 ? "s" : ""} left
                        </p>
                     )}
                  </div>

                  <div className="bg-primary-50 rounded-xl p-4">
                     <p className="text-xs text-primary-700 text-center">
                        Can&apos;t find the email? Check your spam folder or try
                        resending.
                     </p>
                  </div>

                  <Button
                     onClick={handleVerifyOtp}
                     disabled={state.otp.length !== 6 || isLoading}
                     className="w-full h-12 text-sm font-medium bg-primary-600 hover:bg-primary-500 disabled:bg-slate-200 disabled:text-slate-500 rounded-xl"
                  >
                     {isLoading ? (
                        <span className="flex items-center gap-2">
                           <RefreshCw className="w-4 h-4 animate-spin" />
                           Verifying...
                        </span>
                     ) : (
                        "Verify Email"
                     )}
                  </Button>
               </div>
            )}

            {state.step === "success" && (
               <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="text-center">
                     <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center mb-5 shadow-lg shadow-green-100">
                        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                     </div>
                     <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Email Verified!
                     </h2>
                     <p className="text-sm text-slate-500 mt-2">
                        Your email has been successfully verified
                     </p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                     <div className="p-4 sm:p-5 border-b border-slate-100 bg-primary-50/50">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <Mail className="w-5 h-5 text-primary-600" />
                           </div>
                           <div>
                              <p className="text-xs text-primary-600 font-medium">
                                 Verified Email
                              </p>
                              <p className="text-sm font-semibold text-slate-900">
                                 {state.email}
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="p-4 sm:p-5">
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-slate-500">
                              Verified on
                           </span>
                           <span className="text-sm font-medium text-slate-900">
                              {new Date().toLocaleDateString("en-IN", {
                                 day: "numeric",
                                 month: "short",
                                 year: "numeric",
                              })}
                           </span>
                        </div>
                     </div>
                  </div>
                  <Button
                     onClick={() => router.push("/profile?section=verifications")}
                     className="w-full h-12 text-sm font-medium bg-primary-600 hover:bg-primary-500 rounded-xl"
                  >
                     Back to Verifications
                  </Button>
               </div>
            )}

            {state.step === "error" && (
               <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="text-center">
                     <div className="w-20 h-20 mx-auto rounded-full bg-linear-to-br from-red-50 to-rose-100 flex items-center justify-center mb-5 shadow-lg shadow-red-100">
                        <XCircle className="w-10 h-10 text-red-500" />
                     </div>
                     <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Verification Failed
                     </h2>
                     <p className="text-sm text-slate-500 mt-2">
                        {state.error}
                     </p>
                  </div>
                  <div className="space-y-3">
                     <Button
                        onClick={() =>
                           setState({
                              step: "input",
                              email: "",
                              otp: "",
                              attemptsRemaining: 3,
                           })
                        }
                        className="w-full h-12 text-sm font-medium bg-primary-600 hover:bg-primary-700 rounded-xl"
                     >
                        Try Again
                     </Button>
                     <Button
                        onClick={() => router.push("/profile?section=verifications")}
                        variant="outline"
                        className="w-full h-12 text-sm font-medium rounded-xl"
                     >
                        Cancel
                     </Button>
                  </div>
               </div>
            )}
         </main>
      </div>
   );
}
