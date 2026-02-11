/**
 * PAN Verification Page
 * Business account PAN verification with document upload
 */

"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
   FileText,
   Lock,
   AlertCircle,
   ArrowLeft,
   CheckCircle2,
   Shield,
   XCircle,
   RefreshCw,
   Upload,
   Eye,
   EyeOff,
   Building2,
   Sparkles,
   BadgeCheck,
} from "lucide-react";
import { verificationApi } from "@/lib/api/endpoints/verification";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";

interface PANVerificationState {
   step: "input" | "processing" | "success" | "error";
   pan: string;
   name: string;
   showPan: boolean;
   consentGiven: boolean;
   verifiedData?: {
      name: string;
      category: string;
      maskedPan: string;
   };
   error?: string;
}

export default function PANVerificationPage() {
   const router = useRouter();
   const { refreshUserData, userData } = useAuth();
   const isBusiness = userData?.userType === "business";

   const [state, setState] = useState<PANVerificationState>({
      step: "input",
      pan: "",
      name: "",
      showPan: false,
      consentGiven: false,
   });

   const [isLoading, setIsLoading] = useState(false);

   const handleBack = () => {
      if (state.step === "input") {
         router.push("/profile?section=verifications");
      } else {
         router.push("/profile?section=verifications");
      }
   };

   const validatePAN = (pan: string): boolean => {
      // PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      return panRegex.test(pan.toUpperCase());
   };

   const formatPANInput = (value: string): string => {
      return value
         .replace(/[^a-zA-Z0-9]/g, "")
         .toUpperCase()
         .slice(0, 10);
   };

   const maskPAN = (pan: string): string => {
      if (pan.length !== 10) return pan;
      return `XXXXX${pan.slice(5, 9)}${pan.slice(9)}`;
   };

   const handleVerifyPAN = async () => {
      if (!validatePAN(state.pan)) {
         setState((p) => ({
            ...p,
            error: "Please enter a valid PAN (e.g., ABCDE1234F)",
         }));
         return;
      }

      if (!state.consentGiven) {
         setState((p) => ({
            ...p,
            error: "Please accept the consent to proceed",
         }));
         return;
      }

      setIsLoading(true);
      setState((p) => ({ ...p, error: undefined, step: "processing" }));

      try {
         const result = await verificationApi.verifyPAN(state.pan, {
            given: true,
            text: "I consent to verify my PAN for compliance and operations",
            version: "v1.0",
         });

         if (result.success && result.data) {
            setState((p) => ({
               ...p,
               step: "success",
               verifiedData: {
                  name: result.data?.verifiedData?.name,
                  category: "Individual",
                  maskedPan: result.data?.maskedPAN ?? maskPAN(state.pan),
               },
            }));
            toast.success(result.message || "PAN verified successfully!");

            await refreshUserData();
            router.refresh();
         } else {
            setState((p) => ({
               ...p,
               step: "error",
               error: result.message || "PAN verification failed",
            }));
            toast.error(result.message || "PAN verification failed");
         }
      } catch (error: any) {
         const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || "PAN verification failed";
         setState((p) => ({
            ...p,
            step: "error",
            error: errorMsg,
         }));
         toast.error(errorMsg);
      } finally {
         setIsLoading(false);
      }
   };

   // ========================================
   // Render Functions
   // ========================================

   const renderInputStep = () => (
      <div className="space-y-6">
         {/* PAN Number Input */}
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
               PAN Number
            </label>
            <div className="relative">
               <input
                  type={state.showPan ? "text" : "password"}
                  value={state.pan}
                  onChange={(e) =>
                     setState((p) => ({
                        ...p,
                        pan: formatPANInput(e.target.value),
                        error: undefined,
                     }))
                  }
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className={cn(
                     "w-full px-4 py-3 text-base border rounded-xl transition-all duration-200 uppercase tracking-wider",
                     "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                     state.error
                        ? "border-red-300 bg-red-50/50"
                        : "border-gray-200"
                  )}
               />
               <button
                  type="button"
                  onClick={() =>
                     setState((p) => ({ ...p, showPan: !p.showPan }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
               >
                  {state.showPan ? (
                     <EyeOff className="w-5 h-5" />
                  ) : (
                     <Eye className="w-5 h-5" />
                  )}
               </button>
            </div>
         </div>

         {/* Name Input */}
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
               Name as per PAN Card
            </label>
            <input
               type="text"
               value={state.name}
               onChange={(e) =>
                  setState((p) => ({
                     ...p,
                     name: e.target.value.toUpperCase(),
                     error: undefined,
                  }))
               }
               placeholder="FULL NAME AS PER PAN"
               className={cn(
                  "w-full px-4 py-3 text-base border rounded-xl transition-all duration-200 uppercase",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  "border-gray-200"
               )}
            />
         </div>

         {/* Error */}
         {state.error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
               <AlertCircle className="w-4 h-4 shrink-0" />
               {state.error}
            </div>
         )}

         {/* Info Box */}
         <div className="bg-primary-50 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-2">
               <Building2 className="w-5 h-5 text-primary-600 mt-0.5" />
               <div>
                  <p className="text-sm font-medium text-primary-800">
                     {isBusiness
                        ? "Business Account Requirement"
                        : "Account Requirement"}
                  </p>
                  <p className="text-xs text-primary-600 mt-1">
                     {isBusiness
                        ? "PAN verification is mandatory for business accounts to ensure tax compliance and enable higher transaction limits."
                        : "PAN verification is required to post tasks and submit offers, and for tax compliance."}
                  </p>
               </div>
            </div>
         </div>

         {/* Benefits */}
         <div className="space-y-3">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
               Benefits of PAN verification
            </p>
            <div className="grid grid-cols-1 gap-2">
               {[
                  ...(isBusiness
                     ? [
                          { icon: BadgeCheck, text: "Unlock higher payout limits" },
                          { icon: Shield, text: "Ensure tax compliance" },
                          { icon: Building2, text: "Access business features" },
                       ]
                     : [
                          { icon: BadgeCheck, text: "Post tasks and submit offers" },
                          { icon: Shield, text: "Tax compliance" },
                          { icon: Building2, text: "Build trust with requesters" },
                       ]),
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

         {/* Consent Checkbox */}
         <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer">
            <input
               type="checkbox"
               checked={state.consentGiven}
               onChange={(e) =>
                  setState((p) => ({
                     ...p,
                     consentGiven: e.target.checked,
                     error: undefined,
                  }))
               }
               className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <div className="text-xs text-gray-600">
               <p>
                  I consent to verify my PAN for compliance and operations. I
                  understand that my PAN details will be verified through
                  official channels and only masked information will be stored.
               </p>
            </div>
         </label>

         {/* Submit Button */}
         <Button
            onClick={handleVerifyPAN}
            disabled={
               isLoading || state.pan.length !== 10 || !state.consentGiven
            }
            className="w-full h-12 text-base font-medium bg-primary-700 hover:bg-primary-600"
         >
            {isLoading ? (
               <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying PAN...
               </div>
            ) : (
               "Verify PAN"
            )}
         </Button>
      </div>
   );

   const renderProcessingStep = () => (
      <div className="text-center space-y-6 py-8">
         <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 flex items-center justify-center animate-pulse">
            <RefreshCw className="w-10 h-10 text-primary-600 animate-spin" />
         </div>

         <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-900">
               Processing Verification
            </h2>
            <p className="text-gray-600">
               Please wait while we verify your PAN details...
            </p>
         </div>

         <div className="bg-primary-50 rounded-xl p-4 text-sm text-primary-700">
            This usually takes a few seconds. Do not close this page.
         </div>
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
               PAN Verified Successfully!
            </h2>
            <p className="text-gray-600">
               Your PAN <strong>{state.verifiedData?.maskedPan || maskPAN(state.pan)}</strong> has been verified.
            </p>
         </div>

         <div className="bg-primary-50 rounded-xl p-4 text-left space-y-2">
            <p className="text-sm font-medium text-primary-800">
               You&apos;ve unlocked:
            </p>
            <ul className="space-y-2 text-sm text-primary-700">
               {isBusiness ? (
                  <>
                     <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Higher transaction limits
                     </li>
                     <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Business account features
                     </li>
                     <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        TDS compliance automation
                     </li>
                  </>
               ) : (
                  <>
                     <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Post tasks and submit offers
                     </li>
                     <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Tax compliance
                     </li>
                  </>
               )}
            </ul>
         </div>

         <div className="flex flex-col gap-3">
            <Button
               onClick={() => router.push("/profile")}
               className="w-full h-12 text-base font-medium bg-primary-600 hover:bg-primary-700"
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
               We couldn&apos;t verify your PAN. Please try again.
            </p>
         </div>

         <div className="bg-red-50 rounded-xl p-4 text-sm text-red-700">
            {state.error ||
               "Please ensure the PAN details and document are correct."}
         </div>

         <div className="flex flex-col gap-3">
            <Button
               onClick={() =>
                  setState((p) => ({ ...p, step: "input", error: undefined }))
               }
               className="w-full h-12 text-base font-medium bg-gray-900 hover:bg-gray-800"
            >
               Try Again
            </Button>
            <Button
               variant="outline"
               onClick={() => router.push("/profile/verify")}
               className="w-full h-12 text-base"
            >
               Back to Verifications
            </Button>
         </div>
      </div>
   );

   // ========================================
   // Main Render
   // ========================================

   return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
         {/* Header */}
         <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
               <button
                  onClick={handleBack}
                  className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
               >
                  <ArrowLeft className="w-5 h-5" />
               </button>
               <h1 className="text-base font-semibold text-gray-900">
                  PAN Verification
               </h1>
               {isBusiness && (
                  <span className="ml-auto text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                     Business
                  </span>
               )}
            </div>
         </div>



         {/* Content */}
         <div className="max-w-5xl mx-auto px-4 py-8">
            {/* Title */}
            {(state.step === "input") && (
               <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 mb-4">
                     <FileText className="w-7 h-7 text-primary-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                     Verify Your PAN
                  </h1>
                  <p className="text-gray-500 mt-2">
                     {isBusiness
                        ? "Required for business accounts"
                        : "Required to post tasks and submit offers"}
                  </p>
               </div>
            )}

            {/* Steps */}
            {state.step === "input" && renderInputStep()}
            {state.step === "processing" && renderProcessingStep()}
            {state.step === "success" && renderSuccessStep()}
            {state.step === "error" && renderErrorStep()}
         </div>

         {/* Security Footer */}
         {(state.step === "input") && (
            <div className="max-w-lg mx-auto px-4 pb-8">
               <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Your data is encrypted and stored securely</span>
               </div>
            </div>
         )}
      </div>
   );
}
