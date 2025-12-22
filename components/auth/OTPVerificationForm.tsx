"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
   ArrowLeft,
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

const OTP_LENGTH = 6;
const RESEND_TIMER = 30;

interface OTPVerificationFormProps {
   phone: string;
   userName?: string;
   authType?: "login" | "signup";
   onSuccess?: () => void;
   onSkip?: () => void;
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
   onSuccess,
   onSkip,
}: OTPVerificationFormProps) {
   const router = useRouter();
   const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
   const [timer, setTimer] = useState(RESEND_TIMER);
   const [isResending, setIsResending] = useState(false);
   const [isVerifying, setIsVerifying] = useState(false);
   const [isVerified, setIsVerified] = useState(false);
   const [hasError, setHasError] = useState(false);

   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

   // Countdown timer
   useEffect(() => {
      if (timer > 0 && !isVerified) {
         const interval = setInterval(() => setTimer((t) => t - 1), 1000);
         return () => clearInterval(interval);
      }
   }, [timer, isVerified]);

   // Auto-verify when OTP is complete
   useEffect(() => {
      const code = otp.join("");
      if (code.length === OTP_LENGTH && !isVerifying && !isVerified) {
         handleVerify();
      }
   }, [otp]);

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

   const handleVerify = async () => {
      const code = otp.join("");
      if (code.length !== OTP_LENGTH) return;

      setIsVerifying(true);
      setHasError(false);

      try {
         await new Promise((resolve) => setTimeout(resolve, 1500));

         // Simulate validation (replace with actual API call)
         if (code === "123456") {
            setIsVerified(true);
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
                  router.push("/onboarding/role-selection");
               }
            }, 1000);
         } else {
            setHasError(true);
            toast.error("Invalid OTP", {
               description: "Please check the code and try again.",
            });
            setOtp(Array(OTP_LENGTH).fill(""));
            focusInput(0);
         }
      } catch {
         setHasError(true);
         toast.error("Verification failed", {
            description: "Something went wrong. Please try again.",
         });
      } finally {
         setIsVerifying(false);
      }
   };

   const handleResend = async () => {
      setIsResending(true);
      setOtp(Array(OTP_LENGTH).fill(""));
      setHasError(false);

      try {
         await new Promise((resolve) => setTimeout(resolve, 500));
         toast.success("OTP sent!", {
            description: `New code sent to ${maskPhone(phone)}`,
         });
         setTimer(RESEND_TIMER);
      } catch {
         toast.error("Failed to resend", {
            description: "Please try again.",
         });
      } finally {
         setIsResending(false);
      }
   };

   const handleSkip = () => {
      if (onSkip) {
         onSkip();
      } else {
         router.push("/onboarding/role-selection");
      }
   };

   return (
      <div className="min-h-screen bg-linear-to-b from-white to-secondary-50 flex flex-col">
         {/* Main Content */}
         <div className="flex-1 flex flex-col items-center justify-center px-0 py-8 lg:px-4">
            <Card className="w-full lg:max-w-md shadow-none border-0 bg-transparent">
               <CardHeader className="space-y-4 px-4 lg:px-6">
                  {/* Back button and Logo */}
                  <div className="relative flex items-center justify-center mb-4">
                     <Link
                        href={authType === "signup" ? "/signup" : "/login"}
                        className="absolute left-0 inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                     >
                        <ArrowLeft className="h-4 w-4" />
                     </Link>
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
                              isVerifying || otp.join("").length !== OTP_LENGTH
                           }
                        >
                           {isVerifying ? (
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
                              disabled={isResending}
                              className="text-primary-600 hover:text-primary-700"
                           >
                              {isResending ? (
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

                     {/* Skip Option */}
                     <div className="text-center">
                        <button
                           onClick={handleSkip}
                           className="text-sm text-gray-600 hover:text-gray-900 underline"
                        >
                           Skip verification for now
                        </button>
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
