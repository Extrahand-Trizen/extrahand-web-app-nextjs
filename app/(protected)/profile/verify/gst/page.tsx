/**
 * GST Verification Page
 * Business GST number verification
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
   AlertCircle,
   ArrowLeft,
   CheckCircle2,
   XCircle,
   RefreshCw,
   Receipt,
   Sparkles,
   Lock,
} from "lucide-react";
import { businessApi } from "@/lib/api/endpoints/business";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";

interface GSTVerificationState {
   step: "input" | "processing" | "success" | "error";
   gstNumber: string;
   consentGiven: boolean;
   verifiedData?: {
      gstNumber: string;
      isVerified: boolean;
      note?: string;
   };
   error?: string;
}

export default function GSTVerificationPage() {
   const router = useRouter();
   const { refreshUserData } = useAuth();

   const [state, setState] = useState<GSTVerificationState>({
      step: "input",
      gstNumber: "",
      consentGiven: false,
   });

   const [isLoading, setIsLoading] = useState(false);

   const handleBack = () => {
      router.push("/profile?section=verifications");
   };

   const validateGST = (gst: string): boolean => {
      // GST format: 2 digits + 5 letters + 4 digits + 1 letter + 1 alphanumeric + Z + 1 alphanumeric
      // Example: 22AAAAA0000A1Z5
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      return gstRegex.test(gst.toUpperCase());
   };

   const formatGST = (value: string): string => {
      return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 15);
   };

   const handleVerifyGST = async () => {
      // Validation
      if (!validateGST(state.gstNumber)) {
         setState((p) => ({
            ...p,
            error: "Please enter a valid GST number (e.g., 22AAAAA0000A1Z5)",
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
         // Call verification API
         const result = await businessApi.verifyGST(state.gstNumber);

         if (result.success) {
            setState((p) => ({
               ...p,
               step: "success",
               verifiedData: {
                  gstNumber: state.gstNumber,
                  isVerified: true,
                  note: result.data?.businessName 
                     ? `Business: ${result.data.businessName}${result.data.gstStatus ? ` | Status: ${result.data.gstStatus}` : ''}`
                     : undefined,
               },
            }));
            toast.success(result.message || "GST number verified successfully!");
            
            // Refresh user data
            await refreshUserData();
            router.refresh();
         } else {
            setState((p) => ({
               ...p,
               step: "error",
               error: result.message || "GST verification failed",
            }));
            toast.error(result.message || "GST verification failed");
         }
      } catch (error: any) {
         const errorMsg =
            error.response?.data?.error ||
            error.message ||
            "GST verification failed";
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

   const renderInputStep = () => (
      <div className="space-y-6">
         {/* GST Number */}
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
               GST Number (GSTIN)
            </label>
            <input
               type="text"
               value={state.gstNumber}
               onChange={(e) =>
                  setState((p) => ({
                     ...p,
                     gstNumber: formatGST(e.target.value),
                     error: undefined,
                  }))
               }
               placeholder="22AAAAA0000A1Z5"
               maxLength={15}
               className={cn(
                  "w-full px-4 py-3 text-base border rounded-xl transition-all duration-200 uppercase font-mono",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  state.error ? "border-red-300 bg-red-50/50" : "border-gray-200"
               )}
            />
            <p className="text-xs text-gray-500">
               Enter your 15-character GST identification number
            </p>
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
               <Receipt className="w-5 h-5 text-primary-600 mt-0.5" />
               <div>
                  <p className="text-sm font-medium text-primary-800">
                     GST Format Validation
                  </p>
                  <p className="text-xs text-primary-600 mt-1">
                     We'll validate your GST number format to ensure it's correct. Real-time GST API verification is coming soon for complete validation.
                  </p>
               </div>
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
                  I consent to verify my business GST number. I understand that this information will be stored securely and used for verification purposes only.
               </p>
            </div>
         </label>

         {/* Submit Button */}
         <Button
            onClick={handleVerifyGST}
            disabled={
               isLoading ||
               !state.gstNumber ||
               state.gstNumber.length !== 15 ||
               !state.consentGiven
            }
            className="w-full h-12 text-base font-medium bg-primary-700 hover:bg-primary-600"
         >
            {isLoading ? (
               <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
               </div>
            ) : (
               "Verify GST Number"
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
               Verifying GST Number
            </h2>
            <p className="text-gray-600">
               Please wait while we validate your GST number...
            </p>
         </div>

         <div className="bg-primary-50 rounded-xl p-4 text-sm text-primary-700">
            This usually takes a few seconds.
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
               GST Number Verified!
            </h2>
            <p className="text-gray-600">
               Your GST number <strong className="font-mono">{state.verifiedData?.gstNumber}</strong> has been verified.
            </p>
            {state.verifiedData?.note && (
               <p className="text-sm text-gray-500">
                  {state.verifiedData.note}
               </p>
            )}
         </div>

         <div className="bg-primary-50 rounded-xl p-4 text-left space-y-2">
            <p className="text-sm font-medium text-primary-800">
               Business Benefits Unlocked:
            </p>
            <ul className="space-y-2 text-sm text-primary-700">
               <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Enhanced business profile credibility
               </li>
               <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  B2B transaction capabilities
               </li>
               <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Priority support for business accounts
               </li>
            </ul>
         </div>

         <Button
            onClick={() => {
               router.push("/profile?section=verifications");
               router.refresh();
            }}
            className="w-full h-12 text-base font-medium bg-primary-600 hover:bg-primary-700"
         >
            Back to Verifications
         </Button>
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
               We couldn't verify your GST number. Please try again.
            </p>
         </div>

         <div className="bg-red-50 rounded-xl p-4 text-sm text-red-700">
            {state.error || "Please ensure your GST number is correct."}
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
               onClick={() => router.push("/profile?section=verifications")}
               className="w-full h-12 text-base"
            >
               Back to Verifications
            </Button>
         </div>
      </div>
   );

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
                  GST Verification
               </h1>
            </div>
         </div>

         {/* Content */}
         <div className="max-w-5xl mx-auto px-4 py-8">
            {state.step === "input" && (
               <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 mb-4">
                     <Receipt className="w-7 h-7 text-primary-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                     Verify Your GST Number
                  </h1>
                  <p className="text-gray-500 mt-2">
                     Validate your business GST identification number
                  </p>
               </div>
            )}

            {state.step === "input" && renderInputStep()}
            {state.step === "processing" && renderProcessingStep()}
            {state.step === "success" && renderSuccessStep()}
            {state.step === "error" && renderErrorStep()}
         </div>

         {/* Security Footer */}
         {state.step === "input" && (
            <div className="max-w-5xl mx-auto px-4 pb-8">
               <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Your data is encrypted and stored securely</span>
               </div>
            </div>
         )}
      </div>
   );
}
