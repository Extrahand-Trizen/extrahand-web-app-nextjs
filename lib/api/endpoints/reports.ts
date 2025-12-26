/**
 * Reports API endpoints
 * Matches extrahand-platform-task-service routes/reports.ts
 */

import { fetchWithAuth } from '../client';

export type ReportReason = 'spam' | 'inappropriate_content' | 'fraudulent' | 'duplicate' | 'wrong_category' | 'other';
export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'dismissed';

export interface TaskReport {
  _id: string;
  userId: string;
  taskId: string;
  reason: ReportReason;
  description?: string;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  resolutionNotes?: string;
}

export const reportsApi = {
  /**
   * Submit a task report
   * POST /api/v1/tasks/:taskId/report
   */
  async submitReport(
    taskId: string,
    reportData: {
      reason: ReportReason;
      description?: string;
    }
  ): Promise<TaskReport> {
    return fetchWithAuth(`tasks/${taskId}/report`, {
      method: 'POST',
      body: JSON.stringify(reportData),
    });
  },

  /**
   * Get reports for a task (admin/owner only)
   * GET /api/v1/tasks/:taskId/reports
   */
  async getTaskReports(taskId: string): Promise<TaskReport[]> {
    return fetchWithAuth(`tasks/${taskId}/reports`);
  },
};
