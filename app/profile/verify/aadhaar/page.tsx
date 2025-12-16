/**
 * Aadhaar Verification Page
 * Beautiful, responsive OTP-based Aadhaar verification
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
   InputOTPSeparator,
} from "@/components/ui/input-otp";
import {
   Fingerprint,
   Lock,
   AlertCircle,
   Info,
   ArrowLeft,
   CheckCircle2,
   Shield,
   Clock,
   XCircle,
   RefreshCw,
   Smartphone,
} from "lucide-react";
import {
   AadhaarVerificationState,
   AADHAAR_CONSENT,
} from "@/types/verification";

export default function AadhaarVerificationPage() {
   const router = useRouter();
   const inputRef = useRef<HTMLInputElement>(null);

   const [state, setState] = useState<AadhaarVerificationState>({
      step: "consent",
      aadhaarNumber: "",
      consentGiven: false,
      otpSent: false,
      otp: "",
      attemptsRemaining: 3,
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
         case "consent":
            router.push("/profile/verify");
            break;
         case "input":
            setState((p) => ({ ...p, step: "consent" }));
            break;
         case "otp":
            setState((p) => ({ ...p, step: "input", otp: "" }));
            break;
         default:
            router.push("/profile/verify");
      }
   };

   const handleAadhaarSubmit = async () => {
      const clean = state.aadhaarNumber.replace(/\s/g, "");
      if (clean.length !== 12 || !/^\d+$/.test(clean)) {
         setState((p) => ({
            ...p,
            error: "Please enter a valid 12-digit Aadhaar number",
         }));
         return;
      }
      setIsLoading(true);
      setState((p) => ({ ...p, error: undefined }));
      try {
         await new Promise((r) => setTimeout(r, 1500));
         setState((p) => ({ ...p, step: "otp", otpSent: true }));
         setOtpTimer(600);
      } catch {
         setState((p) => ({ ...p, error: "Failed to send OTP" }));
      } finally {
         setIsLoading(false);
      }
   };

   const handleOtpSubmit = async () => {
      if (state.otp.length !== 6) {
         setState((p) => ({ ...p, error: "Please enter complete OTP" }));
         return;
      }
      setIsLoading(true);
      setState((p) => ({ ...p, error: undefined }));
      try {
         await new Promise((r) => setTimeout(r, 2000));
         setState((p) => ({
            ...p,
            step: "success",
            verifiedData: {
               name: "Anita Kapoor",
               maskedAadhaar: "XXXX XXXX 4321",
            },
         }));
      } catch {
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
               error: `Invalid OTP. ${newAttempts} attempts left.`,
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
         await new Promise((r) => setTimeout(r, 1500));
         setOtpTimer(600);
         setState((p) => ({
            ...p,
            otp: "",
            attemptsRemaining: 3,
            error: undefined,
         }));
      } catch {
         setState((p) => ({ ...p, error: "Failed to resend" }));
      } finally {
         setIsLoading(false);
      }
   };

   const formatTimer = (s: number) =>
      `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
   const formatAadhaar = (v: string) => {
      const d = v.replace(/\D/g, "").slice(0, 12);
      return d.match(/.{1,4}/g)?.join(" ") || "";
   };

   const stepNum =
      { consent: 1, input: 2, otp: 3, success: 3, error: 3 }[state.step] || 1;
   const showBack = !["success"].includes(state.step);

   return (
      <div className="min-h-screen bg-slate-50">
         {/* Header */}
         <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-slate-100">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
               <div className="flex items-center h-14 sm:h-16">
                  {showBack && (
                     <button
                        onClick={handleBack}
                        className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
                     >
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                     </button>
                  )}
                  <h1 className="flex-1 text-center text-sm sm:text-base font-semibold text-slate-900">
                     Aadhaar Verification
                  </h1>
                  {showBack && <div className="w-9" />}
               </div>
               {!["success", "error"].includes(state.step) && (
                  <div className="pb-3">
                     <div className="flex gap-1.5">
                        {[1, 2, 3].map((s) => (
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
                        Step {stepNum} of 3
                     </p>
                  </div>
               )}
            </div>
         </header>

         {/* Content */}
         <main className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
            {state.step === "consent" && (
               <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="text-center pb-2">
                     <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center mb-4 shadow-sm">
                        <Fingerprint className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
                     </div>
                     <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Verify your identity
                     </h2>
                     <p className="text-sm text-slate-500 mt-2">
                        Quick & secure via Aadhaar OTP
                     </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                     <div className="p-4 sm:p-5 border-b border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-900">
                           Why verify?
                        </h3>
                     </div>
                     <div className="p-4 sm:p-5 space-y-3">
                        {[
                           {
                              icon: Shield,
                              text: "Build trust with other users",
                           },
                           {
                              icon: CheckCircle2,
                              text: "Access higher value tasks",
                           },
                           {
                              icon: Lock,
                              text: "Required for payments above ₹10,000",
                           },
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                                 <item.icon className="w-4 h-4 text-slate-600" />
                              </div>
                              <span className="text-sm text-slate-700">
                                 {item.text}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
                     <h3 className="text-sm font-semibold text-slate-900 mb-4">
                        How it works
                     </h3>
                     {[
                        {
                           title: "Enter Aadhaar",
                           desc: "Your number is encrypted",
                        },
                        {
                           title: "Receive OTP",
                           desc: "On Aadhaar-linked mobile",
                        },
                        { title: "Verify", desc: "Only masked details stored" },
                     ].map((step, i) => (
                        <div key={i} className="flex gap-3 pb-3 last:pb-0">
                           <div className="flex flex-col items-center">
                              <div className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-medium">
                                 {i + 1}
                              </div>
                              {i < 2 && (
                                 <div className="w-px h-full bg-primary-200 my-1" />
                              )}
                           </div>
                           <div className="pt-0.5">
                              <p className="text-sm font-medium text-slate-900">
                                 {step.title}
                              </p>
                              <p className="text-xs text-slate-500">
                                 {step.desc}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>

                  <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
                     <input
                        type="checkbox"
                        checked={state.consentGiven}
                        onChange={(e) =>
                           setState((p) => ({
                              ...p,
                              consentGiven: e.target.checked,
                           }))
                        }
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                     />
                     <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        <p className="mt-2">{AADHAAR_CONSENT.paragraph}</p>
                        <ul className="list-disc pl-4 space-y-1">
                           {AADHAAR_CONSENT.points.map((p, i) => (
                              <li key={i}>{p}</li>
                           ))}
                        </ul>
                     </div>
                  </label>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                     <Lock className="w-3.5 h-3.5" />
                     <span>256-bit SSL encrypted • UIDAI compliant</span>
                  </div>

                  <Button
                     onClick={() =>
                        state.consentGiven &&
                        setState((p) => ({ ...p, step: "input" }))
                     }
                     disabled={!state.consentGiven}
                     className="w-full h-12 text-sm font-medium bg-primary-500 hover:bg-primary-600 disabled:bg-slate-200 disabled:text-slate-500 rounded-xl"
                  >
                     Continue
                  </Button>
               </div>
            )}

            {state.step === "input" && (
               <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center">
                     <div className="w-14 h-14 mx-auto rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                        <Fingerprint className="w-7 h-7 text-slate-600" />
                     </div>
                     <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                        Enter Aadhaar number
                     </h2>
                     <p className="text-sm text-slate-500 mt-1">
                        OTP will be sent to linked mobile
                     </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                     <label className="block">
                        <span className="text-sm font-medium text-slate-700">
                           Aadhaar Number
                        </span>
                        <input
                           ref={inputRef}
                           type="text"
                           value={state.aadhaarNumber}
                           onChange={(e) =>
                              setState((p) => ({
                                 ...p,
                                 aadhaarNumber: formatAadhaar(e.target.value),
                                 error: undefined,
                              }))
                           }
                           placeholder="0000 0000 0000"
                           maxLength={14}
                           inputMode="numeric"
                           className={cn(
                              "mt-2 w-full px-4 py-3.5 text-lg font-mono tracking-wider text-center border rounded-xl focus:outline-none focus:ring-2 transition-all",
                              state.error
                                 ? "border-red-300 focus:ring-red-500"
                                 : "border-slate-200 focus:ring-slate-900"
                           )}
                        />
                     </label>
                     {state.error && (
                        <div className="flex items-center gap-2 mt-3 text-sm text-red-600">
                           <AlertCircle className="w-4 h-4" />
                           <span>{state.error}</span>
                        </div>
                     )}
                     <div className="flex items-start gap-2 mt-4 p-3 bg-primary-50 rounded-lg">
                        <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-primary-700">
                           Ensure access to Aadhaar-linked mobile
                        </p>
                     </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                     <Lock className="w-3.5 h-3.5" />
                     <span>Your Aadhaar is never stored</span>
                  </div>

                  <Button
                     onClick={handleAadhaarSubmit}
                     disabled={
                        state.aadhaarNumber.replace(/\s/g, "").length !== 12 ||
                        isLoading
                     }
                     className="w-full h-12 text-sm font-medium bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-500 rounded-xl"
                  >
                     {isLoading ? (
                        <span className="flex items-center gap-2">
                           <RefreshCw className="w-4 h-4 animate-spin" />
                           Sending OTP...
                        </span>
                     ) : (
                        "Send OTP"
                     )}
                  </Button>
               </div>
            )}

            {state.step === "otp" && (
               <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center">
                     <div className="w-14 h-14 mx-auto rounded-xl bg-amber-50 flex items-center justify-center mb-4">
                        <Smartphone className="w-7 h-7 text-amber-600" />
                     </div>
                     <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                        Verify OTP
                     </h2>
                     <p className="text-sm text-slate-500 mt-1">
                        Enter 6-digit code sent to Aadhaar linked mobile
                     </p>
                     <p className="text-xs font-medium text-slate-700 mt-2">
                        XXXX XXXX{" "}
                        {state.aadhaarNumber.replace(/\s/g, "").slice(-4)}
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
                              <InputOTPSlot
                                 index={0}
                                 className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-lg border-slate-200"
                              />
                              <InputOTPSlot
                                 index={1}
                                 className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-lg border-slate-200"
                              />
                              <InputOTPSlot
                                 index={2}
                                 className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-lg border-slate-200"
                              />
                           </InputOTPGroup>
                           <InputOTPSeparator className="mx-1 sm:mx-2" />
                           <InputOTPGroup className="gap-1.5 sm:gap-2">
                              <InputOTPSlot
                                 index={3}
                                 className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-lg border-slate-200"
                              />
                              <InputOTPSlot
                                 index={4}
                                 className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-lg border-slate-200"
                              />
                              <InputOTPSlot
                                 index={5}
                                 className="w-10 h-12 sm:w-12 sm:h-14 text-lg rounded-lg border-slate-200"
                              />
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
                              className="text-sm font-medium text-slate-900 hover:underline disabled:opacity-50"
                           >
                              Resend OTP
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

                  <Button
                     onClick={handleOtpSubmit}
                     disabled={state.otp.length !== 6 || isLoading}
                     className="w-full h-12 text-sm font-medium bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-500 rounded-xl"
                  >
                     {isLoading ? (
                        <span className="flex items-center gap-2">
                           <RefreshCw className="w-4 h-4 animate-spin" />
                           Verifying...
                        </span>
                     ) : (
                        "Verify"
                     )}
                  </Button>
               </div>
            )}

            {state.step === "success" && (
               <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="text-center">
                     <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-5 shadow-lg shadow-green-100">
                        <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
                     </div>
                     <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Verification Complete!
                     </h2>
                     <p className="text-sm text-slate-500 mt-2">
                        Your identity has been verified
                     </p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                     <div className="p-4 sm:p-5 border-b border-slate-100 bg-primary-50/50">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <Fingerprint className="w-5 h-5 text-primary-600" />
                           </div>
                           <div>
                              <p className="text-xs text-primary-600 font-medium">
                                 Aadhaar Verified
                              </p>
                              <p className="text-sm font-semibold text-slate-900">
                                 {state.verifiedData?.name}
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="p-4 sm:p-5 space-y-3">
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-slate-500">
                              Aadhaar
                           </span>
                           <span className="text-sm font-medium text-slate-900 font-mono">
                              {state.verifiedData?.maskedAadhaar}
                           </span>
                        </div>
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
                     onClick={() => router.push("/profile/verify")}
                     className="w-full h-12 text-sm font-medium bg-primary-600 hover:bg-primary-500 rounded-xl"
                  >
                     Back to Verifications
                  </Button>
               </div>
            )}

            {state.step === "error" && (
               <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                  <div className="text-center">
                     <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-5 shadow-lg shadow-red-100">
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
                              step: "consent",
                              aadhaarNumber: "",
                              consentGiven: false,
                              otpSent: false,
                              otp: "",
                              attemptsRemaining: 3,
                           })
                        }
                        className="w-full h-12 text-sm font-medium bg-slate-900 hover:bg-slate-800 rounded-xl"
                     >
                        Try Again
                     </Button>
                     <Button
                        onClick={() => router.push("/profile/verify")}
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
