/**
 * Bank Account Verification Page
 * Individual bank account verification with penny drop
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
   Building2,
   Lock,
   AlertCircle,
   ArrowLeft,
   CheckCircle2,
   Shield,
   XCircle,
   RefreshCw,
   Landmark,
   Sparkles,
   BadgeCheck,
} from "lucide-react";
import { verificationApi } from "@/lib/api/endpoints/verification";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";

interface BankVerificationState {
   step: "input" | "processing" | "success" | "error";
   accountNumber: string;
   confirmAccountNumber: string;
   ifsc: string;
   accountHolderName: string;
   consentGiven: boolean;
   verifiedData?: {
      accountHolderName: string;
      bankName: string;
      ifsc: string;
      maskedBankAccount: string;
   };
   error?: string;
}

export default function BankVerificationPage() {
   const router = useRouter();
   const { refreshUserData } = useAuth();

   const [state, setState] = useState<BankVerificationState>({
      step: "input",
      accountNumber: "",
      confirmAccountNumber: "",
      ifsc: "",
      accountHolderName: "",
      consentGiven: false,
   });

   const [isLoading, setIsLoading] = useState(false);

   const handleBack = () => {
      router.push("/profile?section=verifications");
   };

   const validateIFSC = (ifsc: string): boolean => {
      // IFSC format: 4 letters, 0, 6 alphanumeric (e.g., YESB0000262)
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      return ifscRegex.test(ifsc.toUpperCase());
   };

   const formatIFSC = (value: string): string => {
      return value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 11);
   };

   const handleVerifyBank = async () => {
      // Validation
      if (!state.accountNumber || state.accountNumber.length < 9) {
         setState((p) => ({
            ...p,
            error: "Please enter a valid account number",
         }));
         return;
      }

      if (state.accountNumber !== state.confirmAccountNumber) {
         setState((p) => ({
            ...p,
            error: "Account numbers do not match",
         }));
         return;
      }

      if (!validateIFSC(state.ifsc)) {
         setState((p) => ({
            ...p,
            error: "Please enter a valid IFSC code (e.g., YESB0000262)",
         }));
         return;
      }

      if (!state.accountHolderName.trim()) {
         setState((p) => ({
            ...p,
            error: "Please enter account holder name",
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
         const result = await verificationApi.verifyBankAccount(
            state.accountNumber,
            state.ifsc,
            state.accountHolderName,
            {
               given: true,
               text: "I consent to verify my bank account details for secure transactions",
               version: "v1.0",
            }
         );

         if (result.success) {
            setState((p) => ({
               ...p,
               step: "success",
               verifiedData: result.data,
            }));
            toast.success(result.message || "Bank account verified successfully!");
            
            // Refresh user data
            await refreshUserData();
            router.refresh();
         } else {
            setState((p) => ({
               ...p,
               step: "error",
               error: result.message || "Bank verification failed",
            }));
            toast.error(result.message || "Bank verification failed");
         }
      } catch (error: any) {
         const errorMsg =
            error.response?.data?.error ||
            error.message ||
            "Bank verification failed";
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
         {/* Account Number */}
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
               Account Number
            </label>
            <input
               type="text"
               value={state.accountNumber}
               onChange={(e) =>
                  setState((p) => ({
                     ...p,
                     accountNumber: e.target.value.replace(/[^0-9]/g, ""),
                     error: undefined,
                  }))
               }
               placeholder="Enter your account number"
               className={cn(
                  "w-full px-4 py-3 text-base border rounded-xl transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  state.error ? "border-red-300 bg-red-50/50" : "border-gray-200"
               )}
            />
         </div>

         {/* Confirm Account Number */}
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
               Confirm Account Number
            </label>
            <input
               type="text"
               value={state.confirmAccountNumber}
               onChange={(e) =>
                  setState((p) => ({
                     ...p,
                     confirmAccountNumber: e.target.value.replace(/[^0-9]/g, ""),
                     error: undefined,
                  }))
               }
               placeholder="Re-enter your account number"
               className={cn(
                  "w-full px-4 py-3 text-base border rounded-xl transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  "border-gray-200"
               )}
            />
         </div>

         {/* IFSC Code */}
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
               IFSC Code
            </label>
            <input
               type="text"
               value={state.ifsc}
               onChange={(e) =>
                  setState((p) => ({
                     ...p,
                     ifsc: formatIFSC(e.target.value),
                     error: undefined,
                  }))
               }
               placeholder="YESB0000262"
               maxLength={11}
               className={cn(
                  "w-full px-4 py-3 text-base border rounded-xl transition-all duration-200 uppercase",
                  "focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500",
                  "border-gray-200"
               )}
            />
         </div>

         {/* Account Holder Name */}
         <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
               Account Holder Name
            </label>
            <input
               type="text"
               value={state.accountHolderName}
               onChange={(e) =>
                  setState((p) => ({
                     ...p,
                     accountHolderName: e.target.value.toUpperCase(),
                     error: undefined,
                  }))
               }
               placeholder="AS PER BANK RECORDS"
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
               <Landmark className="w-5 h-5 text-primary-600 mt-0.5" />
               <div>
                  <p className="text-sm font-medium text-primary-800">
                     Penny Drop Verification
                  </p>
                  <p className="text-xs text-primary-600 mt-1">
                     We'll verify your bank account details instantly using secure penny drop verification. Your bank account will be credited with ₹1 which will be reversed automatically.
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
                  I consent to verify my bank account details for secure transactions. I understand that my account details will be verified through official banking channels and only masked information will be stored.
               </p>
            </div>
         </label>

         {/* Submit Button */}
         <Button
            onClick={handleVerifyBank}
            disabled={
               isLoading ||
               !state.accountNumber ||
               !state.confirmAccountNumber ||
               !state.ifsc ||
               !state.accountHolderName ||
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
               "Verify Bank Account"
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
               Verifying Bank Account
            </h2>
            <p className="text-gray-600">
               Please wait while we verify your bank details...
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
               Bank Account Verified!
            </h2>
            <p className="text-gray-600">
               Your account <strong>{state.verifiedData?.maskedBankAccount}</strong> has been verified.
            </p>
            <p className="text-sm text-gray-500">
               {state.verifiedData?.bankName} - {state.verifiedData?.accountHolderName}
            </p>
         </div>

         <div className="bg-primary-50 rounded-xl p-4 text-left space-y-2">
            <p className="text-sm font-medium text-primary-800">
               You've unlocked:
            </p>
            <ul className="space-y-2 text-sm text-primary-700">
               <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Secure payment processing
               </li>
               <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Instant withdrawals
               </li>
               <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Higher transaction limits
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
               We couldn't verify your bank account. Please try again.
            </p>
         </div>

         <div className="bg-red-50 rounded-xl p-4 text-sm text-red-700">
            {state.error || "Please ensure your bank details are correct."}
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
                  Bank Account Verification
               </h1>
            </div>
         </div>

         {/* Content */}
         <div className="max-w-5xl mx-auto px-4 py-8">
            {state.step === "input" && (
               <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 mb-4">
                     <Landmark className="w-7 h-7 text-primary-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                     Verify Your Bank Account
                  </h1>
                  <p className="text-gray-500 mt-2">
                     Secure your account with bank verification
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
