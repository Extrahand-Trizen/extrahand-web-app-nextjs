/**
 * Reviews API endpoints
 * Matches task-connect-relay routes/reviews.js
 */

import { fetchWithAuth } from '../client';

export interface Review {
  _id: string;
  taskId: string;
  reviewerUid: string;
  revieweeUid: string;
  rating: number;
  title?: string;
  comment?: string;
  ratings?: {
    communication?: number;
    quality?: number;
    timeliness?: number;
    professionalism?: number;
    value?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const reviewsApi = {
  /**
   * Create a review
   * POST /api/v1/reviews
   */
  async createReview(reviewData: {
    taskId: string;
    rating: number;
    title?: string;
    comment?: string;
    ratings?: {
      communication?: number;
      quality?: number;
      timeliness?: number;
      professionalism?: number;
      value?: number;
    };
  }): Promise<Review> {
    const response = await fetchWithAuth('reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
    return response.data || response;
  },

  /**
   * Get review for a task
   * GET /api/v1/reviews/task/:taskId
   */
  async getTaskReview(taskId: string): Promise<Review | null> {
    const response = await fetchWithAuth(`reviews/task/${taskId}`);
    return response.data || response;
  },

  /**
   * Get reviews for a user
   * GET /api/v1/reviews/user/:userId?limit=10&skip=0&rating=5
   */
  async getUserReviews(
    userId: string,
    options?: {
      limit?: number;
      skip?: number;
      rating?: number;
    }
  ): Promise<{ reviews: Review[]; total: number }> {
    const params = new URLSearchParams();
    if (options?.limit) params.append('limit', options.limit.toString());
    if (options?.skip) params.append('skip', options.skip.toString());
    if (options?.rating) params.append('rating', options.rating.toString());
    
    const queryString = params.toString();
    const response = await fetchWithAuth(`reviews/user/${userId}${queryString ? `?${queryString}` : ''}`);
    return response.data || response;
  },

  /**
   * Update a review
   * PUT /api/v1/reviews/:id
   */
  async updateReview(
    reviewId: string,
    updateData: {
      rating?: number;
      title?: string;
      comment?: string;
      ratings?: {
        communication?: number;
        quality?: number;
        timeliness?: number;
        professionalism?: number;
        value?: number;
      };
    }
  ): Promise<Review> {
    const response = await fetchWithAuth(`reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return response.data || response;
  },

  /**
   * Delete a review
   * DELETE /api/v1/reviews/:id
   */
  async deleteReview(reviewId: string): Promise<{ success: boolean }> {
    return fetchWithAuth(`reviews/${reviewId}`, {
      method: 'DELETE',
    });
  },
};

