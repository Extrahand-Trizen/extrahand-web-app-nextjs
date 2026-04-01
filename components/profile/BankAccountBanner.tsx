"use client";

import React from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BankAccountBannerProps {
  taskTitle?: string;
  onAddBankAccount?: () => void;
}

export function BankAccountBanner({
  taskTitle,
  onAddBankAccount,
}: BankAccountBannerProps) {
  return (
    <Alert className="border-amber-200 bg-amber-50 text-amber-900">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between">
        <span>
          {taskTitle
            ? `Add your bank account to receive payment for "${taskTitle}"`
            : "Add your bank account to receive payments for completed tasks"}
        </span>
        <Button
          onClick={onAddBankAccount}
          variant="ghost"
          size="sm"
          className="text-amber-700 hover:text-amber-900 hover:bg-amber-100"
        >
          Add Account
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
