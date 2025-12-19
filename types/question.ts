/**
 * Task Question type definitions
 * Matches backend TaskQuestion schema
 */

export interface TaskQuestion {
   _id: string;
   taskId: string;
   askedByUid: string;
   question: string;
   answer?: string;
   answeredByUid?: string;
   answeredAt?: Date;
   isPublic: boolean;
   createdAt: Date;
   updatedAt: Date;
}

export interface CreateQuestionRequest {
   taskId: string;
   question: string;
   isPublic?: boolean;
}

export interface AnswerQuestionRequest {
   answer: string;
}

export interface QuestionsResponse {
   questions: TaskQuestion[];
   pagination?: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
   };
}

