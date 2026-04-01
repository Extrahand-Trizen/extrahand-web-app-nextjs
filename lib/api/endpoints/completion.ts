import { fetchWithAuth } from "../client";
import type { Task } from "@/types/task";

/**
 * Completion API Client
 * Handles task completion proof submission, approval, and rejection
 */

export const completionApi = {
  /**
   * Submit completion proof
   * Tasker submits proof for review when work is done
   * Automatically changes task status to 'review'
   */
  async submitCompletionProof(
    taskId: string,
    data: { proofUrls?: string[]; notes?: string }
  ): Promise<Task> {
    const response = await fetchWithAuth(`tasks/${taskId}/submit-proof`, {
      method: "POST",
      body: JSON.stringify({ 
        proofUrls: data.proofUrls || [],
        notes: data.notes 
      }),
    });
    // Backend returns { success: true, data: task }
    return response.data || response;
  },

  /**
   * Approve completion
   * Poster approves the submitted work
   * Changes task status from 'review' to 'completed'
   */
  async approveCompletion(taskId: string): Promise<Task> {
    try {
      // Primary route used by api-gateway + task-service
      const response = await fetchWithAuth(`tasks/${taskId}/approve-completion`, {
        method: "POST",
      });
      return response.data || response;
    } catch (error: any) {
      // Backward-compatible fallback route for older deployments
      if (error?.status === 404 || String(error?.message || "").includes("404")) {
        const fallback = await fetchWithAuth(`tasks/${taskId}/completion/approve`, {
          method: "POST",
        });
        return fallback.data || fallback;
      }
      throw error;
    }
  },

  /**
   * Reject completion
   * Poster rejects the work and sends it back for revisions
   * Changes task status from 'review' to 'in_progress'
   */
  async rejectCompletion(taskId: string, reason: string): Promise<Task> {
    try {
      // Primary route used by api-gateway + task-service
      const response = await fetchWithAuth(`tasks/${taskId}/reject-completion`, {
        method: "POST",
        body: JSON.stringify({ reason }),
      });
      return response.data || response;
    } catch (error: any) {
      // Backward-compatible fallback route for older deployments
      if (error?.status === 404 || String(error?.message || "").includes("404")) {
        const fallback = await fetchWithAuth(`tasks/${taskId}/completion/reject`, {
          method: "POST",
          body: JSON.stringify({ reason }),
        });
        return fallback.data || fallback;
      }
      throw error;
    }
  },
};
