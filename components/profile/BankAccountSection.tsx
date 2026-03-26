"use client";

import React from "react";
import { Landmark, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/user";
import { useRouter } from "next/navigation";

interface BankAccountSectionProps {
  user: UserProfile;
}

export function BankAccountSection({ user }: BankAccountSectionProps) {
  const router = useRouter();

  const isVerified = Boolean(user.isBankVerified);
  const accountDisplay = user.maskedBankAccount || user.bankAccount?.maskedAccountNumber;

  return (
    <div className="max-w-4xl space-y-4">
      <div>
        <h2 className="text-base sm:text-lg font-semibold text-gray-900">Bank Account</h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage your payout bank account for task earnings
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
            <Landmark className="w-5 h-5 text-primary-700" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">Payout Account Status</p>
            {isVerified ? (
              <div className="mt-1">
                <p className="text-sm text-green-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  Verified bank account is active
                </p>
                {accountDisplay ? (
                  <p className="text-xs text-gray-500 mt-1">{accountDisplay}</p>
                ) : null}
              </div>
            ) : (
              <p className="text-sm text-amber-700 mt-1">
                Add and verify your bank account to receive payouts.
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={() => router.push("/profile/verify/bank")}
          className="w-full sm:w-auto h-9 text-xs sm:text-sm"
        >
          {isVerified ? "Update Bank Account" : "Add Bank Account"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
