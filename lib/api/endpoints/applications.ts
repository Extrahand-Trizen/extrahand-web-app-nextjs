/**
 * Applications API endpoints
 * Matches task-connect-relay routes/applications.js
 */

import { fetchWithAuth } from '../client';
import { TaskApplication, CreateApplicationRequest, UpdateApplicationRequest, ApplicationsResponse } from '@/types/application';
import { ApplicationQueryParams } from '@/types/api';

export const applicationsApi = {
  /**
   * Submit an application for a task
   * POST /api/v1/applications
   */
  async submitApplication(applicationData: CreateApplicationRequest): Promise<TaskApplication> {
    return fetchWithAuth('applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  /**
   * Get applications with optional filters
   * GET /api/v1/applications
   */
  async getApplications(params?: ApplicationQueryParams): Promise<ApplicationsResponse> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return fetchWithAuth(`applications${queryString}`);
  },

  /**
   * Get a single application by ID
   * GET /api/v1/applications/:id
   */
  async getApplication(applicationId: string): Promise<TaskApplication> {
    return fetchWithAuth(`applications/${applicationId}`);
  },

  /**
   * Update application status (accept/reject)
   * PUT /api/v1/applications/:id
   */
  async updateApplicationStatus(
    applicationId: string,
    updateData: UpdateApplicationRequest
  ): Promise<TaskApplication> {
    return fetchWithAuth(`applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  /**
   * Get applications for a specific task
   * GET /api/v1/applications?taskId=:taskId
   */
  async getTaskApplications(taskId: string): Promise<ApplicationsResponse> {
    return fetchWithAuth(`applications?taskId=${taskId}`);
  },

  /**
   * Get current user's applications
   * GET /api/v1/applications?mine=true
   */
  async getMyApplications(status?: string): Promise<ApplicationsResponse> {
    const params: ApplicationQueryParams = { mine: 'true' };
    if (status) {
      params.status = status as any;
    }
    const queryString = `?${new URLSearchParams(params as any).toString()}`;
    return fetchWithAuth(`applications${queryString}`);
  },
};

