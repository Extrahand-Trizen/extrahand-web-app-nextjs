"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle, CheckCircle2, Building2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth/context";

interface AddBankAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddBankAccountModal({
  open,
  onOpenChange,
  onSuccess,
}: AddBankAccountModalProps) {
  const { currentUser, userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    bankName: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (
      !formData.accountNumber ||
      !formData.confirmAccountNumber ||
      !formData.ifscCode ||
      !formData.accountHolderName
    ) {
      setError("All fields are required");
      return;
    }

    if (formData.accountNumber !== formData.confirmAccountNumber) {
      setError("Account numbers do not match");
      return;
    }

    if (formData.accountNumber.length < 9) {
      setError("Please enter a valid account number");
      return;
    }

    if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode)) {
      setError("Please enter a valid IFSC code (e.g., HDFC0001234)");
      return;
    }

    setLoading(true);

    try {
      const uid = currentUser?.uid || userData?.uid || userData?._id;
      if (!uid) {
        throw new Error("Please log in to add a bank account");
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
        method: "POST",
        headers,
        body: JSON.stringify({
          accountNumber: formData.accountNumber,
          ifscCode: formData.ifscCode.toUpperCase(),
          accountHolderName: formData.accountHolderName,
          bankName: formData.bankName || "Unknown Bank",
          email: currentUser?.email,
          phone: currentUser?.phoneNumber,
          setAsDefault: true,
          userId: uid,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save bank account");
      }

      await response.json();
      toast.success("Bank account added successfully!");
      setFormData({
        accountNumber: "",
        confirmAccountNumber: "",
        ifscCode: "",
        accountHolderName: "",
        bankName: "",
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add bank account";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Add Bank Account
          </DialogTitle>
          <DialogDescription>
            Add your bank account to receive task payments Via RazorpayX
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="w-4 h-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="accountHolderName">Account Holder Name</Label>
            <Input
              id="accountHolderName"
              name="accountHolderName"
              placeholder="Your name as per bank"
              value={formData.accountHolderName}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              type="password"
              placeholder="Enter account number"
              value={formData.accountNumber}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmAccountNumber">Confirm Account Number</Label>
            <Input
              id="confirmAccountNumber"
              name="confirmAccountNumber"
              type="password"
              placeholder="Re-enter account number"
              value={formData.confirmAccountNumber}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ifscCode">IFSC Code</Label>
            <Input
              id="ifscCode"
              name="ifscCode"
              placeholder="e.g., HDFC0001234"
              value={formData.ifscCode}
              onChange={handleChange}
              disabled={loading}
              required
              maxLength={11}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name (Optional)</Label>
            <Input
              id="bankName"
              name="bankName"
              placeholder="e.g., HDFC Bank"
              value={formData.bankName}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <Alert>
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <AlertDescription>
              Your bank details are securely encrypted and stored. We never display your full account number.
            </AlertDescription>
          </Alert>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Bank Account"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
