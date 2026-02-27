/**
 * useOTP Hook for Web App
 * Manages OTP state, Firebase OTP sending/verification, and localStorage persistence
 * Mirrors mobile app's useOTP hook functionality
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { sendOTP, confirmOTP } from "@/lib/auth/phoneAuth";
import { otpStateManager, OTPSession } from "@/lib/auth/otpStateManager";
import {
   parsePhoneWithCountryCode,
   formatPhoneNumber,
} from "@/lib/utils/phone";

const OTP_LENGTH = 6;
const MAX_SESSION_AGE = 5 * 60 * 1000; // 5 minutes

interface UseOTPResult {
   otp: string[];
   setOtp: (otp: string[]) => void;
   timer: number;
   sending: boolean;
   verifying: boolean;
   verifyOTP: () => Promise<{
      success: boolean;
      user?: any;
      error?: string;
      code?: string;
   }>;
   sendOtp: (phoneInput: string) => Promise<void>;
   resetTimer: () => void;
   clearSession: () => void;
   confirmationResult: any;
}

export const useOTP = (
   initialPhone: string,
   mode: "login" | "signup"
): UseOTPResult => {
   const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
   const [timer, setTimer] = useState(30);
   const [sending, setSending] = useState(false);
   const [verifying, setVerifying] = useState(false);

   // Refs to track state without triggering re-renders
   const confirmationRef = useRef<any>(null);
   const isSendingRef = useRef<boolean>(false);

   // 1. Restore OTP Input State
   useEffect(() => {
      const restoreOTPState = () => {
         try {
            const storedOTP = otpStateManager.getOTPInput();
            const storedSession = otpStateManager.getOTPSession();
            if (
               storedOTP &&
               Array.isArray(storedOTP) &&
               storedOTP.length === OTP_LENGTH
            ) {
               // Only restore input state if there's a valid (non-expired) OTP session
               if (storedSession && !otpStateManager.isSessionExpired(storedSession)) {
                  setOtp(storedOTP);
                  console.log("✅ [useOTP] Restored OTP state from storage");
               } else {
                  // Clear any stale OTP input to avoid showing old codes
                  otpStateManager.clearOTPInput();
                  console.log("ℹ️ [useOTP] Cleared stale OTP input (no active session)");
               }
            }
         } catch (error) {
            console.warn("⚠️ [useOTP] Failed to restore OTP state:", error);
         }
      };
      restoreOTPState();
   }, []);

   // 2. Save OTP Input State on Change
   useEffect(() => {
      otpStateManager.saveOTPInput(otp);
   }, [otp]);

   // 3. Timer Logic - Only re-run when timer status changes (0 to positive or positive to 0)
   useEffect(() => {
      if (timer <= 0) return;

      const interval = setInterval(() => {
         setTimer((prev) => {
            if (prev <= 1) {
               return 0;
            }
            return prev - 1;
         });
      }, 1000);

      return () => clearInterval(interval);
   }, [timer > 0]);

   // 4. Restore Session Logic
   useEffect(() => {
      const restoreSession = () => {
         if (confirmationRef.current) return;

         try {
            const storedSession = otpStateManager.getOTPSession();
            if (
               storedSession &&
               !otpStateManager.isSessionExpired(storedSession)
            ) {
               // Session exists and is valid, but we don't have confirmation result
               // This means we need to resend OTP
               console.log(
                  "⚠️ [useOTP] Session found but no confirmation result - will need to resend"
               );
            } else if (
               storedSession &&
               otpStateManager.isSessionExpired(storedSession)
            ) {
               otpStateManager.clearOTPSession();
            }
         } catch (error) {
            console.warn("⚠️ [useOTP] Failed to restore OTP session:", error);
         }
      };

      if (initialPhone) {
         restoreSession();
      }
   }, [initialPhone]);

   // 5. Send OTP Function
   const sendOtpInternal = useCallback(
      async (phoneInput: string) => {
         // Guards
         if (isSendingRef.current || sending) {
            console.log("⚠️ [useOTP] OTP send already in progress, skipping.");
            return;
         }
         if (!phoneInput || phoneInput.trim().length === 0) {
            console.warn(
               "⚠️ [useOTP] Cannot send OTP: no phone number provided"
            );
            return;
         }

         const fullNumber = formatPhoneNumber(phoneInput);
         const digitsOnly = fullNumber.replace(/\D/g, "");

         try {
            isSendingRef.current = true;
            setSending(true);

            // Verify User Existence (Login Mode Only)
            if (mode === "login") {
               try {
                  const { authApi } = await import("@/lib/api/endpoints/auth");
                  const checkResult = await authApi.checkPhone(digitsOnly);
                  if (!checkResult || !checkResult.exists) {
                     throw new Error("USER_NOT_REGISTERED");
                  }
               } catch (checkError: any) {
                  if (checkError.message === "USER_NOT_REGISTERED") {
                     throw checkError;
                  }
                  // Network/System errors during check
                  throw new Error("PHONE_CHECK_FAILED");
               }
            }

            // Send OTP via Firebase
            const res = await sendOTP(fullNumber);

            if (res.success && res.confirmation) {
               confirmationRef.current = res.confirmation;

               // Persist Session
               const session: OTPSession = {
                  phone: fullNumber,
                  timestamp: Date.now(),
                  mode: mode,
               };
               otpStateManager.saveOTPSession(session);

               setOtp(Array(OTP_LENGTH).fill(""));
               setTimer(30);
               // Make sure any previously typed OTP is removed from localStorage
               otpStateManager.clearOTPInput();
               console.log("✅ [useOTP] OTP sent successfully");

               // Attempt WebOTP (SMS Receiver) API to auto-fill verification code in supporting browsers
               try {
                  if (typeof window !== "undefined" && (navigator as any)?.credentials?.get) {
                     const controller = new AbortController();
                     const signal = controller.signal;

                     // Abort after 40s to avoid hanging the promise
                     const abortTimeout = setTimeout(() => controller.abort(), 40000);

                     (async () => {
                        try {
                           // @ts-ignore - WebOTP API typings are not widely available
                           const content = await (navigator as any).credentials.get({
                              otp: { transport: ["sms"] },
                              signal,
                           });

                           if (content && content.code) {
                              const digits = content.code.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
                              const newOtp = Array(OTP_LENGTH).fill("");
                              digits.forEach((d: string, i: number) => (newOtp[i] = d));
                              setOtp(newOtp);
                              console.log("📥 [useOTP] Auto-filled OTP via WebOTP API:", content.code);
                              // Let the component detect the filled OTP and trigger verification
                           }
                        } catch (err) {
                           console.warn("⚠️ [useOTP] WebOTP attempt failed or not available:", err?.message || err);
                        } finally {
                           clearTimeout(abortTimeout);
                        }
                     })();
                  }
               } catch (err) {
                  console.warn("⚠️ [useOTP] WebOTP detection error:", err);
               }
            } else {
               // Handle Firebase Errors
               let msg = res.error || "Failed to send verification code.";
               if (res.code === "auth/billing-not-enabled") {
                  msg = `Billing Not Enabled. Please check Firebase Console. Error: ${res.code}`;
               }
               throw new Error(msg);
            }
         } catch (e: any) {
            // Re-throw specific errors for the UI to handle
            throw e;
         } finally {
            isSendingRef.current = false;
            setSending(false);
         }
      },
      [mode, sending]
   );

   // Ref to prevent duplicate verification attempts
   const isVerifyingRef = useRef(false);

   // 6. Verify OTP Function
   const verifyOTP = async () => {
      const code = otp.join("");
      if (code.length !== OTP_LENGTH) {
         return {
            success: false,
            error: `Please enter the ${OTP_LENGTH}-digit verification code.`,
         };
      }

      // Prevent duplicate verification attempts
      if (isVerifyingRef.current) {
         console.log("⚠️ [useOTP] Verification already in progress, skipping duplicate call");
         return {
            success: false,
            error: "Verification already in progress",
            code: "auth/verification-in-progress",
         };
      }

      // Check for session/confirmation
      if (!confirmationRef.current) {
         const storedSession = otpStateManager.getOTPSession();
         if (!storedSession) {
            return {
               success: false,
               error: "No verification session found. Please resend the code.",
               code: "auth/no-session",
            };
         }
         return {
            success: false,
            error: "Session reference lost. Please resend OTP.",
            code: "auth/session-restoration-failed",
         };
      }

      try {
         isVerifyingRef.current = true;
         setVerifying(true);
         const res = await confirmOTP(confirmationRef.current, code);

         if (res.success) {
            otpStateManager.clearAll();
            confirmationRef.current = null; // Clear confirmation to prevent reuse
            isVerifyingRef.current = false;
            return { success: true, user: res.user };
         } else {
            // Session expired logic
            if (
               res.code === "auth/session-expired" ||
               res.code === "auth/code-expired"
            ) {
               confirmationRef.current = null;
            }
            isVerifyingRef.current = false;
            return { success: false, error: res.error, code: res.code };
         }
      } catch (e: any) {
         console.error("❌ [useOTP] Verification error:", e);
         isVerifyingRef.current = false;
         return {
            success: false,
            error: e.message || "Verification failed",
            code: "auth/unknown",
         };
      } finally {
         setVerifying(false);
      }
   };

   const clearSession = () => {
      otpStateManager.clearAll();
      confirmationRef.current = null;
   };

   const resetTimer = () => setTimer(30);

   return {
      otp,
      setOtp,
      timer,
      sending,
      verifying,
      verifyOTP,
      sendOtp: sendOtpInternal,
      resetTimer,
      clearSession,
      confirmationResult: confirmationRef.current,
   };
};
