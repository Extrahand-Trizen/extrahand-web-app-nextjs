"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import type { CategoriesListItem } from "@/lib/api/endpoints/categories";
import styles from "./ad.module.css";

const TASKER_ONBOARDING_URL =
   process.env.NEXT_PUBLIC_TASKER_ONBOARDING_URL ||
   "https://extrahand-tasker-onboarding-backend.backend.extrahand.in";

export default function PartnerCallbackForm({
   categories,
   cities,
   variant = "page",
   partnerPlayStoreUrl,
   partnerAppStoreUrl,
}: {
   categories: Pick<CategoriesListItem, "name" | "slug">[];
   cities: string[];
   variant?: "page" | "modal";
   partnerPlayStoreUrl?: string;
   partnerAppStoreUrl?: string;
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
         const response = await fetch(`${TASKER_ONBOARDING_URL}/api/v1/onboarding/website-leads/public`, {
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

   const formContent = (
      <>
            {variant === "page" && (
               <Link className={styles.callbackBack} href="/ad#partners">
                  <span aria-hidden="true">←</span> Back to ExtraHand
               </Link>
            )}
            <p className={styles.sectionKicker}>Let’s work together</p>
            {variant === "modal" ? (
               <h2 id="partner-callback-title">Register with ExtraHand</h2>
            ) : (
               <h1 id="partner-callback-title">Register with ExtraHand</h1>
            )}
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
                  {isSubmitting ? "Submitting..." : "Submit"}
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
            {variant === "modal" && (partnerPlayStoreUrl || partnerAppStoreUrl) && (
               <div className={styles.partnerAppLinks}>
                  <p className={styles.partnerAppLinksTitle}>Download the Partner App</p>
                  <div className={styles.partnerAppLinksRow}>
                     {partnerPlayStoreUrl && (
                        <a
                           className={styles.partnerAppLink}
                           href={partnerPlayStoreUrl}
                           rel="noreferrer"
                           target="_blank"
                        >
                           <span aria-hidden="true" className={styles.partnerAppIcon}>
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path
                                    d="M3 20.5V3.5C3 2.91 3.34 2.39 3.84 2.15L13.69 12L3.84 21.85C3.34 21.6 3 21.09 3 20.5Z"
                                    fill="#4285F4"
                                 />
                                 <path d="M16.81 15.12L6.05 21.34L14.54 12.85L16.81 15.12Z" fill="#34A853" />
                                 <path
                                    d="M20.16 10.81C20.5 11.08 20.75 11.5 20.75 12C20.75 12.5 20.53 12.9 20.18 13.18L17.89 14.5L15.39 12L17.89 9.5L20.16 10.81Z"
                                    fill="#FBBC05"
                                 />
                                 <path d="M6.05 2.66L16.81 8.88L14.54 11.15L6.05 2.66Z" fill="#EA4335" />
                              </svg>
                           </span>
                           <span>GET IT ON</span>
                           <strong>Google Play</strong>
                        </a>
                     )}
                     {partnerAppStoreUrl && (
                        <a
                           className={styles.partnerAppLink}
                           href={partnerAppStoreUrl}
                           rel="noreferrer"
                           target="_blank"
                        >
                           <span aria-hidden="true" className={styles.partnerAppIcon}>
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                 <path
                                    d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 17 2.94 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"
                                    fill="white"
                                 />
                              </svg>
                           </span>
                           <span>Download on the</span>
                           <strong>App Store</strong>
                        </a>
                     )}
                  </div>
               </div>
            )}
      </>
   );

   if (variant === "modal") {
      return (
         <section
            aria-labelledby="partner-callback-title"
            className={`${styles.adPage} ${styles.modalCard}`}
         >
            {formContent}
         </section>
      );
   }

   return (
      <main className={`${styles.adPage} ${styles.callbackPage}`}>
         <section aria-labelledby="partner-callback-title" className={styles.callbackCard}>
            {formContent}
         </section>
      </main>
   );
}
