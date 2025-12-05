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
    return fetchWithAuth('reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  },

  /**
   * Get review for a task
   * GET /api/v1/reviews/task/:taskId
   */
  async getTaskReview(taskId: string): Promise<Review | null> {
    return fetchWithAuth(`reviews/task/${taskId}`);
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
    return fetchWithAuth(`reviews/user/${userId}${queryString ? `?${queryString}` : ''}`);
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
    return fetchWithAuth(`reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
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

