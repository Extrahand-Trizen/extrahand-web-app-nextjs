import { z } from "zod";
import { containsPhoneNumber, PHONE_NUMBER_ERROR } from "@/lib/utils/phoneDetection";

/**
 * Question validation schemas
 * Matches backend TaskQuestion schema
 */

export const createQuestionSchema = z.object({
   taskId: z.string().min(1, "Task ID is required"),
   question: z
      .string()
      .min(10, "Question must be at least 10 characters")
      .max(1000, "Question must be less than 1000 characters")
      .trim()
      .refine((val) => !containsPhoneNumber(val), PHONE_NUMBER_ERROR),
   isPublic: z.boolean(),
});

export const answerQuestionSchema = z.object({
   answer: z
      .string()
      .min(10, "Answer must be at least 10 characters")
      .max(1000, "Answer must be less than 1000 characters")
      .trim()
      .refine((val) => !containsPhoneNumber(val), PHONE_NUMBER_ERROR),
});

export type CreateQuestionFormData = z.output<typeof createQuestionSchema>;
export type AnswerQuestionFormData = z.infer<typeof answerQuestionSchema>;
