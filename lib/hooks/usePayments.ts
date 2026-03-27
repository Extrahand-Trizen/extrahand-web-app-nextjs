import { useCallback, useEffect, useState } from "react";
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
  const { currentUser, userData } = useAuth();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasBankAccount = bankAccounts.length > 0;

  const fetchBankAccounts = useCallback(async () => {
    const uid = currentUser?.uid || userData?.uid || userData?._id;
    if (!uid) {
      setBankAccounts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = currentUser ? await currentUser.getIdToken().catch(() => null) : null;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-User-Id": uid,
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("/api/payment/bank-accounts", { headers });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch bank accounts");
      }

      setBankAccounts(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      setBankAccounts([]);
      setError(err instanceof Error ? err.message : "Error fetching bank accounts");
    } finally {
      setLoading(false);
    }
  }, [currentUser, userData]);

  const deleteBankAccount = useCallback(
    async (bankAccountId: string) => {
      const uid = currentUser?.uid || userData?.uid || userData?._id;
      if (!uid) {
        throw new Error("Please log in to delete bank account");
      }

      const token = currentUser ? await currentUser.getIdToken().catch(() => null) : null;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-User-Id": uid,
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("/api/payment/bank-accounts", {
        method: "DELETE",
        headers,
        body: JSON.stringify({ bankAccountId, userId: uid }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Failed to delete bank account");
      }

      await fetchBankAccounts();
      return data;
    },
    [currentUser, userData, fetchBankAccounts]
  );

  const setDefaultBankAccount = useCallback(
    async (bankAccountId: string) => {
      const uid = currentUser?.uid || userData?.uid || userData?._id;
      if (!uid) {
        throw new Error("Please log in to set default bank account");
      }

      const token = currentUser ? await currentUser.getIdToken().catch(() => null) : null;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "X-User-Id": uid,
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch("/api/payment/bank-accounts", {
        method: "PUT",
        headers,
        body: JSON.stringify({ bankAccountId, userId: uid }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || "Failed to set default bank account");
      }

      await fetchBankAccounts();
      return data;
    },
    [currentUser, userData, fetchBankAccounts]
  );

  useEffect(() => {
    fetchBankAccounts();
  }, [fetchBankAccounts]);

  return {
    bankAccounts,
    loading,
    error,
    hasBankAccount,
    refetch: fetchBankAccounts,
    deleteBankAccount,
    setDefaultBankAccount,
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
