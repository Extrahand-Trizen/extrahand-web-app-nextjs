"use client";

import { useState, type FormEvent } from "react";

const TASKER_ONBOARDING_URL =
   process.env.NEXT_PUBLIC_TASKER_ONBOARDING_URL ||
   "https://extrahand-tasker-onboarding-backend.backend.extrahand.in";

export function usePartnerLeadSubmission() {
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [message, setMessage] = useState("");
   const [hasError, setHasError] = useState(false);

   async function handleSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setMessage("");
      setHasError(false);
      const formData = new FormData(event.currentTarget);
      const form = event.currentTarget;

      try {
         setIsSubmitting(true);
         const response = await fetch(
            `${TASKER_ONBOARDING_URL}/api/v1/onboarding/website-leads/public`,
            {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               body: JSON.stringify({
                  fullName: formData.get("fullName"),
                  mobileNumber: formData.get("mobileNumber"),
                  city: formData.get("city"),
                  serviceCategorySlug: formData.get("serviceCategory"),
               }),
            }
         );
         const result: { message?: string; error?: string } = await response.json();

         if (!response.ok) {
            throw new Error(result.error || "Unable to submit your enquiry.");
         }

         form.reset();
         setMessage(result.message || "Thanks for your interest. Our team will be in touch soon.");
      } catch (error) {
         console.error("Partner enquiry submission failed:", error);
         setHasError(true);
         setMessage(
            error instanceof Error
               ? error.message
               : "Unable to submit your enquiry right now. Please try again."
         );
      } finally {
         setIsSubmitting(false);
      }
   }

   return { isSubmitting, message, hasError, handleSubmit };
}
