"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { CategoriesListItem } from "@/lib/api/endpoints/categories";
import styles from "./ad.module.css";

const CONTENT_ADMIN_URL =
   process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL ||
   "https://extrahand-content-admin-backend.backend.extrahand.in";

export default function PartnerCallbackForm({
   categories,
   cities,
}: {
   categories: CategoriesListItem[];
   cities: string[];
}) {
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
         const response = await fetch(`${CONTENT_ADMIN_URL}/api/partner-leads`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
               fullName: formData.get("fullName"),
               mobileNumber: formData.get("mobileNumber"),
               city: formData.get("city"),
               serviceCategorySlug: formData.get("serviceCategory"),
            }),
         });
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

   return (
      <main className={`${styles.adPage} ${styles.callbackPage}`}>
         <section aria-labelledby="partner-callback-title" className={styles.callbackCard}>
            <Link className={styles.callbackBack} href="/ad#partners">
               <span aria-hidden="true">←</span> Back to ExtraHand
            </Link>
            <p className={styles.sectionKicker}>Let’s work together</p>
            <h1 id="partner-callback-title">Request a Callback</h1>
            <p className={styles.modalDescription}>
               Share your details and our team will contact you about becoming an ExtraHand partner.
            </p>
            <form className={styles.leadForm} onSubmit={handleSubmit}>
               <label className={styles.field}>
                  <span>Full Name</span>
                  <input
                     autoComplete="name"
                     autoFocus
                     maxLength={80}
                     minLength={2}
                     name="fullName"
                     placeholder="Enter your full name"
                     required
                  />
               </label>
               <label className={styles.field}>
                  <span>Mobile Number</span>
                  <input
                     autoComplete="tel"
                     inputMode="tel"
                     maxLength={16}
                     name="mobileNumber"
                     pattern="(?:\+?91[\s-]?)?[6-9][0-9]{9}"
                     placeholder="+91 98765 43210"
                     required
                     title="Enter a valid 10-digit Indian mobile number."
                     type="tel"
                  />
               </label>
               <label className={styles.field}>
                  <span>City</span>
                  {cities.length > 0 ? (
                     <select defaultValue="" name="city" required>
                        <option disabled value="">Select your city</option>
                        {cities.map((city) => (
                           <option key={city} value={city}>{city}</option>
                        ))}
                     </select>
                  ) : (
                     <input
                        autoComplete="address-level2"
                        maxLength={80}
                        name="city"
                        placeholder="Enter your city"
                        required
                     />
                  )}
               </label>
               <label className={styles.field}>
                  <span>Service Category</span>
                  <select defaultValue="" name="serviceCategory" required>
                     <option disabled value="">Choose a service</option>
                     {categories.map((category) => (
                        <option key={category.slug} value={category.slug}>
                           {category.name}
                        </option>
                     ))}
                  </select>
               </label>
               {message && (
                  <p
                     aria-live="polite"
                     className={`${styles.formMessage} ${hasError ? styles.errorMessage : styles.successMessage}`}
                     role={hasError ? "alert" : "status"}
                  >
                     {message}
                  </p>
               )}
               <button
                  className={styles.submitButton}
                  disabled={isSubmitting || categories.length === 0}
                  type="submit"
               >
                  {isSubmitting ? "Submitting..." : "Request Callback"}
                  <span aria-hidden="true">→</span>
               </button>
               {categories.length === 0 && (
                  <p className={styles.formHint}>
                     Service options are temporarily unavailable. Please try again shortly.
                  </p>
               )}
               <p className={styles.privacyNote}>
                  By submitting, you agree to be contacted by ExtraHand about partner onboarding.
               </p>
            </form>
         </section>
      </main>
   );
}
