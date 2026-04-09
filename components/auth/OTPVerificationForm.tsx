"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
   Loader2,
   CheckCircle2,
   Shield,
   Smartphone,
   RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useOTP } from "@/hooks/useOTP";
import { authApi } from "@/lib/api/endpoints/auth";
import { referralsApi } from "@/lib/api/endpoints/referrals";
import { useAuth } from "@/lib/auth/context";
import { sessionManager } from "@/lib/auth/session";
import { setOTPAuthInProgress } from "@/lib/auth/authFlowState";
import { isLocalTestMode, isTestPhone, DUMMY_OTP } from "@/lib/auth/devOtp";
import { useUserStore } from "@/lib/state/userStore";
import { formatPhoneNumber } from "@/lib/utils/phone";

const OTP_LENGTH = 6;
const INVALID_OTP_TOAST_MESSAGE =
   "Invalid OTP. Please enter the correct 6-digit code and try again.";

const isInvalidOtpFailure = (code?: string, message?: string) => {
   const normalizedCode = (code || "").toLowerCase();
   const normalizedMessage = (message || "").toLowerCase();

   return (
      normalizedCode === "auth/invalid-verification-code" ||
      normalizedCode === "auth/invalid-code" ||
      normalizedCode === "auth/code-mismatch" ||
      normalizedMessage.includes("invalid-verification-code") ||
      normalizedMessage.includes("invalid verification code") ||
      normalizedMessage.includes("code-mismatch")
   );
};

interface OTPVerificationFormProps {
   phone: string;
   userName?: string;
   authType?: "login" | "signup";
   redirectTo?: string;
   onSuccess?: () => void;
}

const maskPhone = (phone: string) => {
   if (!phone) return "";
   const digits = phone.replace(/\D/g, "");
   if (digits.length < 6) return phone;
   if (digits.startsWith("91") && digits.length === 12) {
      return `+91 ${digits.slice(2, 4)}****${digits.slice(-2)}`;
   }
   return `+91 ${digits.slice(0, 2)}****${digits.slice(-2)}`;
};

export function OTPVerificationForm({
   phone,
   userName = "",
   authType = "login",
   redirectTo = "",
   onSuccess,
}: OTPVerificationFormProps) {
   const router = useRouter();
   const { refreshUserData } = useAuth();
   const loginToStore = useUserStore((state) => state.login);

   const finalRedirectTo =
      redirectTo ||
      (authType === "signup" ? "/onboarding/goal-selection" : "/home");
   const hasAttemptedInitialSend = useRef(false);
   const lastSentPhone = useRef<string | null>(null);

   // Use the useOTP hook for state management
   const {
      otp,
      setOtp,
      timer,
      sending,
      verifying,
      verifyOTP: verifyOTPWithFirebase,
      sendOtp,
      resetTimer,
      clearSession,
   } = useOTP(phone, authType);

   const [isVerified, setIsVerified] = useState(false);
   const [hasError, setHasError] = useState(false);
   const [isFocused, setIsFocused] = useState(false);
   const isVerifyingRef = useRef(false); // Prevent duplicate verification attempts
   const verificationCompletedRef = useRef(false); // Track if verification succeeded

   // Single real input that Chrome autofill targets
   const singleOtpRef = useRef<HTMLInputElement | null>(null);

   // Focus the single real input (accepts optional idx for backward compat, ignores it)
   const focusInput = useCallback((_idx?: number) => {
      singleOtpRef.current?.focus();
   }, []);

   const applyOtpCode = useCallback(
      (rawCode: string) => {
         const digits = rawCode.replace(/\D/g, "").slice(0, OTP_LENGTH);
         if (!digits) return;

         const otpArray = digits.split("");
         const newOtp = Array(OTP_LENGTH).fill("");
         otpArray.forEach((digit, i) => {
            newOtp[i] = digit;
         });

         setHasError(false);
         setOtp(newOtp);
         focusInput(Math.min(otpArray.length - 1, OTP_LENGTH - 1));
      },
      [focusInput, setOtp]
   );

   // Poll the single real input DOM value directly.
   // Chrome Android autofill sometimes sets the DOM value without firing React
   // synthetic events on controlled inputs — reading .value directly catches those.
   useEffect(() => {
      const existingCode = otp.join("");
      if (existingCode.length === OTP_LENGTH) return;

      const intervalId = setInterval(() => {
         const rawValue = singleOtpRef.current?.value || "";
         const digits = rawValue.replace(/\D/g, "").slice(0, OTP_LENGTH);
         if (digits.length === OTP_LENGTH) {
            applyOtpCode(digits);
         }
      }, 100);

      return () => clearInterval(intervalId);
   }, [applyOtpCode, otp]);

   const applyPendingReferralCode = useCallback(async () => {
      if (authType !== "signup" || typeof window === "undefined") return;
      const pendingReferralCode = sessionStorage.getItem("pendingReferralCode");
      if (!pendingReferralCode) return;
      try {
         await referralsApi.applyReferralCode(pendingReferralCode);
         sessionStorage.removeItem("pendingReferralCode");
         toast.success("Referral code applied!", {
            description: "Complete a task worth ₹500+ to unlock rewards.",
         });
      } catch (error: any) {
         console.error("Failed to apply referral code:", error);
         sessionStorage.removeItem("pendingReferralCode");
         toast.error("Could not apply referral code", {
            description: "You can apply it later from your profile.",
         });
      }
   }, [authType]);

   // Initial auto-send OTP
   useEffect(() => {
      // Only send if:
      // 1. We have a phone number
      // 2. We haven't attempted initial send yet
      // 3. The phone number is different from the last one we sent to
      if (!phone || hasAttemptedInitialSend.current || lastSentPhone.current === phone) {
         return;
      }

      // Debounce to prevent rapid-fire calls from React Strict Mode or re-renders
      const timeoutId = setTimeout(() => {
         // Double-check conditions after debounce
         if (phone && !hasAttemptedInitialSend.current && lastSentPhone.current !== phone) {
            hasAttemptedInitialSend.current = true;
            lastSentPhone.current = phone;
            handleSendOtp(phone);
         }
      }, 100); // 100ms debounce

      return () => clearTimeout(timeoutId);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [phone]);

   // Auto-verify when OTP is complete
   useEffect(() => {
      const code = otp.join("");
      // Prevent duplicate verification attempts - call handleVerify and let it manage the flag
      if (code.length === OTP_LENGTH && !verifying && !isVerified && !isVerifyingRef.current) {
         handleVerify();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [otp, verifying, isVerified]);

   // Keep the single OTP input focused on mount so Chrome autofill has a target.
   useEffect(() => {
      // Small delay to let the page settle before focusing
      const t = setTimeout(() => focusInput(), 200);
      return () => clearTimeout(t);
   }, [focusInput]);

   // Handle input on the single real input.
   // Two cases:
   // 1. Autofill / paste: browser injects all 6 digits at once → use applyOtpCode
   // 2. Manual typing: user types one digit → append it to the next empty slot
   const handleSingleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const digits = raw.replace(/\D/g, "");

      if (digits.length === OTP_LENGTH) {
         // Full code in one shot (autofill / paste via onChange)
         applyOtpCode(digits);
      } else if (digits.length >= 1) {
         // Single (or partial) digit typed manually — append at next empty slot
         const lastDigit = digits[digits.length - 1]; // take last typed char
         const currentFilled = otp.findIndex((d) => d === "");
         const insertAt = currentFilled === -1 ? OTP_LENGTH - 1 : currentFilled;
         if (insertAt < OTP_LENGTH) {
            const newOtp = [...otp];
            newOtp[insertAt] = lastDigit;
            setHasError(false);
            setOtp(newOtp);
         }
      }

      // Always clear the real input after reading so the next event is a fresh value
      if (singleOtpRef.current) {
         singleOtpRef.current.value = "";
      }
   };

   const handleSingleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
         e.preventDefault();
         const currentFilled = otp.join("").length;
         if (currentFilled > 0) {
            const newOtp = [...otp];
            newOtp[currentFilled - 1] = "";
            setHasError(false);
            setOtp(newOtp);
         }
      }
   };

   const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
      applyOtpCode(pastedData);
   };

   const handleAutofillAnimation = (
      e: React.AnimationEvent<HTMLInputElement>
   ) => {
      if (e.animationName !== "onAutoFillStart") return;
      applyOtpCode((e.target as HTMLInputElement).value || "");
   };

   const handleSendOtp = async (phoneInput: string) => {
      if (isLocalTestMode() && isTestPhone(phoneInput)) {
         resetTimer();
         toast.success("OTP sent! (dev)", {
            description: `Use OTP ${DUMMY_OTP} to sign in.`,
         });
         return;
      }
      
      try {
         await sendOtp(phoneInput);
         // Note: sendOtp internally calls setTimer(30) on success — no resetTimer() needed here
         // Show success toast when OTP is sent
         toast.success("Verification code sent", {
            description: `Code sent to ${phoneInput}. It will expire in 10 minutes.`,
         });
      } catch (error: any) {
         const errorMessage = error?.message || "Failed to send OTP";
         const errorCode = error?.code || "";

         if (errorMessage === "USER_NOT_REGISTERED") {
            toast.error("User not registered", {
               description:
                  "This phone number is not registered. Please sign up.",
            });
            router.push(`/signup?phone=${encodeURIComponent(phoneInput)}`);
         } else if (errorMessage === "PHONE_CHECK_FAILED") {
            toast.error("Connection error", {
               description:
                  "Could not verify your phone number. Please check your internet connection.",
            });
         } else if (
            errorCode === "auth/invalid-app-credential" ||
            errorMessage.includes("reCAPTCHA")
         ) {
            toast.error("reCAPTCHA Configuration Error", {
               description:
                  "Please check Firebase console settings. Phone authentication may not be properly configured.",
               duration: 10000,
            });
            } else if (
               errorCode === "auth/too-many-requests" ||
               /too\s+many/i.test(errorMessage)
            ) {
               toast.error("Limit reached", {
                  description: "Try later or use a different phone number.",
               });
         } else {
               toast.error("Something went wrong", {
               description: errorMessage || "Please try again.",
            });
         }
      }
   };

   const handleVerify = async () => {
      const code = otp.join("");
      if (code.length !== OTP_LENGTH) {
         isVerifyingRef.current = false;
         return;
      }

      // Prevent duplicate verification attempts
      if (verifying || isVerified) {
         return;
      }

      // Mark verification in progress to avoid duplicate triggers

      // Mark verification in progress to avoid duplicate triggers
   

      // Mark as verifying to avoid concurrent calls (auto-fill + manual click)
      isVerifyingRef.current = true;
      setHasError(false);

      // Dev bypass: LOCAL_TEST + dummy phone → backend completeOTPDev (no Firebase)
      if (isLocalTestMode() && isTestPhone(phone)) {
         try {
            setOTPAuthInProgress(true);
            const backendResult = await authApi.completeOTPDev(
               formatPhoneNumber(phone),
               code,
               authType,
               userName || undefined
            );
            if (!backendResult.success) {
               throw new Error(backendResult.error || "Verification failed");
            }
            loginToStore({
               user: backendResult.profile ?? undefined,
            });
            sessionManager.saveSession({
               isAuthenticated: true,
               lastRoute: "Landing",
            });
            setOTPAuthInProgress(false);
            await new Promise((r) => setTimeout(r, 200));
            await refreshUserData();
            await applyPendingReferralCode();
            
            // Mark verification as completed BEFORE setting isVerified
            verificationCompletedRef.current = true;
            setIsVerified(true);
            clearSession();
            
            // Set client-side auth cookie for middleware detection
            document.cookie = "extrahand_auth=1; path=/; max-age=2592000; SameSite=Lax";
            
            // Keep isVerifyingRef.current=true until after redirect fires so the
            // auto-verify useEffect cannot re-trigger handleVerify with a stale state.
            toast.success(
               authType === "signup"
                  ? `Welcome to ExtraHand${userName ? `, ${userName}` : ""}!`
                  : "Welcome back!",
               { description: "Phone verified successfully. Redirecting..." }
            );
            setTimeout(() => {
               isVerifyingRef.current = false;
               if (onSuccess) onSuccess();
               else window.location.href = finalRedirectTo;
            }, 800);
         } catch (err: any) {
            setOTPAuthInProgress(false);
            isVerifyingRef.current = false;
            
            // Only show error if verification didn't complete
            if (!verificationCompletedRef.current) {
               toast.error("Verification failed", {
                  description: err?.message || "Invalid OTP or test user not seeded.",
               });
            }
            setOtp(Array(OTP_LENGTH).fill(""));
            focusInput(0);
         }
         return;
      }

      try {
         // Set flag to prevent onAuthStateChanged from calling api.me() prematurely
         setOTPAuthInProgress(true);
         
         // 1. Verify OTP with Firebase (client-side)
         const firebaseResult = await verifyOTPWithFirebase();

         if (!firebaseResult.success) {
            // Reset verification flag on error
            isVerifyingRef.current = false;
            
            // Don't show any error toasts if verification already completed successfully
            if (verificationCompletedRef.current) {
               console.warn("Firebase verification failed but already verified - ignoring");
               return;
            }
            
            // Handle Firebase verification errors
            if (
               firebaseResult.code === "auth/no-session" ||
               firebaseResult.code === "auth/session-restoration-failed"
            ) {
               toast.error("Session expired", {
                  description:
                     "Your verification session has expired. Please request a new code.",
                  action: {
                     label: "Resend OTP",
                     onClick: () => handleSendOtp(phone),
                  },
               });
            } else if (firebaseResult.code === "auth/code-expired") {
               // Don't show error toast for expired code if we already succeeded
               // This prevents the duplicate toast issue
               console.warn("OTP code expired (likely already used):", firebaseResult.code);
            } else {
               if (isInvalidOtpFailure(firebaseResult.code, firebaseResult.error)) {
                  toast.error(INVALID_OTP_TOAST_MESSAGE);
               } else {
                  toast.error("Invalid OTP", {
                     description:
                        firebaseResult.error ||
                        "The code entered is invalid. Please try again.",
                  });
               }
               setOtp(Array(OTP_LENGTH).fill(""));
               focusInput(0);
            }
            setOTPAuthInProgress(false);
            return;
         }

         // 2. Get ID token from Firebase user
         const firebaseUser = firebaseResult.user;
         if (!firebaseUser) {
            throw new Error("Firebase user not found");
         }

         const idToken = await firebaseUser.getIdToken();
         const formattedPhone = formatPhoneNumber(phone);

         // 3. Call backend to complete OTP authentication
         // For web: tokens are set as HttpOnly cookies by the backend
         const backendResult = await authApi.completeOTP(
            idToken,
            authType,
            formattedPhone,
            userName || undefined
         );

         if (!backendResult.success) {
            throw new Error(
               backendResult.error || "Failed to complete authentication"
            );
         }

         // For web clients, tokens are in HttpOnly cookies (not in response body)
         // sessionManager no longer needed for token storage
         // Just update the user store with profile data
         loginToStore({
            user: backendResult.profile ?? undefined,
            // NOTE: tokens are now HttpOnly cookies; not storing in state
         });

         // Clear the OTP auth flag - cookies are now set
         setOTPAuthInProgress(false);

         // Brief delay so the browser can persist Set-Cookie from the response before
         // we send the next request (avoids 401 on first api.me() and redirect-to-login)
         await new Promise((resolve) => setTimeout(resolve, 200));

         // Now fetch the full profile from backend (cookies are set)
         await refreshUserData();

         // Apply referral code if user signed up with one
         await applyPendingReferralCode();

         // 5. Success!
         // Mark verification as completed BEFORE setting isVerified and showing toast
         verificationCompletedRef.current = true;
         setIsVerified(true);
         clearSession();
         
         // Set client-side auth cookie for middleware detection
         document.cookie = "extrahand_auth=1; path=/; max-age=2592000; SameSite=Lax";
         
         // Keep isVerifyingRef.current=true until after redirect fires so the
         // auto-verify useEffect cannot re-trigger handleVerify with a stale state.

         const welcomeMessage =
            authType === "signup"
               ? `Welcome to ExtraHand${userName ? `, ${userName}` : ""}!`
               : "Welcome back!";

         toast.success(welcomeMessage, {
            description: "Phone verified successfully. Redirecting...",
         });

         setTimeout(() => {
            isVerifyingRef.current = false;
            if (onSuccess) {
               onSuccess();
            } else {
               // Use hard navigation to ensure middleware re-checks auth state
               window.location.href = finalRedirectTo;
            }
         }, 800);
      } catch (error: any) {
         // Don't show ANY error toasts if verification already completed successfully
         // This is the key fix to prevent both success and error messages from appearing
         if (verificationCompletedRef.current) {
            console.info("Verification already completed successfully - suppressing error:", error?.message);
            return;
         }
         
         // Don't show error toast if verification already succeeded (state-based check)
         if (isVerified) {
            console.warn("Error caught after successful verification - ignoring:", error);
            return;
         }
         
         // Don't show error toast for code-expired errors
         const errorMessage = error?.message || "";
         const errorCode = error?.code || "";
         
         if (errorCode === "auth/code-expired" || errorMessage.includes("code-expired")) {
            console.warn("Code expired error:", errorCode);
            return;
         }
         
         console.error("OTP verification error:", error);
         setHasError(true);
         if (isInvalidOtpFailure(errorCode, errorMessage)) {
            toast.error(INVALID_OTP_TOAST_MESSAGE);
         } else {
            toast.error("Verification failed", {
               description:
                  errorMessage || "Something went wrong. Please try again.",
            });
         }
         setOtp(Array(OTP_LENGTH).fill(""));
         focusInput(0);
      } finally {
         // Ensure OTP auth flag is cleared. Do NOT reset isVerifyingRef here because
         // the success path intentionally keeps it true until the redirect setTimeout fires.
         try {
            setOTPAuthInProgress(false);
         } catch (e) {
            /* ignore */
         }
      }
   };

   const handleResend = async () => {
      if (timer > 0) return; // Can't resend if timer is still running

      setOtp(Array(OTP_LENGTH).fill(""));
      setHasError(false);
      await handleSendOtp(phone);
   };

   return (
      <div className="min-h-screen bg-linear-to-b from-white to-secondary-50 flex flex-col">
         {/* Main Content */}
         <div className="flex-1 flex flex-col items-center justify-center px-0 py-8 lg:px-4">
            <Card className="w-full lg:max-w-md shadow-none border-0 bg-transparent">
               <CardHeader className="space-y-4 px-4 lg:px-6">
                  {/* Logo */}
                  <div className="flex items-center justify-center mb-4">
                     <Image
                        src="/assets/images/logo.png"
                        alt="Extrahand"
                        width={55}
                        height={55}
                     />
                  </div>
                  <div className="text-center">
                     <div>
                        <CardTitle className="text-2xl">
                           {isVerified ? "Verified!" : "Verify your phone"}
                        </CardTitle>
                        <CardDescription className="mt-2">
                           {isVerified
                              ? "Your phone number has been verified"
                              : `Enter the 6-digit code sent to ${maskPhone(
                                   phone
                                )}`}
                        </CardDescription>
                     </div>
                  </div>
               </CardHeader>

               {!isVerified && (
                  <CardContent className="space-y-6 px-4 lg:px-6">
                     {/* OTP Input */}
                     <div className="space-y-4">
                        {/*
                         * OTP Input: Single real <input> + visual digit boxes (divs).
                         *
                         * WHY THIS APPROACH:
                         * React controlled inputs conflict with browser autofill — React
                         * re-renders reset the DOM value before the app can read it.
                         * Using an uncontrolled single input + visual divs lets Chrome
                         * inject the 6-digit code freely. The WebOTP API and the poll
                         * both read from this single input's real DOM value.
                         */}
                        <div
                           className={cn(
                              "relative flex gap-2 justify-center cursor-text",
                              hasError && "animate-shake"
                           )}
                           onClick={() => singleOtpRef.current?.focus()}
                        >
                           {/*
                            * THE REAL INPUT — Chrome autofill targets this.
                            * • Not pointer-events-none (Chrome skips unfocusable inputs)
                            * • Not tabIndex=-1 (prevents Chrome from autofocusing for autofill)
                            * • opacity-[0.01] not opacity-0 (some Chrome builds check visibility)
                            * • uncontrolled (value not bound to React state) so browser can write freely
                            * • positioned absolutely over the full row so any tap focuses it
                            */}
                           <input
                              ref={singleOtpRef}
                              type="text"
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              name="one-time-code"
                              id="otp-single-input"
                              maxLength={OTP_LENGTH}
                              onChange={handleSingleInputChange}
                              onKeyDown={handleSingleKeyDown}
                              onPaste={handlePaste}
                              onAnimationStart={handleAutofillAnimation}
                              onFocus={() => setIsFocused(true)}
                              onBlur={() => setIsFocused(false)}
                              autoFocus
                              aria-label="Enter 6-digit OTP"
                              className="absolute inset-0 w-full h-full z-10 border-0 outline-none"
                              style={{
                                 opacity: 0.01,
                                 background: "transparent",
                                 color: "transparent",
                                 caretColor: "transparent",
                                 WebkitTextFillColor: "transparent",
                                 fontSize: "1px",
                              }}
                           />

                           {(() => {
                              // Which box should show the blinking cursor?
                              const firstEmpty = otp.findIndex((d) => d === "");
                              const cursorAt = firstEmpty === -1 ? -1 : firstEmpty;

                              return otp.map((digit, idx) => {
                                 const showCursor = isFocused && !hasError && cursorAt === idx;
                                 return (
                                    <div
                                       key={idx}
                                       className={cn(
                                          "w-12 h-14 flex items-center justify-center rounded-md border-2 text-xl font-semibold transition-all duration-150 select-none relative overflow-hidden",
                                          hasError
                                             ? "border-red-500 text-red-600 bg-red-50"
                                             : digit
                                             ? "border-primary-500 bg-primary-50 text-gray-900"
                                             : showCursor
                                             ? "border-primary-500 bg-white shadow-sm shadow-primary-200"
                                             : isFocused && cursorAt > idx
                                             ? "border-primary-400 bg-primary-50 text-gray-900"
                                             : "border-gray-300 bg-white text-gray-400"
                                       )}
                                       aria-hidden="true"
                                    >
                                       {digit ? (
                                          digit
                                       ) : showCursor ? (
                                          <span className="otp-cursor" />
                                       ) : (
                                          ""
                                       )}
                                    </div>
                                 );
                              });
                           })()}
                        </div>

                        <Button
                           onClick={handleVerify}
                           size="lg"
                           className="w-full"
                           disabled={
                              verifying || otp.join("").length !== OTP_LENGTH
                           }
                        >
                           {verifying ? (
                              <>
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                 Verifying...
                              </>
                           ) : (
                              "Verify OTP"
                           )}
                        </Button>
                     </div>

                     {/* Resend */}
                     <div className="text-center space-y-2">
                        {timer > 0 ? (
                           <p className="text-sm text-gray-600">
                              Resend code in{" "}
                              <span className="font-semibold text-primary-600">
                                 {timer}s
                              </span>
                           </p>
                        ) : (
                           <Button
                              variant="ghost"
                              onClick={handleResend}
                              disabled={sending}
                              className="text-primary-600 hover:text-primary-700"
                           >
                              {sending ? (
                                 <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                 </>
                              ) : (
                                 <>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Resend code
                                 </>
                              )}
                           </Button>
                        )}
                     </div>

                     {/* Trust Badge */}
                     <div className="flex items-center justify-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-3">
                        <Shield className="h-4 w-4 text-primary-500" />
                        <span>Your phone number is secure</span>
                     </div>
                  </CardContent>
               )}
            </Card>
         </div>

         <style jsx global>{`
            @keyframes shake {
               0%,
               100% {
                  transform: translateX(0);
               }
               10%,
               30%,
               50%,
               70%,
               90% {
                  transform: translateX(-8px);
               }
               20%,
               40%,
               60%,
               80% {
                  transform: translateX(8px);
               }
            }
            @keyframes scale-in {
               0% {
                  transform: scale(0);
               }
               50% {
                  transform: scale(1.1);
               }
               100% {
                  transform: scale(1);
               }
            }
            .animate-shake {
               animation: shake 0.5s ease-in-out;
            }
            .animate-scale-in {
               animation: scale-in 0.5s ease-out;
            }
            /* Blinking cursor inside the active OTP box */
            .otp-cursor {
               display: inline-block;
               width: 2px;
               height: 1.5rem;
               background-color: var(--color-primary-500, #f59e0b);
               border-radius: 1px;
               animation: otp-blink 1s step-start infinite;
            }
            @keyframes otp-blink {
               0%, 100% { opacity: 1; }
               50% { opacity: 0; }
            }
            input:-webkit-autofill {
               animation-name: onAutoFillStart;
               animation-duration: 0.01s;
            }
            @keyframes onAutoFillStart {
               from {
                  opacity: 1;
               }
               to {
                  opacity: 1;
               }
            }
         `}</style>
      </div>
   );
}
