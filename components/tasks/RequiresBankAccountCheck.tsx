"use client";

import React, { useEffect, useState } from "react";
import { TaskBankAccountBanner } from "./TaskBankAccountBanner";
import { useAuth } from "@/lib/auth/context";

interface RequiresBankAccountProps {
  taskTitle?: string;
  taskAssigneeId?: string;
  showIfMissing?: boolean;
}

/**
 * Component that checks if current user has a bank account
 * and displays a banner if they don't when working on a task.
 *
 * Usage:
 * <RequiresBankAccountCheck taskTitle="Fix my leaky faucet" />
 */
export function RequiresBankAccountCheck({
  taskTitle,
  taskAssigneeId,
  showIfMissing = true,
}: RequiresBankAccountProps) {
  const { currentUser } = useAuth();
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Only show banner if task is assigned to current user
    if (taskAssigneeId && currentUser?.uid !== taskAssigneeId) {
      setShouldShow(false);
      return;
    }

    if (showIfMissing) {
      setShouldShow(true);
    }
  }, [taskAssigneeId, currentUser?.uid, showIfMissing]);

  if (!shouldShow) return null;

  return <TaskBankAccountBanner taskTitle={taskTitle} />;
}
