/**
 * Tasks API endpoints
 * Matches task-connect-relay routes/tasks.js
 */

import { fetchWithAuth, fetchPublic } from '../client';
import { Task, TaskListResponse } from '@/types/task';
import { TaskQueryParams } from '@/types/api';

export const tasksApi = {
  /**
   * Get tasks with optional filters (requires authentication)
   * GET /api/v1/tasks
   */
  async getTasks(params?: TaskQueryParams): Promise<TaskListResponse> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await fetchWithAuth(`tasks${queryString}`);
    
    // Handle standardized API response format: { success, code, message, data, meta: { pagination } }
    if (response.data && response.meta?.pagination) {
      return {
        tasks: response.data,
        pagination: {
          page: response.meta.pagination.page,
          limit: response.meta.pagination.limit,
          total: response.meta.pagination.total,
          pages: response.meta.pagination.totalPages,
        },
      };
    }
    
    // Fallback for legacy format
    return response.data || response;
  },

  /**
   * Get tasks with optional filters (public - no authentication required)
   * GET /api/v1/tasks
   */
  async getPublicTasks(params?: TaskQueryParams): Promise<TaskListResponse> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await fetchPublic(`tasks${queryString}`);
    
    // Handle standardized API response format: { success, code, message, data, meta: { pagination } }
    if (response.data && response.meta?.pagination) {
      return {
        tasks: response.data,
        pagination: {
          page: response.meta.pagination.page,
          limit: response.meta.pagination.limit,
          total: response.meta.pagination.total,
          pages: response.meta.pagination.pages,
        },
      };
    }
    
    // Fallback for legacy format
    return response.data || response;
  },

  /**
   * Get tasks posted by current user
   * GET /api/v1/tasks/my-tasks
   */
  async getMyTasks(params?: TaskQueryParams): Promise<TaskListResponse> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await fetchWithAuth(`tasks/my-tasks${queryString}`);
    return response.data || response;
  },

  /**
   * Get a single task by ID
   * GET /api/v1/tasks/:id
   */
  async getTask(taskId: string): Promise<Task> {
    const response = await fetchWithAuth(`tasks/${taskId}`);
    return response.data || response;
  },

  /**
   * Create a new task
   * POST /api/v1/tasks
   */
  async createTask(taskData: Partial<Task>): Promise<Task> {
    const response = await fetchWithAuth('tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
    return response.data || response;
  },

  /**
   * Update a task
   * PUT /api/v1/tasks/:id
   */
  async updateTask(taskId: string, taskData: Partial<Task>): Promise<Task> {
    const response = await fetchWithAuth(`tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
    return response.data || response;
  },

  /**
   * Delete a task
   * DELETE /api/v1/tasks/:id
   */
  async deleteTask(taskId: string): Promise<{ success: boolean; message?: string }> {
    return fetchWithAuth(`tasks/${taskId}`, {
      method: 'DELETE',
    });
  },

  /**
   * Update task status
   * PATCH /api/v1/tasks/:id/status
   */
  async updateTaskStatus(taskId: string, status: Task['status']): Promise<Task> {
    const response = await fetchWithAuth(`tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    // Backend returns { success: true, data: task, message: "..." }
    return response.data || response;
  },

  /**
   * Accept a task (for taskers)
   * POST /api/v1/tasks/:id/accept
   */
  async acceptTask(taskId: string): Promise<Task> {
    const response = await fetchWithAuth(`tasks/${taskId}/accept`, {
      method: 'POST',
    });
    return response.data || response;
  },

  /**
   * Complete a task
   * POST /api/v1/tasks/:id/complete
   */
  async completeTask(taskId: string, body: { rating?: number; review?: string }): Promise<Task> {
    const response = await fetchWithAuth(`tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return response.data || response;
  },
};

