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

interface PANVerificationState {
   step: "input" | "upload" | "processing" | "success" | "error";
   pan: string;
   name: string;
   panDocument: File | null;
   showPan: boolean;
   error?: string;
}

export default function PANVerificationPage() {
   const router = useRouter();
   const fileInputRef = useRef<HTMLInputElement>(null);

   const [state, setState] = useState<PANVerificationState>({
      step: "input",
      pan: "",
      name: "",
      panDocument: null,
      showPan: false,
   });

   const [isLoading, setIsLoading] = useState(false);

   const handleBack = () => {
      switch (state.step) {
         case "input":
            router.push("/profile/verify");
            break;
         case "upload":
            setState((p) => ({ ...p, step: "input" }));
            break;
         default:
            router.push("/profile/verify");
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

      if (!state.name.trim()) {
         setState((p) => ({
            ...p,
            error: "Please enter the name as per PAN card",
         }));
         return;
      }

      setIsLoading(true);
      setState((p) => ({ ...p, error: undefined }));

      try {
         // TODO: Replace with actual PAN verification API
         await new Promise((r) => setTimeout(r, 2000));
         setState((p) => ({ ...p, step: "upload" }));
      } catch {
         setState((p) => ({
            ...p,
            error: "PAN verification failed. Please check and try again.",
         }));
      } finally {
         setIsLoading(false);
      }
   };

   const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         // Validate file type
         if (
            !["image/jpeg", "image/png", "application/pdf"].includes(file.type)
         ) {
            setState((p) => ({
               ...p,
               error: "Please upload a JPG, PNG, or PDF file",
            }));
            return;
         }
         // Validate file size (max 5MB)
         if (file.size > 5 * 1024 * 1024) {
            setState((p) => ({
               ...p,
               error: "File size must be less than 5MB",
            }));
            return;
         }
         setState((p) => ({
            ...p,
            panDocument: file,
            error: undefined,
         }));
      }
   };

   const handleSubmit = async () => {
      if (!state.panDocument) {
         setState((p) => ({
            ...p,
            error: "Please upload your PAN card document",
         }));
         return;
      }

      setIsLoading(true);
      setState((p) => ({ ...p, step: "processing", error: undefined }));

      try {
         // TODO: Replace with actual API call to upload and verify
         await new Promise((r) => setTimeout(r, 3000));
         setState((p) => ({ ...p, step: "success" }));
      } catch {
         setState((p) => ({
            ...p,
            step: "error",
            error: "Verification failed. Please try again.",
         }));
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
                     Business Account Requirement
                  </p>
                  <p className="text-xs text-primary-600 mt-1">
                     PAN verification is mandatory for business accounts to
                     ensure tax compliance and enable higher transaction limits.
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
                  { icon: BadgeCheck, text: "Unlock higher payout limits" },
                  { icon: Shield, text: "Ensure tax compliance" },
                  { icon: Building2, text: "Access business features" },
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

         {/* Submit Button */}
         <Button
            onClick={handleVerifyPAN}
            disabled={
               isLoading || state.pan.length !== 10 || !state.name.trim()
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

   const renderUploadStep = () => (
      <div className="space-y-6">
         {/* Verified PAN Info */}
         <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
               </div>
               <div>
                  <p className="text-sm font-medium text-green-800">
                     PAN Verified: {maskPAN(state.pan)}
                  </p>
                  <p className="text-xs text-green-600">{state.name}</p>
               </div>
            </div>
         </div>

         {/* Document Upload */}
         <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
               Upload PAN Card Image
            </label>
            <input
               ref={fileInputRef}
               type="file"
               accept="image/jpeg,image/png,application/pdf"
               onChange={handleDocumentUpload}
               className="hidden"
            />
            <div
               onClick={() => fileInputRef.current?.click()}
               className={cn(
                  "flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-xl cursor-pointer transition-all",
                  state.panDocument
                     ? "border-green-300 bg-green-50"
                     : "border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100"
               )}
            >
               {state.panDocument ? (
                  <>
                     <CheckCircle2 className="w-10 h-10 text-green-500 mb-3" />
                     <span className="text-sm font-medium text-green-700">
                        {state.panDocument.name}
                     </span>
                     <span className="text-xs text-green-600 mt-1">
                        Click to change file
                     </span>
                  </>
               ) : (
                  <>
                     <Upload className="w-10 h-10 text-gray-400 mb-3" />
                     <span className="text-sm font-medium text-gray-700">
                        Click to upload
                     </span>
                     <span className="text-xs text-gray-500 mt-1">
                        JPG, PNG or PDF (max 5MB)
                     </span>
                  </>
               )}
            </div>
         </div>

         {/* Error */}
         {state.error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 rounded-lg p-3">
               <AlertCircle className="w-4 h-4 shrink-0" />
               {state.error}
            </div>
         )}

         {/* Guidelines */}
         <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs font-medium text-gray-700 mb-2">
               Upload Guidelines:
            </p>
            <ul className="space-y-1.5 text-xs text-gray-600">
               <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5" />
                  Clear image showing full PAN card
               </li>
               <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5" />
                  All details should be readable
               </li>
               <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5" />
                  No blurry or cropped images
               </li>
            </ul>
         </div>

         {/* Actions */}
         <div className="flex gap-3">
            <Button
               variant="outline"
               onClick={() => setState((p) => ({ ...p, step: "input" }))}
               className="flex-1 h-12"
            >
               Back
            </Button>
            <Button
               onClick={handleSubmit}
               disabled={isLoading || !state.panDocument}
               className="flex-1 h-12 bg-gray-900 hover:bg-gray-800"
            >
               {isLoading ? (
                  <div className="flex items-center gap-2">
                     <RefreshCw className="w-4 h-4 animate-spin" />
                     Submitting...
                  </div>
               ) : (
                  "Submit for Verification"
               )}
            </Button>
         </div>
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
               Your PAN <strong>{maskPAN(state.pan)}</strong> has been verified.
            </p>
         </div>

         <div className="bg-primary-50 rounded-xl p-4 text-left space-y-2">
            <p className="text-sm font-medium text-primary-800">
               You&apos;ve unlocked:
            </p>
            <ul className="space-y-2 text-sm text-primary-700">
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
            <div className="max-w-lg mx-auto px-4 h-14 flex items-center gap-3">
               <button
                  onClick={handleBack}
                  className="p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
               >
                  <ArrowLeft className="w-5 h-5" />
               </button>
               <h1 className="text-base font-semibold text-gray-900">
                  PAN Verification
               </h1>
               <span className="ml-auto text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                  Business
               </span>
            </div>
         </div>

         {/* Progress Steps */}
         {(state.step === "input" || state.step === "upload") && (
            <div className="max-w-lg mx-auto px-4 pt-6">
               <div className="flex items-center gap-2">
                  <div
                     className={cn(
                        "flex-1 h-1.5 rounded-full transition-colors",
                        "bg-primary-500"
                     )}
                  />
                  <div
                     className={cn(
                        "flex-1 h-1.5 rounded-full transition-colors",
                        state.step === "upload"
                           ? "bg-primary-500"
                           : "bg-gray-200"
                     )}
                  />
               </div>
               <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Enter PAN</span>
                  <span>Upload Document</span>
               </div>
            </div>
         )}

         {/* Content */}
         <div className="max-w-lg mx-auto px-4 py-8">
            {/* Title */}
            {(state.step === "input" || state.step === "upload") && (
               <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary-100 mb-4">
                     <FileText className="w-7 h-7 text-primary-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                     {state.step === "input"
                        ? "Verify Your PAN"
                        : "Upload PAN Card"}
                  </h1>
                  <p className="text-gray-500 mt-2">
                     {state.step === "input"
                        ? "Required for business accounts"
                        : "Upload a clear image of your PAN card"}
                  </p>
               </div>
            )}

            {/* Steps */}
            {state.step === "input" && renderInputStep()}
            {state.step === "upload" && renderUploadStep()}
            {state.step === "processing" && renderProcessingStep()}
            {state.step === "success" && renderSuccessStep()}
            {state.step === "error" && renderErrorStep()}
         </div>

         {/* Security Footer */}
         {(state.step === "input" || state.step === "upload") && (
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
