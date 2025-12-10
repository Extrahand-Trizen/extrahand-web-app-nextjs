import { z } from "zod";

/**
 * Authentication validation schemas - Phone + OTP based
 */

export const phoneAuthSchema = z.object({
   fullName: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(50, "Name is too long"),
   phone: z
      .string()
      .min(10, "Phone number is required")
      .refine(
         (val) => val.replace(/\D/g, "").length >= 10,
         "Please enter a valid phone number (at least 10 digits)"
      ),
   agreeTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms to continue",
   }),
});

export const phoneLoginSchema = z.object({
   phone: z
      .string()
      .min(10, "Phone number is required")
      .refine(
         (val) => val.replace(/\D/g, "").length >= 10,
         "Please enter a valid phone number (at least 10 digits)"
      ),
});

export const otpSchema = z.object({
   code: z.string().length(6, "OTP must be 6 digits"),
});

export type PhoneAuthFormData = z.infer<typeof phoneAuthSchema>;
export type PhoneLoginFormData = z.infer<typeof phoneLoginSchema>;
export type OTPFormData = z.infer<typeof otpSchema>;
