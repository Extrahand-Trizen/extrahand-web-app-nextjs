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
import { Input } from "@/components/ui/input";
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
   redirectTo = "/home",
   onSuccess,
}: OTPVerificationFormProps) {
   const router = useRouter();
   const { refreshUserData } = useAuth();
   const loginToStore = useUserStore((state) => state.login);
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
   const isVerifyingRef = useRef(false); // Prevent duplicate verification attempts

   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

   const focusInput = useCallback((idx: number) => {
      if (idx >= 0 && idx < OTP_LENGTH) {
         inputRefs.current[idx]?.focus();
      }
   }, []);

   const handleChange = (value: string, idx: number) => {
      setHasError(false);
      const digits = value.replace(/\D/g, "");

      if (digits.length <= 1) {
         const newOtp = [...otp];
         newOtp[idx] = digits;
         setOtp(newOtp);
         if (digits && idx < OTP_LENGTH - 1) {
            focusInput(idx + 1);
         }
         return;
      }

      // Handle paste
      const otpArray = digits.slice(0, OTP_LENGTH).split("");
      const newOtp = Array(OTP_LENGTH).fill("");
      otpArray.forEach((digit, i) => {
         newOtp[i] = digit;
      });
      setOtp(newOtp);
      focusInput(Math.min(otpArray.length, OTP_LENGTH - 1));
   };

   const handleKeyDown = (
      e: React.KeyboardEvent<HTMLInputElement>,
      idx: number
   ) => {
      if (e.key === "Backspace") {
         e.preventDefault();
         if (otp[idx]) {
            const newOtp = [...otp];
            newOtp[idx] = "";
            setOtp(newOtp);
         } else if (idx > 0) {
            focusInput(idx - 1);
            const newOtp = [...otp];
            newOtp[idx - 1] = "";
            setOtp(newOtp);
         }
      } else if (e.key === "ArrowLeft" && idx > 0) {
         e.preventDefault();
         focusInput(idx - 1);
      } else if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
         e.preventDefault();
         focusInput(idx + 1);
      }
   };

   const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text").replace(/\D/g, "");
      const otpArray = pastedData.slice(0, OTP_LENGTH).split("");
      const newOtp = Array(OTP_LENGTH).fill("");
      otpArray.forEach((digit, i) => {
         newOtp[i] = digit;
      });
      setOtp(newOtp);
      focusInput(Math.min(otpArray.length - 1, OTP_LENGTH - 1));
   };

   const handleSendOtp = async (phoneInput: string) => {
      if (isLocalTestMode() && isTestPhone(phoneInput)) {
         resetTimer();
         toast.success("OTP sent! (dev)", {
            description: `Use OTP ${DUMMY_OTP} to sign in.`,
         });
         return;
      }
      
      let sendSuccess = false;
      try {
         await sendOtp(phoneInput);
         sendSuccess = true; // Only set to true if sendOtp completes without throwing
         resetTimer();
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
            setIsVerified(true);
            clearSession();
            isVerifyingRef.current = false;
            toast.success(
               authType === "signup"
                  ? `Welcome to ExtraHand${userName ? `, ${userName}` : ""}!`
                  : "Welcome back!",
               { description: "Phone verified successfully. Redirecting..." }
            );
            setTimeout(() => {
               if (onSuccess) onSuccess();
               else router.push(redirectTo);
            }, 1000);
         } catch (err: any) {
            setOTPAuthInProgress(false);
            isVerifyingRef.current = false;
            toast.error("Verification failed", {
               description: err?.message || "Invalid OTP or test user not seeded.",
            });
            setOtp(Array(OTP_LENGTH).fill(""));
            focusInput(0);
         }
         return;
      }

      // This duplicate block should be removed - keeping for now but updating redirect
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
            setIsVerified(true);
            clearSession();
            isVerifyingRef.current = false;
            toast.success(
               authType === "signup"
                  ? `Welcome to ExtraHand${userName ? `, ${userName}` : ""}!`
                  : "Welcome back!",
               { description: "Phone verified successfully. Redirecting..." }
            );
            setTimeout(() => {
               if (onSuccess) onSuccess();
               else router.push(redirectTo);
            }, 1000);
         } catch (err: any) {
            setOTPAuthInProgress(false);
            isVerifyingRef.current = false;
            toast.error("Verification failed", {
               description: err?.message || "Invalid OTP or test user not seeded.",
            });
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
               toast.error("Invalid OTP", {
                  description:
                     firebaseResult.error ||
                     "The code entered is invalid. Please try again.",
               });
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
         setIsVerified(true);
         clearSession();
         isVerifyingRef.current = false; // Reset verification flag on success

         const welcomeMessage =
            authType === "signup"
               ? `Welcome to ExtraHand${userName ? `, ${userName}` : ""}!`
               : "Welcome back!";

         toast.success(welcomeMessage, {
            description: "Phone verified successfully. Redirecting...",
         });

         setTimeout(() => {
            if (onSuccess) {
               onSuccess();
            } else {
               router.push(redirectTo);
            }
         }, 1000);
      } catch (error: any) {
         // Don't show error toast for code-expired if verification already succeeded
         // This prevents duplicate toasts
         const errorMessage = error?.message || "";
         const errorCode = error?.code || "";
         
         if (errorCode === "auth/code-expired" || errorMessage.includes("code-expired")) {
            // If we're already verified, don't show the error
            if (isVerified) {
               console.warn("Code expired error after successful verification - ignoring");
               return;
            }
         }
         
         console.error("OTP verification error:", error);
         setHasError(true);
         toast.error("Verification failed", {
            description:
               errorMessage || "Something went wrong. Please try again.",
         });
         setOtp(Array(OTP_LENGTH).fill(""));
         focusInput(0);
      } finally {
         // Ensure flags are cleared regardless of success or failure to avoid duplicate flows
         try {
            setOTPAuthInProgress(false);
         } catch (e) {
            /* ignore */
         }
         isVerifyingRef.current = false;
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
                        <div
                           className={cn(
                              "flex gap-2 justify-center",
                              hasError && "animate-shake"
                           )}
                        >
                           {otp.map((digit, idx) => (
                              <Input
                                 key={idx}
                                 ref={(el) => {
                                    inputRefs.current[idx] = el;
                                 }}
                                 type="text"
                                 inputMode="numeric"
                                 autoComplete={idx === 0 ? "one-time-code" : "off"}
                                 name={idx === 0 ? "otp" : undefined}
                                 maxLength={1}
                                 value={digit}
                                 onChange={(e) =>
                                    handleChange(e.target.value, idx)
                                 }
                                 onKeyDown={(e) => handleKeyDown(e, idx)}
                                 onPaste={handlePaste}
                                 className={cn(
                                    "w-12 h-14 text-center text-xl font-semibold",
                                    hasError &&
                                       "border-red-500 focus-visible:ring-red-500"
                                 )}
                                 aria-label={`Digit ${idx + 1}`}
                              />
                           ))}
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
         `}</style>
      </div>
   );
}
