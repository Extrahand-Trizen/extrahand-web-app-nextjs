import { z } from "zod";

/**
 * Application validation schemas
 * Matches backend TaskApplication schema
 */

export const createApplicationSchema = z
   .object({
      taskId: z.string().min(1, "Task ID is required"),
      proposedBudget: z.object({
         amount: z
            .number()
            .min(50, "Minimum budget is ₹50")
            .max(50000, "Maximum budget is ₹50,000"),
         currency: z.string(),
         isNegotiable: z.boolean(),
      }),
      proposedTime: z
         .object({
            startDate: z.date().optional(),
            endDate: z.date().optional(),
            estimatedDuration: z
               .number()
               .min(0.5, "Minimum duration is 0.5 hours")
               .max(168, "Maximum duration is 168 hours")
               .optional(),
            flexible: z.boolean(),
         })
         .optional(),
      coverLetter: z
         .string()
         .max(1000, "Cover letter must be less than 1000 characters")
         .optional(),
      relevantExperience: z.array(z.string()).max(10).default([]).optional(),
      portfolio: z.array(z.string().url()).max(10).default([]).optional(),
   })
   .refine(
      (data) => {
         // If endDate is provided, it should be after startDate
         if (
            data.proposedTime?.startDate &&
            data.proposedTime?.endDate &&
            data.proposedTime.endDate <= data.proposedTime.startDate
         ) {
            return false;
         }
         return true;
      },
      {
         message: "End date must be after start date",
         path: ["proposedTime", "endDate"],
      }
   );

export type CreateApplicationFormData = z.input<typeof createApplicationSchema>;
