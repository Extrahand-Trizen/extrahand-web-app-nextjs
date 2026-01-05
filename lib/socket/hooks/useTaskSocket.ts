"use client";

import { useEffect, useCallback } from "react";
import { useSocket } from "../SocketProvider";

interface UseTaskSocketOptions {
  taskId: string | null;
  onStatusChanged?: (task: any) => void;
  onProofSubmitted?: (data: any) => void;
  onProofApproved?: (data: any) => void;
  onProofRejected?: (data: any) => void;
  onTaskAssigned?: (task: any) => void;
}

export function useTaskSocket({
  taskId,
  onStatusChanged,
  onProofSubmitted,
  onProofApproved,
  onProofRejected,
  onTaskAssigned,
}: UseTaskSocketOptions) {
  const { taskSocket } = useSocket();

  // Join/leave task room
  useEffect(() => {
    if (!taskSocket || !taskId) return;

    // Join the task room
    taskSocket.emit("task:join", { taskId });

    // Cleanup: leave room on unmount
    return () => {
      taskSocket.emit("task:leave", { taskId });
    };
  }, [taskSocket, taskId]);

  // Listen for task status changes
  useEffect(() => {
    if (!taskSocket || !taskId || !onStatusChanged) return;

    taskSocket.on("task:status_changed", onStatusChanged);

    return () => {
      taskSocket.off("task:status_changed", onStatusChanged);
    };
  }, [taskSocket, taskId, onStatusChanged]);

  // Listen for proof submissions
  useEffect(() => {
    if (!taskSocket || !taskId || !onProofSubmitted) return;

    taskSocket.on("task:proof_submitted", onProofSubmitted);

    return () => {
      taskSocket.off("task:proof_submitted", onProofSubmitted);
    };
  }, [taskSocket, taskId, onProofSubmitted]);

  // Listen for proof approval
  useEffect(() => {
    if (!taskSocket || !taskId || !onProofApproved) return;

    taskSocket.on("task:proof_approved", onProofApproved);

    return () => {
      taskSocket.off("task:proof_approved", onProofApproved);
    };
  }, [taskSocket, taskId, onProofApproved]);

  // Listen for proof rejection
  useEffect(() => {
    if (!taskSocket || !taskId || !onProofRejected) return;

    taskSocket.on("task:proof_rejected", onProofRejected);

    return () => {
      taskSocket.off("task:proof_rejected", onProofRejected);
    };
  }, [taskSocket, taskId, onProofRejected]);

  // Listen for task assignment
  useEffect(() => {
    if (!taskSocket || !taskId || !onTaskAssigned) return;

    taskSocket.on("task:assigned", onTaskAssigned);

    return () => {
      taskSocket.off("task:assigned", onTaskAssigned);
    };
  }, [taskSocket, taskId, onTaskAssigned]);

  return {
    isConnected: !!taskSocket?.connected,
  };
}
