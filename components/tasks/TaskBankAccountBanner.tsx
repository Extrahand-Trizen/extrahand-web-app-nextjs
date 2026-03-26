"use client";

import React, { useState } from "react";
import { useBankAccounts } from "@/lib/hooks/usePayments";
import { BankAccountBanner } from "@/components/profile/BankAccountBanner";
import { AddBankAccountModal } from "@/components/profile/AddBankAccountModal";

interface TaskBankAccountBannerProps {
  taskTitle?: string;
  showOnAssignment?: boolean;
  taskAssignedTo?: string;
}

export function TaskBankAccountBanner({
  taskTitle,
  showOnAssignment = true,
  taskAssignedTo,
}: TaskBankAccountBannerProps) {
  const { hasBankAccount, refetch } = useBankAccounts();
  const [showModal, setShowModal] = useState(false);

  // Only show if:
  // 1. User doesn't have a bank account
  // 2. Task is assigned to them or showOnAssignment is true
  if (hasBankAccount) {
    return null;
  }

  return (
    <>
      <BankAccountBanner
        taskTitle={taskTitle}
        onAddBankAccount={() => setShowModal(true)}
      />
      <AddBankAccountModal
        open={showModal}
        onOpenChange={setShowModal}
        onSuccess={() => {
          refetch();
        }}
      />
    </>
  );
}
