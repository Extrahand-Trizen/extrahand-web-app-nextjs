/**
 * Aadhaar Verification Page (DigiLocker)
 * Government-backed, consent-based KYC via Cashfree DigiLocker
 */

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Fingerprint,
  Lock,
  AlertCircle,
  Info,
  ArrowLeft,
  CheckCircle2,
  Shield,
  ExternalLink,
  RefreshCw,
  Smartphone,
} from "lucide-react";
import { AADHAAR_CONSENT } from "@/types/verification";
import { verificationApi } from "@/lib/api/endpoints/verification";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";

const DIGILOCKER_SESSION_KEY = "digilocker_verification_id";

/** Normalize profile phone to 10-digit Indian mobile for comparison (e.g. +917416337859 → 7416337859). */
function normalizeProfilePhone(phone: string | null | undefined): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export default function AadhaarVerificationPage() {
  const router = useRouter();
  const { userData } = useAuth();
  const [step, setStep] = useState<"consent" | "input" | "redirecting" | "error">("consent");
  const [mobileNumber, setMobileNumber] = useState("");
  const [consentGiven, setConsentGiven] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [showMismatchModal, setShowMismatchModal] = useState(false);

  // Pre-fill mobile number from user data when moving to input step
  React.useEffect(() => {
    if (step === "input" && userData?.phone && !mobileNumber) {
      const normalized = normalizeProfilePhone(userData.phone);
      if (normalized) {
        setMobileNumber(normalized);
      }
    }
  }, [step, userData?.phone, mobileNumber]);

  const handleBack = () => {
    if (step === "consent") {
      router.push("/profile?section=verifications");
    } else if (step === "input") {
      setStep("consent");
      setError(undefined);
    } else {
      router.push("/profile?section=verifications");
    }
  };

  const formatMobile = (v: string) => {
    return v.replace(/\D/g, "").slice(0, 10);
  };

  const handleInitiate = async () => {
    const mobile = mobileNumber.replace(/\D/g, "").trim();

    if (!mobile || mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      toast.error("Mobile number required");
      return;
    }

    const registeredPhone = normalizeProfilePhone(userData?.phone);
    if (registeredPhone && mobile !== registeredPhone) {
      setShowMismatchModal(true);
      return;
    }

    if (!registeredPhone) {
      setError("We couldn't find a registered mobile number. Please ensure your profile has a verified phone number.");
      toast.error("Registered mobile required");
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      const result = await verificationApi.initiateDigilocker({
        mobileNumber: mobile,
        consentGiven: true,
      });

      if (!result.success) {
        setError(result.message || "Failed to initiate verification");
        toast.error(result.message || "Failed to initiate");
        return;
      }

      const { data } = result;

      if (data.alreadyVerified) {
        toast.success("Aadhaar is already verified");
        router.push("/profile?section=verifications");
        router.refresh();
        return;
      }

      if (data.url && data.verification_id) {
        sessionStorage.setItem(DIGILOCKER_SESSION_KEY, data.verification_id);
        setStep("redirecting");
        toast.success("Redirecting to DigiLocker...");
        window.location.href = data.url;
      } else {
        setError("Invalid response from server");
        toast.error("Invalid response");
      }
    } catch (err: unknown) {
      const msg =
        (err as { data?: { error?: string }; message?: string })?.data?.error ||
        (err as Error)?.message ||
        "Failed to initiate verification";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const stepNum = step === "consent" ? 1 : step === "input" ? 2 : 2;
  const showBack = !["redirecting"].includes(step);

  return (
    <div className="min-h-screen bg-slate-50">
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
              Aadhaar Verification
            </h1>
            {showBack && <div className="w-9" />}
          </div>
          {!["redirecting", "error"].includes(step) && (
            <div className="pb-3">
              <div className="flex gap-1.5">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-all",
                      s <= stepNum ? "bg-primary-600" : "bg-slate-200"
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-2 text-center">
                Step {stepNum} of 2
              </p>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:py-12">
        {step === "consent" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center pb-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-gray-50 flex items-center justify-center mb-4 shadow-sm">
                <Fingerprint className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Verify your identity
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Secure verification via DigiLocker (government-backed)
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900">Why verify?</h3>
              </div>
              <div className="p-4 sm:p-5 space-y-3">
                {[
                  { icon: Shield, text: "Build trust with other users" },
                  { icon: CheckCircle2, text: "Access higher value tasks" },
                  { icon: Lock, text: "Required for payments above ₹10,000" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <item.icon className="w-4 h-4 text-slate-600" />
                    </div>
                    <span className="text-sm text-slate-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-5">
              <h3 className="text-sm font-semibold text-slate-900 mb-4">How it works</h3>
              {[
                { title: "Enter registered mobile", desc: "Must match your account" },
                { title: "Sign in to DigiLocker", desc: "Government portal" },
                { title: "Share consent", desc: "Only masked details stored" },
              ].map((s, i) => (
                <div key={i} className="flex gap-3 pb-3 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-medium">
                      {i + 1}
                    </div>
                    {i < 2 && <div className="w-px h-full bg-primary-200 my-1" />}
                  </div>
                  <div className="pt-0.5">
                    <p className="text-sm font-medium text-slate-900">{s.title}</p>
                    <p className="text-xs text-slate-500">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p className="mt-2">{AADHAAR_CONSENT.paragraph}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {AADHAAR_CONSENT.points.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            </label>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              <span>256-bit SSL encrypted • DigiLocker compliant</span>
            </div>

            <Button
              onClick={() => consentGiven && setStep("input")}
              disabled={!consentGiven}
              className="w-full h-12 text-sm font-medium bg-primary-500 hover:bg-primary-600 disabled:bg-slate-200 disabled:text-slate-500 rounded-xl"
            >
              Continue
            </Button>
          </div>
        )}

        {step === "input" && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <Smartphone className="w-7 h-7 text-slate-600" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Enter your details
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Enter the mobile number registered with your account
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6 space-y-4">
              <label className="block">
                <span className="text-sm font-medium text-slate-700">Mobile Number</span>
                <div className="relative">
                  <input
                    type="tel"
                    value={mobileNumber}
                    readOnly
                    className={cn(
                      "mt-2 w-full px-4 py-3.5 text-lg font-mono border rounded-xl transition-all bg-slate-50 cursor-not-allowed",
                      error ? "border-red-300" : "border-slate-200"
                    )}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-slate-500">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Registered</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-1.5">This is your registered mobile number</p>
              </label>
              {error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
              <div className="flex items-start gap-2 p-3 bg-primary-50 rounded-lg">
                <Info className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                <p className="text-xs text-primary-700">
                  You will be redirected to DigiLocker to complete verification. Ensure your
                  Aadhaar is linked in DigiLocker.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              <span>Your Aadhaar is never stored</span>
            </div>

            <Button
              onClick={handleInitiate}
              disabled={isLoading || !mobileNumber}
              className="w-full h-12 text-sm font-medium bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-500 rounded-xl"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Preparing...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Continue to DigiLocker
                  <ExternalLink className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        )}

        {step === "redirecting" && (
          <div className="space-y-6 animate-in fade-in duration-300 text-center py-12">
            <div className="w-16 h-16 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-4">
              <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Redirecting to DigiLocker</h2>
            <p className="text-sm text-slate-500">
              If you are not redirected automatically,{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const id = sessionStorage.getItem(DIGILOCKER_SESSION_KEY);
                  if (id) router.push(`/profile/verify/aadhaar/callback?verification_id=${id}`);
                }}
                className="text-primary-600 hover:underline"
              >
                click here
              </a>
              .
            </p>
          </div>
        )}

        {step === "error" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-5 shadow-lg shadow-red-100">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Verification Failed</h2>
              <p className="text-sm text-slate-500 mt-2">{error}</p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => {
                  setStep("input");
                  setError(undefined);
                }}
                className="w-full h-12 text-sm font-medium bg-slate-900 hover:bg-slate-800 rounded-xl"
              >
                Try Again
              </Button>
              <Button
                onClick={() => router.push("/profile?section=verifications")}
                variant="outline"
                className="w-full h-12 text-sm font-medium rounded-xl"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </main>

      <AlertDialog open={showMismatchModal} onOpenChange={setShowMismatchModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mobile number doesn&apos;t match</AlertDialogTitle>
            <AlertDialogDescription>
              Please enter the mobile number associated with your ExtraHand account. Aadhaar
              verification requires the same number you used to register. If you no longer
              have access to that number, update your phone number in your profile first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowMismatchModal(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
