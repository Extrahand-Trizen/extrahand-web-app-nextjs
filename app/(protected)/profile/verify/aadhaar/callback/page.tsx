/**
 * DigiLocker Callback Page
 * Handles redirect from Cashfree DigiLocker after user completes verification.
 * Polls status until AUTHENTICATED, then calls complete API.
 */

"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Fingerprint,
} from "lucide-react";
import { verificationApi } from "@/lib/api/endpoints/verification";
import { useAuth } from "@/lib/auth/context";
import { toast } from "sonner";

const DIGILOCKER_SESSION_KEY = "digilocker_verification_id";
const POLL_INTERVAL_MS = 3000;
const MAX_POLL_ATTEMPTS = 60; // 3 min max

export default function AadhaarCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUserData } = useAuth();
  const [state, setState] = useState<
    "loading" | "polling" | "completing" | "success" | "error"
  >("loading");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();
  const [verifiedData, setVerifiedData] = useState<{
    maskedAadhaar?: string;
    verifiedAt?: string;
  } | null>(null);

  const getVerificationId = useCallback(() => {
    const fromQuery = searchParams.get("verification_id");
    if (fromQuery) return fromQuery;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(DIGILOCKER_SESSION_KEY);
    }
    return null;
  }, [searchParams]);

  useEffect(() => {
    const id = getVerificationId();
    if (!id) {
      setError("Verification session not found. Please start the verification again.");
      setState("error");
      return;
    }
    setVerificationId(id);
  }, [getVerificationId]);

  useEffect(() => {
    if (!verificationId) return;

    let pollCount = 0;
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    const pollStatus = async () => {
      if (cancelled) return;
      try {
        const result = await verificationApi.getDigilockerStatus(verificationId);
        if (cancelled) return;
        if (!result.success) {
          setError(result.message || "Failed to get status");
          setState("error");
          return;
        }

        const { status, ready_for_complete } = result.data;

        if (ready_for_complete) {
          if (intervalId) clearInterval(intervalId);
          setState("completing");
          try {
            const completeResult = await verificationApi.completeDigilocker(verificationId);
            if (cancelled) return;
            if (completeResult.success && completeResult.data) {
              setVerifiedData({
                maskedAadhaar: completeResult.data.maskedAadhaar,
                verifiedAt: completeResult.data.verifiedAt,
              });
              setState("success");
              sessionStorage.removeItem(DIGILOCKER_SESSION_KEY);
              await refreshUserData();
              router.refresh();
              toast.success("Aadhaar verified successfully!");
            } else {
              setError(completeResult.message || "Verification completion failed");
              setState("error");
            }
          } catch (err: unknown) {
            if (cancelled) return;
            const msg =
              (err as { data?: { error?: string }; message?: string })?.data?.error ||
              (err as Error)?.message ||
              "Failed to complete verification";
            setError(msg);
            setState("error");
            toast.error(msg);
          }
          return;
        }

        if (status === "FAILED" || status === "DENIED" || status === "EXPIRED") {
          if (intervalId) clearInterval(intervalId);
          setError(
            status === "DENIED"
              ? "You denied consent. Please try again and grant access."
              : status === "EXPIRED"
                ? "Verification link expired. Please start again."
                : "Verification failed. Please try again."
          );
          setState("error");
          return;
        }

        pollCount++;
        if (pollCount >= MAX_POLL_ATTEMPTS) {
          if (intervalId) clearInterval(intervalId);
          setError("Verification timed out. Please try again.");
          setState("error");
        }
      } catch (err: unknown) {
        if (cancelled) return;
        const msg =
          (err as { data?: { error?: string }; message?: string })?.data?.error ||
          (err as Error)?.message ||
          "Failed to check status";
        setError(msg);
        setState("error");
        if (intervalId) clearInterval(intervalId);
      }
    };

    setState("polling");
    pollStatus();
    intervalId = setInterval(pollStatus, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [verificationId, router, refreshUserData]);

  const handleRetry = () => {
    sessionStorage.removeItem(DIGILOCKER_SESSION_KEY);
    router.push("/profile/verify/aadhaar");
  };

  const handleBackToProfile = () => {
    router.push("/profile?section=verifications");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-14 sm:h-16">
            {state === "error" && (
              <button
                onClick={handleBackToProfile}
                className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
            )}
            <h1 className="flex-1 text-center text-sm sm:text-base font-semibold text-slate-900">
              Aadhaar Verification
            </h1>
            {state === "error" && <div className="w-9" />}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 sm:px-6 sm:py-16">
        {state === "loading" && (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 text-primary-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading...</p>
          </div>
        )}

        {(state === "polling" || state === "completing") && (
          <div className="text-center py-12 animate-in fade-in duration-300">
            <div className="w-20 h-20 mx-auto rounded-full bg-primary-100 flex items-center justify-center mb-6">
              <RefreshCw
                className={cn(
                  "w-10 h-10 text-primary-600",
                  state === "completing" && "animate-spin"
                )}
              />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              {state === "polling"
                ? "Checking verification status..."
                : "Completing verification..."}
            </h2>
            <p className="text-sm text-slate-500">
              {state === "polling"
                ? "Please wait while we confirm your DigiLocker verification."
                : "Fetching your verified details."}
            </p>
          </div>
        )}

        {state === "success" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-5 shadow-lg shadow-green-100">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-green-600" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Verification Complete!
              </h2>
              <p className="text-sm text-slate-500 mt-2">
                Your identity has been verified via DigiLocker
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-primary-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-xs text-primary-600 font-medium">Aadhaar Verified</p>
                    <p className="text-sm font-semibold text-slate-900 font-mono">
                      {verifiedData?.maskedAadhaar || "XXXX XXXX XXXX"}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 sm:p-5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Verified on</span>
                  <span className="text-sm font-medium text-slate-900">
                    {verifiedData?.verifiedAt
                      ? new Date(verifiedData.verifiedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : new Date().toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                  </span>
                </div>
              </div>
            </div>
            <Button
              onClick={handleBackToProfile}
              className="w-full h-12 text-sm font-medium bg-primary-600 hover:bg-primary-500 rounded-xl"
            >
              Back to Verifications
            </Button>
          </div>
        )}

        {state === "error" && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-red-50 flex items-center justify-center mb-5 shadow-lg shadow-red-100">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Verification Failed
              </h2>
              <p className="text-sm text-slate-500 mt-2">{error}</p>
            </div>
            <div className="space-y-3">
              <Button
                onClick={handleRetry}
                className="w-full h-12 text-sm font-medium bg-slate-900 hover:bg-slate-800 rounded-xl"
              >
                Try Again
              </Button>
              <Button
                onClick={handleBackToProfile}
                variant="outline"
                className="w-full h-12 text-sm font-medium rounded-xl"
              >
                Back to Profile
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
