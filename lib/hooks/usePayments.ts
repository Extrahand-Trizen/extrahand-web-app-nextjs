import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";

export interface BankAccount {
  id: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  isVerified: boolean;
  isDefault: boolean;
  createdAt: string;
}

export function useBankAccounts() {
  const { currentUser } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasBankAccount, setHasBankAccount] = useState(false);

  const fetchBankAccounts = async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch("/api/payment/bank-accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch bank accounts");
      }

      const data = await response.json();
      setBankAccounts(data.data || []);
      setHasBankAccount((data.data || []).length > 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching bank accounts");
      setHasBankAccount(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchBankAccounts();
    }
  }, [currentUser]);

  return {
    bankAccounts,
    loading,
    error,
    hasBankAccount,
    refetch: fetchBankAccounts,
  };
}

export function usePayoutStatus(payoutId?: string) {
  const { currentUser } = useAuth();
  const [payout, setPayout] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayoutStatus = async (id: string) => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const token = await currentUser.getIdToken();
      const response = await fetch(`/api/payment/payout/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payout status");
      }

      const data = await response.json();
      setPayout(data.payout);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching payout status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (payoutId && currentUser) {
      fetchPayoutStatus(payoutId);
      // Poll for status updates every 10 seconds
      const interval = setInterval(() => {
        fetchPayoutStatus(payoutId);
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [payoutId, currentUser]);

  return {
    payout,
    loading,
    error,
    refetch: payoutId ? () => fetchPayoutStatus(payoutId) : undefined,
  };
}
