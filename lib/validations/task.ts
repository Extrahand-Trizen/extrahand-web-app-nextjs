import { z } from "zod";
import { containsPhoneNumber, PHONE_NUMBER_ERROR } from "@/lib/utils/phoneDetection";

/**
 * Task creation validation schemas
 */

// Step 1: Task Basics
export const taskBasicsSchema = z
   .object({
      title: z
         .string()
         .min(5, "Please add a few more details to your title")
         .max(200, "Title is too long")
         .refine((val) => !containsPhoneNumber(val), PHONE_NUMBER_ERROR),
      description: z
         .string()
         .min(10, "Add more detail so taskers understand what's needed")
         .max(2000, "Description is too long")
         .refine((val) => !containsPhoneNumber(val), PHONE_NUMBER_ERROR),
      category: z.string().min(1, "Please select a category"),
      subcategory: z.string().optional(),
      requirements: z.array(z.string()).max(10).nullable().default([]).transform(val => val || []),
      estimatedDuration: z.number().min(0.5).max(168).nullable().optional(),
      tags: z.array(z.string()).max(5).nullable().default([]).transform(val => val || []),
      priority: z.enum(["low", "normal", "high"]).nullable().default("normal").transform(val => val || "normal"),
      attachments: z
         .array(
            z.object({
               type: z.string(),
               url: z.string(),
               filename: z.string(),
               uploadedAt: z.date().optional(),
            })
         )
         .max(5)
         .nullable()
         .default([])
         .transform(val => val || []),
   })
   .refine(
      (data) => {
         // If category is "other", subcategory must be provided with 3-50 characters
         if (data.category === "other") {
            return (
               data.subcategory &&
               data.subcategory.trim().length >= 3 &&
               data.subcategory.trim().length <= 50
            );
         }
         return true;
      },
      {
         message:
            "Please describe your task type (3-50 characters) for 'Other' category",
         path: ["subcategory"],
      }
   );

// Step 2: Location & Schedule
export const locationScheduleSchema = z
   .object({
      locationMode: z.enum(["in-person", "online"]).default("in-person"),
      location: z.object({
         address: z.string().default(""),
         city: z.string().default(""),
         state: z.string().default(""),
         pinCode: z.string().default(""),
         country: z.string().default("India"),
         coordinates: z.tuple([z.number(), z.number()]).optional(),
      }),
      // AirTasker-style scheduling
      dateOption: z.enum(["on-date", "before-date", "flexible"]).default("flexible"),
      scheduledDate: z.date().nullable(),
      needsTimeOfDay: z.boolean().default(false),
      timeSlot: z.enum(["morning", "midday", "afternoon", "evening"]).nullable().optional(),
      // Legacy fields (kept for compatibility)
      scheduledTimeStart: z.date(),
      scheduledTimeEnd: z.date(),
      flexibility: z.enum(["exact", "flexible", "very_flexible"]),
      recurringEnabled: z.boolean().default(false),
      recurringStartDate: z.date().nullable().optional(),
      recurringEndDate: z.date().nullable().optional(),
      recurringFrequency: z.enum(["daily", "weekly"]).default("daily"),
   })
   .refine((data) => {
      if (data.locationMode === "online") return true;
      return (
         data.location.address.trim().length >= 5 &&
         data.location.city.trim().length >= 1 &&
         data.location.state.trim().length >= 1
      );
   }, {
      message: "Please add a location",
      path: ["location", "address"],
   })
   .refine((data) => {
      if (data.recurringEnabled) {
        return data.recurringStartDate !== null && data.recurringEndDate !== null;
      }
      return data.scheduledDate !== null;
   }, {
      message: "Please choose a date",
      path: ["scheduledDate"],
   })
   .refine((data) => {
      if (!data.recurringEnabled) return true;
      if (!data.recurringStartDate || !data.recurringEndDate) return false;
      return data.recurringEndDate >= data.recurringStartDate;
   }, {
      message: "End date must be after start date",
      path: ["recurringEndDate"],
   })
   .refine(
      (data) => {
         if (data.flexibility === "very_flexible") return true;

         // Ensure end date/time is after start date/time with minimum 30 minutes duration
         const timeDiffMinutes = (data.scheduledTimeEnd.getTime() - data.scheduledTimeStart.getTime()) / (1000 * 60);
         return timeDiffMinutes >= 30;
      },
      {
         message: "End time must be at least 30 minutes after start time. Note: 12:30 AM is just after midnight (00:30).",
         path: ["scheduledTimeEnd"],
      }
   );

// Step 3: Budget
export const budgetSchema = z
   .object({
      budgetType: z.enum(["fixed", "hourly", "negotiable"]),
      budget: z.number().nullable().optional(),
      urgency: z.enum(["standard", "soon", "urgent"]),
   })
   .refine(
      (data) => {
         // If budgetType is not negotiable, budget is required
         if (data.budgetType !== "negotiable") {
            return (
               data.budget !== null &&
               data.budget !== undefined &&
               data.budget > 0
            );
         }
         return true;
      },
      {
         message: "Please enter a budget",
         path: ["budget"],
      }
   )
   .refine(
      (data) => {
         if (data.budgetType === "negotiable") return true;
         if (!data.budget) return true;
         return data.budget >= 50;
      },
      {
         message: "Please enter at least ₹50",
         path: ["budget"],
      }
   )
   .refine(
      (data) => {
         if (data.budgetType === "negotiable") return true;
         if (!data.budget) return true;
         return data.budget <= 50000;
      },
      {
         message: "For tasks over ₹50,000, please contact support",
         path: ["budget"],
      }
   );

// Complete task schema (for final submission)
export const completeTaskSchema = taskBasicsSchema
   .merge(locationScheduleSchema)
   .merge(budgetSchema)
   .extend({
      agreedToGuidelines: z.boolean(),
   });

export type TaskBasicsFormData = z.infer<typeof taskBasicsSchema>;
export type LocationScheduleFormData = z.infer<typeof locationScheduleSchema>;
export type BudgetFormData = z.infer<typeof budgetSchema>;
export type CompleteTaskFormData = z.infer<typeof completeTaskSchema>;

// Edit task schema - only editable fields (no status, assignedTo, etc.)
// All fields are optional for partial updates, but if provided, they must be valid
export const editTaskSchema = z
   .object({
      title: z
         .string()
         .min(5, "Please add a few more details to your title")
         .max(200, "Title is too long")
         .optional(),
      description: z
         .string()
         .min(10, "Add more detail so taskers understand what's needed")
         .max(2000, "Description is too long")
         .optional(),
      category: z.string().min(1, "Please select a category").optional(),
      subcategory: z.string().optional(),
      requirements: z.array(z.string()).max(10).nullable().default([]).optional(),
      estimatedDuration: z.number().min(0.5).max(168).nullable().optional(),
      tags: z.array(z.string()).max(5).nullable().default([]).optional(),
      priority: z.enum(["low", "normal", "high"]).nullable().optional(),
      attachments: z
         .array(
            z.object({
               type: z.string(),
               url: z.string(),
               filename: z.string(),
               uploadedAt: z.date().optional(),
            })
         )
         .max(5)
         .nullable()
         .default([])
         .optional(),
      location: z
         .object({
            address: z.string().min(5, "Please add a location").optional(),
            city: z.string().min(1, "City is required").optional(),
            state: z.string().min(1, "State is required").optional(),
            pinCode: z.string().default("").optional(),
            country: z.string().default("India").optional(),
            coordinates: z.tuple([z.number(), z.number()]).optional(),
         })
         .optional(),
      locationMode: z.enum(["in-person", "online"]).optional(),
      scheduledDate: z.date().nullable().optional(),
      // AirTasker-style scheduling
      dateOption: z.enum(["on-date", "before-date", "flexible"]).optional(),
      needsTimeOfDay: z.boolean().optional(),
      timeSlot: z.enum(["morning", "midday", "afternoon", "evening"]).nullable().optional(),
      // Legacy fields
      scheduledTimeStart: z.date().optional(),
      scheduledTimeEnd: z.date().optional(),
      flexibility: z.enum(["exact", "flexible", "very_flexible"]).optional(),
      budgetType: z.enum(["fixed", "hourly", "negotiable"]).optional(),
      budget: z.number().nullable().optional(),
      urgency: z.enum(["standard", "soon", "urgent"]).optional(),
   })
   .refine(
      (data) => {
         // If category is "other" and subcategory is provided, validate it
         if (data.category === "other" && data.subcategory !== undefined) {
            return (
               data.subcategory &&
               data.subcategory.trim().length >= 3 &&
               data.subcategory.trim().length <= 50
            );
         }
         return true;
      },
      {
         message:
            "Please describe your task type (3-50 characters) for 'Other' category",
         path: ["subcategory"],
      }
   )
   .refine(
      (data) => {
         // If budgetType is provided and not negotiable, budget must be valid
         if (
            data.budgetType !== undefined &&
            data.budgetType !== "negotiable"
         ) {
            return (
               data.budget !== null &&
               data.budget !== undefined &&
               data.budget > 0
            );
         }
         return true;
      },
      {
         message: "Please enter a budget",
         path: ["budget"],
      }
   )
   .refine(
      (data) => {
         if (
            data.budgetType === "negotiable" ||
            data.budget === null ||
            data.budget === undefined
         )
            return true;
         return data.budget >= 50;
      },
      {
         message: "Please enter at least ₹50",
         path: ["budget"],
      }
   )
   .refine(
      (data) => {
         if (
            data.budgetType === "negotiable" ||
            data.budget === null ||
            data.budget === undefined
         )
            return true;
         return data.budget <= 50000;
      },
      {
         message: "For tasks over ₹50,000, please contact support",
         path: ["budget"],
      }
   )
   .refine(
      (data) => {
         // If scheduledDate is explicitly set to null or a date, validate
         if (data.scheduledDate !== undefined && data.scheduledDate === null) {
            // Allow null if explicitly set
            return true;
         }
         return true;
      },
      {
         message: "Please choose a valid date",
         path: ["scheduledDate"],
      }
   )
   .refine(
      (data) => {
         // Only validate time range if both times are provided
         if (
            data.flexibility === "very_flexible" ||
            !data.scheduledTimeStart ||
            !data.scheduledTimeEnd
         )
            return true;

         // Ensure end date/time is after start date/time with minimum 30 minutes duration
         const timeDiffMinutes = (data.scheduledTimeEnd.getTime() - data.scheduledTimeStart.getTime()) / (1000 * 60);
         return timeDiffMinutes >= 30;
      },
      {
         message: "End time must be at least 30 minutes after start time. Note: 12:30 AM is just after midnight (00:30).",
         path: ["scheduledTimeEnd"],
      }
   );

export type EditTaskFormData = z.infer<typeof editTaskSchema>;
