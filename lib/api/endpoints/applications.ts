/**
 * Applications API endpoints
 * Matches task-connect-relay routes/applications.js
 */

import { fetchWithAuth, fetchPublic } from '../client';
import {
  TaskApplication,
  CreateApplicationRequest,
  UpdateApplicationRequest,
  EditApplicationRequest,
  ApplicationsResponse,
  NegotiateApplicationRequest,
} from '@/types/application';
import { ApplicationQueryParams } from '@/types/api';

export const applicationsApi = {
  /**
   * Submit an application for a task
   * POST /api/v1/applications
   */
  async submitApplication(applicationData: CreateApplicationRequest): Promise<TaskApplication> {
    const response = await fetchWithAuth('applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
    return response.data || response;
  },

  /**
   * Get applications with optional filters
   * GET /api/v1/applications
   */
  async getApplications(params?: ApplicationQueryParams): Promise<ApplicationsResponse> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await fetchWithAuth(`applications${queryString}`);
    
    // Handle standardized response format: { success, data, meta: { pagination } }
    if (response.data && response.meta?.pagination) {
      return {
        applications: response.data,
        pagination: response.meta.pagination,
      };
    }
    
    // Fallback for legacy format
    return response.data || response;
  },

  /**
   * Get a single application by ID
   * GET /api/v1/applications/:id
   */
  async getApplication(applicationId: string): Promise<TaskApplication> {
    const response = await fetchWithAuth(`applications/${applicationId}`);
    return response.data || response;
  },

  /**
   * Update application status (accept/reject)
   * PUT /api/v1/applications/:id
   */
  async updateApplicationStatus(
    applicationId: string,
    updateData: UpdateApplicationRequest
  ): Promise<TaskApplication> {
    const response = await fetchWithAuth(`applications/${applicationId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return response.data || response;
  },

  /**
   * Edit current user's pending application
   * PATCH /api/v1/applications/:id
   */
  async editApplication(
    applicationId: string,
    editData: EditApplicationRequest
  ): Promise<TaskApplication> {
    const response = await fetchWithAuth(`applications/${applicationId}`, {
      method: 'PATCH',
      body: JSON.stringify(editData),
    });
    return response.data || response;
  },

  async negotiateApplication(
    applicationId: string,
    payload: NegotiateApplicationRequest
  ): Promise<TaskApplication> {
    const response = await fetchWithAuth(`applications/${applicationId}/negotiate`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return response.data || response;
  },

  /**
   * Withdraw current user's pending application
   * DELETE /api/v1/applications/:id
   */
  async withdrawApplication(applicationId: string): Promise<void> {
    await fetchWithAuth(`applications/${applicationId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Get applications for a specific task
   * GET /api/v1/applications?taskId=:taskId
   * Uses fetchPublic (with credentials included when available) since endpoint supports optional auth
   */
  async getTaskApplications(taskId: string): Promise<ApplicationsResponse> {
    // Use fetchPublic since the endpoint supports optional auth.
    // It sends cookies when present, so logged-in users are personalized,
    // and still works for non-logged-in users when backend allows public access.
    const response = await fetchPublic(`applications?taskId=${taskId}`);
    
    // Handle standardized response format
    if (response.data && response.meta?.pagination) {
      return {
        applications: response.data,
        pagination: response.meta.pagination,
      };
    }
    
    return response.data || response;
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
    const response = await fetchWithAuth(`applications${queryString}`);
    
    // Handle standardized response format
    if (response.data && response.meta?.pagination) {
      return {
        applications: response.data,
        pagination: response.meta.pagination,
      };
    }
    
    return response.data || response;
  },
};

