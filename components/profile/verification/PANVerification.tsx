/**
 * PAN Verification Component
 * For business accounts - verifies Permanent Account Number (PAN)
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
   FileText,
   CheckCircle2,
   AlertCircle,
   X,
   Upload,
   Eye,
   EyeOff,
} from "lucide-react";
import { FormInput, LoadingButton } from "./VerificationComponents";

interface PANVerificationProps {
   currentPAN?: string;
   maskedPAN?: string;
   isVerified: boolean;
   onVerificationComplete?: () => void;
}

type PANStep = "display" | "input" | "upload" | "pending" | "verified";

export function PANVerification({
   currentPAN,
   maskedPAN,
   isVerified,
   onVerificationComplete,
}: PANVerificationProps) {
   const [step, setStep] = useState<PANStep>(
      isVerified ? "verified" : "display"
   );
   const [pan, setPan] = useState(currentPAN || "");
   const [name, setName] = useState("");
   const [showPan, setShowPan] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | undefined>();
   const [panDocument, setPanDocument] = useState<File | null>(null);

   const validatePAN = (pan: string): boolean => {
      // PAN format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
      return panRegex.test(pan.toUpperCase());
   };

   const formatPANInput = (value: string): string => {
      // Remove non-alphanumeric and uppercase
      return value
         .replace(/[^a-zA-Z0-9]/g, "")
         .toUpperCase()
         .slice(0, 10);
   };

   const handleVerifyPAN = async () => {
      if (!validatePAN(pan)) {
         setError("Please enter a valid PAN (e.g., ABCDE1234F)");
         return;
      }

      if (!name.trim()) {
         setError("Please enter the name as per PAN card");
         return;
      }

      setIsLoading(true);
      setError(undefined);

      try {
         // TODO: Replace with actual PAN verification API
         await simulateApiCall(2000);
         setStep("upload");
      } catch {
         setError("PAN verification failed. Please check and try again.");
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
            setError("Please upload a JPG, PNG, or PDF file");
            return;
         }
         // Validate file size (max 5MB)
         if (file.size > 5 * 1024 * 1024) {
            setError("File size must be less than 5MB");
            return;
         }
         setPanDocument(file);
         setError(undefined);
      }
   };

   const handleSubmit = async () => {
      if (!panDocument) {
         setError("Please upload your PAN card document");
         return;
      }

      setIsLoading(true);
      setError(undefined);

      try {
         // TODO: Replace with actual API call to upload and verify
         await simulateApiCall(2500);
         setStep("verified");
         onVerificationComplete?.();
      } catch {
         setError("Failed to submit. Please try again.");
      } finally {
         setIsLoading(false);
      }
   };

   const handleCancel = () => {
      setStep("display");
      setPan(currentPAN || "");
      setName("");
      setPanDocument(null);
      setError(undefined);
   };

   const maskPAN = (pan: string): string => {
      if (pan.length !== 10) return pan;
      return `XXXXX${pan.slice(5, 9)}${pan.slice(9)}`;
   };

   // Verified state
   if (step === "verified") {
      return (
         <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
               <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-green-600" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                     <h3 className="text-sm font-medium text-gray-900">
                        PAN Verification
                     </h3>
                     <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                     </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                     {maskedPAN || maskPAN(pan)}
                  </p>
               </div>
               <div className="hidden sm:flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
               </div>
            </div>
         </div>
      );
   }

   // Pending state (submitted, awaiting verification)
   if (step === "pending") {
      return (
         <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
               <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-yellow-600" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                     <h3 className="text-sm font-medium text-gray-900">
                        PAN Verification
                     </h3>
                     <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-700 bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Pending
                     </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                     Verification in progress (1-2 business days)
                  </p>
               </div>
            </div>
         </div>
      );
   }

   // Display state (not verified, show start button)
   if (step === "display") {
      return (
         <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3 sm:gap-4">
               <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-gray-400" />
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                     <h3 className="text-sm font-medium text-gray-900">
                        PAN Verification
                     </h3>
                     <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                        Business
                     </span>
                     <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
                        <AlertCircle className="w-3 h-3" />
                        Not started
                     </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-0.5">
                     Required for business accounts & tax compliance
                  </p>
               </div>
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep("input")}
                  className="hidden sm:flex text-xs h-8 px-3"
               >
                  Verify PAN
               </Button>
            </div>
            <Button
               variant="outline"
               size="sm"
               onClick={() => setStep("input")}
               className="w-full mt-3 text-xs h-9 sm:hidden"
            >
               Verify PAN
            </Button>
         </div>
      );
   }

   // Input state (enter PAN details)
   if (step === "input") {
      return (
         <div className="p-4 sm:p-5 border-l-2 border-gray-900">
            <div className="flex items-center justify-between mb-4">
               <h3 className="text-sm font-medium text-gray-900">
                  PAN Verification
               </h3>
               <button
                  onClick={handleCancel}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
               >
                  <X className="w-4 h-4" />
               </button>
            </div>

            <div className="space-y-4">
               {/* PAN Number Input */}
               <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                     PAN Number
                  </label>
                  <div className="relative">
                     <input
                        type={showPan ? "text" : "password"}
                        value={pan}
                        onChange={(e) => {
                           setPan(formatPANInput(e.target.value));
                           setError(undefined);
                        }}
                        placeholder="ABCDE1234F"
                        maxLength={10}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 uppercase tracking-wider"
                     />
                     <button
                        type="button"
                        onClick={() => setShowPan(!showPan)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                     >
                        {showPan ? (
                           <EyeOff className="w-4 h-4" />
                        ) : (
                           <Eye className="w-4 h-4" />
                        )}
                     </button>
                  </div>
               </div>

               {/* Name as per PAN */}
               <FormInput
                  label="Name as per PAN Card"
                  type="text"
                  value={name}
                  onChange={(e) => {
                     setName(e.target.value.toUpperCase());
                     setError(undefined);
                  }}
                  placeholder="FULL NAME AS PER PAN"
                  className="uppercase"
               />

               {error && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                     <AlertCircle className="w-3 h-3" />
                     {error}
                  </p>
               )}

               <p className="text-xs text-gray-500">
                  Your PAN will be verified instantly with the Income Tax
                  Department
               </p>

               <div className="flex gap-3">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={handleCancel}
                     className="flex-1 h-9"
                  >
                     Cancel
                  </Button>
                  <LoadingButton
                     size="sm"
                     onClick={handleVerifyPAN}
                     loading={isLoading}
                     loadingText="Verifying..."
                     className="flex-1 h-9 bg-gray-900 hover:bg-gray-800"
                  >
                     Verify PAN
                  </LoadingButton>
               </div>
            </div>
         </div>
      );
   }

   // Upload state (upload PAN document)
   return (
      <div className="p-4 sm:p-5 border-l-2 border-gray-900">
         <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-900">
               Upload PAN Card
            </h3>
            <button
               onClick={handleCancel}
               className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
               <X className="w-4 h-4" />
            </button>
         </div>

         <div className="space-y-4">
            {/* PAN Verified Status */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
               <div className="flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle2 className="w-4 h-4" />
                  <span className="font-medium">
                     PAN verified: {maskPAN(pan)}
                  </span>
               </div>
               <p className="text-xs text-green-600 mt-1 ml-6">Name: {name}</p>
            </div>

            {/* Document Upload */}
            <div>
               <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Upload PAN Card Image
               </label>
               <div className="relative">
                  <input
                     type="file"
                     accept="image/jpeg,image/png,application/pdf"
                     onChange={handleDocumentUpload}
                     className="hidden"
                     id="pan-upload"
                  />
                  <label
                     htmlFor="pan-upload"
                     className={`flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        panDocument
                           ? "border-green-300 bg-green-50"
                           : "border-gray-200 hover:border-gray-300 bg-gray-50"
                     }`}
                  >
                     {panDocument ? (
                        <>
                           <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                           <span className="text-sm font-medium text-green-700">
                              {panDocument.name}
                           </span>
                           <span className="text-xs text-green-600 mt-1">
                              Click to change file
                           </span>
                        </>
                     ) : (
                        <>
                           <Upload className="w-8 h-8 text-gray-400 mb-2" />
                           <span className="text-sm font-medium text-gray-700">
                              Click to upload
                           </span>
                           <span className="text-xs text-gray-500 mt-1">
                              JPG, PNG or PDF (max 5MB)
                           </span>
                        </>
                     )}
                  </label>
               </div>
            </div>

            {error && (
               <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {error}
               </p>
            )}

            <p className="text-xs text-gray-500">
               Upload a clear image of your PAN card for final verification
            </p>

            <div className="flex gap-3">
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStep("input")}
                  className="flex-1 h-9"
               >
                  Back
               </Button>
               <LoadingButton
                  size="sm"
                  onClick={handleSubmit}
                  loading={isLoading}
                  loadingText="Submitting..."
                  disabled={!panDocument}
                  className="flex-1 h-9 bg-gray-900 hover:bg-gray-800"
               >
                  Submit
               </LoadingButton>
            </div>
         </div>
      </div>
   );
}

// ============================================
// Helper Functions
// ============================================

function simulateApiCall(delay: number): Promise<void> {
   return new Promise((resolve) => setTimeout(resolve, delay));
}

export default PANVerification;
