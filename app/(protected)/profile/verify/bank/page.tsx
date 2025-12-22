/**
 * Bank Verification Page
 * Beautiful, responsive penny-drop bank verification
 */

"use client";

import React, { useState, useRef, useEffect } from "react";
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
   CreditCard,
   IndianRupee,
   User,
   Hash,
   Clock,
   Wallet,
   Info,
} from "lucide-react";
import { BANK_CONSENT } from "@/types/verification";

interface BankVerificationState {
   step: "input" | "verifying" | "penny-drop" | "success" | "error";
   accountNumber: string;
   confirmAccountNumber: string;
   ifscCode: string;
   accountHolderName: string;
   pennyAmount?: string;
   attemptsRemaining: number;
   error?: string;
   verifiedData?: {
      bankName: string;
      branch: string;
      maskedAccount: string;
      holderName: string;
   };
}

export default function BankVerificationPage() {
   const router = useRouter();
   const accountRef = useRef<HTMLInputElement>(null);

   const [state, setState] = useState<BankVerificationState>({
      step: "input",
      accountNumber: "",
      confirmAccountNumber: "",
      ifscCode: "",
      accountHolderName: "",
      attemptsRemaining: 3,
   });

   const [isLoading, setIsLoading] = useState(false);
   const [bankDetails, setBankDetails] = useState<{
      name: string;
      branch: string;
   } | null>(null);

   useEffect(() => {
      if (state.step === "input" && accountRef.current) {
         accountRef.current.focus();
      }
   }, [state.step]);

   // Auto-fetch bank details from IFSC
   useEffect(() => {
      const fetchBankDetails = async () => {
         if (state.ifscCode.length === 11) {
            try {
               // Simulated IFSC lookup
               await new Promise((r) => setTimeout(r, 500));
               setBankDetails({
                  name: "State Bank of India",
                  branch: "Connaught Place, New Delhi",
               });
            } catch {
               setBankDetails(null);
            }
         } else {
            setBankDetails(null);
         }
      };
      fetchBankDetails();
   }, [state.ifscCode]);

   const handleBack = () => {
      switch (state.step) {
         case "input":
            router.push("/profile/verify");
            break;
         case "penny-drop":
            setState((p) => ({ ...p, step: "input", pennyAmount: undefined }));
            break;
         default:
            router.push("/profile/verify");
      }
   };

   const validateForm = (): string | null => {
      if (!state.accountNumber || state.accountNumber.length < 9)
         return "Invalid account number";
      if (state.accountNumber !== state.confirmAccountNumber)
         return "Account numbers don't match";
      if (!state.ifscCode || state.ifscCode.length !== 11)
         return "Invalid IFSC code";
      if (!state.accountHolderName.trim())
         return "Account holder name is required";
      return null;
   };

   const handleSubmitDetails = async () => {
      const error = validateForm();
      if (error) {
         setState((p) => ({ ...p, error }));
         return;
      }
      setIsLoading(true);
      setState((p) => ({ ...p, error: undefined, step: "verifying" }));
      try {
         await new Promise((r) => setTimeout(r, 2500));
         // Random penny amount between ₹1.00 and ₹1.99
         const penny = (1 + Math.random()).toFixed(2);
         setState((p) => ({ ...p, step: "penny-drop", pennyAmount: penny }));
      } catch {
         setState((p) => ({
            ...p,
            step: "input",
            error: "Verification failed. Please try again.",
         }));
      } finally {
         setIsLoading(false);
      }
   };

   const handleVerifyPenny = async () => {
      setIsLoading(true);
      setState((p) => ({ ...p, error: undefined }));
      try {
         await new Promise((r) => setTimeout(r, 2000));
         setState((p) => ({
            ...p,
            step: "success",
            verifiedData: {
               bankName: bankDetails?.name || "Bank",
               branch: bankDetails?.branch || "",
               maskedAccount: `XXXX ${state.accountNumber.slice(-4)}`,
               holderName: state.accountHolderName.toUpperCase(),
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
               error: `Verification failed. ${newAttempts} attempts left.`,
            }));
         }
      } finally {
         setIsLoading(false);
      }
   };

   const stepNum =
      { input: 1, verifying: 2, "penny-drop": 2, success: 3, error: 3 }[
         state.step
      ] || 1;
   const showBack = !["success", "verifying"].includes(state.step);

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
                     Bank Verification
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
                                 s <= stepNum
                                    ? "bg-primary-600"
                                    : "bg-slate-200"
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
            {state.step === "input" && (
               <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="text-center pb-2">
                     <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-primary-50 flex items-center justify-center mb-4 shadow-sm">
                        <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
                     </div>
                     <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                        Link your bank
                     </h2>
                     <p className="text-sm text-slate-500 mt-2">
                        Secure penny-drop verification
                     </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                     <div className="p-4 sm:p-5 border-b border-slate-100">
                        <h3 className="text-sm font-semibold text-slate-900">
                           Why link bank?
                        </h3>
                     </div>
                     <div className="p-4 sm:p-5 space-y-3">
                        {[
                           {
                              icon: Wallet,
                              text: "Receive task payments directly",
                           },
                           { icon: Shield, text: "Secure & instant transfers" },
                           { icon: IndianRupee, text: "No transaction fees" },
                        ].map((item, i) => (
                           <div key={i} className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                                 <item.icon className="w-4 h-4 text-primary-600" />
                              </div>
                              <span className="text-xs md:text-sm text-slate-700">
                                 {item.text}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
                     {/* Account Number */}
                     <div>
                        <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-700 mb-2">
                           <CreditCard className="w-4 h-4" />
                           Account Number
                        </label>
                        <input
                           ref={accountRef}
                           type="text"
                           inputMode="numeric"
                           value={state.accountNumber}
                           onChange={(e) =>
                              setState((p) => ({
                                 ...p,
                                 accountNumber: e.target.value.replace(
                                    /\D/g,
                                    ""
                                 ),
                                 error: undefined,
                              }))
                           }
                           placeholder="Enter account number"
                           maxLength={18}
                           className="w-full px-4 py-3 text-sm md:text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                     </div>

                     {/* Confirm Account Number */}
                     <div>
                        <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-700 mb-2">
                           <Hash className="w-4 h-4" />
                           Confirm Account Number
                        </label>
                        <input
                           type="text"
                           inputMode="numeric"
                           value={state.confirmAccountNumber}
                           onChange={(e) =>
                              setState((p) => ({
                                 ...p,
                                 confirmAccountNumber: e.target.value.replace(
                                    /\D/g,
                                    ""
                                 ),
                                 error: undefined,
                              }))
                           }
                           placeholder="Re-enter account number"
                           maxLength={18}
                           className={cn(
                              "w-full px-4 py-3 text-sm md:text-base border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500",
                              state.confirmAccountNumber &&
                                 state.accountNumber !==
                                    state.confirmAccountNumber
                                 ? "border-red-300 bg-red-50"
                                 : state.confirmAccountNumber &&
                                   state.accountNumber ===
                                      state.confirmAccountNumber
                                 ? "border-green-300 bg-green-50"
                                 : "border-slate-200"
                           )}
                        />
                        {state.confirmAccountNumber &&
                           state.accountNumber ===
                              state.confirmAccountNumber && (
                              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                 <CheckCircle2 className="w-3 h-3" /> Account
                                 numbers match
                              </p>
                           )}
                     </div>

                     {/* IFSC Code */}
                     <div>
                        <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-700 mb-2">
                           <Building2 className="w-4 h-4" />
                           IFSC Code
                        </label>
                        <input
                           type="text"
                           value={state.ifscCode}
                           onChange={(e) =>
                              setState((p) => ({
                                 ...p,
                                 ifscCode: e.target.value
                                    .toUpperCase()
                                    .slice(0, 11),
                                 error: undefined,
                              }))
                           }
                           placeholder="e.g., SBIN0001234"
                           maxLength={11}
                           className="w-full px-4 py-3 text-sm md:text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
                        />
                        {bankDetails && (
                           <div className="mt-2 p-3 bg-primary-50 rounded-lg">
                              <p className="text-sm font-medium text-primary-900">
                                 {bankDetails.name}
                              </p>
                              <p className="text-xs text-primary-600">
                                 {bankDetails.branch}
                              </p>
                           </div>
                        )}
                     </div>

                     {/* Account Holder Name */}
                     <div>
                        <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-700 mb-2">
                           <User className="w-4 h-4" />
                           Account Holder Name
                        </label>
                        <input
                           type="text"
                           value={state.accountHolderName}
                           onChange={(e) =>
                              setState((p) => ({
                                 ...p,
                                 accountHolderName: e.target.value,
                                 error: undefined,
                              }))
                           }
                           placeholder="As per bank records"
                           className="w-full px-4 py-3 text-sm md:text-base border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                     </div>

                     {state.error && (
                        <div className="flex items-center gap-2 text-sm text-red-600 p-3 bg-red-50 rounded-lg">
                           <AlertCircle className="w-4 h-4 shrink-0" />
                           <span>{state.error}</span>
                        </div>
                     )}

                     <div className="text-xs text-slate-500 leading-relaxed">
                        <p className="mt-2">{BANK_CONSENT.paragraph}</p>
                        <ul className="list-disc pl-4 space-y-1">
                           {BANK_CONSENT.points.map((p, i) => (
                              <li key={i}>{p}</li>
                           ))}
                        </ul>
                     </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                     <Lock className="w-3.5 h-3.5" />
                     <span>Bank-grade encryption</span>
                  </div>

                  <Button
                     onClick={handleSubmitDetails}
                     disabled={
                        !state.accountNumber ||
                        !state.confirmAccountNumber ||
                        !state.ifscCode ||
                        !state.accountHolderName ||
                        isLoading
                     }
                     className="w-full h-12 text-sm font-medium bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-500 rounded-xl"
                  >
                     {isLoading ? (
                        <span className="flex items-center gap-2">
                           <RefreshCw className="w-4 h-4 animate-spin" />
                           Verifying...
                        </span>
                     ) : (
                        "Verify Bank Account"
                     )}
                  </Button>
               </div>
            )}

            {state.step === "verifying" && (
               <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="text-center py-12">
                     <div className="w-20 h-20 mx-auto rounded-full bg-primary-50 flex items-center justify-center mb-6">
                        <RefreshCw className="w-10 h-10 text-primary-600 animate-spin" />
                     </div>
                     <h2 className="text-xl font-bold text-slate-900">
                        Verifying your bank
                     </h2>
                     <p className="text-sm text-slate-500 mt-2">
                        We're sending a small amount to your account...
                     </p>
                     <div className="mt-6 space-y-2">
                        {[
                           { text: "Validating account details", done: true },
                           { text: "Initiating penny drop", done: true },
                           { text: "Waiting for confirmation", done: false },
                        ].map((item, i) => (
                           <div
                              key={i}
                              className="flex items-center justify-center gap-2 text-sm"
                           >
                              {item.done ? (
                                 <CheckCircle2 className="w-4 h-4 text-green-500" />
                              ) : (
                                 <Clock className="w-4 h-4 text-slate-400 animate-pulse" />
                              )}
                              <span
                                 className={
                                    item.done
                                       ? "text-slate-700"
                                       : "text-slate-500"
                                 }
                              >
                                 {item.text}
                              </span>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            {state.step === "penny-drop" && (
               <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
                  <div className="text-center">
                     <div className="w-14 h-14 mx-auto rounded-xl bg-green-50 flex items-center justify-center mb-4">
                        <IndianRupee className="w-7 h-7 text-green-600" />
                     </div>
                     <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                        Confirm penny drop
                     </h2>
                     <p className="text-sm text-slate-500 mt-1">
                        We've sent a small amount to your account
                     </p>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
                     <div className="text-center">
                        <p className="text-sm text-slate-500">
                           Amount credited
                        </p>
                        <p className="text-4xl font-bold text-green-600 mt-2">
                           ₹{state.pennyAmount}
                        </p>
                        <p className="text-xs text-slate-500 mt-2">
                           Check your bank statement or SMS
                        </p>
                     </div>
                     <div className="mt-6 p-4 bg-slate-50 rounded-xl space-y-2">
                        <div className="flex justify-between text-sm">
                           <span className="text-slate-500">Account</span>
                           <span className="font-medium text-slate-900">
                              XXXX {state.accountNumber.slice(-4)}
                           </span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-slate-500">Bank</span>
                           <span className="font-medium text-slate-900">
                              {bankDetails?.name}
                           </span>
                        </div>
                     </div>
                     {state.error && (
                        <div className="flex items-center gap-2 mt-4 text-sm text-red-600">
                           <AlertCircle className="w-4 h-4" />
                           <span>{state.error}</span>
                        </div>
                     )}
                  </div>

                  <div className="bg-amber-50 rounded-xl p-4 flex gap-3">
                     <Info className="w-5 h-5 text-amber-600 shrink-0" />
                     <p className="text-xs text-amber-700">
                        This amount will be adjusted in your first payout.
                        Please click confirm once you've received it.
                     </p>
                  </div>

                  <Button
                     onClick={handleVerifyPenny}
                     disabled={isLoading}
                     className="w-full h-12 text-sm font-medium bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-500 rounded-xl"
                  >
                     {isLoading ? (
                        <span className="flex items-center gap-2">
                           <RefreshCw className="w-4 h-4 animate-spin" />
                           Confirming...
                        </span>
                     ) : (
                        "Confirm Receipt"
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
                        Bank Verified!
                     </h2>
                     <p className="text-sm text-slate-500 mt-2">
                        Your bank account has been linked
                     </p>
                  </div>
                  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                     <div className="p-4 sm:p-5 border-b border-slate-100 bg-primary-50/50">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <Building2 className="w-5 h-5 text-primary-600" />
                           </div>
                           <div>
                              <p className="text-xs text-primary-600 font-medium">
                                 Verified Account
                              </p>
                              <p className="text-sm font-semibold text-slate-900">
                                 {state.verifiedData?.bankName}
                              </p>
                           </div>
                        </div>
                     </div>
                     <div className="p-4 sm:p-5 space-y-3">
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-slate-500">
                              Account
                           </span>
                           <span className="text-sm font-medium text-slate-900 font-mono">
                              {state.verifiedData?.maskedAccount}
                           </span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-slate-500">Name</span>
                           <span className="text-sm font-medium text-slate-900">
                              {state.verifiedData?.holderName}
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
                     className="w-full h-12 text-sm font-medium bg-primary-600 hover:bg-primary-700 rounded-xl"
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
                              step: "input",
                              accountNumber: "",
                              confirmAccountNumber: "",
                              ifscCode: "",
                              accountHolderName: "",
                              attemptsRemaining: 3,
                           })
                        }
                        className="w-full h-12 text-sm font-medium bg-primary-600 hover:bg-primary-700 rounded-xl"
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
