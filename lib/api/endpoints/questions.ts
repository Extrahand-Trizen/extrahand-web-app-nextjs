/**
 * Questions API endpoints
 * Matches task-service routes/questions.ts
 */

import { fetchWithAuth } from '../client';
import type { TaskQuestion, CreateQuestionRequest, AnswerQuestionRequest } from '@/types/question';

interface QuestionsResponse {
  success: boolean;
  data: TaskQuestion[];
  meta?: {
    pagination?: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export const questionsApi = {
  /**
   * Get questions for a specific task
   * GET /api/v1/tasks/:taskId/questions
   */
  async getTaskQuestions(taskId: string): Promise<QuestionsResponse> {
    return fetchWithAuth(`tasks/${taskId}/questions`);
  },

  /**
   * Ask a question on a task
   * POST /api/v1/tasks/:taskId/questions
   */
  async askQuestion(taskId: string, data: Omit<CreateQuestionRequest, 'taskId'>): Promise<TaskQuestion> {
    return fetchWithAuth(`tasks/${taskId}/questions`, {
      method: 'POST',
      body: JSON.stringify({ ...data, taskId }),
    });
  },

  /**
   * Answer a question
   * POST /api/v1/tasks/:taskId/questions/:questionId/answer
   */
  async answerQuestion(
    taskId: string, 
    questionId: string, 
    data: AnswerQuestionRequest
  ): Promise<TaskQuestion> {
    return fetchWithAuth(`tasks/${taskId}/questions/${questionId}/answer`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a question
   * DELETE /api/v1/tasks/:taskId/questions/:questionId
   */
  async deleteQuestion(taskId: string, questionId: string): Promise<void> {
    return fetchWithAuth(`tasks/${taskId}/questions/${questionId}`, {
      method: 'DELETE',
    });
  },
};
