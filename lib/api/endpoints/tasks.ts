/**
 * Tasks API endpoints
 * Matches task-connect-relay routes/tasks.js
 */

import { fetchWithAuth } from '../client';
import { Task, TaskListResponse } from '@/types/task';
import { TaskQueryParams } from '@/types/api';

export const tasksApi = {
  /**
   * Get tasks with optional filters
   * GET /api/v1/tasks
   */
  async getTasks(params?: TaskQueryParams): Promise<TaskListResponse> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return fetchWithAuth(`tasks${queryString}`);
  },

  /**
   * Get tasks posted by current user
   * GET /api/v1/tasks/my-tasks
   */
  async getMyTasks(params?: TaskQueryParams): Promise<TaskListResponse> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return fetchWithAuth(`tasks/my-tasks${queryString}`);
  },

  /**
   * Get a single task by ID
   * GET /api/v1/tasks/:id
   */
  async getTask(taskId: string): Promise<Task> {
    return fetchWithAuth(`tasks/${taskId}`);
  },

  /**
   * Create a new task
   * POST /api/v1/tasks
   */
  async createTask(taskData: Partial<Task>): Promise<Task> {
    return fetchWithAuth('tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Update a task
   * PUT /api/v1/tasks/:id
   */
  async updateTask(taskId: string, taskData: Partial<Task>): Promise<Task> {
    return fetchWithAuth(`tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
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
    return fetchWithAuth(`tasks/${taskId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  /**
   * Accept a task (for taskers)
   * POST /api/v1/tasks/:id/accept
   */
  async acceptTask(taskId: string): Promise<Task> {
    return fetchWithAuth(`tasks/${taskId}/accept`, {
      method: 'POST',
    });
  },

  /**
   * Complete a task
   * POST /api/v1/tasks/:id/complete
   */
  async completeTask(taskId: string, body: { rating?: number; review?: string }): Promise<Task> {
    return fetchWithAuth(`tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};

