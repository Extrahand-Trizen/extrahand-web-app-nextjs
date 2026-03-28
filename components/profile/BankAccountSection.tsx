"use client";

import React, { useState } from "react";
import { Landmark, ShieldCheck, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/types/user";
import { useRouter } from "next/navigation";
import { AddBankAccountModal } from "./AddBankAccountModal";
import { useBankAccounts } from "@/lib/hooks/usePayments";
import { toast } from "sonner";

interface BankAccountSectionProps {
  user: UserProfile;
}

export function BankAccountSection({ user }: BankAccountSectionProps) {
  const router = useRouter();
  const [showBankModal, setShowBankModal] = useState(false);
  const [latestMaskedAccount, setLatestMaskedAccount] = useState<string | null>(null);
  const [hasLocalBankAccount, setHasLocalBankAccount] = useState(false);
  const [settingDefaultAccountId, setSettingDefaultAccountId] = useState<string | null>(null);
  const [deletingAccountId, setDeletingAccountId] = useState<string | null>(null);
  const { bankAccounts, hasBankAccount, deleteBankAccount, setDefaultBankAccount, loading } = useBankAccounts();

  const isVerified = hasLocalBankAccount || hasBankAccount || Boolean(user.isBankVerified);
  const accountDisplay =
    latestMaskedAccount ||
    bankAccounts[0]?.accountNumber ||
    user.maskedBankAccount ||
    user.bankAccount?.maskedAccountNumber;

  const handleDelete = async (bankAccountId: string) => {
    if (deletingAccountId || settingDefaultAccountId) return;

    const ok = window.confirm("Delete this bank account? Pending payouts will require adding a bank account again.");
    if (!ok) return;

    try {
      setDeletingAccountId(bankAccountId);
      await deleteBankAccount(bankAccountId);
      setHasLocalBankAccount(false);
      setLatestMaskedAccount(null);
      toast.success("Bank account deleted", { id: "delete-payout-bank-account" });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete bank account", {
        id: "delete-payout-bank-account",
      });
    } finally {
      setDeletingAccountId(null);
    }
  };

  const handleSelectForPayout = async (bankAccountId: string) => {
    if (settingDefaultAccountId || deletingAccountId) return;

    try {
      setSettingDefaultAccountId(bankAccountId);
      await setDefaultBankAccount(bankAccountId);
      toast.success("Default payout bank account updated", {
        id: "default-payout-bank-account",
      });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update payout bank account", {
        id: "default-payout-bank-account",
      });
    } finally {
      setSettingDefaultAccountId(null);
    }
  };

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
                Add your bank account to receive payouts.
              </p>
            )}
          </div>
        </div>

        <Button
          onClick={() => setShowBankModal(true)}
          className="w-full sm:w-auto h-9 text-xs sm:text-sm"
          disabled={loading}
        >
          {isVerified ? "Update Bank Account" : "Add Bank Account"}
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        {bankAccounts.length > 0 ? (
          <div className="space-y-2 border-t border-gray-100 pt-3">
            {bankAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between gap-3 rounded-md border border-gray-200 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">{account.accountNumber}</p>
                  <p className="text-xs text-gray-500">{account.ifscCode}</p>
                </div>
                <div className="flex items-center gap-2">
                  {!account.isDefault ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectForPayout(account.id)}
                      disabled={loading || settingDefaultAccountId === account.id || deletingAccountId === account.id}
                    >
                      {settingDefaultAccountId === account.id ? "Setting..." : "Set default"}
                    </Button>
                  ) : (
                    <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(account.id)}
                    disabled={loading || deletingAccountId === account.id || settingDefaultAccountId === account.id}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    {deletingAccountId === account.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <AddBankAccountModal
          open={showBankModal}
          onOpenChange={setShowBankModal}
          onSuccess={(data) => {
            setHasLocalBankAccount(true);
            if (data?.maskedAccountNumber) {
              setLatestMaskedAccount(data.maskedAccountNumber);
            }
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
